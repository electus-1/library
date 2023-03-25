// [ ] TODO: will add dynamically loading cover images from google books api later.

import { getApiKey } from "./env.js";

const modalConfirm = document.querySelector(".modal-confirm");
let idCounter;
let allowRemove = false;
main();

// [x] TODO: Handle the main application logic. Load the stored books when the page is loaded. If there is no storage make one.
function main() {
  // [x] TODO load books inside the local storage and display them
  idCounter =
    Number(JSON.parse(localStorage.getItem("idCounter"))) ||
    initializeIdCounter();
  loadBooks();

  // [x] TODO: handle click on add new books
  // [x] TODO: focus on first input
  let modal = document.querySelector(".modal");

  document.querySelector(".add-book").addEventListener("click", (e) => {
    modal.style.display = "flex";
    document.querySelector(".modal>.form input:first-of-type").focus();
  });

  // [x] TODO: handle closing modal
  const closeButton = document.querySelector(".close");
  closeButton.addEventListener("click", (e) => {
    modal.style.display = "none";
  });

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // [x] TODO sanitize user input and if user input is fine add new book and store it
  const form = document.querySelector(".form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // select input elements
    const title = document.getElementById("title");
    const author = document.getElementById("author");
    const pages = document.getElementById("pages");
    const language = document.getElementById("language");
    const haveRead = document.querySelector('input[name="haveRead"]:checked');

    // add, store and display new book
    addNewBook(
      title.value,
      author.value,
      pages.value,
      language.value,
      haveRead.value === "yes" ? true : false,
      assignID()
    );
    // clear form
    title.value = author.value = pages.value = language.value = "";

    document.querySelector(
      'input[name="haveRead"]:first-of-type'
    ).checked = true;

    // close modal page
    closeButton.click();
  });

  // [x] TODO handle click on don't remove or remove buttons on confirmation page
  const confirmRemove = document.querySelector(".confirm");
  confirmRemove.addEventListener("click", (e) => {
    allowRemove = true;
    modalConfirm.style.display = "none";
    document.querySelector(".willRemoved").click();
  });
  const notConfirmRemove = document.querySelector(".not-confirm");
  notConfirmRemove.addEventListener("click", (e) => {
    modalConfirm.style.display = "none";
  });
}

function initializeIdCounter() {
  localStorage.setItem("idCounter", JSON.stringify(0));
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

function getLanguageCode(languageName) {
  return Intl.getCanonicalLocales(languageName).toString().toLowerCase();
}

function getBookCover(book) {
  const img = document.createElement("img");
  img.width = 300;
  img.height = 300;
  img.src = "./img/default-cover.jpg";
  return img;
}

function displayBook(book) {
  if (JSON.parse(localStorage.getItem(book.id)) !== null) {
    const card = document.createElement("div");
    card.classList.add("card");

    const title = document.createElement("p");
    title.classList.add("title");
    title.textContent = capitalizeEachWord(String(book.title));
    card.appendChild(title);

    const author = document.createElement("p");
    author.classList.add("author");
    author.textContent = `by ${capitalizeEachWord(String(book.author))}`;
    card.appendChild(author);

    const bookCover = getBookCover(book);
    bookCover.classList.add("book-cover");
    card.appendChild(bookCover);

    const pages = document.createElement("p");
    pages.classList.add("pages");
    pages.textContent = `${book.pages || "Unknown number of"} pages`;
    card.appendChild(pages);

    // [x] TODO: handle click on toggle read/unread and save the changes to local storage
    const toggleRead = document.createElement("button");
    toggleRead.classList.add(book.haveRead ? "read" : "unread");
    toggleRead.textContent = book.haveRead ? "Have Read" : "Not Read Yet";
    card.appendChild(toggleRead);
    toggleRead.addEventListener("click", (e) => {
      toggleRead.classList.contains("read")
        ? markAsUnread(toggleRead, book)
        : markAsRead(toggleRead, book);
    });

    // [x] TODO: handle click on remove
    const removeButton = document.createElement("button");
    removeButton.classList.add("remove");
    removeButton.textContent = "Remove Book";
    card.appendChild(removeButton);
    removeButton.addEventListener("click", (e) => {
      removeButton.classList.add("willRemoved");
      if (allowRemove) {
        // remove from local storage
        localStorage.removeItem(book.id);
        // remove from display
        document.querySelector(".cards").removeChild(card);
        // disallow removing until next confirmation
        allowRemove = false;
      } else {
        modalConfirm.style.display = "flex";
      }
    });

    document.querySelector(".cards").appendChild(card);
  }
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
  displayBook(book);
}

// [x] TODO store books inside the local storage
function storeBook(book) {
  localStorage.setItem(book.id, JSON.stringify(book));
}

function loadBooks() {
  let book;
  if (localStorage.length !== 0) {
    Object.keys(localStorage).forEach((key) => {
      if (key !== "idCounter") {
        book = JSON.parse(localStorage.getItem(key));
        displayBook(book);
      }
    });
  }
}

function assignID() {
  let id = idCounter;
  idCounter++;
  localStorage.setItem("idCounter", JSON.stringify(idCounter));
  return id;
}

function markAsRead(button, book) {
  button.classList.remove("unread");
  button.classList.add("read");
  button.textContent = "Have Read";
  book.haveRead = true;
  localStorage.setItem(book.id, JSON.stringify(book));
}

function markAsUnread(button, book) {
  button.classList.remove("read");
  button.classList.add("unread");
  button.textContent = "Not Read Yet";
  book.haveRead = false;
  localStorage.setItem(book.id, JSON.stringify(book));
}
