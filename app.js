const express = require("express");

const app = express();

//Index Route
app.get("/", (req, res) => {
  res.send("Index");
});

//About Route
app.get("/about", (req, res) => {
  res.send("About1");
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
