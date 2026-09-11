const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

const getUserId = (req) => req.user._id;

const listTransactions = async (req, res) => {
	const filter = { user: getUserId(req) };
	if (req.query.type) filter.type = req.query.type;
	if (req.query.category) filter.category = req.query.category;

	const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
	res.json({ count: transactions.length, transactions });
};

const createTransaction = async (req, res) => {
	const transaction = await Transaction.create({ ...req.body, user: getUserId(req) });
	res.status(201).json({ message: "Transaction created", transaction });
};

const updateTransaction = async (req, res) => {
	const transaction = await Transaction.findOneAndUpdate(
		{ _id: req.params.id, user: getUserId(req) },
		req.body,
		{ new: true, runValidators: true }
	);

	if (!transaction) return res.status(404).json({ message: "Transaction not found" });
	res.json({ message: "Transaction updated", transaction });
};

const deleteTransaction = async (req, res) => {
	const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: getUserId(req) });
	if (!transaction) return res.status(404).json({ message: "Transaction not found" });
	res.json({ message: "Transaction deleted", id: req.params.id });
};

const monthlySummary = async (req, res) => {
	const month = req.query.month || new Date().toISOString().slice(0, 7);
	if (!/^\d{4}-\d{2}$/.test(month)) return res.status(400).json({ message: "month must use YYYY-MM format" });

	const start = new Date(`${month}-01T00:00:00.000Z`);
	const end = new Date(start);
	end.setUTCMonth(end.getUTCMonth() + 1);
	const summary = await Transaction.aggregate([
		{ $match: { user: new mongoose.Types.ObjectId(String(getUserId(req))), date: { $gte: start, $lt: end } } },
		{ $group: { _id: { type: "$type", category: "$category" }, total: { $sum: "$amount" }, count: { $sum: 1 } } },
		{ $sort: { "_id.type": 1, total: -1 } }
	]);

	const totals = summary.reduce((result, item) => {
		result[item._id.type] = (result[item._id.type] || 0) + item.total;
		return result;
	}, { income: 0, expense: 0 });
	res.json({ month, totals, net: totals.income - totals.expense, byCategory: summary });
};

module.exports = { listTransactions, createTransaction, updateTransaction, deleteTransaction, monthlySummary };