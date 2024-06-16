import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChatRoom: {
    id: "", // 채팅룸의 id
    name: "", // 채팅룸의 이름
    description: "", // 채팅방의 설명

    // 채팅룸이 누구에 의해 생성되었는지
    createdBy: {
      image: "", // 생성한 사람의 이미지 데이터
      name: "", // 채팅을 생성한 사람의 이름
    },
  },
  isPrivateChatRoom: false,
  userPosts: null,
};

export const chatRoomSlice = createSlice({
  name: "chatRoom",
  initialState,
  reducers: {},
});

export default chatRoomSlice.reducer;
