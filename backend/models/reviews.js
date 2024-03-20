const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

// Define a virtual to calculate the number of reviews
reviewSchema.virtual("numOfReviews").get(function () {
  return this.reviews.length;
});

// Define a virtual to calculate the average rating
reviewSchema.virtual("avgRating").get(function () {
  if (this.reviews.length === 0) {
    return 0;
  }

  const totalRating = this.reviews.reduce(
    (acc, review) => acc + review.rating,
    0
  );
  return totalRating / this.reviews.length;
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
