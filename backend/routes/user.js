const express = require("express");
const { getMe, allUsers, updateAvatar } = require("../controllers/user");
const { protect } = require("../middleware/auth");
const { uploadAvatar } = require("../middleware/multer");

const router = express.Router();

router.get("/", protect, allUsers);
router.get("/me", protect, getMe);
router.post("/avatar", protect, uploadAvatar, updateAvatar);

module.exports = router;
