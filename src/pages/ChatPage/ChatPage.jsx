import MainPanel from "./MainPanel/MainPanel";
import SidePanel from "./SidePanel/SidePanel";

const ChatPage = () => {
  return (
    <div className="flex flex-row">
      <div className="w-72">
        <SidePanel />
      </div>
      <div className="w-full">
        <MainPanel />
      </div>
    </div>
  );
};

export default ChatPage;
