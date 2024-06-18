import ChatRooms from "./ChatRooms";
import DirectMessages from "./DirectMessages";
import Favorite from "./Favorite";
import UserPanel from "./UserPanel";

const SidePanel = () => {
  return (
    <div
      style={{
        backgroundColor: "#7B83EB",
        padding: "2rem",
        minHeight: "100vh",
        color: "white",
        minWidth: "275px",
      }}
    >
      <UserPanel />
      <Favorite />
      <ChatRooms />
      <DirectMessages />
    </div>
  );
};

export default SidePanel;
