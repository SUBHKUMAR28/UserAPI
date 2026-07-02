const paymentService = require('../services/payment.service');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');

exports.createOrder = catchAsync(async (req, res) => {
  const { amount } = req.body; // yeh wahi amount hai jo user app me type karta hai
  const order = await paymentService.createOrder(req.user.id, amount);
  return success(res, 200, 'Order created successfully', order);
});

exports.verifyPayment = catchAsync(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const result = await paymentService.verifyPayment(
    req.user.id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );
  return success(res, 200, 'Payment verified successfully', result);
});