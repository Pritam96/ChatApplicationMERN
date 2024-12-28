import { Box, Spinner } from "@chakra-ui/react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      navigate("/");
    }
    setLoading(false);
  }, [user, navigate]);

  if (loading) {
    return <Spinner alignSelf="center" margin="auto" size="xl" />;
  }

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
