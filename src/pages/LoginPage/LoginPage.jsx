import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import { setUser } from "../../redux/slices/userSlice";

const LoginPage = () => {
  // 회원가입을 처리할 동안 다시 버튼을 누르지 못하게.
  const [loading, setLoading] = useState(false);
  const [errorFromSubmit, setErrorFromSubmit] = useState("");
  const auth = getAuth(firebase);
  const dispatch = useDispatch();

  // 유효성 검사
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    //data.email data.password data.name
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // console.log(data);
      dispatch(
        setUser({
          uid: getAuth().currentUser.uid,
          displayName: getAuth().currentUser.displayName,
          photoURL: getAuth().currentUser.photoURL,
        })
      );
    } catch (error) {
      // console.log(error);
      // error.message
      setErrorFromSubmit(error.message);
      setTimeout(() => {
        setErrorFromSubmit("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-wrapper"
      className="flex flex-col justify-center items-center min-h-screen"
    >
      <div className="text-2xl font-bold text-center m-4">로그인</div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col text-center m-4 gap-2 border border-gray-300 rounded px-28 py-20"
      >
        <label htmlFor="email" className="text-start">
          Email
        </label>
        <input
          className="border border-gray-300 rounded"
          id="email"
          type="email"
          name="email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>이메일을 입력해주세요.</p>}

        <label htmlFor="password" className="text-start">
          Password
        </label>
        <input
          className="border border-gray-300 rounded"
          id="password"
          type="password"
          name="password"
          {...register("password", { required: true, minLength: 6 })}
        />
        {errors.password && errors.password.type === "required" && (
          <p>비밀번호를 입력해주세요.</p>
        )}
        {errors.password && errors.password.type === "maxLength" && (
          <p>비밀번호는 최소 6자 이상입니다.</p>
        )}

        {errorFromSubmit && <p>{errorFromSubmit}</p>}

        <input
          type="submit"
          disabled={loading}
          className="border border-gray-300 rounded bg-gray-300 p-1 my-2"
        />
        <Link className="text-gray-500 no-underline" to="/register">
          회원가입하러 가기
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
