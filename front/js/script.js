//fonction d'appel à l'api
function setArray() {
    return fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((jsonData) => jsonData) 
    .catch((error) => console.error(error));
};

// sélection de la class ".item" pour y mettre les élements
const shopContainer = document.querySelector(".items");

function createProducts(x) { //fonction de création des liens pour qhaque produit
    for (let elem of x) { // boucle dnas l'array
        //Création du lien
        const productContainer = document.createElement('a');
        productContainer.setAttribute('href', `./product.html?id=${elem._id}`);
        //Création de l'article
        const product = document.createElement('article');
        //création de l'image
        const productImage = document.createElement('img');
        productImage.src = (elem.imageUrl);
        productImage.alt = (elem.altTxt);
        //création de titre
        const productTitle = document.createElement('h3');
        productTitle.textContent = (elem.name);
        //création de la description
        const productDesc = document.createElement('p');
        productDesc.textContent =(elem.description);
        //Ajout de chaque élément dans l'article
        product.appendChild(productImage);
        product.appendChild(productTitle);
        product.appendChild(productDesc);
        //ajout de l'article dans le lien
        productContainer.appendChild(product);
        //ajout du ien dans la classe ".items"
        shopContainer.appendChild(productContainer);
    };
};

//fonction principale
async function displayProducts() { 
    const products = await setArray(); //récupération des produits via la fontion d'appel pour mettre les données dans un tableau
    createProducts(products); //appel de la fonction de création des éléments
};

// appel de la fonction d'affichage
displayProducts();