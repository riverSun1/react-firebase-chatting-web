import { getAuth, signOut, updateProfile } from "firebase/auth";
import { ref as dbRef, update } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as strRef,
  uploadBytesResumable,
} from "firebase/storage";
import { useRef } from "react";
import { Image } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { IoIosChatboxes } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import firebase, { db } from "../../../firebase";
import { setPhotoUrl } from "../../../redux/slices/userSlice";

const UserPanel = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const auth = getAuth(firebase);
  const inputOpenImageRef = useRef(null);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  };

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    const user = auth.currentUser;

    const storage = getStorage(firebase);
    const metadata = {
      contentType: file.type,
    };
    const storageRef = strRef(storage, "user_image/" + user.uid);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);

          updateProfile(user, {
            photoURL: downloadURL,
          });

          dispatch(setPhotoUrl(downloadURL));
          update(dbRef(db, `users/${user.uid}`), { image: downloadURL });
        });
      }
    );
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
            <Dropdown.Item onClick={handleOpenImageRef}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <input
        onChange={handleUploadImage}
        type="file"
        ref={inputOpenImageRef}
        className="hidden"
        accept="image/jpeg, image/png"
      />
    </div>
  );
};

export default UserPanel;
