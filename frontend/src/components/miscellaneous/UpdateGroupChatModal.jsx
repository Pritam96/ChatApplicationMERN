import { useEffect, useState } from "react";
import { Button } from "../UI/button";
import {
  DialogActionTrigger,
  DialogBody,
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

// Utility function to check if two user arrays are equal
function areUsersEqual(users1, users2) {
  if (users1.length !== users2.length) return false;
  return users1.every((user1) =>
    users2.some((user2) => user1._id === user2._id)
  );
}

const UpdateGroupChatModal = ({
  openDialog,
  setOpenDialog,
  refetch,
  doRefetch,
}) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [saveGroupLoading, setSaveGroupLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  useEffect(() => {
    if (selectedChat) {
      setGroupChatName(selectedChat.chatName || "");
      setSelectedUsers(selectedChat.users || []);
    }
  }, [selectedChat]);

  const handleSearch = async (keyword) => {
    setSearchKeyword(keyword);
    if (!keyword.trim()) {
      setSearchResult([]);
      return;
    }
    try {
      setSearchLoading(true);
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
      setSearchLoading(false);
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

  const handleSubmit = async () => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toaster.create({
        type: "warning",
        title: "Warning",
        description: "Only admins can update the group",
        placement: "bottom-end",
        duration: 5000,
      });
      return;
    }

    if (
      groupChatName === selectedChat.chatName &&
      areUsersEqual(selectedChat.users, selectedUsers)
    ) {
      toaster.create({
        title: "No changes made",
        description: "Group name and members remain the same.",
        type: "info",
        placement: "bottom-end",
        duration: 5000,
      });
      setOpenDialog(false);
      return;
    }

    if (!groupChatName || selectedUsers.length < 2) {
      toaster.create({
        type: "warning",
        title: "Please provide all details",
        description: "Group name and at least two members are required.",
        placement: "bottom-end",
        duration: 5000,
      });
      return;
    }

    try {
      setSaveGroupLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const payload = {
        chatId: selectedChat._id,
        ...(selectedChat.chatName !== groupChatName && {
          updatedName: groupChatName,
        }),
        ...(!areUsersEqual(selectedChat.users, selectedUsers) && {
          updatedUsers: JSON.stringify(selectedUsers.map((u) => u._id)),
        }),
      };

      const { data } = await axios.put(
        "/api/v1/chat/groupupdate",
        payload,
        config
      );

      setSelectedChat(data);

      toaster.create({
        title: "Group updated successfully",
        type: "success",
        placement: "bottom-end",
        duration: 5000,
      });
      setOpenDialog(false);
      doRefetch(!refetch);
    } catch (error) {
      toaster.create({
        title: "Error Occurred!",
        description:
          error.response?.data?.error || "Failed to update the group",
        type: "error",
        placement: "bottom-end",
        duration: 5000,
      });
    } finally {
      setSaveGroupLoading(false);
      setSearchKeyword("");
      setSearchResult([]);
    }
  };

  const handleLeaveGroup = async () => {
    if (selectedChat.groupAdmin._id === user._id) {
      toaster.create({
        type: "warning",
        title: "Warning",
        description: "Admins can not leave the group",
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

      const { data } = await axios.put(
        "/api/v1/chat/groupremove",
        { chatId: selectedChat._id, userId: user._id },
        config
      );

      console.log(data);

      setSelectedChat(null);

      toaster.create({
        title: "Group leaved successfully",
        type: "success",
        placement: "bottom-end",
        duration: 5000,
      });
      setOpenDialog(false);
      doRefetch(!refetch);
    } catch (error) {
      toaster.create({
        title: "Error Occurred!",
        description: error.response?.data?.error || "Failed to leave the group",
        type: "error",
        placement: "bottom-end",
        duration: 5000,
      });
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
        <DialogHeader display="flex" justifyContent="space-between">
          <DialogTitle>Update Group</DialogTitle>
          <DialogActionTrigger asChild>
            <Button
              variant="solid"
              size="xs"
              colorPalette="red"
              onClick={handleLeaveGroup}
            >
              Leave Group
            </Button>
          </DialogActionTrigger>
        </DialogHeader>
        <DialogBody>
          <Fieldset.Root size="lg" maxW="md" mb="4">
            <Fieldset.Content>
              <Field label="Group Name">
                <Input
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </Field>
              <Stack mt="2" w="100%" direction="row" flexWrap="wrap" gap="2">
                {selectedUsers.map(
                  (u) =>
                    u._id !== user._id && (
                      <UserBadge
                        key={u._id}
                        user={u}
                        handleFunction={() => handleRemoveUser(u)}
                      />
                    )
                )}
              </Stack>
              <Field label="Add Users">
                <Input
                  value={searchKeyword}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search for users"
                />
              </Field>

              <Stack spacing={2} w="100%" maxH="150px" overflowY="auto">
                {searchLoading ? (
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
            <Button
              variant="solid"
              onClick={handleSubmit}
              isLoading={saveGroupLoading}
              loadingText="Saving..."
            >
              Save Group
            </Button>
          </DialogActionTrigger>
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default UpdateGroupChatModal;
