import { Box, Text } from "@chakra-ui/react";
import { Avatar } from "../UI/avatar";
import pickPalette from "../../utils/pickPalette";

const UserItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      w="100%"
      display="flex"
      alignItems="center"
      px="3"
      py="2"
      mb="2"
      borderRadius="lg"
      _hover={{
        background: "white",
        color: "black",
      }}
    >
      <Avatar
        mr="2"
        size="sm"
        name={user.name}
        src={user?.avatar || ""}
        colorPalette={pickPalette(user.name)}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">Email: {user.email}</Text>
      </Box>
    </Box>
  );
};

export default UserItem;
