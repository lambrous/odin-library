class Library {
	constructor() {
		this.books = [];
	}

	add(book) {
		this.books.push(book);
	}

	remove(bookID) {
		const index = this.books.findIndex((book) => bookID === book.id);
		if (index < 0) return;
		this.books.splice(index, 1);
	}
}

class Book {
	static nextBookID = 1;

	constructor(title, author, pages) {
		this.title = title;
		this.author = author;
		this.pages = pages;
		this.isRead = false;
		this.id = Book.nextBookID++;
	}

	toggleRead() {
		this.isRead = !this.isRead;
	}
}

(() => {
	const myLibrary = new Library();

	const addBookForm = document.querySelector(".add-book-form");
	const addBookModal = document.querySelector(".add-book-modal");
	const openModalButton = document.querySelector(".open-btn");
	const closeModalButton = document.querySelector(".close-btn");
	const libraryElement = document.querySelector("ul.library");

	const renderBook = (book) => {
		const bookItem = createBookElement(book);
		openModalButton.insertAdjacentElement("beforebegin", bookItem);
	};

	const createBookElement = (book) => {
		const bookItem = document.createElement("li");
		bookItem.setAttribute("data-id", book.id);
		bookItem.classList.add("book", "card");

		const bookDescription = createBookDescription(book);
		const readButton = createReadButton(book);
		const removeBookButton = createRemoveButton(bookItem);

		bookItem.append(removeBookButton, bookDescription, readButton);

		return bookItem;
	};

	const createBookDescription = (book) => {
		const bookHeading = document.createElement("h2");
		bookHeading.textContent = book.title;

		const bookAuthorText = document.createElement("p");
		bookAuthorText.textContent = book.author;

		const bookTotalPagesText = document.createElement("span");
		bookTotalPagesText.textContent = `${book.pages} pages`;

		const bookContainer = document.createElement("div");
		bookContainer.append(bookHeading, bookAuthorText, bookTotalPagesText);

		return bookContainer;
	};

	const createReadButton = (book) => {
		const readButton = document.createElement("button");
		readButton.classList.add("btn");

		const updateReadStatus = () => {
			readButton.classList.toggle("book-read", book.isRead);
			readButton.textContent = book.isRead ? "Unread" : "Read";
		};

		updateReadStatus();

		readButton.addEventListener("click", () => {
			book.toggleRead();
			updateReadStatus();
		});

		return readButton;
	};

	const createRemoveButton = (bookItem) => {
		const bookID = bookItem.dataset.id;
		const removeButton = document.createElement("button");
		removeButton.textContent = "×";
		removeButton.classList.add("remove-btn");
		removeButton.addEventListener("click", () => {
			myLibrary.remove(+bookID);
			libraryElement.removeChild(bookItem);
		});

		return removeButton;
	};

	const handleBookSubmission = (e) => {
		e.preventDefault();

		const newBookData = new FormData(e.target);
		const { title, author, totalPages } = Object.fromEntries(newBookData);
		const newBook = new Book(title, author, +totalPages);

		myLibrary.add(newBook);
		renderBook(newBook);
		addBookModal.close();
		e.target.reset();
	};

	const handleClickOutsideModal = (e) => {
		const modal = e.target;
		const rect = modal.getBoundingClientRect();
		if (
			e.clientY < rect.top ||
			e.clientY > rect.bottom ||
			e.clientX < rect.left ||
			e.clientX > rect.right
		) {
			modal.close();
		}
	};

	openModalButton.addEventListener("click", () => addBookModal.showModal());
	closeModalButton.addEventListener("click", () => addBookModal.close());
	addBookForm.addEventListener("submit", handleBookSubmission);
	addBookModal.addEventListener("click", handleClickOutsideModal);
})();
