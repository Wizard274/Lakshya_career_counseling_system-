const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const User = require("./models/User");

    // Delete any existing admin with this email
    await User.deleteMany({ email: "admin@gmail.com" });
    console.log("🗑️  Old admin deleted");

    // Create new admin — password will be auto-hashed by User model
    const admin = await User.create({
      name: "Admin User",
      email: "admin@gmail.com",
      password: "admin123",
      role: "admin",
      isVerified: true,
      isActive: true,
    });

    console.log("✅ Admin created successfully!");
    console.log("📧 Email   :", admin.email);
    console.log("🔑 Password: admin123");
    console.log("👤 Role    :", admin.role);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createAdmin();