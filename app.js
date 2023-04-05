const express = require('express');
const userrouter = require("./router/userRoute");
const productrouter = require('./router/productRoute');


const app = express();

app.use(express.json());
app.use("/api/user", userrouter);
app.use('/api/product', productrouter);

app.all("*", (req, res, next) => {
  next(
    res.status(404).json({
      status: "failed",
      messege: `Can't find ${req.originalUrl} on this server`,
    })
  );
});
module.exports = app;