import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    modal : false,
    modalSelection: '',
    info: {},
    chat: {}
}

const systemSlice = createSlice({
    name: 'system',
    initialState,
    reducers: {
        modalShow: (state, action) => {state.modal = action.payload},
        modalSelect: (state, action) => {state.modalSelection = action.payload},
        setInfo: (state, action) => {state.info = action.payload },
        setChat: (state, action) => {state.chat = action.payload}
    }
})

export default systemSlice.reducer
export const { modalShow, modalSelect, setInfo, setChat } = systemSlice.actions