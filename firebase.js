// firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyCcM0br4aDbOatafow2GHgXb8i-N42BD_Q",
  authDomain: "sigueme-y-te-sigo.firebaseapp.com",
  databaseURL: "https://sigueme-y-te-sigo-default-rtdb.firebaseio.com",
  projectId: "sigueme-y-te-sigo",
  storageBucket: "sigueme-y-te-sigo.appspot.com",
  messagingSenderId: "169674582393",
  appId: "1:169674582393:web:fe2171b7ed14675f4b27a8"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

document.getElementById('facebookForm').addEventListener('submit', function(event) {
  event.preventDefault();
  var facebookUrl = document.getElementById('facebookUrl').value;
  verificarYAgregarUrlALaListaYFirebase(facebookUrl);
});

document.getElementById('searchButton').addEventListener('click', function(event) {
  event.preventDefault();
  var searchNumber = document.getElementById('searchNumber').value;
  buscarUrlPorNumero(searchNumber);
});

window.addEventListener('load', function() {
  mostrarUrlsDesdeFirebase();
});

function verificarYAgregarUrlALaListaYFirebase(url) {
  database.ref('urls').orderByChild('url').equalTo(url).once('value', snapshot => {
    if (!snapshot.exists()) {
      agregarUrlALaListaYFirebase(url);
    } else {
      alert('Esta URL ya ha sido compartida.');
    }
  });
}

function agregarUrlALaListaYFirebase(url) {
  database.ref('urls').once('value').then(snapshot => {
    const numUrls = snapshot.numChildren();
    database.ref('urls').push({
      numero: numUrls + 1,
      url: url
    });
    mostrarUrlsDesdeFirebase(); // Mostrar la URL recién agregada
  });
}

function mostrarUrlsDesdeFirebase() {
  database.ref('urls').once('value').then(snapshot => {
    const urls = snapshot.val();
    const lista = document.getElementById('facebookList');
    lista.innerHTML = '';
    for (let key in urls) {
      const anchor = document.createElement('a');
      anchor.textContent = `URL ${urls[key].numero}: ${urls[key].url}`;
      anchor.href = urls[key].url;
      anchor.target = "_blank"; // Para abrir en una nueva pestaña
      anchor.rel = "noopener noreferrer"; // Medida de seguridad
      const listItem = document.createElement('div');
      listItem.appendChild(anchor);
      lista.appendChild(listItem);
    }
  });
}

function buscarUrlPorNumero(numero) {
  database.ref('urls').orderByChild('numero').equalTo(parseInt(numero)).once('value', snapshot => {
    const urlEncontrada = snapshot.val();
    if (urlEncontrada) {
      const urlKey = Object.keys(urlEncontrada)[0];
      const url = urlEncontrada[urlKey].url;
      const urlElement = document.querySelector(`#facebookList a[href="${url}"]`);
      if (urlElement) {
        // Desplazamiento suave hacia la URL encontrada
        urlElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Resaltar la URL cambiando el color de fondo
        urlElement.style.backgroundColor = '#ffffcc';
        setTimeout(() => {
          urlElement.style.backgroundColor = ''; // Deshacer el resaltado después de 3 segundos
        }, 3000);
      }
    } else {
      alert(`No se encontró ninguna URL con el número ${numero}.`);
    }
  }).catch(error => {
    console.error("Error al buscar URL por número:", error);
  });
}


document.getElementById('instructionsButton').addEventListener('click', function() {
  var instructionsDiv = document.getElementById('instructions');
  if (instructionsDiv.style.display === 'none') {
    instructionsDiv.style.display = 'block';
    this.textContent = 'Ocultar instrucciones';
  } else {
    instructionsDiv.style.display = 'none';
    this.textContent = 'Instrucciones';
  }
});

