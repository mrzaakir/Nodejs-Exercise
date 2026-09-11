const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 2,
			maxlength: 100
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		},
		password: {
			type: String,
			required: true,
			minlength: 60
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user"
		},
		profilePicture: {
			type: String,
			default: null
		}
	},
	{ timestamps: true }
);

userSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		delete returnedObject.password;
		delete returnedObject.__v;
		return returnedObject;
	}
});

module.exports = mongoose.model("User", userSchema);
