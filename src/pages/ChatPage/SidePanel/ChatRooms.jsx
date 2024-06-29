import {
  child,
  ref as dbRef,
  onChildAdded,
  push,
  update,
} from "firebase/database";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { db } from "../../../firebase";

const ChatRooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [chatRoomName, setChatRoomName] = useState("");
  const [chatRoomDescription, setChatRoomDescription] = useState("");
  const chatRoomsRef = dbRef(db, "chatRooms");
  const [chatRooms, setChatRooms] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    addChatRoomsListeners();
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
    });
  };

  const isFormValid = (chatRoomName, chatRoomDescription) => {
    return chatRoomName && chatRoomDescription;
  };

  const renderChatRooms = () => {
    if (chatRooms.length > 0) {
      return chatRooms.map((room) => <li key={room.id}>- {room.name}</li>);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between px-3 py-2 rounded-md bg-cyan-600">
        ChatRooms
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
