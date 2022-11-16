const mongoose = require("mongoose");
const { Schema } = mongoose;
const { autoIncrementModelID } = require("./counter");

const User_Model = new Schema({
  _id: { type: Number, min: 1, unique: true },
  name: { type: String, required: true },
  otp: { type: String, default: 1 },
  otp_expiration_date: { type: Number, default: Math.floor(Date.now() / 1000) },
  phone_number: { type: String, required: true },
});

User_Model.pre("save", function (next) {
  if (!this.isNew) {
    next();
    return;
  }

  autoIncrementModelID("user_model", this, next);
});

module.exports = mongoose.model("user_model", User_Model);
