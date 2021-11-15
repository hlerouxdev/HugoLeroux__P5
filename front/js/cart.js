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

function displayFinalProducts(array) {
    for(elem of cart) {
        if(elem.quantity != 0){

            var productContainer = document.createElement('article');
            productContainer.setAttribute('class', 'cart__item');
            productContainer.setAttribute('data-id', elem._id);

            var productImageDiv = document.createElement('div');
            productImageDiv.setAttribute('class', 'cart__item__img');

            var productContent = document.createElement('div');
            productContent.setAttribute('class', 'cart_item_content');

            var productTitlePrice = document.createElement('div');
            productTitlePrice.setAttribute('class', 'cart_item_content_titlePrice');

            var productTitle = document.createElement('h2');
            productTitle.textContent = elem.name;

            var productSettings = document.createElement('div');
            productSettings.setAttribute('class', 'cart__item__content__settings');

            var productSettingsQuantity = document.createElement('div');
            productSettingsQuantity.setAttribute('class', 'cart__item__content__settings__quantity');
            productSettingsQuantity.innerHTML += `<p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${elem.quantity}">`;

            var productSettingDelete = document.createElement('div');
            productSettingDelete.setAttribute('class', 'cart__item__content__settings__delete');
            var productDelete = document.createElement('p');
            productDelete.setAttribute('class', 'deleteItem');
            productDelete.innerText = 'Supprimer';
        
            var tempProductId = elem._id;
            for(elem of array) {
                if(elem._id === tempProductId) {

                    var productImage = document.createElement('img');
                    productImage.src = (elem.imageUrl);
                    productImage.alt = (elem.altTxt);

                    var productPrice = document.createElement('p');
                    productPrice.innerText = `${elem.price} €`;

                    productImageDiv.appendChild(productImage);

                    productTitlePrice.appendChild(productTitle);
                    productTitlePrice.appendChild(productPrice);

                    productSettingDelete.appendChild(productDelete);
                    productSettings.appendChild(productSettingsQuantity);
                    productSettings.appendChild(productSettingDelete);

                    productContent.appendChild(productTitlePrice);
                    productContent.appendChild(productSettings)
                    productContainer.appendChild(productImageDiv);
                    productContainer.appendChild(productContent);
                    productSection.appendChild(productContainer);
                }
            }
        }
    }
}

function getTotalPrice(array) {
    var totalPrice = document.getElementById('totalPrice');
    var totalPriceNumber = 0;
    for(elem of cart) {
        var tempProductQuantity = elem.quantity;
        var tempProductId = elem._id;
        for(elem of array) {
            if(elem._id === tempProductId) {
                productPrice = tempProductQuantity * elem.price;
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