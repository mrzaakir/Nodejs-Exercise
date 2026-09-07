// let name = 'yow yow ';

// console.log(name);

const express = require("express");
const app = express();

app.use(express.json());

let books = [
  { id: 1, title: 'Atomic Habits', author: 'James Clear' },
  { id: 2, title: 'Deep Work', author: 'Cal Newport' }
];

app.get("/", (req, res) => {
  res.json(books);
});

app.get("/books", (req, res) => {
  res.json(books);
});

app.get("/books/:id", (req, res) => {
  const book = books.find((book) => book.id === Number(req.params.id));

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.json(book);
});

app.post("/books", (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }

  const newBook = {
    id: books.length ? Math.max(...books.map((book) => book.id)) + 1 : 1,
    title,
    author
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

app.put("/books/:id", (req, res) => {
  const book = books.find((book) => book.id === Number(req.params.id));

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!req.body.title) {
    return res.status(400).json({ message: "Title is required" });
  }

  book.title = req.body.title;
  res.json(book);
});

app.delete("/books/:id", (req, res) => {
  const bookIndex = books.findIndex((book) => book.id === Number(req.params.id));

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  const [deletedBook] = books.splice(bookIndex, 1);
  res.json(deletedBook);
});

app.listen(3010, () => {
  console.log(`Server is running at http://localhost:3015`);
});
