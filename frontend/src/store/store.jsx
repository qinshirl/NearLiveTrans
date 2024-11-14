import { configureStore } from "@reduxjs/toolkit";
import videoContentReducer from "./reducers/videoContent";

export default configureStore({
  reducer: {
    videoContent: videoContentReducer,
  }
})