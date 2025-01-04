import { Box, Flex, Spinner } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import SideDrawer from "../miscellaneous/SideDrawer";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Chats = () => {
  const { user } = ChatState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (!user) {
      navigate("/");
    }
    setLoading(false);
  }, [user, navigate, loading]);

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
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
