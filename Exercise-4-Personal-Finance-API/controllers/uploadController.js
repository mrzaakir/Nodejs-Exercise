const User = require("../../Exercise-3-Auth-API/models/User");
const { uploadBuffer } = require("../utils/cloudinary");

const uploadProfilePicture = async (req, res) => {
	if (!process.env.CLOUDINARY_CLOUD_NAME) return res.status(503).json({ message: "Cloudinary is not configured" });
	if (!req.file) return res.status(400).json({ message: "An image file is required in the profilePicture field" });

	const result = await uploadBuffer(req.file.buffer);
	await User.findByIdAndUpdate(req.user._id, { profilePicture: result.secure_url });
	res.json({ message: "Profile picture uploaded", url: result.secure_url });
};

module.exports = { uploadProfilePicture };