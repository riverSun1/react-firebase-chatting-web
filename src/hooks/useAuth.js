import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import firebase, { db } from "../firebase";
import { clearUser, setUser } from "../redux/slices/userSlice";

const useAuth = () => {
  const auth = getAuth(firebase); // Firebase 인증 객체
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // onAuthStateChanged 함수로 사용자 인증 상태 변화 감지
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // 최초에 firebase에서 안넘어옴.
      if (user) {
        //console.log("user:", Object.entries(user)); // 사용자 객체 로깅
        //console.log("uid:", user.uid);
        //console.log("Display Name:", user.displayName);
        //console.log("Photo URL:", user.photoURL);
        //console.log("==> ", getAuth().currentUser);
        //console.log("==> ", Object.entries(getAuth().currentUser));

        // Realtime Database에서 사용자 데이터 가져오기
        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          const { name, image } = data;

          dispatch(
            setUser({
              uid: user.uid,
              displayName: name,
              photoURL: image,
            })
          );
        });

        navigate("/"); // 사용자가 로그인한 경우 홈 페이지로 이동
      } else {
        navigate("/login"); // 사용자가 로그아웃한 경우 로그인 페이지로 이동

        dispatch(clearUser());
      }
    });

    // 클린업 함수
    return () => {
      unsubscribe(); // onAuthStateChanged 구독 해지
    };
  }, [auth, dispatch, navigate]);
};

export default useAuth;
