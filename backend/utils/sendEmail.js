// ============================================
// utils/sendEmail.js - UPGRADED
// Removed: WhatsApp/Twilio (email only)
// Added: Better email templates
// ============================================

// ── Common email wrapper (Brevo HTTP API) ─────────────────
const sendEmail = async ({ to, subject, html }) => {
  try {
    const apiKey = (process.env.BREVO_API_KEY || process.env.EMAIL_PASS || "").trim();
    const senderEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

    if (!apiKey) {
      throw new Error("BREVO_API_KEY is missing in environment variables.");
    }

    const payload = {
      sender: {
        name: "Lakshya Career Platform",
        email: senderEmail
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html
    };

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Brevo API Error:", errorData);
      throw new Error("Failed to send email via Brevo API");
    }

    const data = await response.json();
    console.log(`✉️  Email successfully sent to ${to} via API: ${data.messageId}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Email failed:", error.message);
    throw new Error("Failed to send email. Please try again.");
  }
};

// ── OTP Email ─────────────────────────────────────────────
const sendOTPEmail = async (to, otp, purpose = "registration") => {
  const isReset   = purpose === "forgot-password";
  const subject   = isReset ? "🔑 Password Reset OTP - Lakshya" : "✅ Verify Your Email - Lakshya";
  const heading   = isReset ? "Reset Your Password" : "Verify Your Email";
  const bodyText  = isReset
    ? "You requested a password reset. Use the OTP below."
    : "Thank you for registering. Verify your email to get started.";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f5fb; margin: 0; padding: 20px; }
        .card { max-width: 520px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #7c3aed, #2563eb); padding: 32px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 22px; letter-spacing: -0.5px; }
        .header p  { color: rgba(255,255,255,0.7); margin: 6px 0 0; font-size: 13px; }
        .body  { padding: 32px; }
        .body p { color: #52525b; line-height: 1.7; font-size: 14px; }
        .otp-box { background: #f4f5fb; border: 2px dashed #7c3aed; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 44px; font-weight: 800; color: #7c3aed; letter-spacing: 14px; font-family: monospace; }
        .expiry { color: #f43f5e; font-size: 13px; margin-top: 8px; font-weight: 600; }
        .warning { background: #fff1f2; border-left: 3px solid #f43f5e; padding: 10px 14px; border-radius: 6px; font-size: 13px; color: #9f1239; margin-top: 16px; }
        .footer { background: #f4f5fb; padding: 20px; text-align: center; color: #a1a1aa; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>✦ Lakshya Career Platform</h1>
          <p>Your Goal. Your Direction.</p>
        </div>
        <div class="body">
          <h2 style="color:#09090b;margin:0 0 12px;font-size:20px;">${heading}</h2>
          <p>${bodyText}</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div class="expiry">⏱ Expires in 5 minutes</div>
          </div>
          <div class="warning">
            ⚠️ <strong>3 attempts maximum.</strong> Exceeding limit blocks your account for 24 hours. Never share this OTP.
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Lakshya Career Platform · If you didn't request this, ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
};

// ── Booking Notification Email ────────────────────────────
const sendBookingEmail = async (to, bookingDetails) => {
  const { studentName, counselorName, date, timeSlot, topic, status, recipientName } = bookingDetails;

  const statusColors = {
    pending:   "#f59e0b",
    approved:  "#2563eb",
    completed: "#10b981",
    cancelled: "#f43f5e",
  };

  const color = statusColors[status] || "#7c3aed";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f5fb; margin: 0; padding: 20px; }
        .card { max-width: 520px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #7c3aed, #2563eb); padding: 28px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 20px; }
        .body { padding: 28px; }
        .detail { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f4f4f5; font-size: 14px; }
        .label { color: #a1a1aa; font-weight: 600; }
        .value { color: #09090b; font-weight: 700; }
        .status-badge { display: inline-block; padding: 4px 14px; border-radius: 99px; background: ${color}20; color: ${color}; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; }
        .footer { background: #f4f5fb; padding: 18px; text-align: center; color: #a1a1aa; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header"><h1>✦ Session Update</h1></div>
        <div class="body">
          <p style="color:#52525b;margin:0 0 20px;font-size:14px;">Hello <strong>${recipientName || studentName}</strong>, here's your session update:</p>
          <div class="detail"><span class="label">Counselor</span><span class="value">${counselorName}</span></div>
          <div class="detail"><span class="label">Date</span><span class="value">${date}</span></div>
          <div class="detail"><span class="label">Time</span><span class="value">${timeSlot}</span></div>
          <div class="detail"><span class="label">Topic</span><span class="value">${topic}</span></div>
          <div class="detail" style="border:none"><span class="label">Status</span><span class="value"><span class="status-badge">${status}</span></span></div>
        </div>
        <div class="footer">© ${new Date().getFullYear()} Lakshya Career Platform</div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Session ${status === "approved" ? "Confirmed ✅" : "Update"} - Lakshya`,
    html,
  });
};

// ── Payment Success Email (with OTP) ──────────────────────
const sendPaymentSuccessEmail = async (to, data) => {
  const { studentName, amount, otp } = data;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f5fb; margin: 0; padding: 20px; }
        .card { max-width: 520px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #10b981, #059669); padding: 32px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 22px; letter-spacing: -0.5px; }
        .body  { padding: 32px; }
        .body p { color: #52525b; line-height: 1.7; font-size: 14px; }
        .otp-box { background: #f4f5fb; border: 2px dashed #10b981; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 44px; font-weight: 800; color: #10b981; letter-spacing: 14px; font-family: monospace; }
        .expiry { color: #f43f5e; font-size: 13px; margin-top: 8px; font-weight: 600; }
        .footer { background: #f4f5fb; padding: 20px; text-align: center; color: #a1a1aa; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>✦ Payment Successful</h1>
        </div>
        <div class="body">
          <h2 style="color:#09090b;margin:0 0 12px;font-size:20px;">Thank you, ${studentName}!</h2>
          <p>Your payment of <strong>$${amount}</strong> was successfully processed.</p>
          <p>Please use the OTP below to confirm your booking.</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div class="expiry">⏱ Valid for 15 minutes</div>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Lakshya Career Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: "✅ Payment Successful & Booking OTP - Lakshya",
    html,
  });
};

// ── Payment Notification Email (for Counselor) ──────────────────────
const sendPaymentNotificationToCounselor = async (to, data) => {
  const { counselorName, studentName, amount } = data;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f5fb; margin: 0; padding: 20px; }
        .card { max-width: 520px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #10b981, #059669); padding: 32px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 22px; letter-spacing: -0.5px; }
        .body  { padding: 32px; }
        .body p { color: #52525b; line-height: 1.7; font-size: 14px; }
        .footer { background: #f4f5fb; padding: 20px; text-align: center; color: #a1a1aa; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>✦ Payment Received</h1>
        </div>
        <div class="body">
          <h2 style="color:#09090b;margin:0 0 12px;font-size:20px;">Hello ${counselorName},</h2>
          <p>This is to inform you that <strong>${studentName}</strong> has successfully completed the payment of <strong>$${amount}</strong> for their session.</p>
          <p>Please wait for the student to confirm the booking using their OTP on the platform.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Lakshya Career Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: "💰 Payment Received - Lakshya",
    html,
  });
};

module.exports = { sendEmail, sendOTPEmail, sendBookingEmail, sendPaymentSuccessEmail, sendPaymentNotificationToCounselor };
