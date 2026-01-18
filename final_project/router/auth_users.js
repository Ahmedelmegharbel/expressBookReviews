const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        "username": "user1",
        "password": "pwd1"
    },
];

const isValid = (username)=>{ //returns boolean
const usernameValid = users.filter((user) => user.username === username);
return (usernameValid.length > 0);
}

const authenticatedUser = (username,password)=>{ //returns boolean
const userMatches = users.filter((user) => user.username === username && user.password === password);
return (userMatches.length > 0);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({data: password}, "access", {expiresIn: 60 * 60});
    req.session.authorization = { accessToken, username };
    return res.status(200).json({message: "User successfully logged in"});
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    let bookIsbn = books[isbn];
    bookIsbn.reviews[username] = review;
    return res.status(200).json({message: "Review successfully posted"});
  } else {
    return res.status(404).json({message: "Input not found"});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req,res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn]) {
        let bookIsbn = books[isbn];
        delete bookIsbn.reviews[username];
        return res.status(200).json({message: "Review successfully deleted"});
    } else {
        return res.status(404).json({message: "Input not found"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
