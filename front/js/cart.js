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

//fonction d'ajout d'élément
function createElem(type, parent, className, content) { 
    var elemName = document.createElement(type); //créé la variable
    if (className) {
        elemName.setAttribute('class', className); //ajoute le classe si il y en a une
    }
    if (content) {
        elemName.innerText = content; //ajoute le texte
    }
    if(type = 'img'){
        elemName.src = (elem.imageUrl);
        elemName.alt = (elem.altTxt);
    }
    parent.appendChild(elemName); //ajoute l'élément à son parent
    return elemName;
}

//fonction d'affichage des produits du panier
function displayFinalProducts(array) {
    for(elem of array) {
        for(cartElem of cart) {
            if(cartElem._id === elem._id) { //vérifie si le produit de cart à le même _id que dans products
                productContainer = createElem('article', productSection, 'cart__item');
                productContainer.setAttribute('data-id', cartElem._id);
                productImageDiv = createElem('div', productContainer, 'cart__item__img');
                productImage = createElem('img', productImageDiv);
                productContent = createElem('div', productContainer, 'cart_item_content');
                productTitlePrice = createElem('div', productContent, 'cart_item_content_titlePrice');
                productTitle = createElem('h2', productTitlePrice, null,elem.name,);
                productPrice = createElem('p', productTitlePrice, null, `${elem.price} €`);
                productColor = createElem('p', productTitle, null, cartElem.color);
                productSettings = createElem('div', productContent, 'cart__item__content__settings');
                productSettingsQuantity = createElem('div', productSettings, 'cart__item__content__settings__quantity');
                productSettingsQuantity.innerHTML += `<p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartElem.quantity}">`;        
                productSettingsDelete = createElem('div', productSettings, 'cart__item__content__settings__delete');
                productDelete = createElem('p', productSettingsDelete, 'deleteItem', 'Supprimer');
            }
        }
    }
}

//fonction de calcul et d'affichage du prix total
function getTotalPrice(array) {
    var totalPrice = document.getElementById('totalPrice');
    var totalPriceNumber = 0; //créé le prix total
    //boucle dans cart puis dans product pour chaque élément de cart
    for(cartElem of cart) {
        for(elem of array) {
            if(cartElem._id === elem._id) { //la fonction ne s'exécute que si l'_id de cart est le même que dans products
                productPrice = cartElem.quantity * elem.price; // multiplie la quantité dans cart par le prix dans products
                totalPriceNumber += productPrice; // ajoute le prix multiplié au prix total
            }
        }
    }
    totalPrice.textContent = totalPriceNumber; //modifie le texte de #totalPrice par le prix total final
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