const express = require("express");
const protect = require("../../Exercise-3-Auth-API/middlewares/auth");
const router = express.Router();
const categories = ["Food", "Transport", "Housing", "Utilities", "Health", "Shopping", "Entertainment", "Salary", "Freelance", "Other"];
router.get("/", protect, (req, res) => res.json({ categories }));
module.exports = router;