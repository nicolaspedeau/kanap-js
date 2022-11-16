//Récupère l'ID dans l'URL
function getId() {
    const url = window.location.search
    const urlParams = new URLSearchParams(url)
    const urlId = urlParams.get('id')
    return urlId

};

//Récupère les informations concernant la pièce à afficher.
async function getDataFromApi(id) {
    try { 
        let data = await fetch("http://localhost:3000/api/products/" + id)
        let resp = data.json()
        return resp
    }
    
    catch (err) {
        apiError()
    }


};



//Génère la page produit de manière à afficher le bon canapé
(async function renderProduct() {
	let data = await getDataFromApi(getId())

    //product image html insertion
	const productImg = document.querySelector(".item__img");
    productImg.innerHTML += `<img src="${data.imageUrl}" alt="${data.altTxt}"></img>`;

    //product name html insertion
    const productName = document.querySelector("#title");
    productName.innerHTML += `${data.name}`;

    //price html insertion
    const productPrice = document.querySelector("#price");
    productPrice.innerHTML += `${data.price}`;

    //description html insertion
    const productDescription = document.querySelector("#description");
    productDescription.innerHTML += `${data.description}`;

    //options html insertion
    const productColor = document.querySelector("#colors");
    data.colors.forEach( (col) => {
        productColor.innerHTML += `<option value="${col}">"${col}"</option>`;
    })
})()


//Vérifie que la couleur du canapé et que la quantité de canapés soit bien sélectionnés avant d'envoyer ces deux informations dans le localstorage
const storageSave = (productArray, productDetail) => {
    if (productDetail.color === "") {
        alert("Merci de sélectionner une couleur")
    }else if(productDetail.quantity < 1 || productDetail.quantity > 100){
        alert("Veuillez choisir entre 1 et 100 produits")
    }else{
        productArray.push(productDetail);
        localStorage.setItem("product", JSON.stringify(productArray));
        alert("Le produit à bien été ajouté dans le panier");
        //console.log(productArray);
    }
}

//Permet d'envoyer les données du canapé sélectionné vers le localstorage afin de l'afficher correctement dans cart
function addCart() {
    let button = document.getElementById("addToCart");

    button.addEventListener('click', () => {
        let productArray = JSON.parse(localStorage.getItem("product"));
        let color = document.getElementById("colors").value;
        let quantity = document.getElementById("quantity").value;
        let id = getId();

        let productDetail = {
            id: id,
            color: color,
            quantity: quantity
        }
        
        if (productArray) {
            productArray.forEach((item, index) => {
                if(productDetail.id === item.id && productDetail.color === item.color){
                    productDetail.quantity = parseInt(productDetail.quantity)+parseInt(item.quantity);
                    productArray.splice(index, 1);
                }
            })
            storageSave(productArray, productDetail);
        }else{
            productArray = [];
            storageSave(productArray, productDetail);
        }
    })
}
addCart();

//Affiche un message d'erreur si l'APi est défaillante et que la page ne s'affiche pas correctement
function apiError () {
    document.querySelector(".item").innerHTML = "<div>Une erreur s'est produite</div>"
    setTimeout(() => [document.location.href="../html/index.html"], 5000);
}


