import { Outlet } from "react-router-dom";
import AuthObserver from "./components/AuthObserver";

const Layout = () => {
  return (
    <>
      <AuthObserver />
      <Outlet />
    </>
  );
};

export default Layout;
