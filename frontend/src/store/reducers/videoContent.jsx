import { createSlice, configureStore, createAsyncThunk } from "@reduxjs/toolkit";

const videoSlice = createSlice({
  name: 'videoContent',
  initialState: {
    textContent: [],
    translation: {},
    plainText: '',
  },
  reducers: {
    setTextContent(state, action) {
      state.textContent = action.payload;
    },
    setTranslation(state, action) {
      state.translation = action.payload;
    },
    setPlainText(state, action) {
      state.plainText = action.payload;
    },
  }
});

export const { setTextContent, setTranslation, setPlainText } = videoSlice.actions;

export default videoSlice.reducer;