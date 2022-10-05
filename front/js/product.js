 function getId() {
    const url = window.location.search
    const urlParams = new URLSearchParams(url)
    const urlId = urlParams.get('id')
    return urlId

};

async function getDataFromApi() {
    try { let data = await fetch("http://localhost:3000/api/products/" + getId())
    let resp = data.json()
    return resp}
    
    catch (err) {
        apiError()
    }


};



(async function renderProduct() {
	let data = await getDataFromApi()
    console.log(data)

    //product image html insertion
	const productImg = document.querySelector(".item__img");
    console.log(productImg)
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


function apiError () {
    document.querySelector(".item").innerHTML = "<div>Une erreur s'est produite</div>"
    setTimeout(() => [document.location.href="../html/index.html"], 5000);
}
