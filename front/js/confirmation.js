//Récupère l'ID dans l'URL
function getId() {
    const url = window.location.search
    const urlParams = new URLSearchParams(url)
    const urlId = urlParams.get('id')
    return urlId

};


//Affiche le numéro de commande
( function renderId() {
	let data = getId();

    //id html insertion
	document.querySelector("#orderId").innerHTML = `${data}`;


})()