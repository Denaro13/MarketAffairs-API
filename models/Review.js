const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      require: [true, "Please provide rating"],
    },
    title: {
      type: String,
      trim: true,
      require: [true, "Please provide review title"],
      maxLength: 100,
    },
    comment: {
      type: String,
      require: [true, "Please provide review text"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      require: true,
    },
  },
  { timeStamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);
