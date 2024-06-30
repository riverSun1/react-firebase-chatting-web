import { child, ref as dbRef, off, onChildAdded } from "firebase/database";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../../firebase";
import Message from "./Message";
import MessageForm from "./MessageForm";
import MessageHeader from "./MessageHeader";

const MainPanel = () => {
  const messagesRef = dbRef(db, "messages");
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const { currentChatRoom } = useSelector((state) => state.chatRoom);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentChatRoom.id) {
      addMessagesListener(currentChatRoom.id);
    }
    return () => {
      off(messagesRef);
    };
  }, [currentChatRoom.id]);

  const addMessagesListener = (chatRoomId) => {
    const messagesArray = [];

    onChildAdded(child(messagesRef, chatRoomId), (DataSnapshot) => {
      messagesArray.push(DataSnapshot.val());
      const newMessageArray = [...messagesArray];

      setMessages(newMessageArray);
      setMessagesLoading(false);
    });
  };

  const renderMessages = (messages) => {
    return (
      messages.length > 0 &&
      messages.map((message) => (
        <Message key={message.timestamp} message={message} user={currentUser} />
      ))
    );
  };

  return (
    <div className="w-full flex flex-col p-5 gap-3">
      <MessageHeader />
      <div className="w-full h-96 border-2 border-gray-200 rounded-md">
        {renderMessages(messages)}
      </div>
      <MessageForm />
    </div>
  );
};

export default MainPanel;
