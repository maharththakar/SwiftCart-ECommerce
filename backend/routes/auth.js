const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // to create a token
const cookieParser = require("cookie-parser");

// @desc   Register a new user
// @route  POST /api/auth/register
router.post("/register", async (req, res) => {
  const checkUser = await User.findOne({
    $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }],
  });

  if (checkUser) {
    return res.status(400).json("User already exists");
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    defaultAddress: req.body.defaultAddress,
    defaultPin: req.body.defaultPin,
    password: hashedPassword,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc  Login a user
// @route POST /api/auth/login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json("User not found");
  const hashedPassword = await bcrypt.compare(req.body.password, user.password);
  if (!hashedPassword) return res.status(400).json("Wrong password");
  try {
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.TOKEN_SECRET
    );

    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        defaultAddress: user.defaultAddress,
        defaultPin: user.defaultPin,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// // @desc Logout a user
// // @route POST /api/auth/logout
// router.get("/logout", verifyTokenAndAuthorization, (req, res) => {
//   res
//     .cookie("token", "", {
//       httpOnly: true,
//       expires: new Date(Date.now()),
//     })
//     .send("Logged out");
// });

module.exports = router;
