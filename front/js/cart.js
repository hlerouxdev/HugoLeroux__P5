let cart = JSON.parse(localStorage.getItem('cart'));
var productSection = document.getElementById('cart__items');

//--------------------------------------------------FONCTIONS D'AFFICHAGE DES PRODUITS--------------------------------------------------

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
        elemName.innerHTML = content; //ajoute le texte
    }
    if(type === 'img'){
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
                productTitle = createElem('h2', productTitlePrice, null,`${elem.name} ${cartElem.color}`,);
                productPrice = createElem('p', productTitlePrice, null, `${elem.price * cartElem.quantity} €`);
                productSettings = createElem('div', productContent, 'cart__item__content__settings');
                productSettingsQuantity = createElem('div', productSettings, 'cart__item__content__settings__quantity', `<p>Qté : </p> <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartElem.quantity}">`);     
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

//--------------------------------------------------FONCTION PRINCIPALE D'APPEL--------------------------------------------------

async function displayProducts() { 
    const products = await setArray(); //récupération des produits via la fontion d'appel pour mettre les données dans un tableau
    displayFinalProducts(products);
    displayTotalProductNumbers();
    getTotalPrice(products);

    //Bouttons 'Supprimer'
    let deleteItemButton = document.querySelectorAll('.deleteItem');
    deleteItemButton.forEach((deleteItem)=>{
        deleteItem.addEventListener('click', function(event) {
            var deleteItemClicked = event.target;
            var itemToDeleteLine = deleteItemClicked.parentElement.parentElement.parentElement.parentElement
            var itemToDeleteTitle = itemToDeleteLine.querySelector('.cart_item_content_titlePrice h2').textContent;
            console.log(itemToDeleteLine);
            for(elem of cart){
                if(elem._id === itemToDeleteLine.getAttribute('data-id') && getLastWord(itemToDeleteTitle) === elem.color) {
                    console.log(elem);
                    // modifyArray(cart.indexOf(elem), cart, 'remove');
                    console.log('le produit a été retiré du panier');
                    productSection.remove(itemToDeleteLine);
                };
            };
            getTotalPrice(products);
        });
    });

    //Champ de saisie de la quantité
    let quantityOption = document.querySelectorAll('.itemQuantity');
    // console.log(quantityOption)
    quantityOption.forEach((changeQuantity)=>{
        changeQuantity.addEventListener('udpate', function(event) { 
            console.log(quantityOption.value)
        });
    });
}

displayProducts();

//--------------------------------------------------FONCTIONS D'AJOUT ET DE SUPPRESSION DES PRODUITS--------------------------------------------------

function modifyArray(element, array, remove) {
    if (remove) {
        array.splice(element, 1); //retrait du produit à cart
    } else {
        array.push(element); //ajout du produit à cart
    }
    localStorage.setItem('cart', JSON.stringify(array)); //création de cart dans le local storage
    console.log('la quantité du produit a été mise à jour');
}

function getLastWord(string) {
    var n = string.split(" ");
    return n[n.length - 1];
    }

//--------------------------------------------------FONCTIONS D'ENVOIE DU FORMULAIRE--------------------------------------------------

