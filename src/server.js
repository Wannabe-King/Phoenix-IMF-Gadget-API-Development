const express = require("express");
const { userRouter } = require("./routes/user.js");
const gadgetRouter = require("./routes/gadget.js");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/gadgets", gadgetRouter);

const PORT = process.env.PORT || 5001;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});
