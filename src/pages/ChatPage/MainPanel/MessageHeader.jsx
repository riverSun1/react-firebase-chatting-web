import { Col, FormControl, Image, InputGroup, Row } from "react-bootstrap";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";

const MessageHeader = () => {
  const { currentChatRoom } = useSelector((state) => state.chatRoom);
  return (
    <div className="w-full border-2 rounded-md h-50 p-1 mb-1 ">
      <div className="flex flex-row justify-end items-center gap-1 m-3">
        <p>방장:</p>
        <Image
          roundedCircle
          src={currentChatRoom.createdBy.image}
          className="h-7 w-7 mr-1"
        />
        <p>{currentChatRoom.createdBy.name}</p>
      </div>
      <Row className="mx-1 my-3">
        <Col>{}</Col>
        <Col>
          <InputGroup>
            <InputGroup.Text>
              <AiOutlineSearch className="reverse" />
            </InputGroup.Text>
            <FormControl
              onChange={() => {}}
              placeholder="메시지를 검색해보세요."
            ></FormControl>
          </InputGroup>
        </Col>
      </Row>
    </div>
  );
};

export default MessageHeader;
