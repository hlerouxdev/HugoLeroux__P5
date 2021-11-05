function setArray() {
    return fetch("http://localhost:3000/api/products") //appel à l'api
    .then((response) => response.json()) //promesse
    .then((jsonData) => jsonData) // réponse attendue
    .catch((error) => console.error(error))
}



