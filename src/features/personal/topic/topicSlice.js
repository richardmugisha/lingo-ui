
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
        name: '',
        language: '',
        creator: '',
        words: [],
        learning: {},
        subTopics: []
}

const topicSlice = createSlice({
    name: 'topic',
    initialState,
    reducers: {
        chooseTopic: (state, action) => ({...state, ...action.payload}),
        storeSubTopics: (state, action) => {state.subTopics = action.payload},
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
export const { chooseTopic, storeSubTopics, removeTopics, push } = topicSlice.actions