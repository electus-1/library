import { getApiKey } from "./env.js";

const myLibrary = [];

function Book(title, author, pages, language, haveRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.language = language;
  this.haveRead = haveRead;
}

Book.prototype.info = function () {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${
    this.haveRead ? "have read" : "not read yet"
  }.`;
};

function addBookToLibrary(book) {
  myLibrary.push(book);
}

function getLanguageCode(languageName) {
  return Intl.getCanonicalLocales(languageName).toString().toLowerCase();
}

function getBookCover(title, author, languageName) {
  // Replace the API key with your own key
  const apiKey = getApiKey();
  const url = `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&langRestrict=${getLanguageCode(
    languageName
  )}&key=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Get the first book from the search results
      const book = data.items[0];
      // Get the thumbnail image URL
      const imageUrl = book.volumeInfo.imageLinks
        ? book.volumeInfo.imageLinks.thumbnail
        : null;
      // Set the URL of the default image
      const defaultImageUrl = "img/default-cover.jpg";
      // Display the image in an HTML <img> element
      const img = document.createElement("img");
      img.width = 300;
      img.height = 300;
      img.src = imageUrl || defaultImageUrl;
      document.body.appendChild(img);
    })
    .catch((error) => {
      console.error(error);
    });
}
getBookCover("Brave New World", "Huxley", "English");
