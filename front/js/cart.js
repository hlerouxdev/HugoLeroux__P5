let cart = JSON.parse(localStorage.getItem('cart'));
var totalProductNumbers = document.getElementById('totalQuantity');
totalProductNumbers.textContent = cart.length;
var productSection = document.getElementById('cart__items');

function displayFinalProducts(array) {
    console.log(array);
    console.log(cart);
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
            var productPrice = document.createElement('p');
            productPrice.innerText = ` €`

            var productSettings = document.createElement('div');
            productSettings.setAttribute('class', 'cart__item__content__settings');

            var productSettingsQuantity = document.createElement('div');
            productSettingsQuantity.setAttribute('class', 'cart__item__content__settings__quantity');
            productSettingsQuantity.innerHTML += `<p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${elem.quantity}">`

            var productSettingDelete = document.createElement('div')
            productSettingDelete.setAttribute('class', 'cart__item__content__settings__delete')
            var productDelete = document.createElement('p')
            productDelete.setAttribute('class', 'deleteItem')
            productDelete.innerText = 'Supprimer'
            

            productTitlePrice.appendChild(productTitle);
            productTitlePrice.appendChild(productPrice);

            productSettingDelete.appendChild(productDelete)
            productSettings.appendChild(productSettingsQuantity);
            productSettings.appendChild(productSettingDelete)

            productContent.appendChild(productTitlePrice);
            productContent.appendChild(productSettings)
            productContainer.appendChild(productImageDiv);
            productContainer.appendChild(productContent);
            productSection.appendChild(productContainer);
        }
    }
}

function setArray() {
    return fetch("http://localhost:3000/api/products") //appel à l'api
    .then((response) => response.json())
    .then((jsonData) => jsonData) 
    .catch((error) => console.error(error));
}

async function displayProducts() { 
    const products = await setArray(); //récupération des produits via la fontion d'appel pour mettre les données dans un tableau
    displayFinalProducts(products)
}

displayProducts()