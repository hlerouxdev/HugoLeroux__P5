
const singleProductImage = document.querySelector('.item__img'); //selection de la class '.item_img'
const singleProductName = document.getElementById('title'); //selection de l'id '#title'
const singleProductPrice = document.getElementById('price'); //selection de l'id '#price'
const singleProductDesc = document.getElementById('description'); //selection de l'id '#description'

const singleProductColors = document.getElementById('colors'); //selection de l'id '#colors'
const singleProductQuantity = document.getElementById('quantity') //selection de l'id '#quantity'
const addToCartButton = document.getElementById('addToCart'); //selection de l'id '#addtocart'

const queryString = window.location.search; //creation d'une constante avec l'url
const urlParams = new URLSearchParams(queryString); //crétion de la recherche de paramètres de l'url
const productId = urlParams.get('id'); //récupération de l'id dans l'url

function findProduct() { //fonction permettant la recherche du produit dans l'api
    return fetch(`http://localhost:3000/api/products/${productId}`) //appel à l'api pour trouver le produit avec son _id
    .then((response) => response.json())
    .then((jsonData) => jsonData) 
    .catch((error) => console.error(error));
};

function createProductContent(x) { //fonction de création/modification des éléments image, title, price et description
    //création de l'image
    const productImage = document.createElement('img')
    productImage.src = (x.imageUrl); //lien vers l'image
    productImage.alt = (x.altTxt); //ajout du texte "alt"

    //ajout du texte dans chaque id
    singleProductName.textContent = (x.name);
    singleProductPrice.textContent = (x.price);
    singleProductDesc.textContent = (x.description);
    //ajout de l'image dans '.item_img'
    singleProductImage.appendChild(productImage);
};

function findProductColors(x) { //fonction permettant de récupérer les couleurs du produit
    for( elem of x.colors) { //boucle passant dans chaque key de l'array colors
        const productColor = document.createElement('option'); //création d'un élément 'option' pour chaque couleur
        productColor.textContent = (elem); //Ajout du texte dans l'élément option

        singleProductColors.appendChild(productColor); //Ajout de l'option dans la div '#colors'
    };
};

async function displaySingleProduct() { //fonction d'affichage de chaque éléments
    const singleProduct = await findProduct(); //récupération des produits via la fontion d'appel pour mettre les données dans un tableau

    createProductContent(singleProduct); //appel de la fonction de création des éléments
    findProductColors(singleProduct); //appel de la fonction d'affichage des couleurs
};

//appel de la fonction d'affichage
displaySingleProduct();

// ----------------------------------------------------------------------FONCTIONS DU PANIER----------------------------------------------------------------------
const messageClient = document.createElement('h2');
const productDiv = document.getElementsByClassName('item__content');
messageClient.style = ('width: 100%;display: flex;justify-content: center;')
productDiv[0].appendChild(messageClient)

function isInCart(array, valueToDetect) { //fonction vérifiant l'existance de l'objet dans un array en regardant son nom
    for (let elem of array) {
      if (elem.name === valueToDetect) {
        return true
        };
    };
    return false
};

function addProduct(array, element, value){ //modifie le panier
    if(value != 0){ //si la quantité est "0" ne fait rien
        array.push(element); //ajout du produit à cart
        localStorage.setItem('cart', JSON.stringify(array)); //création de cart dans le local storage
    };
};

// fonction d'ajout du produit au panier
function addToCart() {
    const colorSelected = singleProductColors.options[singleProductColors.selectedIndex].text; //prend la valeur sélectionnée dans les options de couleur
    const numberSelected = parseInt(singleProductQuantity.value); //prend la quantité sélectionnée dans les options de quantité
    const productName = document.getElementById('title').textContent + ' ' + colorSelected; //création du nom du produit avec le nom et la couleur du canapé

    let cart = localStorage.getItem('cart'); //récupère le panier dans le local storage

    //vérifie qu'une couleur a été selectionnée
    if(colorSelected === '--SVP, choisissez une couleur --') {//empêche l'ajout du produit si une couleur n'est pas selectionnée
        messageClient.innerHTML = ('il faut choisir une couleur')
    } else {
        if(numberSelected > 0) { //la quantité selectionné est supérieur à 0
            let product = {name: productName, _id: productId, color: colorSelected, quantity: numberSelected}; //création d'un produit avec le nom et la couleur du canapé
            //vérifie l'existence du panier
            if(cart) { 
                cart = JSON.parse(cart);
                //vérifie si le produit est dans le panier
                if(isInCart(cart, productName)) { //le produit est déjà dans le panier
                    const index = cart.findIndex(function(i) { //cherche l'index du produit dans le panier
                        return i.name == productName; 
                    });
                    cart[index].quantity += numberSelected; //ajout la quantité sélctionnée à la quantité du produit
                        localStorage.setItem('cart', JSON.stringify(cart)); //met à jour le panier dans le local storage
                        messageClient.innerHTML = ('la quantité a été mise à jour');
                    //le produit n'existe pas dans le panier
                    } else{ //le produit n'existe pas dans le panier
                        addProduct(cart, product, numberSelected);//appel de la fonction d'ajout du produit au panier
                        messageClient.innerHTML = ('le produit a été ajouté');
                    };
                //créé le panier avec l'objet selectionné, sa couleur et sa quantité
                } else{ //le panier n'existe pas
                    let cart = []; //création du panier
                    addProduct(cart, product, numberSelected);// appel de la fonction d'ajout du produit au panier
                    messageClient.innerHTML = ('le produit a été ajouté');
            };
        }  else {
            messageClient.innerHTML = ('la quantité n\'est pas autorisée');
        };
    };
};

//ajout de l'appel de la fonction addToCart au clique sur le bouton Ajouter au panier
addToCartButton.addEventListener("click", addToCart);