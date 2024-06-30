import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import firebase from "../firebase";
import { clearUser, setUser } from "../redux/slices/userSlice";

const AuthObserver = () => {
  const auth = getAuth(firebase); // Firebase 인증 객체를 가져옵니다.
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // onAuthStateChanged 함수로 사용자 인증 상태 변화 감지
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/"); // 사용자가 로그인한 경우 홈 페이지로 이동합니다.

        dispatch(
          setUser({
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        );
      } else {
        navigate("/login"); // 사용자가 로그아웃한 경우 로그인 페이지로 이동합니다.

        dispatch(clearUser);
      }
    });

    // 클린업 함수
    return () => {
      unsubscribe(); // 언마운트, auth, navigate 값 변경 시, onAuthStateChanged 구독 해지
    };
  }, [auth, dispatch, navigate]);

  return null;
};

export default AuthObserver;
