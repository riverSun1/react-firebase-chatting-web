import {
  child,
  ref as dbRef,
  push,
  serverTimestamp,
  set,
} from "firebase/database";
import { useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../firebase";

const MessageForm = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const messagesRef = dbRef(db, "messages");

  const { currentChatRoom } = useSelector((state) => state.chatRoom);
  const { isPrivateChatRoom } = useSelector((state) => state.chatRoom);
  const { currentUser } = useSelector((state) => state.user);

  const createMessage = (fileUrl = null) => {
    const message = {
      timestamp: serverTimestamp(),
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        image: currentUser.photoURL,
      },
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = content;
    }
    return message;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content) {
      setErrorMsg("메시지를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await set(push(child(messagesRef, currentChatRoom.id)), createMessage());
      setLoading(false);
      setContent("");
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(error.message);
      setTimeout(() => {
        setErrorMsg("");
      }, 5000);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-24 border-2 rounded-md p-3"
        />
        <div className="text-red-500">{errorMsg}</div>
        <div>
          <div className="flex flex-row gap-2.5 my-2">
            <button
              type="submit"
              className="flex flex-1 p-2.5 rounded-md text-white bg-cyan-800 hover:bg-cyan-600 text-center items-center justify-center"
              disabled={loading}
            >
              이미지
            </button>
            <button
              type="submit"
              className="flex flex-1 p-2.5 rounded-md text-white bg-cyan-800 hover:bg-cyan-600 text-center items-center justify-center"
              disabled={loading}
            >
              메시지 전송
            </button>
          </div>
        </div>
      </form>
      <input type="file" accept="image/jpeg, image/png" className="hidden" />
    </div>
  );
};

export default MessageForm;
