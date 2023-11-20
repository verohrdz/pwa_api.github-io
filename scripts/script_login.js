document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;


    if (!username || !password) {
        alert('Por favor, ingresa tanto el nombre de usuario como la contraseña.');
        return;
    }

    function handleAuthentication(db, username, password) {
        var transaction = db.transaction(['usuarios'], 'readonly');
        var objectStore = transaction.objectStore('usuarios');

        var getRequest = objectStore.get(username);
        getRequest.onsuccess = function(event) {
            var usuario = event.target.result;

            if (usuario && usuario.password === password) {
                var redirectURL = (username === 'administrador') ? 'administrador.html' : 'index.html';
                window.location.assign(redirectURL);
            } else {
                alert('Credenciales incorrectas');
            }
        };
    }

    var request = indexedDB.open('usuariosDB', 1);
    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        var objectStore = db.createObjectStore('usuarios', { keyPath: 'username' });
        objectStore.createIndex('password', 'password', { unique: false });
        objectStore.add({ username: 'administrador', password: 'admin' });
    };

    request.onsuccess = function(event) {
        var db = event.target.result;

        handleAuthentication(db, username, password);
    };

    request.onerror = function(event) {
        alert('Error al abrir la base de datos IndexedDB');
    };
});
