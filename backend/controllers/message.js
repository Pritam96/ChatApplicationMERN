const ErrorResponse = require("../utils/errorResponse");
const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");

// @desc    Send message
// @route   POST /api/v1/message
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { chatId, content } = req.body;

    let data = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    let message = await Message.create(data);

    message = await message.populate("sender", "name avatar email phone");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name avatar email phone",
    });

    // Update latest message
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all message of a chat
// @route   GET /api/v1/message/:chatId
// @access  Private
exports.allMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name avatar email phone")
      .populate("chat");

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
