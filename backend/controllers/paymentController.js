// ============================================
// controllers/paymentController.js 
// ============================================

const paymentService = require("../services/paymentService");

const createPaymentIntent = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ success: false, message: "bookingId is required" });
    
    const result = await paymentService.createIntent(bookingId, req.user._id);
    res.json({ success: true, clientSecret: result.clientSecret, amount: result.amount });
  } catch (error) {
    next(error);
  }
};

const stripeWebhook = async (req, res, next) => {
  try {
    const sig = req.headers["stripe-signature"];
    await paymentService.handleWebhook(req.body, sig);
    res.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, bookingId } = req.body;
    if (!paymentIntentId || !bookingId) return res.status(400).json({ success: false, message: "Missing info" });
    
    await paymentService.verifyClientPayment(paymentIntentId, bookingId, req.user._id);
    res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPaymentIntent, stripeWebhook, verifyPayment };
