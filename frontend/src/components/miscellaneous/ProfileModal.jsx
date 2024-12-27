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
import { Text, VStack } from "@chakra-ui/react";
import { Avatar } from "../UI/avatar";
import { Button } from "../UI/button";

const ProfileModal = ({ user, openDialog, setOpenDialog }) => {
  return (
    <DialogRoot
      placement="center"
      motionPreset="slide-in-bottom"
      lazyMount
      open={openDialog}
      onOpenChange={(e) => setOpenDialog(e.open)}
    >
      <DialogContent h="400px">
        <DialogHeader>
          <DialogTitle
            fontSize="32px"
            fontFamily="Roboto, sans-serif"
            display="flex"
            justifyContent="center"
          >
            {user?.name || "User"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody display="flex" justifyContent="center" alignItems="center">
          <VStack gap="4">
            <Avatar size="2xl" name={user?.name} src={user?.avatar || ""} />
            <Text fontSize="24px" fontFamily="Roboto, sans-serif">
              Email: {user?.email || "N/A"}
            </Text>
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
