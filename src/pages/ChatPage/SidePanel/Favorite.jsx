import {
  child,
  off,
  onChildAdded,
  onChildRemoved,
  ref,
} from "firebase/database";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../../firebase";
import {
  setCurrentRoom,
  setPrivateRoom,
} from "../../../redux/slices/chatRoomSlice";

const Favorite = () => {
  const [favoriteChatRooms, setFavoriteChatRooms] = useState([]);
  const [activeChatRoomId, setActiveChatRoomId] = useState("");
  const usersRef = ref(db, "users");
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser.uid) {
      addListener(currentUser.uid);
    }
    return () => {
      removeListener(currentUser.uid);
    };
  }, [currentUser.uid]);

  const removeListener = (userId) => {
    off(child(usersRef, `${userId}/favorite`));
  };

  const addListener = (userId) => {
    let favoriteArray = [];
    onChildAdded(child(usersRef, `${userId}/favorite`), (DataSnapshot) => {
      favoriteArray.push({ id: DataSnapshot.key, ...DataSnapshot.val() });
      const newFavoriteChatRooms = [...favoriteArray];
      setFavoriteChatRooms(newFavoriteChatRooms);
    });

    onChildRemoved(child(usersRef, `${userId}/favorite`), (DataSnapshot) => {
      const filteredChatRooms = favoriteArray.filter((chatRoom) => {
        return chatRoom.id !== DataSnapshot.key;
      });
      favoriteArray = filteredChatRooms;
      setFavoriteChatRooms(filteredChatRooms);
    });
  };

  const changeChatRoom = (room) => {
    dispatch(setCurrentRoom(room));
    dispatch(setPrivateRoom(room));
    setActiveChatRoomId(room.id);
  };

  const renderFavoriteChatRooms = (favoriteChatRooms) => {
    return (
      favoriteChatRooms.length > 0 &&
      favoriteChatRooms.map((chatRoom) => (
        <li
          key={chatRoom.id}
          onClick={() => changeChatRoom(chatRoom)}
          className={`rounded-md cursor-pointer ${
            chatRoom.id === activeChatRoomId
              ? "p-1 bg-cyan-700"
              : "bg-transparent"
          }`}
        >
          <div
            className={`rounded-md ${
              chatRoom.id === activeChatRoomId
                ? "bg-cyan-700"
                : "p-1 hover:bg-cyan-950"
            }`}
          >
            - {chatRoom.name}
          </div>
        </li>
      ))
    );
  };

  return (
    <div className="m-1">
      <div className="py-1.5">⭐ 즐겨찾기</div>
      <ul className="m-1 cursor-pointer">
        {renderFavoriteChatRooms(favoriteChatRooms)}
      </ul>
    </div>
  );
};

export default Favorite;
