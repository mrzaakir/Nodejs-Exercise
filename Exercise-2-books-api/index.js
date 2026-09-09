const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const booksRouter = require("./routes/books");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use("/books", booksRouter);

app.get("/", (req, res) => {
  res.json({ message: "Books API is running" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
