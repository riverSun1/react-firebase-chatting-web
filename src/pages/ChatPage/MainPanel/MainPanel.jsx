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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setSearchLoading(true);
    handleSearchMessage(event.target.value);
  };

  const handleSearchMessage = (searchTerm) => {
    const chatRoomMessages = [...messages];
    const regex = new RegExp(searchTerm, "gi");
    const searchResults = chatRoomMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    setSearchResults(searchResults);
    setSearchLoading(false);
  };

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
      <MessageHeader handleSearchChange={handleSearchChange} />
      <div className="w-full h-96 border-2 border-gray-200 rounded-md">
        {searchLoading && <div>loading...</div>}
        {searchTerm ? renderMessages(searchResults) : renderMessages(messages)}
        {/* {renderMessages(messages)} */}
      </div>
      <MessageForm />
    </div>
  );
};

export default MainPanel;
