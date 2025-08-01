import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    minlength: 8,  // min 8 digits (can include +91 etc.)
    maxlength: 15, // international numbers can go up to 15
    match: /^[+0-9]+$/ // only digits and optional '+'
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 100,
  },
});

agentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("Agent", agentSchema);
