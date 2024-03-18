const User = require("../models/user");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const bcrypt = require("bcrypt");

const router = require("express").Router();

// @desc view user by user
// @route GET /api/users/:id
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { password, ...others } = user._doc; // to remove password from the user object
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc update password by user
// @route PUT /api/users/updatePassword/:id
router.put(
  "/updatePassword/:id",
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: { password: hashedPassword },
      });

      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// @desc find user by admin
// @route GET /api/users/find/:id
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc get all users by admin
// @route GET /api/users
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
