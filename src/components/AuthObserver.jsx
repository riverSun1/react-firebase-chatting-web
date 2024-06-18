import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import app from "../firebase";
import { clearUser, setUser } from "../redux/slices/userSlice";

const AuthObserver = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // 사용자 인증 상태 감지
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
        dispatch(
          setUser({
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        );
      } else {
        // 로그아웃 시
        navigate("/login");
        dispatch(clearUser);
      }
    });

    // 언마운트, auth, navigate 값 변경 시, onAuthStateChanged 구독 취소
    return () => {
      unsubscribe();
    };
  }, [auth, navigate]);

  return null;
};

export default AuthObserver;
