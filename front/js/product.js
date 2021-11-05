
var singleProductImage = document.querySelector('.item__img'); //selection de la class '.item_img'
var singleProductName = document.querySelector('#title'); //selection de l'id '#title'
var singleProductPrice = document.querySelector('#price'); //selection de l'id '#price'
var singleProductDesc = document.querySelector('#description'); //selection de l'id '#description'
var singleProductColors = document.querySelector('#colors'); //selection de l'id '#colors'

var addToCartButton = document.querySelector('#addToCart'); //selection de l'id '#addtocart'

function findProduct() { //fonction permettant la recherche du produit dans l'api
    const queryString = window.location.search; //creation d'une constante avec l'url
    const urlParams = new URLSearchParams(queryString); //crétion de la recherche de paramètres de l'url
    const productId = urlParams.get('id'); //récupération de l'id dans l'url

    return fetch(`http://localhost:3000/api/products/${productId}`) //appel à l'api pour trouver le produit avec son _id
    .then((response) => response.json())
    .then((jsonData) => jsonData) 
    .catch((error) => console.error(error));
}

function createProductContent(x) { //fonction de création/modification des éléments image, title, price et description
    //création de l'image
    var productImage = document.createElement('img')
    productImage.src = (x.imageUrl); //lien vers l'image
    productImage.alt = (x.altTxt); //ajout du texte "alt"

    //ajout du texte dans chaque id
    singleProductName.textContent = (x.name);
    singleProductPrice.textContent = (x.price);
    singleProductDesc.textContent = (x.description);
    //ajout de l'image dans '.item_img'
    singleProductImage.appendChild(productImage);
}

function findProductColors(x) { //fonction permettant de récupérer les couleurs du produit
    for( elem of x.colors) { //boucle passant dans chaque key de l'array colors
        var productColor = document.createElement('option'); //création d'un élément 'option' pour chaque couleur
        productColor.textContent = (elem); //Ajout du texte dans l'élément option

        singleProductColors.appendChild(productColor); //Ajout de l'option dans la div '#colors'
    }
}

async function displaySingleProduct() { //fonction d'affichage de chaque éléments
    const singleProduct = await findProduct(); //récupération des produits via la fontion d'appel pour mettre les données dans un tableau

    createProductContent(singleProduct); //appel de la fonction de création des éléments
    findProductColors(singleProduct); //appel de la fonction d'affichage des couleurs
}

//appel de la fonction d'affichage
displaySingleProduct();
    
function addProductQuantity(){ //fonction d'ajout d'un produit dans le local storage
    let productQuantity = localStorage.getItem('cartNumbers')
    productQuantity = parseInt(productQuantity)
    
    if (productQuantity) {
        localStorage.setItem('cartNumbers', productQuantity + 1)
    }
    else {
        localStorage.setItem('cartNumbers', 1)
    }
}

addToCartButton.addEventListener("click", addProductQuantity);