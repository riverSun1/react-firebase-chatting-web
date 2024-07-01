import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import md5 from "md5";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import firebase, { db } from "../../firebase";

const RegisterPage = () => {
  // 로그인을 처리할 동안 다시 버튼을 누르지 못하게.
  const [loading, setLoading] = useState(false);
  const [errorFromSubmit, setErrorFromSubmit] = useState("");

  const auth = getAuth(firebase);

  // 유효성 검사
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // 회원가입
      const createdUser = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      // console.log(createdUser);

      // 닉네임, 프로필 이미지
      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(
          createdUser.user.email
        )}?d=identicon`,
      });
      // console.log("currentUser => ", auth.currentUser);
      // console.log(
      //   "photo URL => ",
      //   `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
      // );

      // db users 테이블에 저장.
      await set(ref(db, `users/${createdUser.user.uid}`), {
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL,
      });
    } catch (error) {
      // console.log(error);
      // error.message
      setErrorFromSubmit(error.message);
      // 3초 이후 에러메시지 숨김.
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
      <div className="text-2xl font-bold text-center m-4">회원가입</div>
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

        <label htmlFor="name" className="text-start">
          Name
        </label>
        <input
          className="border border-gray-300 rounded"
          id="name"
          type="text"
          name="name"
          {...register("name", { required: true, maxLength: 10 })}
        />
        {errors.name && errors.name.type === "required" && (
          <p>이름을 입력해주세요.</p>
        )}
        {errors.name && errors.name.type === "maxLength" && (
          <p>최대 10글자 입력 가능합니다.</p>
        )}

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
        <Link className="text-gray-500 no-underline" to="/login">
          로그인하러 가기
        </Link>
      </form>
    </div>
  );
};

export default RegisterPage;
