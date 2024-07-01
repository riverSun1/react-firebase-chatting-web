import firebase from "firebase/compat/app";
import {
  child,
  ref as dbRef,
  push,
  serverTimestamp,
  set,
  ref as strRef,
} from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../firebase";

const MessageForm = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const messagesRef = dbRef(db, "messages");
  const inputOpenImageRef = useRef(null);

  const { currentChatRoom } = useSelector((state) => state.chatRoom);
  const { isPrivateChatRoom } = useSelector((state) => state.chatRoom);
  const { currentUser } = useSelector((state) => state.user);

  const createMessage = (fileUrl = null) => {
    const message = {
      timestamp: serverTimestamp(),
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        image: currentUser.photoURL,
      },
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = content;
    }
    return message;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content) {
      setErrorMsg("메시지를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await set(push(child(messagesRef, currentChatRoom.id)), createMessage());
      setLoading(false);
      setContent("");
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(error.message);
      setTimeout(() => {
        setErrorMsg("");
      }, 5000);
    }
  };

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };

  const getPath = () => {
    if (isPrivateChatRoom) {
      return `/message/private/${currentChatRoom.id}`;
    } else {
      return `/message/public`;
    }
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];

    const storage = getStorage(firebase);
    const metadata = {
      contentType: file.type,
    };
    const storageRef = strRef(storage, `${getPath()}/${file.name}`);
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
        });
      }
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-24 border-2 rounded-md p-3"
        />
        <div className="text-red-500">{errorMsg}</div>
        <div>
          <div className="flex flex-row gap-2.5 my-2">
            <button
              type="button"
              className="flex flex-1 p-2.5 rounded-md text-white bg-cyan-800 hover:bg-cyan-600 text-center items-center justify-center"
              onClick={handleOpenImageRef}
              disabled={loading}
            >
              이미지
            </button>
            <button
              type="submit"
              className="flex flex-1 p-2.5 rounded-md text-white bg-cyan-800 hover:bg-cyan-600 text-center items-center justify-center"
              disabled={loading}
            >
              메시지 전송
            </button>
          </div>
        </div>
      </form>
      <input
        type="file"
        accept="image/jpeg, image/png"
        className="hidden"
        ref={inputOpenImageRef}
        onChange={handleUploadImage}
      />
    </div>
  );
};

export default MessageForm;
