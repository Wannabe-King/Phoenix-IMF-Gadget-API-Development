const { Router } = require("express");
const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");
const userRouter = Router();
const jwt = require("jsonwebtoken");

userRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      console.log(existingUser);
      res.json({
        message:
          "Email Already Registed. Please Login using email and password!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 3);

    const newUser = await prisma.user.create({
      data: { name: name, email: email, password: hashedPassword },
    });
    res.json({
      message: "User Created Successfully",
      data: newUser,
    });
  } catch (e) {
    res.status(500).json({
      message: `There was an error during signup ${e}`,
    });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.json({
        message: "User does not exist. Please regiter.",
      });
    }

    const hashedPassword = user.password;
    const isValid = await bcrypt.compare(password, hashedPassword);
    if (!isValid) {
      return res.json({
        message:
          "Invalid user credential. Please enter correct email and password",
      });
    }
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET
    );

    res.json({
      token: token,
      message: "Signin Successful.",
    });
  } catch (e) {
    res.status(500).json({
      message: `There was an error while login ${e}`,
    });
  }
});

module.exports = {
  userRouter: userRouter,
};
