import { useState, useEffect } from 'react';
import { searchTopics, getWords } from "../../api/http"

export const useTopicSearch = (initialTopics = [], mode) => {
  const [topics, setTopics] = useState(initialTopics);
  const [topic, setTopic] = useState({})
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cachedTopics, setCachedTopics] = useState([]); // Cache for topics fetched from API

  // Search through cached topics first
  const searchCachedTopics = (searchTerm) => {
    if (!searchTerm) return [];
    
    return cachedTopics.filter(topic => 
      topic.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    if (!searchValue) return
    console.log(searchValue)
    const performSearch = async () => {
      if (!searchValue) {
        setSuggestions([]);
        return;
      }

      // First check if the topic already exists in current topics
      const existingTopic = topics.find(topic => 
        topic.name.toLowerCase() === searchValue.toLowerCase()
      );
      if (existingTopic) {
        // setSuggestions([]);
        return setSuggestions([topic])
      }

      // Then search through cached topics
      const cachedResults = searchCachedTopics(searchValue);
      if (cachedResults.length >= 5) {
        return setSuggestions(cachedResults);
      }

      // If not enough results, fetch from API
      setIsLoading(true);
      try {
        const fetchedTopics = await searchTopics(searchValue);
        // Filter out topics that already exist in current topics
        const newTopics = fetchedTopics.filter(topic => 
          !topics.some(existingTopic => 
            existingTopic.name.toLowerCase() === topic.name.toLowerCase()
          )
        );
        setSuggestions(newTopics);
        const alreadyCached = cachedTopics.map(c => c._id)
        setCachedTopics(prev => [...prev, ...(newTopics.filter(t => alreadyCached.includes(t._id)))]); // Cache only new topics
      } catch (error) {
        console.error('Error fetching topics:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const addTopic = async (topic) => {
    if (topic && (!topics.includes(topic) || mode === "word-filling-mode")) {
      if (mode === 'word-filling-mode') {
        if (topic.filled) return [setTopic(topic), setSuggestions(topics)]
        try {
          const wordObjects = await getWords('english', topic.words);
          setTopics(prev => prev.map(t => 
            t === topic ? {...t, words: wordObjects?.words || [], filled: true} : t
          ));
          setTopic({...topic, words: wordObjects?.words || [], filled: true});
          console.log(topics.length)
          setSuggestions(topics)
        } catch (error) {
          console.error('Error fetching words:', error);
          setTopics(prev => [...prev, topic]);
        }
      } else {
        setTopics(prev => [...prev, topic]);
      }
    }
  };

  const removeTopic = (topicToRemove) => {
    setTopics(prev => prev.filter(topic => topic !== topicToRemove));
  };

  return {
    topics,
    searchValue,
    setSearchValue,
    suggestions,
    isLoading,
    addTopic,
    removeTopic,
    topic
  };
};