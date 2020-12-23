const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, "sdsfdfds343DSDSF33");
    res.send({ token });
  } catch (error) {
    return res.status(422).send(error.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(422).send({ error: "Invalid password or email" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, "sdsfdfds343DSDSF33");
    res.send({ token });
  } catch (error) {
    return res.status(422).send({ error: "Invalid password or email" });
  }
});

router.patch("/update-profile", requireAuth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    if (e.name === "MongoError" && e.code === 11000) {
      // Duplicate username
      return res.status(400).send({ error: "User already exist!" });
    }
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
