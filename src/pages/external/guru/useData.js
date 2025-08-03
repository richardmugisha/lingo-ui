import { useEffect, useState } from "react";

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
  
  
    
export const useData = () => {
    const [data, setData] = useState({});
    const [currentData, setCurrentData] = useState({})
    const [lineUp, setLineUp] = useState([])
    const [topicChain, setTopicChain] = useState([])
    const [map, setMap] = useState([])

    useEffect(() => {
        setLineUp(Object.keys(data))
    }, [])

    const resolveTopic = (chosenTopic, rightLimit) => {
        let cursive = data.subtopics || data
        const topics = topicChain.slice(0, rightLimit)
        for (const topic of topics) {
            cursive = cursive[topic]?.subtopics || cursive[topic]
        }
        if (cursive) {
            const c = cursive[chosenTopic]?.subtopics || cursive
            const newLineUp = Object.keys(c)
            console.log(newLineUp)
            return newLineUp
        }
    }

    const handleEnterTopic = (chosenTopic, rightLimit) => {
        const newLineUp = resolveTopic(chosenTopic, rightLimit)
        const newChain = topicChain.slice(0, rightLimit) 
        console.log(newChain)
        setTopicChain(prev => [...newChain, chosenTopic])
        if (!newLineUp?.length) return
        setLineUp(newLineUp)
    }

    return { data, setData, lineUp, handleEnterTopic, topicChain, resolveTopic };
}