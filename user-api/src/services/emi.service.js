const Emi = require('../models/emi.model');
const EmiPayment = require('../models/emiPayment.model');
const ApiError = require('../utils/ApiError');

exports.getEmiList = async (userId) => {
  const emis = await Emi.find({ user: userId }).sort({ due_date: 1 });
  return emis;
};

exports.getEmiById = async (userId, emiId) => {
  const emi = await Emi.findOne({ _id: emiId, user: userId });
  if (!emi) throw new ApiError(404, 'EMI not found');
  return emi;
};

exports.payEmi = async (userId, emi_id, amount) => {
  const emi = await Emi.findOne({ _id: emi_id, user: userId });
  if (!emi) throw new ApiError(404, 'EMI not found');

  if (emi.status === 'completed') {
    throw new ApiError(400, 'EMI already completed, no more payments needed');
  }

  if (amount > emi.balance_amount) {
    throw new ApiError(400, 'Amount exceeds remaining balance');
  }

  // Payment update karo
  emi.paid_amount += amount;
  emi.balance_amount -= amount;
  emi.paid_installments += 1;

  // Status check karo
  if (emi.balance_amount <= 0) {
    emi.status = 'completed';
  } else {
    // Next due date set karo (1 month aage)
    const nextDueDate = new Date(emi.due_date);
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    emi.due_date = nextDueDate;
  }

  await emi.save();

  // Payment history record karo
  await EmiPayment.create({
    emi: emi._id,
    user: userId,
    amount_paid: amount,
  });

  return emi;
};