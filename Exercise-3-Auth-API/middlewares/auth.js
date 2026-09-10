const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
	const authorization = req.headers.authorization;

	if (!authorization || !authorization.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Not authorized, token required" });
	}

	const token = authorization.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId).select("-password -__v");

		if (!user) {
			return res.status(401).json({ message: "Not authorized, user not found" });
		}

		req.user = user;
		next();
	} catch (error) {
		res.status(401).json({ message: "Not authorized, invalid or expired token" });
	}
};

module.exports = protect;
