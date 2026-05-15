// ============================================
// services/paymentService.js - Stripe Logic
// ============================================

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");
const OTP = require("../models/OTP");
const generateOTP = require("../utils/generateOTP");
const { sendPaymentSuccessEmail } = require("../utils/sendEmail");

const createIntent = async (bookingId, userId) => {
  const appointment = await Appointment.findById(bookingId).populate("counselor");
  if (!appointment) throw new Error("Booking not found");
  if (appointment.student.toString() !== userId.toString()) throw new Error("Unauthorized");
  if (appointment.status !== "approved") throw new Error("Booking must be approved before payment");

  // Determine amount (using 5000 cents = $50 as fallback, using counselor hourly rate if available)
  const rateInCents = appointment.counselor.hourlyRate ? appointment.counselor.hourlyRate * 100 : 5000;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: rateInCents,
    currency: "usd",
    metadata: { bookingId: bookingId.toString(), userId: userId.toString() },
  });

  await Payment.create({
    userId,
    bookingId,
    amount: rateInCents,
    paymentIntentId: paymentIntent.id
  });

  return { clientSecret: paymentIntent.client_secret, amount: rateInCents };
};

const handleWebhook = async (rawBody, signature) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const { bookingId, userId } = paymentIntent.metadata;

    // Update Payment 
    await Payment.findOneAndUpdate({ paymentIntentId: paymentIntent.id }, { status: "succeeded" });
    
    // Update Appointment
    const appointment = await Appointment.findByIdAndUpdate(bookingId, { 
      status: "payment_done", 
      paymentStatus: "paid" 
    }, { new: true }).populate("student", "email name");

    if (appointment && appointment.student) {
      // Generate OTP for confirmation
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
      
      await OTP.deleteMany({ email: appointment.student.email, purpose: "confirm-booking" });
      await OTP.create({
        email: appointment.student.email,
        otp,
        purpose: "confirm-booking",
        expiresAt,
      });

      // Send Email
      await sendPaymentSuccessEmail(appointment.student.email, {
        studentName: appointment.student.name,
        amount: paymentIntent.amount / 100,
        otp,
      });
    }
  }

  return true;
};

const verifyClientPayment = async (paymentIntentId, bookingId, userId) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.status !== "succeeded") {
    throw new Error("Payment not successful");
  }

  const payment = await Payment.findOne({ paymentIntentId });
  if (payment && payment.status !== "succeeded") {
    payment.status = "succeeded";
    await payment.save();
  }

  // Always attempt to update appointment to payment_done if it isn't already, and send OTP
  const appointment = await Appointment.findOneAndUpdate(
    { _id: bookingId, student: userId },
    { status: "payment_done", paymentStatus: "paid" },
    { new: true }
  ).populate("student", "email name");

  if (appointment && appointment.student) {
    // Check if we already have a valid unexpired OTP
    const existingOTP = await OTP.findOne({ email: appointment.student.email, purpose: "confirm-booking" });
    
    // Only generate and send a new OTP if there isn't one, or if we explicitly want to force a resend
    // For safety, let's just forcefully generate a new one if verifyClientPayment is called,
    // as it's the initialization of the verification flow.
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    
    await OTP.deleteMany({ email: appointment.student.email, purpose: "confirm-booking" });
    await OTP.create({
      email: appointment.student.email,
      otp,
      purpose: "confirm-booking",
      expiresAt,
    });

    console.log(`Sending Payment Success + OTP email to ${appointment.student.email}`);
    await sendPaymentSuccessEmail(appointment.student.email, {
      studentName: appointment.student.name,
      amount: paymentIntent.amount / 100,
      otp,
    });
  }

  return true;
};

module.exports = { createIntent, handleWebhook, verifyClientPayment };
