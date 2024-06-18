import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import app from "../../firebase";

const LoginPage = () => {
  // 회원가입을 처리할 동안 다시 버튼을 누르지 못하게.
  const [loading, setLoading] = useState(false);
  const [errorFromSubmit, setErrorFromSubmit] = useState("");

  const auth = getAuth(app);

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
        <h3>Login</h3>
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
        <Link
          style={{ color: "gray", textDecoration: "none" }}
          to={"/register"}
        >
          계정이 아직 없다면...
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
