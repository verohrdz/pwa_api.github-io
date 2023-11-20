document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('crud-form');
    const tabla = document.getElementById('tabla-frutas');
    const nombreInput = document.getElementById('nombre');
    const datosInteresantesInput = document.getElementById('datosInteresantes');
    const eliminarBtn = document.getElementById('eliminar-btn');
    const editarBtn = document.getElementById('editar-btn'); // Añadido
    let db;

    const dbPromise = indexedDB.open('frutasDB', 1);

    dbPromise.onupgradeneeded = function (event) {
        db = event.target.result;

        if (!db.objectStoreNames.contains('frutas')) {
            db.createObjectStore('frutas', { keyPath: 'id', autoIncrement: true });
        }
    };

    dbPromise.onsuccess = function (event) {
        db = event.target.result;
        actualizarTabla();
    };

    formulario.addEventListener('submit', function (event) {
        event.preventDefault();

        const nombre = nombreInput.value;
        const datosInteresantes = datosInteresantesInput.value;

        if (formulario.dataset.editarId) {
            const id = Number(formulario.dataset.editarId);
            agregarEditarRegistro({ id, nombre, datosInteresantes });
            formulario.dataset.editarId = '';
        } else {
            agregarEditarRegistro({ nombre, datosInteresantes });
        }

        formulario.reset();
        actualizarTabla();
    });

    eliminarBtn.addEventListener('click', function () {
        const filasSeleccionadas = document.querySelectorAll('input[type="checkbox"]:checked');

        filasSeleccionadas.forEach(function (fila) {
            const id = Number(fila.dataset.id);
            eliminarRegistro(id);
        });

        actualizarTabla();
    });

    editarBtn.addEventListener('click', function () {
        const filaSeleccionada = document.querySelector('input[type="checkbox"]:checked');

        if (filaSeleccionada) {
            const id = Number(filaSeleccionada.dataset.id);
            activarModoEdicion(id);
        }
    });

    function agregarEditarRegistro(registro) {
        const transaction = db.transaction(['frutas'], 'readwrite');
        const objectStore = transaction.objectStore('frutas');

        if (registro.id) {
            const request = objectStore.put(registro);
            request.onsuccess = function (event) {
                console.log('Registro actualizado con éxito');
            };
        } else {
            const request = objectStore.add(registro);
            request.onsuccess = function (event) {
                console.log('Registro agregado con éxito');
            };
        }
    }

    function eliminarRegistro(id) {
        const transaction = db.transaction(['frutas'], 'readwrite');
        const objectStore = transaction.objectStore('frutas');

        const request = objectStore.delete(id);
        request.onsuccess = function (event) {
            console.log('Registro eliminado con éxito');
        };
    }

    function activarModoEdicion(id) {
        const transaction = db.transaction(['frutas'], 'readonly');
        const objectStore = transaction.objectStore('frutas');

        const request = objectStore.get(id);

        request.onsuccess = function (event) {
            const registro = event.target.result;

            nombreInput.value = registro.nombre;
            datosInteresantesInput.value = registro.datosInteresantes;

            formulario.dataset.editarId = id;
        };
    }

    function actualizarTabla() {
        const transaction = db.transaction(['frutas'], 'readonly');
        const objectStore = transaction.objectStore('frutas');

        const request = objectStore.getAll();

        request.onsuccess = function (event) {
            while (tabla.firstChild) {
                tabla.removeChild(tabla.firstChild);
            }

            const datos = event.target.result;
            let idCounter = 1;

            datos.forEach(function (dato) {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${idCounter++}</td>
                    <td>${dato.nombre}</td>
                    <td>${dato.datosInteresantes}</td>
                    <td><input type="checkbox" data-id="${dato.id}"></td>
                `;
                tabla.appendChild(fila);
            });
        };
    }
});
