const express = require("express");
const { userRouter } = require("./routes/user.js");
const gadgetRouter = require("./routes/gadget.js");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/gadgets", gadgetRouter);

app.listen(process.env.PORT);
