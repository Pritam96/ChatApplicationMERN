import { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { toaster } from "../UI/toaster";
import axios from "axios";
import { Box, Stack, Text } from "@chakra-ui/react";
import { Button } from "../UI/button";
import { LuPlus } from "react-icons/lu";

const ChatList = () => {
  const [loggedInUser, setLoggedInUser] = useState();
  const { user, selectedChat, setSelectedChat, currentChats, setCurrentChats } =
    ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/v1/chat", config);
      console.log(data);
      setCurrentChats(data);
    } catch (error) {
      // console.error("Login failed:", error, error.response?.data?.error);

      toaster.create({
        title: "Error",
        description: error.response?.data?.error || "Error fetching the chat",
        type: "error",
        placement: "bottom-end",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      bg="black"
      color="white"
      p="3"
      w={{ base: "100%", md: "30%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb="3"
        px="3"
        fontSize={{ base: "24px", md: "32px" }}
        fontFamily="Roboto, sans-serif"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        color="white"
      >
        <Text>My Chats</Text>
        <Button
          variant="outline"
          colorPalette="cyan"
          display="flex"
          fontSize={{ base: "16px", md: "10px", lg: "16px" }}
        >
          New Group Chat
          <LuPlus />
        </Button>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p="4"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {currentChats ? (
          <Stack overflowY="scroll">
            {currentChats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                px="3"
                py="2"
                bg={selectedChat === chat ? "white" : "#14213d"}
                color={selectedChat === chat ? "black" : "white"}
                borderRadius="sm"
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedInUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatListSkeleton />
        )}
      </Box>
    </Box>
  );
};

export default ChatList;
