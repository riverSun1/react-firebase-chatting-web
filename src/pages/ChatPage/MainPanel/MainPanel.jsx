import MessageForm from "./MessageForm";
import MessageHeader from "./MessageHeader";

const MainPanel = () => {
  return (
    <div className="w-full flex flex-col p-5 gap-3">
      <MessageHeader />
      <div className="w-full h-96 border-2 border-gray-200 rounded-md"></div>
      <MessageForm />
    </div>
  );
};

export default MainPanel;
