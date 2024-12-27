import { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { toaster } from "../UI/toaster";
import axios from "axios";
import { Box, Stack, Text } from "@chakra-ui/react";
import { Button } from "../UI/button";
import { LuPlus } from "react-icons/lu";
import ChatListSkeleton from "./ChatListSkeleton";
import GroupChatModal from "../miscellaneous/GroupChatModal";
import getSender from "../../utils/getSender";

const ChatList = ({ refetch }) => {
  const [loggedInUser, setLoggedInUser] = useState();
  const [openDialog, setOpenDialog] = useState(false);

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
      setCurrentChats(data);
    } catch (error) {
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
  }, [refetch]);

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        bg="black"
        color="white"
        p="3"
        w={{ base: "100%", md: "31%" }}
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
        >
          <Text>My Chats</Text>
          <Button
            variant="outline"
            colorPalette="cyan"
            display="flex"
            fontSize={{ base: "16px", md: "10px", lg: "16px" }}
            onClick={() => setOpenDialog(true)} // Opens dialog
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
                      ? getSender(loggedInUser, chat.users).name
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

      <GroupChatModal openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </>
  );
};

export default ChatList;
