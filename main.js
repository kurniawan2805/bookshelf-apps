/*
// book object:
{
  id: string | number,
  title: string,
  author: string,
  year: number,
  isComplete: boolean,
}
*/

const books = [];
const RENDER_EVENT = "render-bookshelf";
const SAVED_EVENT = "saved-bookshelf";
const STORAGE_KEY = "BOOKSHELF_APP";

// generate unique id
const generateId = () => {
  return +new Date();
};

// generate book object
const generateBookObject = (id, title, author, year, isCompleted) => {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
};

// get input data from form and add it to array of obj
const addBook = () => {
  const titleBook = document.getElementById("inputBookTitle").value;
  const authorBook = document.getElementById("inputBookAuthor").value;
  const yearBook = document.getElementById("inputBookYear").value;
  const isBookCompleted = document.getElementById(
    "inputBookIsComplete"
  ).checked;

  const generatedId = generateId();

  let bookObj = generateBookObject(
    generatedId,
    titleBook,
    authorBook,
    yearBook,
    isBookCompleted
  );

  books.push(bookObj);
  document.dispatchEvent(new Event(RENDER_EVENT));
  console.log(books);
};

// prepare render for a book
const makeBook = (book) => {
  // <!-- <article class="book_item">--> -->
  // <!-- <h3>Book Title</h3>
  // <p>Penulis: John Doe</p>
  // <p>Tahun: 2002</p>

  // <div class="action">
  //   <button class="green">Selesai dibaca</button>
  //   <button class="red">Hapus buku</button>
  // </div> -->

  // <div class="action">
  //           <button class="green">Belum selesai di Baca</button>
  //           <button class="red">Hapus buku</button>
  //         </div> -->
  const { id, title, author, year, isCompleted } = book;

  const textTitle = document.createElement("h3");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis: ${author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun: ${year}`;

  // const textContainer = document.createElement("div");
  // textContainer.classList.add("book_item");
  // textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  if (isCompleted) {
    const undoRead = document.createElement("button");
    undoRead.classList.add("green");
    undoRead.innerText = "Belum selesai di Baca";

    const deleteBook = document.createElement("button");
    deleteBook.classList.add("red");
    deleteBook.innerText = "Hapus buku";

    buttonContainer.append(undoRead, deleteBook);
  } else {
    const doneRead = document.createElement("button");
    doneRead.classList.add("green");
    doneRead.innerText = "Selesai dibaca";

    const deleteBook = document.createElement("button");
    deleteBook.classList.add("red");
    deleteBook.innerText = "Hapus buku";

    buttonContainer.append(doneRead, deleteBook);
  }
  container.append(buttonContainer);
  return container;
};

// render event
document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
  });

  // add saved storage
});

document.addEventListener(RENDER_EVENT, () => {
  const readBooks = document.getElementById("completeBookshelfList");
  const unreadBooks = document.getElementById("incompleteBookshelfList");

  // clearing list item
  readBooks.innerHTML = "";
  unreadBooks.innerHTML = "";

  for (let book of books) {
    const bookElemen = makeBook(book);
    if (book.isCompleted) {
      readBooks.append(bookElemen);
    } else {
      unreadBooks.append(bookElemen);
    }
  }
});

// let hasRead = [];

// hasRead.push({
//   id: +new Date(),
//   title: "Harry Potter and the Philosopher's Stone",
//   author: "J.K Rowling",
//   year: 1997,
//   isComplete: false,
// });

// console.log(hasRead);
