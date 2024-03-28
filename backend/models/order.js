const mongoose = require("mongoose");
const Product = require("./product");

const paymentMethods = {
  values: ["ONLINE", "COD"],
  message: "enum validator failed for payment Methods",
};

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: mongoose.Schema.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      pinCode: {
        type: Number,
        required: true,
      },
    },
    paymentMethods: {
      type: String,
      enum: paymentMethods,
      required: true,
    },
    amount: { type: Number },
    totalProducts: { type: Number },
    status: { type: String, default: "processing" },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

OrderSchema.pre("save", async function (next) {
  try {
    let totalAmount = 0;
    let totalQuantity = 0;

    // Calculate total amount and quantity
    for (const productItem of this.products) {
      const product = await Product.findById(productItem.productId);
      if (!product) {
        throw new Error("Product not found");
      }
      totalAmount += product.price * productItem.quantity;
      totalQuantity += productItem.quantity;
    }

    // Set amount and totalProducts fields
    this.amount = totalAmount;
    this.totalProducts = totalQuantity;

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Order", OrderSchema);
