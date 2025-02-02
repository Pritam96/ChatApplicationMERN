import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { Provider as ChakraProvider } from "./components/UI/provider";
import ChatProvider from "./Context/ChatProvider";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChatProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ChatProvider>
  </React.StrictMode>
);
