import ChatRooms from "./ChatRooms";
import DirectMessages from "./DirectMessages";
import Favorite from "./Favorite";
import UserPanel from "./UserPanel";

const SidePanel = () => {
  return (
    <div className="bg-cyan-900 p-8 min-h-screen text-white min-w-[275px]">
      <UserPanel />
      <Favorite />
      <ChatRooms />
      <DirectMessages />
    </div>
  );
};

export default SidePanel;
