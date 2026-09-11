const express = require("express");
const protect = require("../../Exercise-3-Auth-API/middlewares/auth");
const upload = require("../middlewares/upload");
const { uploadProfilePicture } = require("../controllers/uploadController");
const router = express.Router();
router.post("/profile-picture", protect, upload.single("profilePicture"), uploadProfilePicture);
module.exports = router;