import { configureStore } from "@reduxjs/toolkit";
import chatRoomReducer from "../slices/chatRoomSlice";
import userReducer from "../slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    chatRoom: chatRoomReducer,
  },
});
