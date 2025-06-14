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

const viewSummary = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res
        .status(EC.UNAUTHORIZED.statusCode)
        .json({ message: EC.UNAUTHORIZED.message });
    }

    const weeks = parseInt(req.query.weeks || "4", 10);
    const now = new Date();

    const startDate = new Date();
    startDate.setDate(now.getDate() - weeks * 7);
    startDate.setHours(0, 0, 0, 0);

    const allExpenses = await prisma.expense.findMany({
      where: {
        userId,
        expenseDate: {
          gte: startDate,
          lte: now,
        },
      },
    });

    const summary = {};

    for (const expense of allExpenses) {
      const date = new Date(expense.expenseDate);
      const week = `${date.getFullYear()}-W${Math.ceil(
        (date.getDate() + 1 - date.getDay()) / 7
      )}`;

      if (!summary[week]) summary[week] = 0;
      summary[week] += expense.amount;
    }

    const result = Object.entries(summary).map(([week, total]) => ({
      week,
      total: Number(total.toFixed(2)),
    }));

    return res.status(200).json(result);
  } catch (error) {
    return res.status(EC.INTERNAL_SERVER_ERROR.statusCode).json({
      message: EC.INTERNAL_SERVER_ERROR.message,
      error,
    });
  }
};

module.exports = { viewProfile, viewSummary };
