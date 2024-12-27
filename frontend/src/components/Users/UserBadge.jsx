import { Badge } from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
import pickPalette from "../../utils/pickPalette";

const UserBadge = ({ user, handleFunction }) => {
  return (
    <Badge
      variant="solid"
      colorPalette={pickPalette(user.name)}
      size="lg"
      onClick={handleFunction}
    >
      {user.name} <LuX />
    </Badge>
  );
};

export default UserBadge;
