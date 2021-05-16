//npm i node-fetch
const fetch = require('node-fetch');

//variables
const interval = 30*60*1000; // Tiempo en ms - {30mins x 60s x 1000}ms
const url = "https://trivial-db.herokuapp.com/";

//Hace un ping cada interval ms
function wake() {

  try {

    const handler = setInterval(() => {

      fetch(url)
        .then(res => console.log(`Respuesta: ${res.ok}, status: ${res.status}`))
        .catch(err => console.error(`Error: ${err}`));

    }, interval);

  } catch(err) {
      console.error('Ha ocurrido un error: reintentado...');
      clearInterval(handler);
      return setTimeout(() => wake(), 10000);
  };

}
//Hace un único ping una vez por si la API está dormida
function wakeforfirstTime(){
    fetch(url)
    .then(res => console.log(`Respuesta: ${res.ok}, status: ${res.status}`))
    .catch(err => console.error(`Error: ${err}`));
}

wakeforfirstTime();
wake();