var mongoose = require("mongoose");
const db = mongoose
  .connect("mongodb://0.0.0.0:27017/e-commerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

let userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNo: {
    type: Number,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
});

const productSchema = new mongoose.Schema({
  ProductName: {
    type: String,
    required:true
  },
  ProductDescription: {
    type: String,
    required:true

  },
  Image: {
    type: String,
    required:true

  },
  Price: {
    type: Number,
    required:true

  },
  Category: {
    type: String,
    required:true

  },
  Quantity: {
    type: Number,
    required:true

  },
});

const cartSchema = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      Quantity: { type: Number, default: 1 },
      Price: { type: Number },
    }
  ],
};

module.exports = {
  users: mongoose.model("user", userSchema),
  product: mongoose.model("product", productSchema),
  category: mongoose.model("category", categorySchema),
  cart: mongoose.model("cart", cartSchema),
};
