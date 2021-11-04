
var singleProductImage = document.querySelector('.item__img'); //selection de la class '.item_img'
var singleProductName = document.querySelector('#title'); //selection de l'id '#title'
var singleProductPrice = document.querySelector('#price'); //selection de l'id '#price'
var singleProductDesc = document.querySelector('#description'); //selection de l'id '#description'
var singleProductColors = document.querySelector('#colors')

function findProduct() { //fonction permettant la recherche du produit dans l'api
    const queryString = window.location.search; //creation d'une constante avec l'url
    const urlParams = new URLSearchParams(queryString); //crétion de la recherche de paramètres de l'url
    const productId = urlParams.get('id') //récupération de l'id dans l'url

    return fetch(`http://localhost:3000/api/products/${productId}`) //appel à l'api pour trouver le produit avec son _id
    .then((response) => response.json()) 
    .then((jsonData) => jsonData) 
    .catch((error) => console.error(error)) 
}

function creatProductContent() {
    //création de l'image
    var productImage = document.createElement('img')
    productImage.src = (singleProduct.imageUrl)
    productImage.alt = (singleProduct.altTxt)

    //ajout du texte dans chaque id
    singleProductName.textContent = (singleProduct.name)
    singleProductPrice.textContent = (singleProduct.price)
    singleProductDesc.textContent = (singleProduct.description)
    //ajout de l'image dans '.item_img'
    singleProductImage.appendChild(productImage)
}

function findProductColors() { //fonction permettant de récupérer les couleurs du produit
    for( elem of singleProduct.colors) { //boucle passant dans chaque key de l'array colors
        var productColor = document.createElement('option')
        productColor.textContent = (elem)

        singleProductColors.appendChild(productColor)
    }
}

async function displaySingleProduct() { //fonction d'affichage de chaque éléments
    const singleProduct = await findProduct(); //récupération des produits via la fontion d'appel pour mettre les données dans un tableau
    console.log(singleProduct);

    //création de l'image
    var productImage = document.createElement('img')
    productImage.src = (singleProduct.imageUrl)
    productImage.alt = (singleProduct.altTxt)

    //ajout du texte dans chaque id
    singleProductName.textContent = (singleProduct.name)
    singleProductPrice.textContent = (singleProduct.price)
    singleProductDesc.textContent = (singleProduct.description)
    //ajout de l'image dans '.item_img'
    singleProductImage.appendChild(productImage)

    for( elem of singleProduct.colors) { //boucle passant dans chaque key de l'array colors
        var productColor = document.createElement('option')
        productColor.textContent = (elem)

        singleProductColors.appendChild(productColor)
    }
}

//appel de la fonction d'affichage
displaySingleProduct()
    