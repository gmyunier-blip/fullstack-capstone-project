const express = require("express");
const app = express();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const connectToDatabase = require("../models/db");
const router = express.Router();
const dotenv = require("dotenv");
const pino = require("pino"); // Import Pino logger
const bcrypt = require("bcryptjs/dist/bcrypt");

dotenv.config();
const logger = pino();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  try {
    // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
    // {{insert code here}}
    const db = await connectToDatabase();

    // Task 2: Access MongoDB collection
    // {{insert code here}}
    const collection = db.collection("users");

    //Task 3: Check for existing email
    // {{insert code here}}
    const existingEmail = await collection.findOne({ email: req.body.email });
    if (existingEmail)
      return res.status(409).send("Email is already registered");

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);
    const email = req.body.email;

    // {{insert code here}} //Task 4: Save user details in database
    const newUser = await collection.insertOne({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
      createdAt: new Date(),
    });
    // {{insert code here}} //Task 5: Create JWT authentication with user._id as payload
    const payload = {
      user: {
        id: newUser.insertedId,
      },
    };

    const authtoken = jwt.sign(payload, JWT_SECRET);
    logger.info("User registered successfully");
    res.json({ authtoken, email });
  } catch (e) {
    return res.status(500).send("Internal server error");
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Check if username or password is missing
  if (!email || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  try {
    // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
    // {{insert code here}}
    const db = await connectToDatabase();

    // Task 2: Access MongoDB collection
    // {{insert code here}}
    const collection = db.collection("users");
    const user = await collection.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "Error logging in" });

    // Authenticate user
    if (bcrypt.compareSync(password, user.password)) {
      // Generate JWT access token
      const payload = {
        user: {
          id: user.insertedId,
        },
      };
      const authtoken = jwt.sign(payload, JWT_SECRET);
      const firstName = user.firstName;
      logger.info("User login successfully");
      res.json({ authtoken, email, firstName });
    } else res.status(401).json("Invalid  email or password");
  } catch (e) {
    return res.status(500).send("Internal server error");
  }
});
module.exports = router;
