import moment from "moment";
import { Image } from "react-bootstrap";

const Message = ({ message, user }) => {
  const timeFromNow = (timestamp) => moment(timestamp).fromNow();

  const isImage = (message) => {
    if (message.image) {
      return true;
    }
    return false;
  };

  const isMessageMine = (message, user) => {
    if (user) {
      return message.user.id === user.uid;
    }
  };

  return (
    <div className="flex flex-row gap-2 p-3 justify-start items-center">
      <Image
        roundedCircle
        className="w-10 h-10"
        src={message.user.image}
        alt={message.user.name}
      />
      <div className="flex flex-col">
        <div className="flex flex-row gap-2 items-center">
          <span
            className={`text-lg items-center font-bold ${
              isMessageMine(message, user) ? "text-cyan-700" : "text-black"
            }`}
          >
            {message.user.name}
          </span>
          <span className="text-sm items-center mt-1 text-gray-500">
            {timeFromNow(message.timestamp)}
          </span>
        </div>
        <div>
          {isImage(message) ? (
            <img className="w-25 rounded-md" alt="이미지" src={message.image} />
          ) : (
            <p>{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
