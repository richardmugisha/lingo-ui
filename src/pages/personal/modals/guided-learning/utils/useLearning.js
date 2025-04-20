import { useState, useRef, useEffect } from "react"
import { getLearning, createLearning } from "../../../../../api/http"
import { chooseTopic } from "../../../../../features/personal/topic/topicSlice"
import { useDispatch } from "react-redux"

export default (topic, words) => {
    const dispatch = useDispatch()
    const isDoneRef = useRef(false)

   try {
        if (!isDoneRef.current) {
            isDoneRef.current = true
            if (!topic) throw new Error("Provide the topic to retrieve a learning plan for it")
            if (!words?.length) throw new Error("This topic doesn't have words to learn")
            updateLearning(dispatch, topic, words.slice(0, 10))
            .catch(error => {
                if (error.response?.status === 404) {
                    createLearning(topic, words)
                        .then(() => updateLearning(dispatch, topic, words))
                        .catch(err => console.error(err))
                }
            })
        }
   } catch (error) {
        console.log(error.message)
   }
}

const updateLearning = async (dispatch, topic, words) => {
    if (!topic) throw new Error("Provide the topic to retrieve a learning plan for it")
    if (!words?.length) throw new Error("This topic doesn't have words to learn")
    try {
        console.log(words.length)
        const data = await getLearning(topic, words.map(word => word._id))
        if (data.learning) dispatch(chooseTopic({learning: updating(data.learning, words)}))
    } catch (error) {
        throw error
    }
}

const updating = (learning, words) => {
    const updatedWords = learning.words.map(w => {
        const full = words.find(word => word._id === w._id);
        return { ...(full || {}), ...w };
    });
    console.log({...learning, words: updatedWords})
    return {...learning, words: updatedWords}
}

export { 
    updateLearning
}