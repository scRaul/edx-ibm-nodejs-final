let axios = require("axios");
let api = "http://localhost:5000";
// task10.png
async function getAllBooks() {
  let url = `${api}`;
  try {
    let response = await axios.get(url);
    let { books, message } = response.data;
    return { books, message };
  } catch (err) {
    console.error(err);
    return null;
  }
}
//task11.png
async function getBookByIsbn(isbn) {
  let url = `${api}/isbn/${isbn}`;
  try {
    let response = await axios.get(url);
    let { message, book } = response.data;
    return { book, message };
  } catch (err) {
    console.error(err);
    return null;
  }
}
//task12.png
async function getBookByAuthor(name) {
  let url = `${api}/author/${name}`;
  try {
    let response = await axios.get(url);
    let { matches, message } = response.data;
    return { matches, message };
  } catch (err) {}
}
//task13.png
async function getBooksByTitle(title) {
  let url = `${api}/title/${title}`;
  try {
    let response = await axios(url);
    let { matches, message } = response.data;
    return { matches, message };
  } catch (err) {
    console.error(err);
    return null;
  }
}

function test() {
  getAllBooks().then(({ books, message }) => {
    console.log(message);
    console.log(books);
  });
  getBookByIsbn(1).then(({ book, message }) => {
    console.log(message);
    console.log(book);
  });
  getBookByAuthor("Balzac").then(({ matches, message }) => {
    console.log(message);
    console.log(matches);
  });
  getBooksByTitle("Pride").then(({ matches, message }) => {
    console.log(message);
    console.log(matches);
  });
}

test();
