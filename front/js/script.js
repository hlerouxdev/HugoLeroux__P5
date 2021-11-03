function setArray() {
    return fetch("http://localhost:3000/api/products") //appel à l'api
    .then((response) => response.json()) //promesse
    .then((jsonData) => jsonData) // réponse attendue
    .catch((error) => console.error(error))
}

var shopContainer = document.querySelector(".items")

async function main() {
    const products = await setArray()
    console.log(products)

    for (let elem of products) {
        //Création du lien
        var productContainer = document.createElement('a');
        productContainer.setAttribute('href', `./product.html?id=${elem._id}`);

        //Création de l'article
        var product = document.createElement('article')

        //création de l'image
        var productImage = document.createElement('img')
        productImage.src = (elem.imageUrl)
        productImage.alt = (elem.altTxt)

        //création de titre
        var productTitle = document.createElement('h3')
        productTitle.textContent = (elem.name)

        //création de la description
        var productDesc = document.createElement('p')
        productDesc.textContent =(elem.description)

        product.appendChild(productImage)
        product.appendChild(productTitle)
        product.appendChild(productDesc)
        productContainer.appendChild(product)
        shopContainer.appendChild(productContainer)
    }
}

main()


