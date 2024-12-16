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
      <Route path="" element={<Home />}></Route>
      <Route path="chats" element={<Chats />}></Route>
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
