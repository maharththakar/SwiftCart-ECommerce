const Order = require("../models/order");
const User = require("../models/user");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();

// @desc Create a new order
// @route POST /api/orders
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
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
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(err);
  }
});

module.exports = router;
