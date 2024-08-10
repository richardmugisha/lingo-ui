
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
    cards: '',
    name: '',
    id: '',
    deckLang: ''
}

const deckSlice = createSlice({
    name: 'deck',
    initialState,
    reducers: {
        name: (state, action) => {state.name = action.payload},
        id : (state, action) => {state.id = action.payload},
        list: (state, action) => { state.list = action.payload },
        cards: (state, action) => {state.cards = action.payload},
        deckLang: (state, action) => {state.deckLang = action.payload},
        removeDecks: (state, action) => {
            const deletingSet = action.payload;
            state.list = state.list.filter(deck => !deletingSet.includes(deck._id));
        },
        push: (state, action) => {
            const newDeck = action.payload
            state.list = [...state.list.filter(deck => deck._id !== newDeck._id), newDeck]
        }
    }
})

export default deckSlice.reducer;
export const { name, id, list, cards, deckLang, removeDecks, push } = deckSlice.actions