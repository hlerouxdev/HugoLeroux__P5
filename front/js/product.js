
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

// ----------------------------------------------------------------------Fonctions du Panier----------------------------------------------------------------------

function isInCart(array, valueToDetect) { //fonction vérifiant l'existance de l'objet dans un array en regardant son nom
    for (let elem of array) {
      if (elem.name === valueToDetect) {
        return true
        }
    }
    return false
}

function addProduct(array, element, value){ //modifie le panier
    if(value === 0){
        console.log('il faut choisir une quantité');
    } else{
        array.push(element); //ajout du produit à cart
        localStorage.setItem('cart', JSON.stringify(array)); //création de cart dans le local storage
        console.log('la quantité du produit a été mise à jour');
    }
}

// fonction d'ajout du produit au panier
function addToCart() {
    var colorSelected = singleProductColors.options[singleProductColors.selectedIndex].text; //prend la valeur sélectionnée dans les options de couleur
    let numberSelected = parseInt(singleProductQuantity.value); //prend la quantité sélectionnée dans les options de quantité
    var productName = document.getElementById('title').textContent + ' ' + colorSelected; //création du nom du produit avec le nom et la couleur du canapé
    let cart = localStorage.getItem('cart'); //récupère le panier dans le local storage

    //vérifie qu'une couleur a été selectionnée
    if(colorSelected === '--SVP, choisissez une couleur --') {//empêche l'ajout du produit si une couleur n'est pas selectionnée
        console.log('il faut choisir une couleur')
    } else {
        let product = {name: productName, _id: productId, color: colorSelected, quantity: numberSelected}; //création d'un produit avec le nom et la couleur du canapé
        //vérifie l'existence du panier
        if(cart) { 
            cart = JSON.parse(cart);
            //vérifie si le produit est dans le panier
            if(isInCart(cart, productName)) { 
                console.log("ce produit existe dans le panier");
                var index = cart.findIndex(function(i) { //cherche l'index du produit dans le panier
                    return i.name == productName
                });
                if(numberSelected === 0) { // Si le champ de quantité a été remis à 0, retire le produit du panier
                    console.log('la quantité selectionné est 0');
                    cart.splice(index, 1); //enlève l'index du produit dans panier
                    localStorage.setItem('cart', JSON.stringify(cart)); //met à jour le panier dans le local storage
                    console.log('le produit a été retiré');
                } else{
                    cart[index].quantity = numberSelected; //modifie la quantité du produit
                    localStorage.setItem('cart', JSON.stringify(cart)); //met à jour le panier dans le local storage
                    console.log('la quantité du produit a été mise à jour');
                }
            //le produit n'existe pas dans le panier
            } else{
                console.log("ce produit n'existe pas dans ce panier");
                addProduct(cart, product, numberSelected);//appel de la fonction d'ajout du produit au panier
            }
        //créé le panier avec l'objet selectionné, sa couleur et sa quantité
        } else{ 
            let cart = []; //création du panier
            console.log('le panier a été créé');
            addProduct(cart, product, numberSelected);// appel de la fonction d'ajout du produit au panier
        }
    }
}

//ajout de l'appel de la fonction addToCart au clique sur le bouton Ajouter au panier
addToCartButton.addEventListener("click", addToCart);
