// Récupération des pièces depuis l'API
try {
	async function getDataFromApi() {
		let data = await fetch("http://localhost:3000/api/products")
		let resp = data.json()
		return resp

	};


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
}

catch (e) {
	console.log(e) = "Error"
}


//fonction permettant de récupérer l'id
//faire un return pour le rendre disponible


