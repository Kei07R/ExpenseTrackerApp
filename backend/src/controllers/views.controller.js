const EC = require("../utils/errorMessages");
const { getAuth } = require("@clerk/express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient;

const viewProfile = (req, res) => {
  try {
    const { userId } = getAuth(req);
  } catch (error) {
    return res.status(EC.INTERNAL_SERVER_ERROR.statusCode).json({
      message: EC.INTERNAL_SERVER_ERROR.message,
      error,
    });
  }
};

const viewSummary = (req, res) => {};

module.exports = { viewProfile, viewSummary };
