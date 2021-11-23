let cart = JSON.parse(localStorage.getItem('cart'));
var productSection = document.getElementById('cart__items');

//--------------------------------------------------FONCTIONS D'AFFICHAGE DES PRODUITS--------------------------------------------------

//fonction permettant d'afficher le nombres total de produits
function displayTotalProductNumbers() {
    var totalProductNumbers = document.getElementById('totalQuantity'); // sélection de l'element '#totalQuantity'
    var totalQuantity = 0; //création du chiffre qui sera affiché dans '#totalQuantity'
    for(elem of cart) { //boucle dans cart
        if(elem.quantity != 0) { //n'éxecuter que si la quantité du produit n'est pas 0
            var tempProductQuantity = parseInt(elem.quantity); //création d'une quantité temporaire pour chaque produit
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
    // let cartItems = document.getElementsByClassName('cart_item');
    // console.log(cartItems)
    deleteItemButton.forEach((deleteItem)=>{
        deleteItem.addEventListener('click', function(event) {
            var deleteItemClicked = event.target;
            var itemToDeleteLine = deleteItemClicked.parentElement.parentElement.parentElement.parentElement
            var itemToDeleteTitle = itemToDeleteLine.querySelector('.cart_item_content_titlePrice h2').textContent;
            console.log(itemToDeleteLine);
            for(elem of cart){
                if(elem._id === itemToDeleteLine.getAttribute('data-id') && getLastWord(itemToDeleteTitle) === elem.color) {
                    console.log(elem);
                    modifyArray(cart.indexOf(elem), cart, 'remove');
                    console.log('le produit a été retiré du panier');
                    itemToDeleteLine.remove();
                    displayTotalProductNumbers();
                    getTotalPrice(products);
                };
            };
        });
    });

    //Champ de saisie de la quantité
    let quantityOption = document.querySelectorAll('.itemQuantity');
    // console.log(quantityOption)
    quantityOption.forEach((changeQuantity)=>{
        changeQuantity.addEventListener('change', function(e) { 
            var itemToModifyLine = e.target.parentElement.parentElement.parentElement.parentElement
            var itemToModifyTitle = itemToModifyLine.querySelector('.cart_item_content_titlePrice h2').textContent;
            // console.log(e.target.parentElement.parentElement.parentElement.parentElement)
            // console.log(e.target.value)
            for(elem of cart){
                if(elem._id === itemToModifyLine.getAttribute('data-id') && getLastWord(itemToModifyTitle) === elem.color) {
                    console.log(elem);
                    modifyArray(elem, cart, e.target.value)
                    console.log('la quantité du produit a été modifiée');
                    for(elemProducts of products){
                        if(elemProducts._id === elem._id){
                            var productPrice = itemToModifyLine.querySelector('.cart_item_content_titlePrice p')
                            productPrice.textContent = elem.quantity * elemProducts.price + ' €'
                        }
                    }
                    displayTotalProductNumbers();
                    getTotalPrice(products);
                };
            };
        });
    });
}

displayProducts();

//--------------------------------------------------FONCTIONS D'AJOUT ET DE SUPPRESSION DES PRODUITS--------------------------------------------------

function modifyArray(element, array, value) {
    if (value === 'remove') {
        array.splice(element, 1); //retrait du produit à cart
    } else {
        element.quantity = value; //modifie la quantité su produit
    }
    localStorage.setItem('cart', JSON.stringify(array)); //création de cart dans le local storage
    console.log('la quantité du produit a été mise à jour');
}

function getLastWord(string) {
    var n = string.split(" ");
    return n[n.length - 1];
    }

//--------------------------------------------------FONCTIONS D'ENVOIE DU FORMULAIRE--------------------------------------------------

// let form = document.getElementsByClassName('cart__order__form');
// let formInputs = form[0].getElementsByTagName('input');
// let sendButton = document.getElementById('order');
// console.log(form);
// console.log(formInputs);


// function CheckString(input, type, value){
//     if(type === 'n') {
//         let _string = String(input);
//         for(let i = 0; i < _string.length; i++){
//             if(!isNaN(_string.charAt(i))){
//             return true;
//             }
//         }
//         return false;
//     }
//     if(type === 'text') {
//         if(input.includes(value)){
//             return true;
//         }
//         return false;
//     }
//   };

// function checkOptions(){
//     var firstNameError = document.getElementById('firstNameErrorMsg');
//     var lastNameError = document.getElementById('lastNameErrorMsg')
//     var emailInput = formInputs[4].value
//     var emailError = document.getElementById('emailErrorMsg')
//     if(stringHasNumber(formInputs[0].value)){
//         firstNameError.textContent = 'ce champ ne doit pas contenir de chiffres';
//         return false;
//     } 
//     else {
//         if(stringHasNumber(formInputs[1].value)){
//             lastNameError.textContent = 'ce champ ne doit pas contenir de chiffres';
//             return false;
//         }
//         else {
//             if(emailInput.prototype.includes('@')){
//                 return true;
//             }
//             else {
//                 emailError.textContent = 'l\'addresse mail n\'est pas valide'
//                 return false;
//             }
//         }
//     };
// };

// sendButton.addEventListener('click', function(){
//     if (cart === [] || cart === null) {
//         console.log('le panier est vide')
//     } else {
//         checkOptions();
//         if(checkOptions()){
//             console.log('le panier peut être envoyé à l\'api')
//         }
//     };
//     // console.log(typeof(formInputs[0].value))
//     // console.log(formInputs[0].value)
//     // console.log(typeof(formInputs[1].value))
//     // console.log(formInputs[1].value)
//     // console.log(stringHasNumber(formInputs[0].value))
//     // console.log(stringHasNumber(formInputs[1].value))
// });