import Layout from "./Layout";
import Home from "./components/Home/Home";
import Chats from "./components/Chats/Chats";
import { Toaster } from "./components/UI/toaster";
import "./App.css";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/*login & register*/}
      <Route index element={<Home />} />
      {/* If authenticated, go to chats*/}
      <Route path="chats" element={<Chats />} />
    </Route>
  )
);

const App = () => {
  return (
    <div className="App">
      <Toaster />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
