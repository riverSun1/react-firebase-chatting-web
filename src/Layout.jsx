import { Outlet } from "react-router-dom";
import useAuth from "./hooks/useAuth";

const Layout = () => {
  useAuth();
  return <Outlet />;
};

export default Layout;
