import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    modal : true,
    modalSelection: 'card',
}

const systemSlice = createSlice({
    name: 'system',
    initialState,
    reducers: {
        modalShow: (state, action) => {state.modal = action.payload},
        modalSelect: (state, action) => {state.modalSelection = action.payload},
    }
})

export default systemSlice.reducer
export const { modalShow, modalSelect } = systemSlice.actions