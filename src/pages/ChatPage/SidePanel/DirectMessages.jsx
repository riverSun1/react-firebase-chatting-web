import { onChildAdded, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../../firebase";
import {
  setCurrentRoom,
  setPrivateRoom,
} from "../../../redux/slices/chatRoomSlice";

const DirectMessages = () => {
  const usersRef = ref(db, "users");
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [activeChatRoom, setActiveChatRoom] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?.uid) {
      addUsersListener(currentUser.uid);
    }
    return () => {};
  }, [currentUser?.uid]);

  const addUsersListener = (currentUserId) => {
    const usersArray = [];
    onChildAdded(usersRef, (DataSnapshot) => {
      if (currentUserId !== DataSnapshot.key) {
        const user = DataSnapshot.val();
        user["uid"] = DataSnapshot.key;
        usersArray.push(user);
        setUsers([...usersArray]);
      }
    });
  };

  // console.log(users);

  const getChatRoomId = (userId) => {
    const currentUserId = currentUser.uid;

    return userId > currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  const changeChatRoom = (user) => {
    const chatRoomId = getChatRoomId(user.uid);
    const chatRoomData = {
      id: chatRoomId,
      name: user.name,
    };
    dispatch(setCurrentRoom(chatRoomData));
    dispatch(setPrivateRoom(true));
    setActiveChatRoom(user.uid);
  };

  const renderDirectMessages = (users) => {
    return (
      users.length > 0 &&
      users.map((user) => (
        <li
          key={user.uid}
          className={`rounded-md cursor-pointer ${
            user.uid === activeChatRoom ? "p-1 bg-cyan-700" : "bg-transparent"
          }`}
          onClick={() => changeChatRoom(user)}
        >
          <div
            className={`rounded-md ${
              user.uid === activeChatRoom
                ? "bg-cyan-700"
                : "p-1 hover:bg-cyan-950"
            }`}
          >
            # {user.name}
          </div>
        </li>
      ))
    );
  };

  return (
    <div>
      <div className="p-1">🙋‍♀️ 다이렉트 메세지</div>
      <ul className="p-1">{renderDirectMessages(users)}</ul>
    </div>
  );
};

export default DirectMessages;
