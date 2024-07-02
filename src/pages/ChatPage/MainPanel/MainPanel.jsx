import {
  child,
  ref as dbRef,
  off,
  onChildAdded,
  onChildRemoved,
} from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../../firebase";
import Message from "./Message";
import MessageForm from "./MessageForm";
import MessageHeader from "./MessageHeader";

const MainPanel = () => {
  const messagesRef = dbRef(db, "messages");
  const typingRef = dbRef(db, "typing");

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const { currentChatRoom } = useSelector((state) => state.chatRoom);
  const dispatch = useDispatch();
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  });

  useEffect(() => {
    if (currentChatRoom.id) {
      addMessagesListener(currentChatRoom.id);
      addTypingListeners(currentChatRoom.id);
    }
    return () => {
      off(messagesRef);
    };
  }, [currentChatRoom.id]);

  const addTypingListeners = (chatRoomId) => {
    let typingUsers = [];

    onChildAdded(child(typingRef, chatRoomId), (DataSnapshot) => {
      if (DataSnapshot.key !== currentUser.uid) {
        typingUsers = typingUsers.concat({
          id: DataSnapshot.key,
          name: DataSnapshot.val(),
        });
        setTypingUsers(typingUsers);
      }
    });

    onChildRemoved(child(typingRef, chatRoomId), (DataSnapshot) => {
      const index = typingUsers.findIndex(
        (user) => user.id === DataSnapshot.key
      );
      if (index !== -1) {
        typingUsers = typingUsers.filter(
          (user) => user.id !== DataSnapshot.key
        );
        setTypingUsers(typingUsers);
      }
    });
  };

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
    setMessages([]);

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

  const renderTypingUsers = (typingUsers) => {
    return (
      typingUsers.length > 0 &&
      typingUsers.map((user) => (
        <span key={user.name.userUid}>
          {user.name.userUid}님이 채팅을 입력하고 있습니다...
        </span>
      ))
    );
  };

  return (
    <div className="w-full flex flex-col p-5 gap-3">
      <MessageHeader handleSearchChange={handleSearchChange} />
      <div className="w-full h-96 border-2 border-gray-200 rounded-md overflow-y-auto">
        {searchLoading && <div>loading...</div>}
        {searchTerm ? renderMessages(searchResults) : renderMessages(messages)}
        {/* {renderMessages(messages)} */}
        <div ref={messageEndRef} />
      </div>
      {renderTypingUsers(typingUsers)}
      <MessageForm />
    </div>
  );
};

export default MainPanel;
