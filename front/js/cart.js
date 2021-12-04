const pageUrl = window.location.href; //creation d'une constante avec l'url
let cart = JSON.parse(localStorage.getItem('cart')); //récupère cart dans le localStorage

if(pageUrl.includes('cart.html')){ //lance le code sur la page cart.html

//--------------------------------------------------FONCTIONS D'AFFICHAGE DES PRODUITS--------------------------------------------------
    var productSection = document.getElementById('cart__items'); //récupère l'id "cart__items"

    //fonction permettant d'afficher le nombres total de produits
    function displayTotalProductNumbers() {
        var totalProductNumbers = document.getElementById('totalQuantity'); // sélection de l'element '#totalQuantity'
        var totalQuantity = 0; //création du chiffre qui sera affiché dans '#totalQuantity'
        for(elem of cart) { //boucle dans cart
            if(elem.quantity != 0) { //n'éxecuter que si la quantité du produit n'est pas 0
                var tempProductQuantity = parseInt(elem.quantity); //création d'une quantité temporaire pour chaque produit
                totalQuantity += tempProductQuantity; //ajout de cette quantité temporaire à la quantité total
            };
        };
        totalProductNumbers.textContent = totalQuantity; //changement du texte de '#totalQuantity'
    };

    //fonction d'ajout d'élément
    function createElem(type, parent, className, content) { 
        var elemName = document.createElement(type); //créé la variable
        if (className) {
            elemName.setAttribute('class', className); //ajoute le classe si il y en a une
        };
        if (content) {
            elemName.innerHTML = content; //ajoute le texte
        };
        if(type === 'img'){ // lignes à ajouter si l'élément est une image
            elemName.src = (elem.imageUrl);
            elemName.alt = (elem.altTxt);
        };
        parent.appendChild(elemName); //ajoute l'élément à son parent
        return elemName;
    };

    //fonction d'affichage des produits du panier
    function displayFinalProducts(array) {
        for(elem of array) {
            for(cartElem of cart) {
                if(cartElem._id === elem._id) { //vérifie si le produit de cart à le même _id que dans products
                    productContainer = createElem('article', productSection, 'cart__item');
                    productContainer.setAttribute('data-id', cartElem._id);
                    productImageDiv = createElem('div', productContainer, 'cart__item__img');
                    productImage = createElem('img', productImageDiv);
                    productContent = createElem('div', productContainer, 'cart__item__content');
                    productTitlePrice = createElem('div', productContent, 'cart__item__content__titlePrice');
                    productTitle = createElem('h2', productTitlePrice, null,cartElem.name);
                    productPrice = createElem('p', productTitlePrice, null, `${elem.price * cartElem.quantity} €`);
                    productSettings = createElem('div', productContent, 'cart__item__content__settings');
                    productSettingsQuantity = createElem('div', productSettings, 'cart__item__content__settings__quantity', `<p>Qté : </p> <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartElem.quantity}">`);     
                    productSettingsDelete = createElem('div', productSettings, 'cart__item__content__settings__delete');
                    productDelete = createElem('p', productSettingsDelete, 'deleteItem', 'Supprimer');
                };
            };
        };
    };

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
                };
            };
        };
        totalPrice.textContent = totalPriceNumber; //modifie le texte de #totalPrice par le prix total final
    };

    function setArray() {
        return fetch("http://localhost:3000/api/products") //appel à l'api
        .then((response) => response.json())
        .then((jsonData) => jsonData) 
        .catch((error) => console.error(error));
    };

    //--------------------------------------------------FONCTIONS D'AJOUT ET DE SUPPRESSION DES PRODUITS--------------------------------------------------

    //fonction modifiant le panier dans le local storage
    function modifyArray(element, array, value) {
        if (value === 'remove') {
            array.splice(element, 1); //retrait du produit à cart
        } else {
            element.quantity = value; //modifie la quantité su produit
        };
        localStorage.setItem('cart', JSON.stringify(array)); //création de cart dans le local storage
    };

    //fonction permettant de récupérer le dernier mot utilisée pour connaitre la couleur du produit
    function getLastWord(string) {
        var n = string.split(' ');
        return n[n.length - 1]; //regarde le dernier mot de la string
    };

    //--------------------------------------------------FONCTION PRINCIPALE D'APPEL A L'API--------------------------------------------------

    async function displayProducts() { //fonction d'appel à l'api
        const products = await setArray(); //récupération des produits via la fontion d'appel pour mettre les données dans un tableau
        displayFinalProducts(products); //appel de la fonction d'affichage des produits
        displayTotalProductNumbers(); //appel de la fonction d'affichage du nombre de produits
        getTotalPrice(products); //appel de la fonction de calcul et d'affichage du prix total

        //Bouttons 'Supprimer'
        let deleteItemButton = document.querySelectorAll('.deleteItem');
        deleteItemButton.forEach((deleteItem)=>{
            deleteItem.addEventListener('click', function(e) { //action au click sur la class '.deleteItem'
                var deleteItemClicked = e.target; //récupère l'élément cliqué
                var itemToDeleteLine = deleteItemClicked.parentElement.parentElement.parentElement.parentElement //récupère la ligne à supprimer
                var itemToDeleteTitle = itemToDeleteLine.querySelector('.cart__item__content__titlePrice h2').textContent; //récupère le nom de l'élément
                for(elem of cart){
                    if(elem._id === itemToDeleteLine.getAttribute('data-id') && getLastWord(itemToDeleteTitle) === elem.color) { //retire l'élément du panier si son id et sa couleur correspondent à l'élément cliqué
                        modifyArray(cart.indexOf(elem), cart, 'remove'); //retire l'élément de cart
                        itemToDeleteLine.remove(); //retire la ligne du DOM
                        displayTotalProductNumbers(); //appel de la fonction d'affichage du nombre de produits
                        getTotalPrice(products); //appel de la fonction de calcul et d'affichage du prix total
                    };
                };
            });
        });

        //Champ de saisie de la quantité
        let quantityOption = document.querySelectorAll('.itemQuantity');
        quantityOption.forEach((changeQuantity)=>{
            changeQuantity.addEventListener('change', function(e) { 
                var itemToModifyLine = e.target.parentElement.parentElement.parentElement.parentElement
                var itemToModifyTitle = itemToModifyLine.querySelector('.cart__item__content__titlePrice h2').textContent;
                for(elem of cart){
                    if(elem._id === itemToModifyLine.getAttribute('data-id') && getLastWord(itemToModifyTitle) === elem.color) {
                        modifyArray(elem, cart, e.target.value) //change la quantité de l'élément dans cart
                        for(elemProducts of products){
                            if(elemProducts._id === elem._id){
                                var productPrice = itemToModifyLine.querySelector('.cart__item__content__titlePrice p')
                                productPrice.textContent = elem.quantity * elemProducts.price + ' €' //change le prix du produit
                            }
                        }
                        displayTotalProductNumbers(); //appel de la fonction d'affichage du nombre de produits
                        getTotalPrice(products); //appel de la fonction de calcul et d'affichage du prix total
                    };
                };
            });
        });
    }

    displayProducts(); //appel de la fonction displayProducts

    //--------------------------------------------------FONCTIONS D'ENVOIE DU FORMULAIRE--------------------------------------------------

    let form = document.getElementsByClassName('cart__order__form');
    let formInputs = form[0].getElementsByTagName('input'); //ici formInputs est une liste déléments du DOM. Chaque élément est un champ du formulaire

    //fonction de vérification de validité des champs du formulaire
    function checkOptions(){
        var error = false
        var firstNameError = document.getElementById('firstNameErrorMsg');
        var lastNameError = document.getElementById('lastNameErrorMsg')
        var emailError = document.getElementById('emailErrorMsg')
        if(/\d/.test(formInputs[0].value)){ //vérifie si le champ "firstName"
            firstNameError.textContent = 'ce champ ne doit pas contenir de chiffres';
            error = true
        }else{
            firstNameError.textContent = null;
        }
        if(/\d/.test(formInputs[1].value)){ //vérifie si le champ "lastName"
            lastNameError.textContent = 'ce champ ne doit pas contenir de chiffres';
            error = true
        }else{
            lastNameError.textContent = null;
        }
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formInputs[4].value)){ //vérifie si le champ "email"
            emailError.textContent = null;
        }else{
            emailError.textContent = 'l\'addresse mail n\'est pas valide';
            error = true
        };
        return !error //n'est vrai que si toutes les condidions sont remplis
    };

    //vérifie que les champs ne soient pas vides
    function checkEmpty(){
        for(let elem of formInputs){
            if(elem.value != null){
                return true
            }
            else {
                return false
            }
        };
    };

    //fonction de création du panier final et d'ajout d'élément à ce dernier
    function createFinalCart() {
        for(let cartElem of cart){
            if(finalCart){
                if(isInCart(finalCart, cartElem._id)){
                }
                else{
                    finalCart.push(cartElem._id);
                };
            }
            else{
                var finalCart = [cartElem._id];
            };
        };
        return finalCart;
    };

    //fonction vérifiant l'existance de l'objet dans un array en regardant son nom
    function isInCart(array, valueToDetect) { 
        for (let elem of array) {
        if (elem === valueToDetect) {
            return true
            }
        };
        return false
    };

    //fonction d'envoie du formulaire
    form[0].addEventListener('submit', async function(e){
        e.preventDefault()
        if (cart === [] || cart === null) { //si le panier est vide ou si il n'existe pas ne fait rien
        } else {
            if(checkOptions() && checkEmpty()){
                finalCart = createFinalCart();
                let clientOrder = { //objet devant être onvoyé à l'api
                    'contact': { firstName: formInputs[0].value, lastName: formInputs[1].value, address: formInputs[2].value, city: formInputs[3].value, email: formInputs[4].value}, //contact du client
                    'products': finalCart}; //panier final
                var orderId = await send(clientOrder); //envoie de clientOrder à l'api avec l'orderId en réponse
                window.location.href = `confirmation.html?orderId=${orderId}`; //redirige vers la page confirmation
            };
        };
    });
};

//fonction d'envoie de la commande
async function send(submitContent) {
    const response = await fetch("http://localhost:3000/api/products/order", { //fetch vers l'api
    method: "POST",
    headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(submitContent) //envoie du body
    })
    const res = await response.json(); // attend la récupération de la réponse
    return res.orderId; // retourne l'orderId dans la réponse
};

//--------------------------------------------------FONCTIONS D'AFFICHAGE DE L'ORDERID--------------------------------------------------

if(pageUrl.includes('confirmation.html')){ //lance le code sur la page confirmation.html
    var orderIdField = document.getElementById('orderId');
    const queryString = window.location.search; //creation d'une constante avec l'url
    const urlParams = new URLSearchParams(queryString); //crétion de la recherche de paramètres de l'url
    const ordertId = urlParams.get('orderId'); //récupération de l'orderId dans l'url
    orderIdField.textContent = ordertId; //ajout de l'orderId dans le champ de text
};