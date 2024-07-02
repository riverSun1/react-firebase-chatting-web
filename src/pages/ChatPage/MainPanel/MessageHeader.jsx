import { child, onValue, ref, remove, update } from "firebase/database";
import { useEffect, useState } from "react";
import { Col, FormControl, Image, InputGroup, Row } from "react-bootstrap";
import { AiOutlineSearch } from "react-icons/ai";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useSelector } from "react-redux";
import { db } from "../../../firebase";

const MessageHeader = ({ handleSearchChange }) => {
  const { currentChatRoom } = useSelector((state) => state.chatRoom);
  const { isPrivateChatRoom } = useSelector((state) => state.chatRoom);
  const { currentUser } = useSelector((state) => state.user);
  const [isFavorite, setIsFavorite] = useState(false);
  const usersRef = ref(db, "users");

  useEffect(() => {
    if (currentChatRoom.id && currentUser.uid) {
      addFavoriteListener(currentChatRoom.id, currentUser.uid);
    }
  }, [currentChatRoom.id, currentUser.uid]);

  // Favorite 리스너 추가
  // 데이터를 받아와 현재 채팅방이 즐겨찾기에 추가되어 있는지 확인 후 isFavorite 상태 업데이트
  const addFavoriteListener = (chatRoomId, userId) => {
    onValue(child(usersRef, `${userId}/favorite`), (data) => {
      if (data.val() !== null) {
        const chatRoomIds = Object.keys(data.val());
        const isAlreadyFavorite = chatRoomIds.includes(chatRoomId);
        setIsFavorite(isAlreadyFavorite);
      }
    });
  };

  const handleFavorite = () => {
    if (isFavorite) {
      setIsFavorite(false);
      remove(
        child(usersRef, `${currentUser.uid}/favorite/${currentChatRoom.id}`)
      );
    } else {
      setIsFavorite(true);
      update(child(usersRef, `${currentUser.uid}/favorite`), {
        [currentChatRoom.id]: {
          name: currentChatRoom.name,
          description: currentChatRoom.description,
          createdBy: {
            name: currentChatRoom.createdBy.name,
            image: currentChatRoom.createdBy.image,
          },
        },
      });
    }
  };

  return (
    <div className="w-full border-2 rounded-md h-50 p-1 mb-1">
      {!isPrivateChatRoom ? (
        <div className="flex flex-row justify-end items-center gap-1 m-3">
          <p>방장:</p>
          <Image
            roundedCircle
            src={currentChatRoom.createdBy.image}
            className="h-7 w-7 mr-1"
          />
          <p>{currentChatRoom.createdBy.name}</p>
        </div>
      ) : null}
      <Row className="mx-1 my-3">
        <Col className="flex flex-row gap-2 items-center">
          <h2>{isPrivateChatRoom ? <FaLock /> : <FaLockOpen />}</h2>
          <p>{currentChatRoom.name}</p>
          {isPrivateChatRoom ? null : (
            <p className="cursor-pointer" onClick={handleFavorite}>
              {isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}
            </p>
          )}
        </Col>
        <Col>
          <InputGroup>
            <InputGroup.Text>
              <AiOutlineSearch className="reverse" />
            </InputGroup.Text>
            <FormControl
              onChange={handleSearchChange}
              placeholder="메시지를 검색해보세요."
            ></FormControl>
          </InputGroup>
        </Col>
      </Row>
    </div>
  );
};

export default MessageHeader;
