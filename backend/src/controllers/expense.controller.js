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

const updateExpenseSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .optional(),
  note: z.string().optional(),
  tagId: z.string().optional(),
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
      .json({ message: EC.INTERNAL_SERVER_ERROR.message, error });
  }
};

const getExpense = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res
        .status(EC.UNAUTHORIZED.statusCode)
        .json({ message: EC.UNAUTHORIZED.message });
    }

    const { date, tagId } = req.query;

    const filters = {
      userId,
    };

    if (date) {
      const day = new Date(date);
      if (isNaN(day.getTime())) {
        return res
          .status(400)
          .json({ message: "Invalid date format. Use YYYY-MM-DD." });
      }
      const startOfDay = new Date(day.setHours(0, 0, 0, 0));
      const endOfDay = new Date(day.setHours(23, 59, 59, 999));

      filters.expenseDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (tagId) {
      filters.tagId = tagId;
    }

    const allExpenses = await prisma.expense.findMany({
      where: filters,
      orderBy: { expenseDate: "desc" },
      include: {
        tag: true,
      },
    });

    return res.status(200).json(allExpenses);
  } catch (error) {
    return res.status(EC.INTERNAL_SERVER_ERROR.statusCode).json({
      message: EC.INTERNAL_SERVER_ERROR.message,
      error,
    });
  }
};

const scanExpense = (req, res) => {
  console.log("Scan Bill Working");
};

const updateExpense = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res
        .status(EC.UNAUTHORIZED.statusCode)
        .json({ message: EC.UNAUTHORIZED.message });
    }

    const parsed = updateExpenseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(EC.VALIDATION_FAILED.statusCode)
        .json({ message: EC.VALIDATION_FAILED.message });
    }

    const { amount, note, tagId } = parsed.data;
    const { id } = req.params;
    const existing = await prisma.expense.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return res
        .status(EC.NOT_FOUND.statusCode)
        .json({ message: EC.NOT_FOUND.message });
    }

    const updatedExpense = await prisma.expense.update({
      where: {
        id,
      },
      data: {
        ...(amount !== undefined && { amount }),
        ...(note !== undefined && { note }),
        ...(tagId !== undefined && { tagId }),
      },
    });

    return res.status(200).json(updatedExpense);
  } catch (error) {
    return res.status(EC.INTERNAL_SERVER_ERROR.statusCode).json({
      message: EC.INTERNAL_SERVER_ERROR.message,
      error,
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res
        .status(EC.UNAUTHORIZED.statusCode)
        .json({ message: EC.UNAUTHORIZED.message });
    }

    const { id } = req.params;
    const existing = await prisma.expense.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return res
        .status(EC.NOT_FOUND.statusCode)
        .json({ message: EC.NOT_FOUND.message });
    }

    await prisma.expense.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({ message: "Expense Deleted" });
  } catch (error) {
    return res.status(EC.INTERNAL_SERVER_ERROR.statusCode).json({
      message: EC.INTERNAL_SERVER_ERROR.message,
      error,
    });
  }
};

module.exports = {
  addExpense,
  getExpense,
  scanExpense,
  updateExpense,
  deleteExpense,
};
