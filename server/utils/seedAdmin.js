// Run with: node utils/seedAdmin.js
// Creates (or promotes) an admin account so you can log into /admin.
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@rewear.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "admin123";
const ADMIN_NAME = "ReWear Admin";

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  let user = await User.findOne({ email: ADMIN_EMAIL });
  if (user) {
    user.role = "admin";
    await user.save();
    console.log(`Existing user ${ADMIN_EMAIL} promoted to admin.`);
  } else {
    user = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });
    console.log(`Admin created -> email: ${ADMIN_EMAIL} password: ${ADMIN_PASSWORD}`);
  }

  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
