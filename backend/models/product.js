const mongoose = require("mongoose");
const faker = require("faker");
const fakerImage = require("faker-image");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product Name"],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter product Description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter product Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: true,
  },
  Stock: {
    type: Number,
    required: [true, "Please Enter product Stock"],
    maxLength: [8, "Stock cannot exceed 8 characters"],
    default: 1,
  },

  colors: { type: Array },
  sizes: { type: Array },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate fake data
const generateFakeData = () => {
  const fakeProducts = [];

  for (let i = 0; i < 10; i++) {
    const fakeProduct = {
      name: faker.commerce.productName(),
      slug: faker.lorem.slug(),
      description: faker.lorem.paragraph(),
      price: faker.commerce.price(),
      images: [
        {
          public_id: faker.random.uuid(),
          url: fakerImage.imageUrl(),
        },
      ],
      category: faker.commerce.department(),
      Stock: faker.random.number(),
      colors: [faker.commerce.color()],
      sizes: [faker.random.arrayElement(["S", "M", "L", "XL"])],
    };

    fakeProducts.push(fakeProduct);
  }

  return fakeProducts;
};

module.exports = mongoose.model("Product", productSchema);

// Usage
// const fakeData = generateFakeData();
// console.log(fakeData);
