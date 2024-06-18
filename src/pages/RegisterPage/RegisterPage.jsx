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
import app, { db } from "../../firebase";

const RegisterPage = () => {
  // 회원가입을 처리할 동안 다시 버튼을 누르지 못하게.
  const [loading, setLoading] = useState(false);
  const [errorFromSubmit, setErrorFromSubmit] = useState("");

  const auth = getAuth(app);

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

      // 회원가입
      const createdUser = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log(createdUser);

      // 닉네임, 프로필 이미지
      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(
          createdUser.user.email
        )}?d=identicon`,
      });
      console.log(auth.currentUser);

      set(ref(db, `users/${createdUser.user.uid}`), {
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL,
      });
    } catch (error) {
      console.log(error);
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
    <div id="auth-wrapper">
      <div style={{ textAlign: "center" }}>
        <h3>Register</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>이메일을 입력해주세요.</p>}

        <label htmlFor="name">Name</label>
        <input
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

        <label htmlFor="password">Password</label>
        <input
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

        <input type="submit" disabled={loading} />
        <Link style={{ color: "gray", textDecoration: "none" }} to={"/login"}>
          이미 아이디가 있다면...
        </Link>
      </form>
    </div>
  );
};

export default RegisterPage;
