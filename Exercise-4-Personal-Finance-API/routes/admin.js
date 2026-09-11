const express = require("express");
const protect = require("../../Exercise-3-Auth-API/middlewares/auth");
const authorize = require("../../Exercise-3-Auth-API/middlewares/authorize");
const { overview } = require("../controllers/adminController");
const router = express.Router();
router.get("/overview", protect, authorize("admin"), overview);
module.exports = router;