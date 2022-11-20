const express = require("express");
const app = express();
const cheerio = require("cheerio");
const axios = require("axios");

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./");

app.get("/I/want/title/", async (req, res) => {
  if (!req.query || !req.query.address) {
    res.status(400).send("Please send address query along!");
  }
  const { address } = req.query;
  const address_array = Array.isArray(address) ? address : [address];
  const titles = [];
  var x = 0;

  while (x >= 0) {
    if (x == address_array.length) {
      break;
    }
    const address_each = address_array[x];
    var url = !address_each.match("https://")
      ? "https://" + address_each
      : address_each;
    console.log("URL :  ", url);
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const url_title = $("title").html();
      titles.push(address_each + " - " + url_title);
    } catch (e) {
      titles.push(address_each + " - " + "NO - RESPONSE ");
    }
    x++;
  }

  res.render("./index.ejs", { titles });
});

app.use((req, res) => {
  res.status(404).send("No Page Found!");
});

app.listen(4000, () => {
  console.log("Connected to server on 4000 port!");
});
