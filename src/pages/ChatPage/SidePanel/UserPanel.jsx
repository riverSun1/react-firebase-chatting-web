import { Image } from "react-bootstrap";
import { IoIosChatboxes } from "react-icons/io";
import { useSelector } from "react-redux";

const UserPanel = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  return (
    <div>
      <h3 className="text-white">
        <IoIosChatboxes />
      </h3>
      <div>
        <Image
          src={currentUser.photoURL}
          roundedCircle
          className="w-8 h-8 mt-1"
        />
      </div>
    </div>
  );
};

export default UserPanel;
