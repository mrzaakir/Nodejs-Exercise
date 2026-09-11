const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../Exercise-3-Auth-API/models/User");
const Transaction = require("./models/Transaction");

const examples = [
	{ name: "Aisha Khan", email: "aisha.khan@example.com", password: "Aisha123!", role: "user" },
	{ name: "Marcus Reed", email: "marcus.reed@example.com", password: "Marcus123!", role: "admin" }
];

const run = async () => {
	if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");
	await mongoose.connect(process.env.MONGO_URI);
	const users = {};
	for (const example of examples) {
		users[example.email] = await User.findOneAndUpdate(
			{ email: example.email },
			{ ...example, password: await bcrypt.hash(example.password, 12) },
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);
	}
	const aisha = users["aisha.khan@example.com"];
	await Transaction.deleteMany({ user: aisha._id });
	await Transaction.insertMany([
		{ user: aisha._id, title: "Monthly salary", amount: 4200, type: "income", category: "Salary", date: "2025-05-01" },
		{ user: aisha._id, title: "Weekly groceries", amount: 84.5, type: "expense", category: "Food", date: "2025-05-07" },
		{ user: aisha._id, title: "Train pass", amount: 65, type: "expense", category: "Transport", date: "2025-05-10" },
		{ user: aisha._id, title: "Freelance project", amount: 850, type: "income", category: "Freelance", date: "2025-05-18" },
		{ user: aisha._id, title: "Apartment rent", amount: 1400, type: "expense", category: "Housing", date: "2025-05-27" }
	]);
	console.log("Seed complete:", examples.map(({ name, email, role }) => ({ name, email, role })));
};

run().catch((error) => { console.error("Seed failed:", error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());