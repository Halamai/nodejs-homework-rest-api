// const mongoose = require("mongoose");
// const { Schema, model } = mongoose.Schema;
// const { Schema, model, SchemaTypes } = require("mongoose");
const { Schema, model } = require("mongoose");

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
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  }
  // { versionKey: false, timestamps: true }
);

const Contacts = model("contacts", contacts);

module.exports = Contacts;
