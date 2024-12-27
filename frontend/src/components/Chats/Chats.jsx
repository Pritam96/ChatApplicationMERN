import { Box } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import SideDrawer from "../miscellaneous/SideDrawer";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Chats = () => {
  const { user } = ChatState();
  const navigate = useNavigate();
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="90vh"
        p="10px"
      >
        {user && <ChatList refetch={refetch} />}
        {user && <ChatWindow refetch={refetch} doRefetch={setRefetch} />}
      </Box>
    </div>
  );
};

export default Chats;
