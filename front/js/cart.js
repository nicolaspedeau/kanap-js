//Récupération de l'array
function getCart() {
    let cart = JSON.parse(localStorage.getItem("product"));
    return cart;
 }



//Intégration du panier afin d'afficher les produits sélectionnés
async function renderCart() {

    const array = getCart();
    let sectionCart = "";
    let totalPrice = 0;
    let totalQuantity = 0;

    
    for(let product of array){
        try{
        //Insertion de l'HTML et du calcul de la quantité et du prix total
        await fetch("http://localhost:3000/api/products/" + product.id)
        .then((res) => res.json())
        .then((item) => {

            totalQuantity += parseInt(product.quantity);
            totalPrice += parseInt(item.price) * parseInt(product.quantity);

            
            sectionCart += `
            <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                <div class="cart__item__img">
                    <img src="${item.imageUrl}" alt="${item.altTxt}" />
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${item.name}</h2>
                            <p>${product.color}</p>
                            <p>${item.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`
        })
        }
        catch(err){
            console.log("error" + err)
            apiError();
        }
    }
    

    document.querySelector("#totalQuantity").innerHTML = totalQuantity;
    document.querySelector("#totalPrice").innerHTML = totalPrice;
    document.querySelector("#cart__items").innerHTML = sectionCart;

}

//Regroupe les différentes fonction concernant le panier et les éxécute
async function refreshPage(){
    await renderCart();
    edit();
    deleteItem();
}
refreshPage()

//Permet de modifier le nombre d'un canapé sans le supprimer
function edit (){
    const cart = getCart();
    const quantitySelector = document.querySelectorAll(".itemQuantity")
    quantitySelector.forEach((quantityInput) => {
        quantityInput.addEventListener('change', (event) =>{
            if(event.target.value < 1 || event.target.value > 100){
                alert("Veuillez choisir entre 1 et 100 articles!");
            }else{
                let newQuantity = parseInt(event.target.value);
                let dataId = event.target.closest("article").dataset.id;
        
                let dataColor = event.target.closest("article").dataset.color;

                const productIndex = cart.findIndex((item) =>item.id === dataId && item.color === dataColor);
                cart[productIndex].quantity = newQuantity;
                localStorage.setItem("product", JSON.stringify(cart));

                refreshPage();
                
        
            }
        })
    })

}




//Permet de supprimer un produit (supprimera le produit peu importe la quantité saisie)
function deleteItem () {
    let cart = getCart();

    let cartItems = document.querySelectorAll(".cart__item");
    cartItems.forEach((item) => {
        let corbeille = item.querySelector(".deleteItem");

        let dataId = item.dataset.id;

        let dataColor = item.dataset.color;

        corbeille.addEventListener("click", (event) => {
            event.preventDefault();

            cart = cart.filter( id => 
                 id.id !== dataId || id.color !== dataColor
            )

            //on envoie la variable dans le localstorage
            localStorage.setItem("product", JSON.stringify(cart));

            //alert de suppression
            alert("Ce produit a été supprimer de votre panier");

            let toDelete = document.querySelectorAll('[data-id="' + dataId + '"][data-color="' + dataColor + '"]');
            toDelete[0].remove();
            
        })

    })

   
}


///////////////////////////////////////////////Formulaire///////////////////////////////////

let valueFirstname, valueLastname, valueAddress, valueCity, valueEmail;

//Regroupe les différente fonctions définissant les regex et les applique à chaque champ présent dans le formulaire
(function initForm (){
    const firstname = document.getElementById("firstName");
    const lastname = document.getElementById("lastName");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const email = document.getElementById("email");


    firstname.addEventListener("input", function(e) {
        let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
        valueFirstname = checkNames(e, firstNameErrorMsg);
    });

    lastname.addEventListener("input", function(e) {
        let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
        valueLastname = checkNames(e, lastNameErrorMsg);
    });

    address.addEventListener("input", function(e) {
        let addressErrorMsg = document.getElementById("addressErrorMsg");
        valueAddress = checkAdress(e, addressErrorMsg);
    })

    city.addEventListener("input", function(e) {
        let cityErrorMsg = document.getElementById("cityErrorMsg");
        valueCity = checkNames(e, cityErrorMsg);
    });

    email.addEventListener("input", function(e) {
        let emailErrorMsg = document.getElementById("emailErrorMsg");
        valueEmail = checkMail(e, emailErrorMsg);
    });


})()

//Définit les regex des champs Nom Prénom et Ville pour que la saisie n'accepte pas de chiffres ou de caractères spéciaux
function checkNames(e, errorMessage) {
    let valueName;
    if(e.target.value.length == 0){
        errorMessage.innerHTML = "";
        valueName = null;
    }else if(e.target.value.length < 3 || e.target.value.length > 35){
        errorMessage.innerHTML = "Le champ doit contenir entre 3 et 25 caractères";
        valueName = null;
    }
    if(e.target.value.match(/^[a-z A-Z]{3,35}$/)){
        errorMessage.innerHTML = "";
        valueName = e.target.value
    }
    if(
    !e.target.value.match(/^[a-z A-Z]{3,35}$/) && 
    e.target.value.length > 3 &&
    e.target.value.length < 35
    ) {
        errorMessage.innerHTML = "Le champ ne doit pas contenir de caractères spéciaux, chiffres ou accents";
        valueName = null;

    }
    return valueName;
}

//Définit les regex du champ adress qui accepte les chiffres mais pas les caractères spéciaux
function checkAdress(e, errorMessage){
    let valueLocation;
    if(e.target.value.length == 0){
        errorMessage.innerHTML = "";
        valueLocation = null;
    }else if(e.target.value.length < 3 || e.target.value.length > 100){
        errorMessage.innerHTML = "Le champ doit contenir entre 3 et 100 caractères";
        valueLocation = null;
    }
    if(e.target.value.match(/^[0-9]{1,4} [a-z A-Z]{3,100}$/)){
        errorMessage.innerHTML = "";
        valueLocation= e.target.value
    }
    if(
    !e.target.value.match(/^[0-9]{1,4} [a-z A-Z]{3,100}$/) && 
    e.target.value.length > 3 &&
    e.target.value.length < 100
    ) {
        errorMessage.innerHTML = "L'adresse doit commencer par un chiffre, comprendre plus de 3 caractères et ne doit pas contenir de caractères spéciaux";
        valueLocation = null;

    }
    return valueLocation;
}

//Définit les regex du champ e-mail qui impose la présence de @ et autorise chiffres et caractères spéciaux
function checkMail(e, errorMessage){
    let valueMail;
    if(e.target.value.length == 0){
        errorMessage.innerHTML = "";
        valueMail = null;
    }else if(e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)){
        errorMessage.innerHTML = "";
        valueMail = e.target.value

    }
    if(
    !e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) && 
    !e.target.value.length == 0 
    ) {
        errorMessage.innerHTML = "Email incorrect ex: random@hotmail.fr";
        valueMail = null;

    }
    return valueMail;
}

//Envoie les données concernant les produits présents dans le panier et les données contenues dans le formulaire vers l'API
(async function sendDataToApi(){ 
    let order = document.getElementsByClassName("cart__order__form");
    order[0].addEventListener("submit", async (e) =>{
        e.preventDefault();

        if(valueFirstname && valueLastname && valueAddress && valueCity && valueEmail) {

            let contact = {
                firstName : valueFirstname,
                lastName : valueLastname,
                address : valueAddress,
                city : valueCity,
                email : valueEmail
            };
            
            let products = [];
            const productStorage = getCart();

            for(let product of productStorage){
                let id = product.id;
                products.push(id);
            }
            const toSend = {
                contact : contact,
                products : products
            };
            await fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(toSend),
            }).then((res) => res.json())
            //Clear le localStorage et redirige vers la page confirmation
            .then((data) =>{
                localStorage.clear();
                location.href=`../html/confirmation.html?id=${data.orderId}`;
            })
            .catch((err) =>{
            });

        }else{
            alert("Merci de remplir le formulaire")
        }
     })
})()

function apiError () {
    console.log("Error");
    document.querySelector(".cart").innerHTML = "<div>Une erreur s'est produite</div>"
    setTimeout(() => [document.location.href="../html/index.html"], 5000);
}