const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
	res.json({
		message: "Auth API is running",
		routes: {
			register: "POST /auth/register",
			login: "POST /auth/login",
			profile: "GET /auth/profile",
			adminDashboard: "GET /admin/dashboard"
		}
	});
});

app.use((req, res) => {
	res.status(404).json({
		message: "Route not found",
		hint: "Check the HTTP method and include /auth or /admin in the URL",
		routes: [
			"POST /auth/register",
			"POST /auth/login",
			"GET /auth/profile",
			"GET /admin/dashboard"
		]
	});
});

const startServer = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		app.listen(port, () => {
			console.log(`Server is running at http://localhost:${port}`);
		});
	} catch (error) {
		console.error("MongoDB connection failed:", error.message);
		process.exit(1);
	}
};

startServer();

module.exports = app;
