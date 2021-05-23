//npm i node-fetch
//compilar mediante node ping.js
const fetch = require('node-fetch');

//variables
const urlAPI = "https://trivial-db.herokuapp.com/";
const urlImages = "https://trivial-images.herokuapp.com/";
const urlWebSockets = "https://websocketstrivial.herokuapp.com";


//Hace un ping para despertarlas
function wake() {

    fetch(urlAPI)
      .then(
        res => console.log(`Up! Respuesta de la API: ${res.ok}, status: ${res.status}`)
      )
      .catch(
        err => console.error(`Error la api no ha podido ser lanzada: ${err}`)
    );

    fetch(urlImages)
    .then(
      res => console.log(`Up! Respuesta del servidor de imagenes: ${res.ok}, status: ${res.status}`)
    )
    .catch(
      err => console.error(`Error servidor de imágenes no ha podido ser lanzado: ${err}`)
    );

    fetch(urlWebSockets)
    .then(
      res => console.log(`Up! Respuesta del servidor websockets: ${res.ok}, status: ${res.status}`)
    )
    .catch(
      err => console.error(`Error web sockets no ha podido ser lanzado: ${err}`)
    );

}


wake();