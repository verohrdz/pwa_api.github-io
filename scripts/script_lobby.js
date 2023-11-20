document.addEventListener('DOMContentLoaded', function () {
    var inicioBtn = document.getElementById('inicio');
    var datosBtn = document.getElementById('datos');
    var busquedaBtn = document.getElementById('busqueda');

    inicioBtn.addEventListener('click', iniciarSesion);
    datosBtn.addEventListener('click', mostrarDatosInteresantes);
    busquedaBtn.addEventListener('click', redireccionarBusqueda);

    function redireccionarBusqueda() {
        window.location.href = 'index.html';
    }

    function iniciarSesion() {
        window.location.href = 'login.html';
    }

    function mostrarDatosInteresantes() {
        obtenerDatosIndexedDB();
    }

    function obtenerDatosIndexedDB() {
        // Abrir la base de datos
        var request = indexedDB.open('frutasDB', 1);

        request.onerror = function (event) {
            console.error('Error al abrir la base de datos.');
        };

        request.onsuccess = function (event) {
            var db = event.target.result;

            // Acceder al almacén de objetos 'frutas'
            var transaction = db.transaction(['frutas'], 'readonly');
            var objectStore = transaction.objectStore('frutas');

            // Obtener todos los datos en el almacén de objetos
            var getAllRequest = objectStore.getAll();

            getAllRequest.onsuccess = function (event) {
                var frutas = event.target.result;

                // Mostrar datos aleatorios (puedes ajustar según tus necesidades)
                if (frutas.length > 0) {
                    var datoAleatorio = frutas[Math.floor(Math.random() * frutas.length)];
                    mostrarResultado(datoAleatorio);
                } else {
                    alert('No hay datos almacenados.');
                }
            };

            getAllRequest.onerror = function (event) {
                console.error('Error al obtener datos desde IndexedDB.');
            };
        };
    }

    function mostrarResultado(dato) {
        var containerElement = document.querySelector(".container");

        // Eliminar contenido anterior
        var datosAnteriores = document.querySelectorAll(".datos-aleatorios");
        datosAnteriores.forEach(function (element) {
            element.remove();
        });

        // Insertar HTML después del contenido existente
        containerElement.insertAdjacentHTML('beforeend', `
            <div class="datos-aleatorios">
                <h1>${dato.nombre}</h1>
                <p>Sabías que ${dato.datosInteresantes}</p>
            </div>
        `);
    }
});
// haciendo el almacenamiento de datos local para el guardado  de info
function guardarDatosLocalmente(datos) {
    var request = indexedDB.open('frutasDB', 1);

    request.onerror = function(event) {
        console.error('Error al abrir la base de datos.');
    };

    request.onsuccess = function(event) {
        var db = event.target.result;

        var transaction = db.transaction(['frutas'], 'readwrite');
        var objectStore = transaction.objectStore('frutas');

        // Agregar cada fruta a la base de datos
        datos.forEach(function(fruta) {
            objectStore.add(fruta);
        });

        transaction.oncomplete = function() {
            console.log('Datos guardados localmente con éxito.');
        };

        transaction.onerror = function(event) {
            console.error('Error al guardar los datos localmente.');
        };
    };

    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        var objectStore = db.createObjectStore('frutas', { keyPath: 'id', autoIncrement:true });
        objectStore.createIndex('nombre', 'nombre', { unique: false });
        objectStore.createIndex('datosInteresantes', 'datosInteresantes', { unique: false });
    };
}

function obtenerDatosLocalmente(callback) {
    var request = indexedDB.open('frutasDB', 1);

    request.onerror = function(event) {
        console.error('Error al abrir la base de datos.');
    };

    request.onsuccess = function(event) {
        var db = event.target.result;

        var transaction = db.transaction(['frutas'], 'readonly');
        var objectStore = transaction.objectStore('frutas');
        var getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = function(event) {
            var frutas = event.target.result;
            callback(frutas);
        };

        getAllRequest.onerror = function(event) {
            console.error('Error al obtener datos desde IndexedDB.');
            callback([]);
        };
    };
}
