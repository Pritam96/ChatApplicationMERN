import { Box, IconButton, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { LuArrowLeft, LuEye, LuSendHorizontal } from "react-icons/lu";
import ProfileModal from "../miscellaneous/ProfileModal";
import { useEffect, useState } from "react";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import axios from "axios";
import { Toaster } from "../UI/toaster";
import { getSender } from "../../utils/helper";

const SingleChat = ({ refetch, doRefetch }) => {
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openUpdateGroupDialog, setOpenUpdateGroupDialog] = useState(false);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  const sender =
    selectedChat && !selectedChat.isGroupChat
      ? getSender(user, selectedChat.users)
      : null;

  const handleOpenDialog = () => {
    if (selectedChat.isGroupChat) setOpenUpdateGroupDialog(true);
    else setOpenProfileDialog(true);
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      setNewMessage("");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/v1/message",
        { chatId: selectedChat._id, content: newMessage },
        config
      );

      setMessages((prevMessages) => [...prevMessages, data]);
    } catch (error) {
      Toaster.create({
        title: "Error Occurred!",
        description:
          error.response?.data?.error || "Failed to send the message",
        type: "error",
        placement: "bottom-end",
        duration: 5000,
      });
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/v1/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
    } catch (error) {
      Toaster.create({
        title: "Error Occurred!",
        description:
          error.response?.data?.error || "Failed to load the messages",
        type: "error",
        placement: "bottom-end",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pd="3"
            px="2"
            w="100%"
            font={"Roboto, sans-serif"}
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              aria-label="Back"
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat(null)}
            >
              <LuArrowLeft />
            </IconButton>

            {selectedChat.isGroupChat ? (
              <>
                {selectedChat.chatName?.toUpperCase()}
                <UpdateGroupChatModal
                  openDialog={openUpdateGroupDialog}
                  setOpenDialog={setOpenUpdateGroupDialog}
                  refetch={refetch}
                  doRefetch={doRefetch}
                />
              </>
            ) : (
              <>
                {sender?.name}
                <ProfileModal
                  user={sender}
                  openDialog={openProfileDialog}
                  setOpenDialog={setOpenProfileDialog}
                />
              </>
            )}

            <IconButton
              aria-label="View Chat Info"
              display="flex"
              onClick={handleOpenDialog}
            >
              <LuEye />
            </IconButton>
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p="3"
            w="100%"
            h="95%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner alignSelf="center" margin="auto" size="xl" />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                  height: "100%",
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}

            <Stack direction="row" w="100%" spacing={2}>
              <Input
                variant="subtle"
                placeholder="Enter a message.."
                onChange={typingHandler}
                value={newMessage}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <IconButton aria-label="Send message" onClick={sendMessage}>
                <LuSendHorizontal />
              </IconButton>
            </Stack>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          h="100%"
        >
          <Text fontSize="3xl" fontFamily={"Roboto, sans-serif"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
