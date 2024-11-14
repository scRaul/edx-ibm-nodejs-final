const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log("here");
  if (!username || !password) {
    return res.status(400).json({ message: "missing required fields" });
  }
  if (!isValid(username)) {
    return res.status(400).json({
      message: "username is already taken,please change it and try again",
    });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "succesfully created new user" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res
    .status(200)
    .json({ books, message: "retrieved list of all books" });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn] || null;
  const message = book ? `retrieved book with isbn:${isbn}` : `no book found`;
  return res.status(200).json({ book, message });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const matches = Object.values(books).filter((book) =>
    book.author.toLocaleLowerCase().includes(author.toLocaleLowerCase())
  );
  return res
    .status(200)
    .json({ matches, message: `list of books matching:${author}` });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const matches = Object.values(books).filter((book) =>
    book.title.toLocaleLowerCase().includes(title.toLocaleLowerCase())
  );
  return res
    .status(200)
    .json({ matches, message: `list of books matching:${title}` });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn] || null;
  const message = book ? "retrieved list of reviews" : "no book found";
  return res.status(200).json({ reviews: book.reviews, message });
});

module.exports.general = public_users;
