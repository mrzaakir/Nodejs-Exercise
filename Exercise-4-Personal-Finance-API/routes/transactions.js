const express = require("express");
const { z } = require("zod");
const protect = require("../../Exercise-3-Auth-API/middlewares/auth");
const validate = require("../middlewares/validate");
const { listTransactions, createTransaction, updateTransaction, deleteTransaction, monthlySummary } = require("../controllers/transactionsController");

const transactionSchema = z.object({
	title: z.string().trim().min(1).max(120),
	amount: z.number().positive(),
	type: z.enum(["income", "expense"]),
	category: z.string().trim().min(1).max(60),
	date: z.coerce.date().optional(),
	notes: z.string().max(500).optional()
});
const router = express.Router();
router.use(protect);
router.get("/monthly-summary", monthlySummary);
router.get("/", listTransactions);
router.post("/", validate(transactionSchema), createTransaction);
router.put("/:id", validate(transactionSchema.partial()), updateTransaction);
router.delete("/:id", deleteTransaction);
module.exports = router;