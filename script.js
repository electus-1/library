import { getApiKey } from "./env.js";

const images = [];
main();

// [ ] TODO: Handle the main application logic. Load the stored books when the page is loaded. If there is no storage make one.
function main() {
  // [x] TODO load books inside the local storage
  let idCounter = localStorage.getItem("idCounter") || initializeIdCounter();
  loadBooks();

  // [ ] TODO: handle click on add new books
  // [ ] TODO: focus on first input
  let modal = document.querySelector(".modal");

  document.querySelector(".add-book").addEventListener("click", (e) => {
    modal.style.display = "flex";
  });

  // [x] TODO: handle closing modal
  let closeButton = document.querySelector(".close");
  closeButton.addEventListener("click", (e) => {
    modal.style.display = "none";
  });

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // [ ] TODO sanitize user input and add new book if user input is fine

  // [ ] TODO: handle click on toggle read/unread

  // [ ] TODO: handle click on remove
}

function initializeIdCounter() {
  localStorage.setItem("idCounter", 0);
  return 0;
}

function Book(title, author, pages, language, haveRead, id) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.language = language;
  this.haveRead = haveRead;
  this.id = id;
}

Book.prototype.info = function () {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${
    this.haveRead ? "have read" : "not read yet"
  }.`;
};

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
  pages.textContent = `${book.pages}` || "Unknown";
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

//[x] TODO "Make add new book" button functioning
function addNewBook(title, author, pages, language, haveRead, id) {
  const book = new Book(title, author, pages, language, haveRead, id);
  storeBook(book);
}

// [x] TODO store books inside the local storage
function storeBook(book) {
  localStorage.setItem(book.id, book);
}

function loadBooks() {
  let book;
  Object.keys(localStorage).forEach((key) => {
    if (key !== "idCounter") {
      book = localStorage.getItem(key);
      displayBook(book);
    }
  });
}
