const Order = require("../models/order");
const User = require("../models/user");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();
const Product = require("../models/product");
const sendEmail = require("../utils/sendEmail");

// @desc Create a new order
// @route POST /api/orders
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    // decrement stock and save order
    for (let item of newOrder.products) {
      let product = await Product.findOne({ _id: item.productId });
      product.Stock -= item.quantity;
      await product.save();
    }
  } catch (error) {
    return res.status(500).json(error);
  }
  try {
    const savedOrder1 = await newOrder.save();
    const savedOrder = await Order.findById(savedOrder1._id).populate(
      "products.productId",
      "name"
    );
    const user = await User.findById(newOrder.userId);
    const options = {
      email: user.email,
      subject: "Order Placed Successfully",
      message: `Dear ${
        user.name
      },\n\n We are excited to inform you that your order has been successfully placed!\n\n Order ID: ${
        savedOrder._id
      }\n\n Products:\n - ${savedOrder.products
        .map(
          (product) =>
            `${product.productId.name} - Quantity: ${product.quantity}`
        )
        .join(
          "\n- "
        )}\n\n Thank you for choosing our service. We'll keep you updated on the status of your order.\n\n Best Regards,\n SwiftCart`,
    };
    await sendEmail(options);

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

// @desc Update an order by admin
// @route PUT /api/orders/:id
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  // here the id is order id
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
          deliveredAt: new Date(),
          status: "delivered",
        },
      },
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json(err);
  }
});

// @desc Delete an order by admin
// @route DELETE /api/orders/:id
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (error) {
    res.status(500).json(err);
  }
});

// @desc Get user's orders
// @route GET /api/orders/find/:userId
// TODO: apiFeatures for this pagination and sorting if time permits
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({
      createdAt: "desc",
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(err);
  }
});

// @desc Get all orders
// @route GET /api/orders
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(err);
  }
});

module.exports = router;
