function setArray() {
    return fetch("http://localhost:3000/api/products") //appel à l'api
    .then((response) => response.json()) //promesse
    .then((jsonData) => jsonData) // réponse attendue
    .catch((error) => console.error(error))
}

// sélection de la class ".item" pour y mettre les élements
var shopContainer = document.querySelector(".items")

async function main() { 
    const products = await setArray() //récupération des produits via la fontion d'appel pour mettre les données dans un tableau
    console.log(products)

    for (let elem of products) { //fonction de création des liens pour qhaque produit
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

        //Ajout de chaque élément dans l'article
        product.appendChild(productImage)
        product.appendChild(productTitle)
        product.appendChild(productDesc)
        //ajout de l'article dans le lien
        productContainer.appendChild(product)
        //ajout du ien dans la classe ".items"
        shopContainer.appendChild(productContainer)
    }
}

// appel de la fonction main
main()


