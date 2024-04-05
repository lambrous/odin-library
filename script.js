const addBookForm = document.querySelector(".add-book-form");
const addBookModal = document.querySelector(".add-book-modal");
const openModalButton = document.querySelector(".open-btn");
const closeModalButton = document.querySelector(".close-btn");
const libraryElement = document.querySelector("ul.library");

const myLibrary = [];

let nextBookID = 1;

function Book(title, author, pages) {
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.isRead = false;
	this.id = nextBookID++;
}

Book.prototype.toggleRead = function () {
	this.isRead = !this.isRead;
};

function addBookToLibrary(book) {
	myLibrary.push(book);
	renderBook(book);
}

function renderBook(book) {
	const bookItem = createBookElement(book);
	libraryElement.prepend(bookItem);
}

function deleteBook(bookID) {
	const index = myLibrary.findIndex((book) => book.id === bookID);
	if (index !== -1) {
		myLibrary.splice(index, 1);
	}
}

function createBookElement(book) {
	const bookItem = document.createElement("li");
	bookItem.setAttribute("data-id", book.id);
	bookItem.classList.add("book", "card");

	const bookDescription = createBookDescription(book);
	const readButton = createReadButton(book);
	const removeBookButton = createRemoveButton(bookItem);

	bookItem.append(removeBookButton, bookDescription, readButton);

	return bookItem;
}

function createBookDescription(book) {
	const bookHeading = document.createElement("h2");
	bookHeading.textContent = book.title;

	const bookAuthorText = document.createElement("p");
	bookAuthorText.textContent = book.author;

	const bookTotalPagesText = document.createElement("span");
	bookTotalPagesText.textContent = `${book.pages} pages`;

	const bookContainer = document.createElement("div");
	bookContainer.append(bookHeading, bookAuthorText, bookTotalPagesText);

	return bookContainer;
}

function createReadButton(book) {
	const readButton = document.createElement("button");
	readButton.classList.add("btn");

	function updateReadStatus() {
		readButton.classList.toggle("book-read", book.isRead);
		readButton.textContent = book.isRead ? "Unread" : "Read";
	}

	updateReadStatus();

	readButton.addEventListener("click", () => {
		book.toggleRead();
		updateReadStatus();
	});

	return readButton;
}

function createRemoveButton(bookItem) {
	const bookID = bookItem.dataset.id;
	const removeButton = document.createElement("button");
	removeButton.textContent = "×";
	removeButton.classList.add("remove-btn");
	removeButton.addEventListener("click", () => {
		deleteBook(+bookID);
		libraryElement.removeChild(bookItem);
	});

	return removeButton;
}

function handleBookSubmission(event) {
	event.preventDefault();

	const newBookData = new FormData(this);
	const { title, author, totalPages } = Object.fromEntries(newBookData);
	const newBook = new Book(title, author, +totalPages);

	addBookToLibrary(newBook);
	addBookModal.close();
	event.target.reset();
}

openModalButton.addEventListener("click", () => addBookModal.showModal());
closeModalButton.addEventListener("click", () => addBookModal.close());
addBookForm.addEventListener("submit", handleBookSubmission);
