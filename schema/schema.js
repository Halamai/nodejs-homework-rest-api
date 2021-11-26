const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contacts = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 250,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      minlength: 3,
      maxlength: 250,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  }
  // { versionKey: false, timestamps: true }
);

const Contacts = mongoose.model("contacts", contacts);

module.exports = Contacts;
