const User = require("../../Exercise-3-Auth-API/models/User");
const Transaction = require("../models/Transaction");

const overview = async (req, res) => {
	const [totalUsers, categoryTotals, totals] = await Promise.all([
		User.countDocuments(),
		Transaction.aggregate([
			{ $match: { type: "expense" } },
			{ $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
			{ $sort: { total: -1 } },
			{ $limit: 5 }
		]),
		Transaction.aggregate([
			{ $group: { _id: "$type", total: { $sum: "$amount" } } }
		])
	]);

	res.json({ totalUsers, totalTransactions: await Transaction.countDocuments(), topSpendingCategories: categoryTotals, totals });
};

module.exports = { overview };