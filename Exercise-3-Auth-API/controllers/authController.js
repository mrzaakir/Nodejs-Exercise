const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const publicUser = (user) => ({
	id: user._id,
	name: user.name,
	email: user.email,
	role: user.role
});

const register = async (req, res) => {
	const { name, email, password, role } = req.body;

	if (!name || !email || !password) {
		return res.status(400).json({
			message: "Name, email, and password are required"
		});
	}

	if (password.length < 6) {
		return res.status(400).json({
			message: "Password must be at least 6 characters"
		});
	}

	try {
		const normalizedEmail = email.trim().toLowerCase();
		const existingUser = await User.findOne({ email: normalizedEmail });

		if (existingUser) {
			return res.status(409).json({ message: "Email is already registered" });
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		const user = await User.create({
			name: name.trim(),
			email: normalizedEmail,
			password: hashedPassword,
			role: role || "user"
		});

		res.status(201).json({
			message: "User registered successfully",
			user: publicUser(user),
			token: generateToken(user._id)
		});
	} catch (error) {
		if (error.name === "ValidationError") {
			return res.status(400).json({ message: error.message });
		}

		if (error.code === 11000) {
			return res.status(409).json({ message: "Email is already registered" });
		}

		res.status(500).json({ message: "Failed to register user" });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: "Email and password are required" });
	}

	try {
		const user = await User.findOne({ email: email.trim().toLowerCase() });
		const passwordMatches = user && (await bcrypt.compare(password, user.password));

		if (!passwordMatches) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		res.json({
			message: "Login successful",
			user: publicUser(user),
			token: generateToken(user._id)
		});
	} catch (error) {
		res.status(500).json({ message: "Failed to log in" });
	}
};

const getProfile = (req, res) => {
	res.json({ user: publicUser(req.user) });
};

module.exports = {
	register,
	login,
	getProfile
};
