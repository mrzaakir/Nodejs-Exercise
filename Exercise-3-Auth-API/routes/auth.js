const express = require("express");
const {
	register,
	login,
	getProfile
} = require("../controllers/authController");
const protect = require("../middlewares/auth");

const router = express.Router();

router.get("/register", (req, res) => {
	res.status(405).json({
		message: "Registration requires a POST request with name, email, and password",
		example: "POST /auth/register"
	});
});

router.get("/login", (req, res) => {
	res.status(405).json({
		message: "Login requires a POST request with email and password",
		example: "POST /auth/login"
	});
});

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);

module.exports = router;
