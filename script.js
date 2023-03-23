import { getApiKey } from "./env.js";

const myLibrary = [];
const images = [];

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

function getBookCover(book) {
  // Replace the API key with your own key
  const apiKey = getApiKey();
  const url = `https://www.googleapis.com/books/v1/volumes?q=${
    book.title
  }+inauthor:${book.author}&langRestrict=${getLanguageCode(
    book.language
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
      images.push(img);
    })
    .catch((error) => {
      console.error(error);
    });
}

function displayBook(book) {
  const card = document.createElement("div");
  card.classList.add("card");

  const title = document.createElement("p");
  title.classList.add("title");
  title.textContent = capitalizeEachWord(book.title);
  card.appendChild(title);

  const author = document.createElement("p");
  author.classList.add("author");
  author.textContent = `by ${capitalizeEachWord(book.author)}`;
  card.appendChild(author);

  getBookCover(book);
  const bookCover = images.pop();
  bookCover.classList.add("book-cover");
  card.appendChild(bookCover);

  const pages = document.createElement("p");
  pages.classList.add("pages");
  pages.textContent = `${book.pages}`;
  card.appendChild(pages);

  const toggleRead = document.createElement("button");
  toggleRead.classList.add(book.haveRead ? "read" : "unread");
  toggleRead.textContent = book.haveRead ? "Have Read" : "Not Read Yet";
  card.appendChild(toggleRead);

  const removeButton = document.createElement("button");
  removeButton.classList.add("remove");
  removeButton.textContent = "Remove Book";
  card.appendChild(removeButton);

  document.querySelector(".cards").appendChild(card);
}

function capitalizeEachWord(name) {
  name = name.split(" ");
  name = name.map((word) => `${word[0].toUpperCase()}${word.substring(1)}`);
  name = name.join(" ");
  return name;
}
