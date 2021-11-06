
var singleProductImage = document.querySelector('.item__img'); //selection de la class '.item_img'
var singleProductName = document.getElementById('title'); //selection de l'id '#title'
var singleProductPrice = document.getElementById('price'); //selection de l'id '#price'
var singleProductDesc = document.getElementById('description'); //selection de l'id '#description'

var singleProductColors = document.getElementById('colors'); //selection de l'id '#colors'
var singleProductQuantity = document.getElementById('quantity') //selection de l'id '#quantity'
var addToCartButton = document.getElementById('addToCart'); //selection de l'id '#addtocart'

const queryString = window.location.search; //creation d'une constante avec l'url
const urlParams = new URLSearchParams(queryString); //crétion de la recherche de paramètres de l'url
const productId = urlParams.get('id'); //récupération de l'id dans l'url

function findProduct() { //fonction permettant la recherche du produit dans l'api
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
    let productsQuantity = localStorage.getItem('productsInCart')
    productsQuantity = parseInt(productsQuantity)
    
    if (productsQuantity) {
        localStorage.setItem('productsInCart', productsQuantity + 1)
    }
    else {
        localStorage.setItem('productsInCart', 1)
    }
}

function addSingleProduct() { //fonction d'ajout d'un produit distinct dans le panier
    var colorSelected = singleProductColors.options[singleProductColors.selectedIndex].text; //prend la valeur sélectionnée dans les options de couleur
    let numberSelected = singleProductQuantity.value; //prend la quantité sélectionnée dans les options de quantité
    
    console.log(colorSelected)
    console.log(numberSelected)

    let product = { id: productId, color: colorSelected, quantity: numberSelected }; //créé un objet avec le produit sélectionné
    console.log(product);
    let cart = []
    cart.push(product)

    console.log(cart)
}

addToCartButton.addEventListener("click", addSingleProduct);

