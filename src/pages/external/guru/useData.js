import { useEffect, useState } from "react";
import { fetchStructure, createStructure, createChat, updateStructure } from "../../../api/http";

import {set, get} from "lodash"
import chat from "../../../api/http/live-chat/chat";

const defaultData = {
    "Philosophy": {
      content: "Study of fundamental questions about existence, knowledge, values, and reason.",
      subtopics: {
        "Ancient Philosophy": {
          content: "Philosophical thoughts from ancient civilizations like Greece, India, and China.",
          subtopics: {
            "Plato": {
              content: "Focused on ideal forms, justice, and the philosopher-king.",
              subtopics: {}
            },
            "Aristotle": {
              content: "Pioneered logic, virtue ethics, and metaphysics.",
              subtopics: {}
            }
          }
        },
        "Modern Philosophy": {
          content: "Developments in philosophical thinking during the 17th to 19th centuries.",
          subtopics: {
            "Rationalism": {
              content: "Reason as the primary source of knowledge (Descartes, Spinoza).",
              subtopics: {}
            },
            "Empiricism": {
              content: "Knowledge comes from sensory experience (Locke, Hume).",
              subtopics: {}
            }
          }
        }
      }
    },
  
    "Computer Science": {
      content: "The study of algorithms, computation, and information systems.",
      subtopics: {
        "Programming": {
          content: "The act of writing and maintaining code to instruct computers.",
          subtopics: {
            "Python": {
              content: "High-level language known for readability and versatility.",
              subtopics: {}
            },
            "JavaScript": {
              content: "Mainly used for web development; event-driven and async-friendly.",
              subtopics: {}
            }
          }
        },
        "Operating Systems": {
          content: "Software that manages hardware and software resources.",
          subtopics: {
            "Processes & Threads": {
              content: "Mechanisms for multitasking and concurrency.",
              subtopics: {}
            },
            "Memory Management": {
              content: "How OS allocates and tracks memory usage.",
              subtopics: {}
            }
          }
        }
      }
    },
  
    "Mathematics": {
      content: "The abstract study of numbers, patterns, space, and change.",
      subtopics: {
        "Algebra": {
          content: "Solving equations and manipulating symbols.",
          subtopics: {
            "Linear Equations": {
              content: "Equations involving linear terms.",
              subtopics: {}
            }
          }
        },
        "Calculus": {
          content: "Study of change through derivatives and integrals.",
          subtopics: {
            "Differentiation": {
              content: "Finding rates of change and slopes.",
              subtopics: {}
            },
            "Integration": {
              content: "Calculating area under curves.",
              subtopics: {}
            }
          }
        }
      }
    }
  };
  
  
    
export const useData = (setCurrentChat) => {
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

        getStrucutre().then((structureObj) => {
            console.log("Structure Object:", structureObj);
            if (structureObj) {
                setData(prev => ({...prev, structure: structureObj.structure}));
                // setLineUp(Object.keys(structureObj.structure));
            }
        });
    }, [])

    // const resolveTopic = (chosenTopic, rightLimit) => {
    //     let cursive = data.subtopics || data
    //     const topics = topicChain.slice(0, rightLimit)
    //     for (const topic of topics) {
    //         cursive = cursive[topic]?.subtopics || cursive[topic]
    //     }
    //     if (cursive) {
    //         const c = cursive[chosenTopic]?.subtopics || cursive
    //         const newLineUp = Object.keys(c)
    //         console.log(newLineUp)
    //         return newLineUp
    //     }
    // }

    // const handleEnterTopic = (chosenTopic, rightLimit) => {
    //     const newLineUp = resolveTopic(chosenTopic, rightLimit)
    //     const newChain = topicChain.slice(0, rightLimit) 
    //     console.log(newChain)
    //     setTopicChain(prev => [...newChain, chosenTopic])
    //     if (!newLineUp?.length) return
    //     setLineUp(newLineUp)
    // }

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
                  // console.log("New Chain:", newChain.slice(0, -1));
                  const topicFam = get(data, newChain.slice(0, -1).join("."));
                  // console.log("Topic Family:", topicFam);

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


    const handleUpdateStructure = (structure) => {
      console.log(structure, "Structure Data")
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

    const handleNavigateToChat = (chatID, column) => {
        const newChain = resolveTopicChain(chatID, column + 1);
        setTopicChain(newChain);
        const topicFam = get(data, newChain.slice(0, -1).join("."));
        setCurrentChat(topicFam[chatID]);
        console.log("Navigated to chat:", chatID, "with chain:", newChain);
    }

    return { data, setData, topicChain, handleCreateChat, resolveTopicChain, getSubtopics, handleNavigateToChat};
}