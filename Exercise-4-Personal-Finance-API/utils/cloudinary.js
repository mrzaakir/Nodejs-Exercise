const cloudinary = require("cloudinary").v2;

if (process.env.CLOUDINARY_CLOUD_NAME) {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET
	});
}

const uploadBuffer = (buffer) => new Promise((resolve, reject) => {
	const stream = cloudinary.uploader.upload_stream(
		{ folder: "personal-finance/profiles", resource_type: "image" },
		(error, result) => (error ? reject(error) : resolve(result))
	);
	stream.end(buffer);
});

module.exports = { cloudinary, uploadBuffer };