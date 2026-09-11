const express = require("express");
const { z } = require("zod");
const protect = require("../../Exercise-3-Auth-API/middlewares/auth");
const validate = require("../middlewares/validate");
const { register, login, profile } = require("../controllers/authController");

const credentials = z.object({
	name: z.string().trim().min(2).max(100).optional(),
	email: z.string().trim().email(),
	password: z.string().min(6).max(100)
});
const router = express.Router();
router.post("/register", validate(credentials.required({ name: true })), register);
router.post("/login", validate(credentials.omit({ name: true })), login);
router.get("/profile", protect, profile);
module.exports = router;