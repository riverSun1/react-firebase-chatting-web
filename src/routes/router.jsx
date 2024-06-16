import { createBrowserRouter } from "react-router-dom";
import ChatPage from "../pages/ChatPage/ChatPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";

const router = createBrowserRouter([
  { path: "/", element: <ChatPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
]);

export default router;
