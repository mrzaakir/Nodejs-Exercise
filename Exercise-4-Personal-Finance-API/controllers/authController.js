const bcrypt = require("bcryptjs");
const User = require("../../Exercise-3-Auth-API/models/User");
const generateToken = require("../../Exercise-3-Auth-API/utils/generateToken");

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, profilePicture: user.profilePicture || null });

const register = async (req, res) => {
	const { name, email, password } = req.body;
	const normalizedEmail = email.toLowerCase();
	if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: "Email is already registered" });

	const user = await User.create({ name, email: normalizedEmail, password: await bcrypt.hash(password, 12), role: "user" });
	res.status(201).json({ message: "User registered successfully", user: publicUser(user), token: generateToken(user._id) });
};

const login = async (req, res) => {
	const user = await User.findOne({ email: req.body.email.toLowerCase() });
	if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.status(401).json({ message: "Invalid email or password" });
	res.json({ message: "Login successful", user: publicUser(user), token: generateToken(user._id) });
};

const profile = (req, res) => res.json({ user: publicUser(req.user) });

module.exports = { register, login, profile };