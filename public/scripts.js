const deleteUser = document.querySelector('#form-delete')

if (deleteUser) {
    deleteUser.addEventListener('submit', (event) => {
        const confirmation = confirm('Tem certeza que deseja excluir o usuário selecionado?\nEsta ação não poderá ser desfeita.')

        if (!confirmation) {
            event.preventDefault()
        }
    })
}


const Mask = {
    apply(input, func) {
        setTimeout(() => {
            input.value = Mask[func](input.value)
        }, 0);
    },
    formatBRL(value) {
        value = value.replace(/\D/g, "")
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value / 100)
    },
    cpfCnpj(value) {

        value = value.replace(/\D/g, "")

        if (value.length > 11) {
            value = value.replace(/(\d{2})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1/$2")
            value = value.replace(/(\d{4})(\d)/, "$1-$2")

        } else {
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1-$2")
        }

        return value

    },
    cep(value) {

        value = value.replace(/\D/g, "")

        if (value.length > 5) {
            value = value.replace(/(\d{5})/, "$1-")

        }

        return value
        
    }
}

const Validate = {
    apply(input, func) {
        Validate.clearErrors(input)
        results = Validate[func](input.value)
        input.value = results.value

        if (results.error) {
            Validate.displayError(input, results.error)
        }

    },
    displayError(input, error) {
        let div = document.createElement("div")
        div.classList.add("error")
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()
    },
    clearErrors(input){
        const errorDiv = input.parentNode.querySelector(".error")
        if (errorDiv) {
            errorDiv.remove()
        }
    },
    isEmail(value) {
        let error = null

        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat)) {
            error = "Email inválido"
        }

        return {
            error,
            value
        }
    },
    isCpfCnpj(value) {
        let error = null

        const clearValues = value.replace(/\D/g, "")

        if (clearValues.length > 11 && clearValues.length !== 14) {
            error = "CNPJ incorreto"
        } else if (clearValues.length < 12 && clearValues.length !== 11) {
            error = "CPF incorreto"
        }

        return {
            error,
            value
        }
    },
    isCep(value) {
        let error = null

        const clearValues = value.replace(/\D/g, "")

        if (clearValues.length !== 8) {
            error = "CEP incorreto"
        }

        return {
            error,
            value
        }
    }
}

/* !IMPORTANT F5.2 IMAGE */

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files: [],
    handleFileInput(event) {

        const { files: fileList } = event.target

        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {
            PhotosUpload.files.push(file)
            const reader = new FileReader()
            reader.onload = () => {
                const image = new Image() // <img/>
                image.src = String(reader.result)
                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }
            /* Lê o arquivo de imagem em formato blob */
            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Máximo de ${uploadLimit} fotos.`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo") {
                photosDiv.push(item)
            }
        })

        const totalPhotos = fileList.length + photosDiv.length

        if (totalPhotos > uploadLimit) {
            alert(`Máximo de ${uploadLimit} fotos.`)
            event.preventDefault()
            return true
        }
        return false
    },
    getAllFiles() {
        const dataTransfer = new DataTransfer() || new ClipboardEvent("").clipboardData
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))
        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')
        div.onclick = PhotosUpload.removePhoto
        div.appendChild(image)
        div.appendChild(PhotosUpload.getRemoveButton())
        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'close'
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)
        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedImages = document.querySelector('input[name="removed_images"')
            if (removedImages) {
                removedImages.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector(".gallery .highlight > img"),
    preview: document.querySelectorAll(".gallery-preview img"),
    setImage(event) {
        const { target } = event
        ImageGallery.preview.forEach(image => {
            image.classList.remove("active")
        })
        target.classList.add("active")
        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

const Lightbox = {
    target: document.querySelector(".lightbox-target"),
    image: document.querySelector(".lightbox-target img"),
    closeButton: document.querySelector(".lightbox-target a.lightbox-close"),
    open() {
       Lightbox.target.style.opacity = 1
       Lightbox.target.style.top = 0
       Lightbox.target.style.bottom = 0
       Lightbox.closeButton.style.top = 0
    },
    close() {
       Lightbox.target.style.opacity = 0
       Lightbox.target.style.top = "-100%"
       Lightbox.target.style.bottom = "initial"
       Lightbox.closeButton.style.top = "-80px"
    }
}