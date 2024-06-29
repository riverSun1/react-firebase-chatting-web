import ChatRooms from "./ChatRooms";
import DirectMessages from "./DirectMessages";
import Favorite from "./Favorite";
import UserPanel from "./UserPanel";

const SidePanel = () => {
  return (
    <div className="flex flex-col bg-cyan-900 p-8 min-h-screen text-white min-w-[275px] gap-y-5">
      <UserPanel />
      <Favorite />
      <ChatRooms />
      <DirectMessages />
    </div>
  );
};

export default SidePanel;
