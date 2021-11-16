let cart = JSON.parse(localStorage.getItem('cart'));
var productSection = document.getElementById('cart__items');

//fonction permettant d'afficher le nombres total de produits
function displayTotalProductNumbers() { 
    var totalProductNumbers = document.getElementById('totalQuantity'); // sélection de l'element '#totalQuantity'
    var totalQuantity = 0; //création du chiffre qui sera affiché dans '#totalQuantity'
    for(elem of cart) { //boucle dans cart
        if(elem.quantity != 0) { //n'éxecuter que si la quantité du produit n'est pas 0
            var tempProductQuantity = elem.quantity; //création d'une quantité temporaire pour chaque produit
            totalQuantity += tempProductQuantity; //ajout de cette quantité temporaire à la quantité total
        }
    }
    totalProductNumbers.textContent = totalQuantity; //changement du texte de '#totalQuantity'
}

function createElem(type, content, parent, className) { //fonction d'ajout d'élément
    var elemName = document.createElement(type) //créé la variable
    if (className) {
        elemName.setAttribute('class', className); //ajoute le classe si il y en a une
    }
    elemName.innerText = content; //ajoute le texte
    parent.appendChild(elemName); //ajoute l'élément à son parent
    return elemName
}

//fonction d'affichage des produits du panier
function displayFinalProducts(array) {
    for(elem of array) {
        for(cartElem of cart) {
            if(cartElem._id === elem._id) { //vérifie si le produit de cart à le même _id que dans products
                var productContainer = createElem('article', null, productSection, 'cart__item');
                productContainer.setAttribute('data-id', cartElem._id);
                var productImageDiv = createElem('div', null, productContainer, 'cart__item__img');
                var productImage = createElem('img', null, productImageDiv);
                productImage.src = (elem.imageUrl);
                productImage.alt = (elem.altTxt);
                var productContent = createElem('div', null, productContainer, 'cart_item_content');
                var productTitlePrice = createElem('div', null, productContent);
                productTitlePrice.setAttribute('class', 'cart_item_content_titlePrice');
                var productTitle = createElem('h2', elem.name, productTitlePrice);
                var productPrice = createElem('p', `${elem.price} €`, productTitlePrice);
                var productColor = createElem('p', cartElem.color, productTitle);
                var productSettings = createElem('div', null, productContent, 'cart__item__content__settings');
                var productSettingsQuantity = createElem('div', null, productSettings, 'cart__item__content__settings__quantity');
                productSettingsQuantity.innerHTML += `<p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartElem.quantity}">`;        
                var productSettingsDelete = createElem('div', null, productSettings, 'cart__item__content__settings__delete');
                var productDelete = createElem('p', 'Supprimer', productSettingsDelete, 'deleteItem');
            }
        }
    }
}

function getTotalPrice(array) {
    var totalPrice = document.getElementById('totalPrice');
    var totalPriceNumber = 0;
    for(cartElem of cart) {
        for(elem of array) {
            if(cartElem._id === elem._id) {
                productPrice = cartElem.quantity * elem.price;
                totalPriceNumber += productPrice;
            }
        }
    }
    totalPrice.textContent = totalPriceNumber;
}

function setArray() {
    return fetch("http://localhost:3000/api/products") //appel à l'api
    .then((response) => response.json())
    .then((jsonData) => jsonData) 
    .catch((error) => console.error(error));
}

async function displayProducts() { 
    const products = await setArray(); //récupération des produits via la fontion d'appel pour mettre les données dans un tableau
    displayFinalProducts(products);
    displayTotalProductNumbers();
    getTotalPrice(products);
}

displayProducts();