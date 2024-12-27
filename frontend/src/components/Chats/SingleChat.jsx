import { Box, IconButton, Text } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { LuArrowLeft, LuEye } from "react-icons/lu";
import getSender from "../../utils/getSender";
import ProfileModal from "../miscellaneous/ProfileModal";
import { useState } from "react";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";

const SingleChat = ({ refetch, doRefetch }) => {
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openUpdateGroupDialog, setOpenUpdateGroupDialog] = useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();

  const sender =
    selectedChat && !selectedChat.isGroupChat
      ? getSender(user, selectedChat.users)
      : null;

  const handleOpenDialog = () => {
    if (selectedChat.isGroupChat) setOpenUpdateGroupDialog(true);
    else setOpenProfileDialog(true);
  };

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
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            MESSAGES GOES HERE
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
