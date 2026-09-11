const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerDefinition = require("./swagger");
const authRouter = require("./routes/auth");
const transactionRouter = require("./routes/transactions");
const categoryRouter = require("./routes/categories");
const uploadRouter = require("./routes/upload");
const adminRouter = require("./routes/admin");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const port = process.env.PORT || 5000;
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: "draft-8", legacyHeaders: false }));
const healthResponse = (req, res) => res.json({ name: "Personal Finance Tracker API", version: "1.0.0", docs: "/docs", examples: { email: "aisha.khan@example.com", name: "Aisha Khan", id: "67a1b2c3d4e5f67890123456", title: "Weekly groceries" } });
app.get("/", healthResponse);
app.get("/api", healthResponse);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDefinition));
app.use("/auth", authRouter);
app.use("/transactions", transactionRouter);
app.use("/categories", categoryRouter);
app.use("/upload", uploadRouter);
app.use("/admin", adminRouter);
app.use((req, res) => res.status(404).json({ message: "Route not found", docs: "/docs" }));
app.use(errorHandler);

const startServer = async () => {
	if (!process.env.MONGO_URI || !process.env.JWT_SECRET) throw new Error("MONGO_URI and JWT_SECRET are required");
	await mongoose.connect(process.env.MONGO_URI);
	app.listen(port, () => console.log(`Finance API is running at http://localhost:${port}`));
};

if (require.main === module) startServer().catch((error) => { console.error("Startup failed:", error.message); process.exit(1); });
module.exports = app;