import {
  child,
  off,
  onChildAdded,
  onChildRemoved,
  ref,
} from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../firebase";

const Favorite = () => {
  const [favoriteChatRooms, setFavoriteChatRooms] = useState([]);
  const usersRef = ref(db, "users");

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

  const renderFavoriteChatRooms = (favoriteChatRooms) => {
    return (
      favoriteChatRooms.length > 0 &&
      favoriteChatRooms.map((chatRoom) => (
        <li key={chatRoom.id}>- {chatRoom.name}</li>
      ))
    );
  };

  return (
    <div>
      <div>⭐ 즐겨찾기</div>
      <ul>{renderFavoriteChatRooms(favoriteChatRooms)}</ul>
    </div>
  );
};

export default Favorite;
