const express = require("express");
const app = express();
const path = require("node:path");
const homeRouter = require("./routes/homeRouter");
const itemRouter = require("./routes/itemRouter");
const typeRouter = require("./routes/typeRouter");
const assetsPath = path.join(__dirname, "public");
const PORT = 3000;

app.use(express.urlencoded({ extended: true}));
app.use(express.static(assetsPath));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", homeRouter);
app.use("/items", itemRouter);
app.use("/types", typeRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});