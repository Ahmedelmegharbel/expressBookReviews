const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    const userExist = users.filter((user) => { return user.username === username });
    if (userExist.length > 0) {
        return true;
    } else {
        return false;
    }
}


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if(!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Please enter username and password!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const bookIsbn = books[isbn];
  return res.status(300).json({message: bookIsbn});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const values = Object.values(books);
  const filteredAuthor = values.filter((book) => book.author.toLowerCase() === author.toLowerCase());
  return res.status(300).json({message: filteredAuthor});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const values = Object.values(books);
  const filteredTitle = values.filter((book) => book.title.toLowerCase() === title.toLowerCase());
  return res.status(300).json({message: filteredTitle});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const reviews = req.params.reviews;
  const bookIsbn = books[isbn];
  return res.status(300).json({message: bookIsbn.reviews});
});

module.exports.general = public_users;
