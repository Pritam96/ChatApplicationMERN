import { useState } from "react";
import { Button } from "../UI/button";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../UI/dialog";
import { ChatState } from "../../Context/ChatProvider";
import { Fieldset, Input, Spinner, Stack } from "@chakra-ui/react";
import { Field } from "../UI/field";
import axios from "axios";
import { toaster } from "../UI/toaster";
import UserItem from "../Users/UserItem";
import UserBadge from "../Users/UserBadge";

const GroupChatModal = ({ openDialog, setOpenDialog }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, currentChats, setCurrentChats, setSelectedChat } = ChatState();

  const handleSearch = async (keyword) => {
    setSearchKeyword(keyword);
    if (!keyword.trim()) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/v1/user?search=${keyword}`,
        config
      );
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: "Error Occurred!",
        description:
          error.response?.data?.error || "Failed to load search results",
        type: "error",
        placement: "bottom-end",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = (user) => {
    if (selectedUsers.some((u) => u._id === user._id)) {
      toaster.create({
        type: "info",
        title: "User already added",
        placement: "bottom-end",
        duration: 3000,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
    setSearchKeyword("");
    setSearchResult([]);
  };

  const handleRemoveUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    setSearchKeyword("");
    setSearchResult([]);
  };

  const submitHandler = async () => {
    if (!groupChatName || !selectedUsers.length) {
      toaster.create({
        type: "warning",
        title: "Please provide all details",
        description: "Group name and members are required.",
        placement: "bottom-end",
        duration: 5000,
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/v1/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setCurrentChats([data, ...currentChats]);
      setSelectedChat(data);
      toaster.create({
        title: "Group created successfully",
        type: "success",
        placement: "bottom-end",
        duration: 5000,
      });
      setOpenDialog(false);
    } catch (error) {
      toaster.create({
        title: "Error Occurred!",
        description: error.response?.data?.error || "Failed to create group",
        type: "error",
        placement: "bottom-end",
        duration: 5000,
      });
    } finally {
      setGroupChatName("");
      setSelectedUsers([]);
      setSearchKeyword("");
      setSearchResult([]);
    }
  };

  return (
    <DialogRoot
      placement="center"
      motionPreset="slide-in-bottom"
      lazyMount
      open={openDialog}
      onOpenChange={(e) => setOpenDialog(e.open)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle
            fontSize="32px"
            fontFamily="Roboto, sans-serif"
            textAlign="center"
          >
            Create Group Chat
          </DialogTitle>
        </DialogHeader>
        <DialogBody display="flex" flexDir="column" alignItems="center">
          <Fieldset.Root size="lg" maxW="md" mb="4">
            <Fieldset.Content>
              <Field label="Group Name">
                <Input
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </Field>

              <Field label="Add Users">
                <Input
                  value={searchKeyword}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search for users"
                />
              </Field>
              <Stack
                mt="2"
                w="100%"
                direction="row"
                flexWrap="wrap"
                gap="2"
                overflow="hidden"
              >
                {selectedUsers.map((user) => (
                  <UserBadge
                    key={user._id}
                    user={user}
                    handleFunction={() => handleRemoveUser(user)}
                  />
                ))}
              </Stack>

              <Stack spacing={2} w="100%" maxH="150px" overflowY="auto">
                {loading ? (
                  <Spinner mx="auto" />
                ) : (
                  searchResult.map((user) => (
                    <UserItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAddUser(user)}
                    />
                  ))
                )}
              </Stack>
            </Fieldset.Content>
          </Fieldset.Root>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="solid" onClick={submitHandler}>
              Create Group
            </Button>
          </DialogActionTrigger>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default GroupChatModal;
