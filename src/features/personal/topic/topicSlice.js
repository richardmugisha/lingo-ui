
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
        name: '',
        language: '',
        creator: '',
        words: [],
        learning: {},
        subTopics: [],
        scripts: [],
        stories: []
}

const topicSlice = createSlice({
    name: 'topic',
    initialState,
    reducers: {
        chooseTopic: (state, action) => ({...state, ...action.payload}),
        storeSubTopics: (state, action) => {state.subTopics = action.payload},
        storeStories: (state, action) => {state.stories = action.payload},
        storeScripts: (state, action) => {state.scripts = action.payload},
        removeTopics: (state, action) => {
            const deletingSet = action.payload;
            state.subTopics = state.subTopics.filter(topic => !deletingSet.includes(topic._id));
        },
        push: (state, action) => {
            const newTopic = action.payload
            state.topicList = [...state.subTopics.filter(topic => topic._id !== newTopic._id), newTopic]
        }
    }
})

export default topicSlice.reducer;
export const { chooseTopic, storeSubTopics, storeScripts, storeStories, removeTopics, push } = topicSlice.actions