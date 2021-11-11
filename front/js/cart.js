let cart = JSON.parse(localStorage.getItem('cart'));
var totalProductNumbers = document.getElementById('totalQuantity');
totalProductNumbers.textContent = cart.length;

var productSection = document.getElementById('cart__items');

function createFinalProducts(array){
    const filterByReference = (array, cart) => {
        let finalCart = [];
        finalCart = array.filter(el => {
           return !cart.find(elem => {
              return elem._id === el._id;
           });
        });
        return finalCart;
    }
    localStorage.setItem('finalProducts', JSON.stringify(filterByReference(array, cart)))
}

function displayFinalProducts(array) {
    console.log(array);
    console.log(cart);
    for(elem of cart) {
        var productContainer = document.createElement('article');
        productContainer.setAttribute('class', 'cart__item');
        productContainer.setAttribute('data-id', elem._id);

        var productInfo = document.createElement('div')
        productInfo.setAttribute('class', 'cart_item_content')
        var productName = document.createElement('h2')
        productName.textContent = elem.name

        productInfo.appendChild(productName)

        productSection.appendChild(productInfo);
        productSection.appendChild(productContainer);
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
    createFinalProducts(products);
    let finalProducts = JSON.parse(localStorage.getItem('finalProducts'));
    displayFinalProducts(finalProducts)
}

displayProducts()