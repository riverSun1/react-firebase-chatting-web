import {
  child,
  ref as dbRef,
  off,
  onChildAdded,
  push,
  update,
} from "firebase/database";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../../firebase";
import { setCurrentRoom } from "../../../redux/slices/chatRoomSlice";

const ChatRooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [chatRoomName, setChatRoomName] = useState("");
  const [chatRoomDescription, setChatRoomDescription] = useState("");

  const chatRoomsRef = dbRef(db, "chatRooms");

  const [chatRooms, setChatRooms] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true); // 일회용
  const [activeChatRoomId, setActiveChatRoomId] = useState("");

  const { currentUser } = useSelector((state) => state.user);
  const { currentChatRoom } = useSelector((state) => state.chatRoom);

  const dispatch = useDispatch();

  useEffect(() => {
    addChatRoomsListeners();

    // event listener 제거
    return () => {
      off(chatRoomsRef);
    };
  }, []);

  const handleSubmit = async () => {
    if (isFormValid(chatRoomName, chatRoomDescription)) {
      const key = push(chatRoomsRef).key;

      const newChatRoom = {
        id: key,
        name: chatRoomName,
        description: chatRoomDescription,
        createdBy: {
          name: currentUser.displayName,
          image: currentUser.photoURL,
        },
      };

      try {
        await update(child(chatRoomsRef, key), newChatRoom);
        setChatRoomName("");
        setChatRoomDescription("");
        setShowModal(false);
      } catch (error) {
        alert(error);
      }
    } else {
      alert("Form is not valid");
    }
  };

  // database에 data가 변경되면 실시간으로 업데이트
  const addChatRoomsListeners = () => {
    const chatRoomsArray = [];

    onChildAdded(chatRoomsRef, (DataSnapshot) => {
      chatRoomsArray.push(DataSnapshot.val());
      const newChatRooms = [...chatRoomsArray];
      setChatRooms(newChatRooms);
      setFirstChatRoom(newChatRooms);
    });
  };

  const setFirstChatRoom = (chatRooms) => {
    const firstChatRoom = chatRooms[0];
    if (firstLoad & (chatRooms.length > 0)) {
      dispatch(setCurrentRoom(firstChatRoom));
      setActiveChatRoomId(firstChatRoom.id);
    }
    setFirstLoad(false);
  };

  const isFormValid = (chatRoomName, chatRoomDescription) => {
    return chatRoomName && chatRoomDescription;
  };

  const changeChatRoom = (room) => {
    dispatch(setCurrentRoom(room));
    setActiveChatRoomId(room.id);
  };

  const renderChatRooms = () => {
    if (chatRooms.length > 0) {
      return chatRooms.map((room) => (
        <li
          key={room.id}
          onClick={() => changeChatRoom(room)}
          className={`cursor-pointer rounded-md p-1.5 y-1 hover:bg-cyan-700 ${
            room.id === activeChatRoomId ? "bg-cyan-950" : "bg-transparent"
          }`}
        >
          - {room.name}
        </li>
      ));
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between p-1">
        {/* px-3 py-2 rounded-md bg-cyan-600 */}
        채팅방
        <FaPlus onClick={() => setShowModal(true)} className="cursor-pointer" />
      </div>
      <ul className="text-white p-1">{renderChatRooms()}</ul>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>채팅 방 만들기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>채팅 방 이름</Form.Label>
              <Form.Control
                onChange={(e) => setChatRoomName(e.target.value)}
                value={chatRoomName}
                placeholder="채팅 방 이름을 입력해주세요."
              />
              <Form.Label>채팅 방 설명</Form.Label>
              <Form.Control
                onChange={(e) => setChatRoomDescription(e.target.value)}
                value={chatRoomDescription}
                placeholder="채팅 방 설명을 입력해주세요."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowModal(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            만들기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChatRooms;
