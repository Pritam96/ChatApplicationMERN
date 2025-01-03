const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      transformation: { width: 200, height: 200, crop: "fill" },
    });

    // console.log("file uploaded successfully");
    return response;
  } catch (error) {
    console.log("Failed to upload on cloudinary");
    return null;
  } finally {
    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Error deleting local file:", err);
    });
  }
};

// Delete from Cloudinary
const deleteFromCloudinary = async (cloudinaryFileLink) => {
  if (!cloudinaryFileLink) {
    throw new ErrorResponse({
      message: "Previous file link is missing",
      statusCode: 400,
    });
  }

  try {
    const urlParts = cloudinaryFileLink.split("/");
    const publicId = urlParts[urlParts.length - 1].split(".")[0]; // Extract file name without extension

    const response = await cloudinary.uploader.destroy(publicId);

    if (response.result !== "ok" && response.result !== "not found") {
      throw new Error("Failed to delete the file from Cloudinary");
    }

    // console.log("File deletion successful:", response);
    return response;
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    throw new ErrorResponse(
      "Failed to delete previous image from Cloudinary",
      500
    );
  }
};

module.exports = { uploadOnCloudinary, deleteFromCloudinary };
