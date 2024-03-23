const Product = require("../models/product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();
const ApiFeatures = require("../utils/apiFeatures");
const reviews = require("../models/reviews");

// @desc Create a product by admin
// @route POST /api/products
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  // TODO: add images logic in all this

  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc Update a product by admin
// @route PUT /api/products/:id
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc Delete a product by admin
// @route DELETE /api/products/:id
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc Get a product by id by anyone
// @route GET /api/products/find/:id
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc Get all products by anyone at homepage
// @route GET /api/products
router.get("/", async (req, res) => {
  const resPerPage = 8;
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  let products = await apiFeatures.query;
  // apiFeatures.query = Product.find() = this.query
  // apiFeatures return "this" object

  res.status(200).json({
    products,
    resPerPage,
  });
});

// @desc Get all products by admin without any filters
// @route GET /api/products/all
router.get("/all", verifyTokenAndAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});


// TODO: review only can be made by that user that has ordered the product
// TODO: this after order logic has been implemented
// TODO: create a new review or update a review logic
// TODO: get all reviews for a product logic
// TODO: delete a review logic

module.exports = router;
