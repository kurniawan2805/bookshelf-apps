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

let books = [];
let filteredBooks = [];
const RENDER_EVENT = "render-bookshelf";
const SAVED_EVENT = "saved-bookshelf";
const STORAGE_KEY = "BOOKSHELF_APP";

// generate unique id
const generateId = () => {
  // return +new Date();
  return (Math.random() + 1).toString().split(".")[1];
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
  // console.log(books);
};

// prepare render for a book
const makeBook = (book) => {
  const { id, title, author, year, isCompleted } = book;

  const textTitle = document.createElement("h3");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis: ${author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun: ${year}`;

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  // add feature edit book
  const editBook = document.createElement("button");
  editBook.classList.add("red");
  editBook.innerText = "Edit buku";
  editBook.addEventListener("click", () => {
    handleEditBook(id);
  });

  buttonContainer.append(editBook);

  if (isCompleted) {
    const undoRead = document.createElement("button");
    undoRead.classList.add("green");
    undoRead.innerText = "Belum selesai di Baca";
    undoRead.addEventListener("click", () => {
      handleUndoRead(id);
    });

    // const deleteBook = document.createElement("button");
    // deleteBook.classList.add("red");
    // deleteBook.innerText = "Hapus buku";
    // deleteBook.addEventListener("click", () => {
    //   handleDeleteBook(id);
    // });

    buttonContainer.append(undoRead);
  } else {
    const doneRead = document.createElement("button");
    doneRead.classList.add("green");
    doneRead.innerText = "Selesai dibaca";
    doneRead.addEventListener("click", () => {
      handleDoneRead(id);
    });

    // const deleteBook = document.createElement("button");
    // deleteBook.classList.add("red");
    // deleteBook.innerText = "Hapus buku";
    // deleteBook.addEventListener("click", () => {
    //   handleDeleteBook(id);
    // });

    buttonContainer.append(doneRead);
  }

  const deleteBook = document.createElement("button");
  deleteBook.classList.add("red");
  deleteBook.innerText = "Hapus buku";
  deleteBook.addEventListener("click", () => {
    handleDeleteBook(id);
  });
  buttonContainer.append(deleteBook);
  container.append(buttonContainer);
  return container;
};

//handle event function
const handleDeleteBook = (id) => {
  if (confirm("Apakah Anda yakin akan menghapus buku?")) {
    // Delete it!
    const idx = books.findIndex((book) => book.id === id);
    if (idx >= 0) {
      books.splice(idx, 1);
    }
    filteredBooks = [...books];
    document.dispatchEvent(new Event(RENDER_EVENT));
    console.log(books, deletedItem, id);
    console.log("Buku terhapus");
    saveData();
  } else {
    // Do nothing!
  }
};

const handleDoneRead = (id) => {
  const idx = books.findIndex((book) => book.id === id);
  books[idx].isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const handleUndoRead = (id) => {
  const idx = books.findIndex((book) => book.id === id);
  books[idx].isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const handleEditBook = (id) => {
  if (confirm("Apakah Anda ingin mengedit buku?")) {
    // Edit it!
    const idx = books.findIndex((book) => book.id === id);
    const editedItem = books.splice(idx, 1);

    filteredBooks = [...books];
    // prepare form with edited book
    document.getElementById("inputBookTitle").value = editedItem[0].title;
    document.getElementById("inputBookAuthor").value = editedItem[0].author;
    document.getElementById("inputBookYear").value = editedItem[0].year;
    document.getElementById("inputBookIsComplete").checked =
      editedItem[0].isCompleted;

    document.dispatchEvent(new Event(RENDER_EVENT));
    // not saved yet, will be saved after click add book or another event
    alert("Silakan edit buku Anda!");
  } else {
    // Do nothing!
  }
};

// search book by title
const searchBook = () => {
  const element = document.getElementById("searchBookTitle");
  let searchTitle = element.value.trim().toLowerCase();

  if (searchTitle && searchTitle.trim().length > 0) {
    filteredBooks = books.filter((book) => {
      return book.title.includes(searchTitle);
    });
  } else {
    filteredBooks = [...books];
  }
};

// render event
document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("inputBook");
  const searchForm = document.getElementById("searchBook");

  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
    alert("Buku berhasil ditambah!");
    sortedBook();
    filteredBooks = [...books];
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  });

  // triger when filter book
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchBook();
    document.dispatchEvent(new Event(RENDER_EVENT));
  });

  // add saved storage
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, () => {
  const readBooks = document.getElementById("completeBookshelfList");
  const unreadBooks = document.getElementById("incompleteBookshelfList");

  // clearing list item
  readBooks.innerHTML = "";
  unreadBooks.innerHTML = "";

  for (let book of filteredBooks) {
    const bookElement = makeBook(book);
    if (book.isCompleted) {
      readBooks.append(bookElement);
    } else {
      unreadBooks.append(bookElement);
    }
  }
});

// sort books by author
const sortedBook = () => {
  // sort of item by author name
  books.sort((a, b) => {
    let fa = a.author.toLowerCase();
    let fb = b.author.toLowerCase();
    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
};

// handle local storatge
function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

// save data to local storage
function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

// load data from local storage
function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
    sortedBook();
    filteredBooks = [...books];
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil di simpan.");
});
