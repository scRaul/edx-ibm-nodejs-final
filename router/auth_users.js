const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  const existingUsers = users.filter((user) => user.username === username);
  return existingUsers.length === 0;
};

const authenticatedUser = (username, password) => {
  const authUser = users.filter(
    (user) => user.username === username && user.password === password
  );
  return authUser.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "missing required login fields" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(400).json({ message: "invalid credentials" });
  }
  const accessToken = jwt.sign(
    {
      username,
    },
    "access",
    { expiresIn: 60 * 60 }
  );

  req.session.authorization = {
    accessToken,
    username,
  };

  return res.status(200).json({ message: "Successfully logged in!" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(403).json({ message: "not authorized" });
  }
  const username = user.username;
  const isbn = req.params.isbn;
  const { review } = req.query;
  if (!review || !isbn) {
    return res.status(400).json({ message: "missing review query" });
  }
  const book = books[isbn] || null;
  if (!book) {
    return res.status(400).json({ message: "invalid isbn" });
  }
  const bookReviews = book.reviews;
  bookReviews[username] = { customer: username, review };
  books[isbn].reviews = bookReviews;
  return res.status(201).json({ message: "your review was submited" });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(403).json({ message: "not authorized" });
  }
  const username = user.username;
  const isbn = req.params.isbn;
  const book = books[isbn] || null;
  if (book) {
    delete books[isbn].reviews[username];
  }
  return res.status(200).json({ message: "book review deleted" });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
