function openModal() {
    const modalContainer = document.getElementById('modal-container')
    const modal = document.getElementById('add-modal')
    const overlay = document.getElementById('overlay')

    modalContainer.className = 'visible-modal-container'
    overlay.className = 'visible-overlay'

    setTimeout(() => {
        modal.className = 'card fade-in'
        overlay.className = 'visible-overlay fade-in'
    }, 200)
}

function closeModal() {
    document.getElementById('add-book-form').reset()
    const modalContainer = document.getElementById('modal-container')
    const modal = document.getElementById('add-modal')
    const overlay = document.getElementById('overlay')

    modal.className = 'card fade-out'
    overlay.className = 'visible-overlay fade-out'

    setTimeout(() => {
        modalContainer.className = 'hidden'
        overlay.className = 'hidden'
    }, 200)

}

class Book {
    constructor({coverUrl, author, title}) {
        this.id = bookList.length + 1
        this.coverUrl = coverUrl
        this.author = author
        this.title = title
        this.read = false
    }

    toggleRead() {
        this.read = !this.read
    }
}

let bookList = []

const addBookToLibrary = (book) => {
    bookList.unshift(book)
}

const removeBookFromLibrary = (id) => {
    bookList = bookList.filter(book => book.id !== id)
    drawGallery()
}

document.addEventListener('submit', e => {
    e.preventDefault()


    const coverUrl = document.getElementById('coverUrl').value
    const author = document.getElementById('author').value
    const title = document.getElementById('title').value


    const newBook = new Book({
        title,
        coverUrl,
        author
    })

    addBookToLibrary(newBook)
    drawGallery()
    closeModal()
})


document.addEventListener('keyup', e => {
    if (e.key === 'Escape') closeModal()
})

const createBookElement = (book) => {
    const bookCard = document.createElement('div')
    const title = document.createElement('h3')
    const cover = document.createElement('img')
    const author = document.createElement('p')
    const readButton = document.createElement('button')
    const deleteButton = document.createElement('i')
    bookCard.className = 'card book-card'
    title.innerText = book.title
    title.className = 'book-title'
    cover.src = book.coverUrl
    cover.className = 'book-cover'
    author.innerText = book.author
    author.className = 'book-author'
    readButton.innerText = `Mark as ${book.read ? 'not read' : 'read'}`
    readButton.className = 'read-button button'
    readButton.value = book.read
    readButton.onclick = () => {
        book.toggleRead()
        drawGallery()
    }
    deleteButton.className = 'material-symbols-outlined delete-button'
    deleteButton.innerHTML = 'close'
    deleteButton.onclick = () => removeBookFromLibrary(book.id)

    bookCard.appendChild(cover)
    bookCard.appendChild(title)
    bookCard.appendChild(author)
    bookCard.appendChild(readButton)
    bookCard.appendChild(deleteButton)

    return bookCard
}

const drawGallery = () => {
    const galleryContainer = document.getElementById('book-grid')
    while (galleryContainer.hasChildNodes()) {
        galleryContainer.removeChild(galleryContainer.firstChild);
    }

    if (!bookList.length) {
        const noBooks = document.createElement("div")
        noBooks.innerText = 'You Have No Books'
        galleryContainer.appendChild(noBooks)
    }

    bookList.forEach(book => galleryContainer.appendChild(createBookElement(book)))

}

const fetchBooks = async () => {
    const response = await fetch('https://www.dbooks.org/api/recent').then(async res => await res.json())
    console.log(response.books)
    response?.books.forEach(book => {
        const newBook = new Book({coverUrl: book.image, author: book.authors, title: book.title})
        addBookToLibrary(newBook)
    })
    drawGallery()
}
fetchBooks()
drawGallery()