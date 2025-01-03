const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const {
  uploadOnCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryService");

// @desc    Get current logged in user
// @route   GET /api/v1/user/me
// @access  Private
exports.getMe = async (req, res, next) => {
  const user = req.user;

  if (!user) return next(new ErrorResponse("User is not authorized", 404));

  res.status(200).json({
    success: true,
    data: user,
  });
};

// @desc    Search user
// @route   GET /api/v1/user?search=keyword
// @access  Private
exports.allUsers = async (req, res, next) => {
  try {
    let keyword = {};
    if (req.query.search) {
      keyword = {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }
    const users = await User.find(keyword)
      .find({ _id: { $ne: req.user._id } })
      .limit(4);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload avatar
// @route   POST /api/v1/user/avatar
// @access  Private
exports.updateAvatar = async (req, res, next) => {
  if (!req.user) return next(new ErrorResponse("User is not authorized", 404));

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    return next(new ErrorResponse("Avatar image is missing", 400));
  }

  try {
    // Upload new avatar to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar?.url) {
      console.error("Cloudinary upload error:", avatar?.error);
      return next(
        new ErrorResponse({
          message: "Error while uploading avatar image",
          statusCode: 500,
        })
      );
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    const oldAvatarUrl = user.avatar;

    user.avatar = avatar.url;
    await user.save({ validateBeforeSave: false });

    // Delete old avatar if it exists
    if (oldAvatarUrl) {
      try {
        await deleteFromCloudinary(oldAvatarUrl);
      } catch (error) {
        console.error("Failed to delete old avatar:", error.message);
      }
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
