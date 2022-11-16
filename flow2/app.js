const express = require("express");
const app = express();

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./");

app.get("/I/want/title/", (req, res) => {
  try {
    if (!req.query || !req.query.address) {
      res.status(400).send("Please send address query along!");
    }
    const { address } = req.query;
    console.log("ADDRESSES : ", address);
    res.render("./index.ejs", { address });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
  //   res.status(200).send("Completed!");
});

app.use((req, res) => {
  res.status(404).send("No Page Found!");
});

app.listen(4000, () => {
  console.log("Connected to server on 4000 port!");
});
