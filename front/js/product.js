
const queryString = window.location.search; //creation d'une constante avec l'url
const productID = queryString.split('=').pop();  //séparation de l'url pour n'avoir que l'_id du produit
console.log(productID);

var singleProductImage = document.querySelector('.item__img'); //selection de la class '.item_img'
var singleProductName = document.querySelector('#title'); //selection de l'id '#title'
var singleProductPrice = document.querySelector('#price'); //selection de l'id '#price'
var singleProductDesc = document.querySelector('#description'); //selection de l'id '#description'

function findProduct() {
    return fetch(`http://localhost:3000/api/products/${productID}`) //appel à l'api pour trouver le produit avec son _id
    .then((response) => response.json()) 
    .then((jsonData) => jsonData) 
    .catch((error) => console.error(error)) 
}

async function displaySingleProduct() {
    const singleProduct = await findProduct(); //récupération des produits via la fontion d'appel pour mettre les données dans un tableau
    console.log(singleProduct);

    //création de l'image
    var productImage = document.createElement('img')
    productImage.src = (singleProduct.imageUrl)
    productImage.alt = (singleProduct.altTxt)

    singleProductName.textContent = (singleProduct.name)
    singleProductPrice.textContent = (singleProduct.price)
    singleProductDesc.textContent = (singleProduct.description)
    singleProductImage.appendChild(productImage)
}

displaySingleProduct()
    