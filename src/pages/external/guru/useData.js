import { useEffect, useState } from "react";
import { fetchStructure, fetchChat, createStructure, createChat, updateStructure, updateChat } from "../../../api/http";

import {set, get} from "lodash"

  export const useData = (currentChat, setCurrentChat) => {
    const [data, setData] = useState({structure: {}, chats: {}});
    const [topicChain, setTopicChain] = useState(["structure"])
    const [userID ] = useState(JSON.parse(localStorage.getItem("user"))?.userId);

    useEffect(() => {
        // setLineUp(Object.keys(data))
        const getStrucutre = async () => {
            try {
                let [structure, error] = await fetchStructure(userID)
                if (error?.response?.status === 404) {
                      console.log("Creating new structure for user:", userID);
                      [structure, error] = await createStructure(userID);
                      if (error) {
                          console.error("Error creating structure:", error.message);
                          return;
                      }
                      return structure;
                } else if (error) {
                  console.error("Error fetching structure:", error.message);
                  return;
                } else {
                  console.log("Fetched structure:", structure);
                  return structure;
                }
            }
            catch (e) {
                console.error("Error in useEffect:", e.message);
            }
        }

        getStrucutre().then(async (structureObj) => {
            console.log("Structure Object:", structureObj);
            if (structureObj) {
                setData(prev => ({...prev, structure: structureObj.structure}));
                handleLoadChats(Object.keys(structureObj.structure) || []);
            }
        });
    }, [])

    const handleLoadChats = async (chatsIDs) => {
      for (const chatID of chatsIDs) {
        const [chat, error] = await fetchChat(chatID);
        if (error) {
          console.error("Error fetching chat:", error.message);
          continue;
        }
        setData(prev => ({...prev, chats: {...prev.chats, [chatID]: chat}}));
      }
    }

    const CreateChat = async() => {
        try {
            const [response, error] = await createChat(userID);
            if (response) {
              setCurrentChat(response);
              setData(prev => ({...prev, 
                chats: {...prev.chats, [response._id]: response},
              }));    
              
              return column => {
                  const newChain = column ? resolveTopicChain(response._id, column) : resolveTopicChain(response._id, topicChain.length);
                  const topicFam = get(data, newChain.slice(0, -1).join("."));

                  setTopicChain(newChain);
                  const dataCopy = {...data};
                  topicFam[response._id] = {}
                  set(dataCopy, newChain.slice(0, -1).join('.'), topicFam);
                  console.log("Updated Data Copy:", dataCopy);
                  setData(dataCopy);
                  handleUpdateStructure(dataCopy.structure);
              }
            }
        } catch (error) {
            console.error("Error creating chat:", error.message);
        }
    }

    const handleFetchChat = async (chatID) => {
        try {
            const [response, error] = await fetchChat(chatID);
            if (error) {
                console.error("Error fetching chat:", error.message);
                return;
            }
            setData(prev => ({...prev, chats: {...prev.chats, [chatID]: response}}));
            return response
        } catch (error) {
            console.error("Error in handleFetchChat:", error.message);
        }
    }


    const handleUpdateStructure = (structure) => {
        if (structure && Object.keys(structure).length > 0) {
            updateStructure(userID, structure)
                .then(([response, error]) => {
                    if (error)console.error("Error updating structure:", error.message);
                    else console.log("Structure updated successfully:", response);
                })
        }
    }
    

    const resolveTopicChain = (chosenTopicID, column) => {
        const chain = topicChain.slice(0, column); // cut off the chain to the current column
        chain.push(chosenTopicID);
        return chain;
    }

    const getSubtopics = (chosenTopicID, column) => {
        const chain = resolveTopicChain(chosenTopicID, column);
        const topicFam = get(data, chain.join("."), {}) 
        return Object.keys(topicFam)
    }

    const handleCreateChat = async (column) => {
        const handle = await CreateChat();
        handle(column + 1);
    }

    const handleNavigateToChat = async (chatID, column) => {
        const newChain = resolveTopicChain(chatID, column + 1);
        setTopicChain(newChain);
        const topicFam = get(data, newChain.slice(0, -1).join("."));
        const chat = data.chats[topicFam[chatID]] || await handleFetchChat(chatID)
        setCurrentChat(chat);
        const subtopics = Object.keys(topicFam) || [];
        handleLoadChats(subtopics);
        console.log("Navigated to chat:", chatID, "with chain:", newChain);
    }

    useEffect(() => {
      if (!currentChat) return;
      updateChat({id: currentChat._id, title: currentChat.title, summary: currentChat.summary, messages: currentChat.messages})
      .then(([res, err]) => {
        if (res) return console.log(res)
        if (err) return console.error("Error updating chat:", err.message);
        })
      .catch(err => console.error("Error updating chat:", err.message));
        
      setData(prev => ({...prev, chats: {...prev.chats, [currentChat._id]: currentChat}}));
      
    }, [currentChat?.title, currentChat?.summary, currentChat?.messages?.length])

    return { data, setData, topicChain, handleCreateChat, resolveTopicChain, getSubtopics, handleNavigateToChat};
}