const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // to create a token
const sendEmail = require("../utils/sendEmail");

// @desc   Register a new user
// @route  POST /api/auth/register
router.post("/register", async (req, res) => {
  const checkUser1 = await User.findOne({ email: req.body.email });
  const checkUser2 = await User.findOne({ phoneNumber: req.body.phoneNumber });

  if (checkUser1 || checkUser2) {
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

  // verify the user by email
  const token = jwt.sign(
    {
      id: newUser._id,
      email: newUser.email,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "10m" }
  );
  const url = `http://localhost:4000/api/auth/verify/${token}`;
  const options = {
    email: newUser.email,
    subject: "Account Verification",
    message: `Please click on the below link to verify the account\n\n ${url} \n\n The Link is valid for 10mins!`,
  };
  sendEmail(options);

  let savedUser;
  try {
    savedUser = await newUser.save();
  } catch (err) {
    res.status(500).json(err);
  }

  res.status(201).json(savedUser);
});

// @desc registration verification via email
// @route GET /api/auth/verify/:token
router.get("/verify/:token", async (req, res) => {
  const token = req.params.token;
  if (!token) return res.status(401).json("You are not authenticated");
  let payload;
  try {
    payload = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    return res.status(500).json(err);
  }
  if (!payload) return res.status(401).json("You are not authenticated");
  const user = await User.findById(payload.id);
  if (!user) return res.status(404).json("User not found");
  user.isVerified = true;

  try {
    const name = user.name.split(" ")[0];
    const options = {
      email: user.email,
      subject: "Registration Successful",
      message: `Dear ${name}, You have successfully registered on SwiftCart. Welcome!`,
    };
    await sendEmail(options);
  } catch (err) {
    res.status(500).json(err);
  }
  await user.save();
  res
    .status(200)
    .json(
      "Your email has been verified. You can close this tab and login now!"
    );
});

// @desc  Login a user
// @route POST /api/auth/login
// FIXME: send email that you logged in and check if user is verified
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
      process.env.TOKEN_SECRET,
      { expiresIn: "12h" }
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

// @desc forgot password
// @route POST /api/auth/forgotPassword
// FIXME: check email with nodemailer check if user is verified
router.post("/forgotPassword", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json("User not found");
  try {
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "12h" }
    );

    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
