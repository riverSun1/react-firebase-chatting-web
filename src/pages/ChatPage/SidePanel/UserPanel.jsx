import { Image } from "react-bootstrap";
import { IoIosChatboxes } from "react-icons/io";
import { useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import firebase from "../../../firebase";
import { getAuth, signOut } from "firebase/auth";

const UserPanel = () => {
  const { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser);

  const auth = getAuth(firebase);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <h3 className="flex flex-row text-2xl font-bold text-white gap-2">
        <IoIosChatboxes /> Chat APP
      </h3>
      <div className="flex flex-row">
        <Image
          src={currentUser.photoURL}
          roundedCircle
          className="w-8 h-8 mt-1"
        />
        <Dropdown>
          <Dropdown.Toggle className="bg-transparent border-0">
            {currentUser.displayName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>프로필 사진</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default UserPanel;
