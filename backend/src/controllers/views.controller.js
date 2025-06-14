const EC = require("../utils/errorMessages");
const { getAuth } = require("@clerk/express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const viewProfile = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res
        .status(EC.UNAUTHORIZED.statusCode)
        .json({ message: EC.UNAUTHORIZED.message });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayExpenses = await prisma.expense.findMany({
      where: {
        userId,
        expenseDate: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

    const recentExpenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { expenseDate: "desc" },
      take: 5,
      include: { tag: true },
    });

    return res.status(200).json({
      userId,
      todayTotal,
      recentExpenses,
    });
  } catch (error) {
    return res.status(EC.INTERNAL_SERVER_ERROR.statusCode).json({
      message: EC.INTERNAL_SERVER_ERROR.message,
      error,
    });
  }
};

const viewOtherDay = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res
        .status(EC.UNAUTHORIZED.statusCode)
        .json({ message: EC.UNAUTHORIZED.message });
    }

    const { date } = req.query;

    if (!date) {
      return res
        .status(400)
        .json({
          message: "Missing required 'date' query parameter (YYYY-MM-DD).",
        });
    }

    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Expected YYYY-MM-DD." });
    }

    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        expenseDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { expenseDate: "desc" },
      include: { tag: true },
    });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    return res.status(200).json({
      date,
      total,
      expenses,
    });
  } catch (error) {
    return res.status(EC.INTERNAL_SERVER_ERROR.statusCode).json({
      message: EC.INTERNAL_SERVER_ERROR.message,
      error,
    });
  }
};

module.exports = { viewProfile, viewOtherDay };
