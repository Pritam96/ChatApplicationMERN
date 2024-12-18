import { Box, Text } from "@chakra-ui/react";
import { Avatar } from "../UI/avatar";

const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];

const pickPalette = (name) => {
  const index = name.charCodeAt(0) % colorPalette.length;
  return colorPalette[index];
};

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
        src=""
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
