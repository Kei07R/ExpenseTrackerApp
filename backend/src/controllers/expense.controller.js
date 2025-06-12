const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");
const EC = require("../utils/errorMessages");
const { getAuth } = require("@clerk/express");

const prisma = new PrismaClient();

const addExpenseSchema = z.object({
  amount: z.number({ invalid_type_error: "Amount must be a number" }),
  note: z.string().optional(),
  tagId: z.string().optional(),
  expenseDate: z.coerce.date({ invalid_type_error: "Invalid date format" }),
});

const addExpense = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res
        .status(EC.UNAUTHORIZED.statusCode)
        .json({ message: EC.UNAUTHORIZED.message });
    }

    const parsed = addExpenseSchema.safeParse(req.body);

    if (!parsed.success) {
      return res
        .status(EC.VALIDATION_FAILED.statusCode)
        .json({ message: EC.VALIDATION_FAILED.message });
    }

    const { amount, note, tagId, expenseDate } = parsed.data;

    const expense = await prisma.expense.create({
      data: {
        userId,
        amount,
        note,
        tagId,
        expenseDate,
      },
    });

    return res.status(201).json(expense);
  } catch (error) {
    return res
      .status(EC.INTERNAL_SERVER_ERROR.statusCode)
      .json({ message: EC.INTERNAL_SERVER_ERROR.message });
  }
};

const getExpense = (req, res) => {
    
};

const scanExpense = (req, res) => {
  console.log("Scan Bill Working");
};

const updateExpense = (req, res) => {
  console.log("Update Expense Working");
};

const deleteExpense = (req, res) => {
  console.log("Delete Expense Working");
};

module.exports = {
  addExpense,
  getExpense,
  scanExpense,
  updateExpense,
  deleteExpense,
};
