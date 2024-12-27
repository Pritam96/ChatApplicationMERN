import { Box } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatWindow = ({ refetch, doRefetch }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{
        base: selectedChat ? "block" : "none",
        md: "flex",
      }}
      alignItems="center"
      flexDir="column"
      p="3"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      bg="black"
    >
      <SingleChat refetch={refetch} doRefetch={doRefetch} />
    </Box>
  );
};

export default ChatWindow;
