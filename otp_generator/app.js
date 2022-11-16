const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./controller/users");
require("dotenv").config();

app.use(express.json());
app.use("/users", userRoutes);

app.use((req, res) => {
  res.status(400).json({ error: "Page Not Found!" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MONGO DB CONNECTED");
    app.listen(process.env.PORT, () => {
      console.log("app listening on port 3200");
    });
  })
  .catch((err) => {
    console.log("MONGODB failed to connect ");
    console.log(err);
  });
