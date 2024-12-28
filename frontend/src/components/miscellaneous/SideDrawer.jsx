import { Box, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { Tooltip } from "../UI/tooltip";
import { Button } from "../UI/button";
import { Avatar } from "../UI/avatar";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from "../UI/drawer";

import {
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuRoot,
  MenuTrigger,
} from "../UI/menu";

import { LuArrowDown, LuBell, LuSearch } from "react-icons/lu";

import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { toaster } from "../UI/toaster";

import axios from "axios";
import ChatListSkeleton from "../Chats/ChatListSkeleton";
import UserItem from "../Users/UserItem";
import pickPalette from "../../utils/pickPalette";
import ProfileModal from "./ProfileModal";

const SideDrawer = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, currentChats, setCurrentChats } = ChatState();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!searchKeyword) {
      toaster.create({
        title: "Warning",
        description: "Please enter something in search",
        type: "warning",
        placement: "bottom-end",
        duration: 5000,
      });
      return;
    }

    try {
      setLoadingSearch(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/v1/user?search=${searchKeyword}`,
        config
      );

      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: "Error",
        description:
          error.response?.data?.error || "Failed to load search results",
        type: "error",
        placement: "bottom-end",
        duration: 5000,
      });
    } finally {
      setLoadingSearch(false);
    }
  };

  const accessChatHandler = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/v1/chat", { userId }, config);

      if (!currentChats.find((chat) => chat._id === data._id)) {
        setCurrentChats([data, ...currentChats]);
      }
      setSelectedChat(data);
      handleCloseDrawer();
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.response?.data?.error || "Error fetching the chat",
        type: "error",
        placement: "bottom-end",
        duration: 5000,
      });
    } finally {
      setLoadingChat(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="black"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search users to chat" placement="bottom-end">
          <Button
            variant="surface"
            onClick={handleOpenDrawer}
            aria-label="Search Users"
          >
            <LuSearch />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Roboto, sans-serif">
          Chat-App
        </Text>
        <div>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="outline" size="md" aria-label="Notifications">
                <LuBell />
              </Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem value="new-txt">New Text File</MenuItem>
            </MenuContent>
          </MenuRoot>

          <MenuRoot>
            <MenuTrigger asChild>
              <Button
                variant="ghost"
                size="md"
                mx="8px"
                py="2px"
                aria-label="User Menu"
              >
                <Avatar
                  variant="subtle"
                  size="sm"
                  name={user.name}
                  colorPalette={pickPalette(user.name)}
                />
                <Text>{user.name}</Text>
                <LuArrowDown />
              </Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem value="my-profile" onClick={handleOpenDialog}>
                My Profile
              </MenuItem>
              <MenuSeparator />
              <MenuItem
                value="logout"
                color="fg.error"
                _hover={{ bg: "bg.error", color: "fg.error" }}
                onClick={logoutHandler}
              >
                Logout
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </div>
      </Box>

      <ProfileModal
        user={user}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />

      <DrawerRoot
        placement="start"
        open={openDrawer}
        onOpenChange={(e) => setOpenDrawer(e.open)}
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Search Users</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb="2">
              <Input
                placeholder="Search by name or email"
                mr="2"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              ></Input>
              <Button onClick={handleSearch} aria-label="Search">
                Go
              </Button>
            </Box>

            <Stack spacing={2} w="100%" overflowY="auto">
              {loadingSearch ? (
                <ChatListSkeleton />
              ) : (
                searchResult?.map((user) => (
                  <UserItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChatHandler(user._id)}
                  />
                ))
              )}
            </Stack>
          </DrawerBody>
          {loadingChat && <Spinner alignSelf="center" mb="4" />}
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};

export default SideDrawer;
