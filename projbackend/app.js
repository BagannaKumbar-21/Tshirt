const bodyParser= require('body-parser');
const cookieParser=require('cookie-parser');
const cors=require('cors')
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
//My routes
const authRoutes=require("./routes/auth")
//User routes
const userRoutes=require("./routes/user")
const categoryRoutes=require("./routes/category")
const productRoutes=require("./routes/product");
const orderRoutes = require("./routes/order");
//DB connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  });


  //Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//my routes
app.use("/api", authRoutes);

// user routes
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api",orderRoutes);

//port
const port = process.env.PORT || 8000 ;
//starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
