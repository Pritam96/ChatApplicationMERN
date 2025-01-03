const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    // Create user
    const user = await User.create({ name, email, phone, password });

    // Create token
    const token = await user.getSignedJwtToken();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      phone: user.phone,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password", 400)
      );
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      phone: user.phone,
      token,
    });
  } catch (error) {
    next(error);
  }
};
