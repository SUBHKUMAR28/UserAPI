const mongoose = require('mongoose');

const emiSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    product_name: { type: String, required: true, trim: true }, // jis product/loan ke liye EMI hai

    loan_amount: { type: Number, required: true }, // total loan amount
    monthly_emi: { type: Number, required: true }, // har mahine ka amount

    tenure_months: { type: Number, required: true },
    paid_installments: { type: Number, default: 0 },

    paid_amount: { type: Number, default: 0 }, // total kitna paisa pay ho gaya
    balance_amount: { type: Number, required: true }, // kitna baki hai

    due_date: { type: Date, required: true }, // agli installment ki due date

    status: {
      type: String,
      enum: ['active', 'completed', 'overdue', 'defaulted'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Emi', emiSchema);