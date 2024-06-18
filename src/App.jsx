import { RouterProvider } from "react-router-dom";
import "./App.css";
import AuthObserver from "./components/AuthObserver";
import router from "./routes/router";

function App() {
  return (
    <div>
      <RouterProvider router={router}>
        <AuthObserver />
      </RouterProvider>
    </div>
  );
}

export default App;
