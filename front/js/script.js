// Récupération des pièces depuis l'API

async function getDataFromApi() {
	try {
		let data = await fetch("http://localhost:3000/api/products")
		let resp = data.json()
		return resp
	}
	catch (err) {
		apiError();
	}

};

//Intégration html des différents produits
(async function renderProduct() {
	let data = await getDataFromApi()
	const sectionItems = document.querySelector(".items");
	data.forEach( (item) =>  {
		sectionItems.innerHTML += `<a href="./product.html?id=${item._id}">
		<article>
		<img src="${item.imageUrl}" alt="${item.altTxt}">
		<h3 class="productName">${item.name}</h3>
		<p class="productDescription">${item.description}</p>
		</article>
	</a>`
	})
})()



function apiError () {
    document.querySelector(".items").innerHTML = "<div>Une erreur s'est produite</div>"
}



