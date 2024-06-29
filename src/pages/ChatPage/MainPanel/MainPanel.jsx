import MessageForm from "./MessageForm";
import MessageHeader from "./MessageHeader";

const MainPanel = () => {
  return (
    <div className="w-full flex flex-col">
      <MessageHeader />
      <div className="w-full h-72 border-2 border-gray-200 rounded-md p-4 mb-4"></div>
      <MessageForm />
    </div>
  );
};

export default MainPanel;
