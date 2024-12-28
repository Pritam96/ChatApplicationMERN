import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../utils/helper";
import { ChatState } from "../../Context/ChatProvider";
import { Tooltip } from "../UI/tooltip";
import { Avatar } from "../UI/avatar";

const ScrollableChat = ({ messages = [] }) => {
  const { user } = ChatState();

  if (!messages || !user) return null;

  const messageStyle = (m, index) => ({
    backgroundColor: m.sender._id === user._id ? "#4CAF50" : "#f0f0f0",
    color: m.sender._id === user._id ? "white" : "black",
    borderRadius: "20px",
    padding: "8px 15px",
    maxWidth: "75%",
    alignSelf: m.sender._id === user._id ? "flex-end" : "flex-start",
    marginLeft: isSameSenderMargin(messages, m, index, user._id),
    marginTop: isSameUser(messages, m, index, user._id) ? 3 : 10,
  });

  return (
    <ScrollableFeed>
      {messages.map((m, index) => {
        const showAvatar =
          isSameSender(messages, m, index, user._id) ||
          isLastMessage(messages, index, user._id);

        return (
          <div
            key={m._id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              paddingRight: "8px",
            }}
          >
            {showAvatar && (
              <Tooltip
                content={m.sender.name}
                positioning={{ placement: "bottom-start" }}
              >
                <Avatar
                  size="sm"
                  name={m.sender.name}
                  src={m.sender.avatar || ""}
                  style={{
                    marginRight: "8px",
                    alignSelf: "flex-start",
                  }}
                />
              </Tooltip>
            )}
            <span style={messageStyle(m, index)}>{m.content}</span>
          </div>
        );
      })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
