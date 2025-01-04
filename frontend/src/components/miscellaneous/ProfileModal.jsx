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
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "../UI/file-upload";
import { SkeletonCircle } from "../UI/skeleton";
import { Stack, Text, VStack } from "@chakra-ui/react";
import { Avatar } from "../UI/avatar";
import { Button } from "../UI/button";
import { LuUpload } from "react-icons/lu";
import { useState } from "react";
import axios from "axios";
import { toaster } from "../UI/toaster";

const ProfileModal = ({ user, setUser, openDialog, setOpenDialog }) => {
  const [loading, setLoading] = useState(false);

  const onFileAccept = async (details) => {
    const file = details.files[0];
    if (file) {
      await uploadAvatar(file);
    }
  };

  // Function to upload the avatar to the server
  const uploadAvatar = async (file) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post(
        "/api/v1/user/avatar",
        formData,
        config
      );

      setUser((prev) => ({ ...prev, avatar: data.avatar }));
      toaster.create({
        title: "Success",
        description: "Avatar updated successful!",
        type: "success",
        placement: "bottom-end",
        duration: 5000,
      });
    } catch (err) {
      console.error("Error uploading avatar:", err);
      toaster.create({
        title: "Error",
        description: err.response?.data?.error || "Failed to update avatar",
        type: "error",
        placement: "bottom-end",
        duration: 5000,
      });
    } finally {
      setLoading(false);
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
            fontSize="30px"
            fontFamily="Roboto, sans-serif"
            display="flex"
            justifyContent="center"
          >
            {user?.name || "User"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody display="flex" justifyContent="center" alignItems="center">
          <VStack gap="4">
            {loading ? (
              <SkeletonCircle size="48" />
            ) : (
              <Avatar
                size={user?.avatar ? "3xl" : "2xl"}
                name={user?.name}
                src={user?.avatar || ""}
              />
            )}
            <Text fontSize="20px" fontFamily="Roboto, sans-serif">
              Email: {user?.email || "N/A"}
            </Text>
            <FileUploadRoot
              accept={"image/*"}
              multiple={false}
              onFileAccept={onFileAccept}
            >
              <Stack gap="4" direction="row">
                <FileUploadTrigger asChild>
                  <Button variant="outline" size="xl" loading={loading}>
                    <LuUpload /> Update Avatar
                  </Button>
                </FileUploadTrigger>
                <FileUploadList />
              </Stack>
            </FileUploadRoot>
          </VStack>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Close
            </Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default ProfileModal;
