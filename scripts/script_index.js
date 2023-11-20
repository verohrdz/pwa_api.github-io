window.addEventListener('load',() => {
    registrarSW();
});

async function registrarSW(){
    if('serviceWorker' in navigator){
        try{
            await navigator
            .serviceWorker
            .register('sw.js');
        }
        catch (e){
            console.log('El SW no pudo ser registrado');
        }
    }
}

$('#search').on('click', function (e){
    var fruitName = $('#fruitSearch').val();
    if (fruitName.trim() !== "") {
        obtenerInformacionPorNombre(fruitName);
    } else {
        $('#fruitInfo').html('<p>Por favor, ingrese el nombre de la fruta.</p>');
    }
});

function obtenerInformacionPorNombre(fruitName){
    $.ajax({
        type: "get",
        url: 'https://www.fruityvice.com/api/fruit/' + fruitName,
        dataType: 'json',
        success: function(response)
        {
            mostrarInformacion(response);
            notificacion('la fruta ' + fruitName, response.nutritions ? response.nutritions.calories : 'No disponible');
        },
        error:function(error){
            console.log(error.message);
            $('#fruitInfo').html('<p>No se encontró información para la fruta ingresada.</p>');
        }
    });
}

function mostrarInformacion(fruit){
    var fruitInfo = '<h2>Información de ' + fruit.name + '</h2>' +
                    '<p><strong>Familia:</strong> ' + fruit.family + '</p>' +
                    '<p><strong>Género:</strong> ' + fruit.genus + '</p>' +
                    '<p><strong>Características:</strong> ' + fruit.description + '</p>';
                    
    if (fruit.nutritions) {
        fruitInfo += '<p><strong>Calorías:</strong> ' + fruit.nutritions.calories + '</p>' +
                     '<p><strong>Grasas:</strong> ' + fruit.nutritions.fat + '</p>' +
                     '<p><strong>Azúcar:</strong> ' + fruit.nutritions.sugar + '</p>' +
                     '<p><strong>Carbohidratos:</strong> ' + fruit.nutritions.carbohydrates + '</p>' +
                     '<p><strong>Proteínas:</strong> ' + fruit.nutritions.protein + '</p>';
    } else {
        fruitInfo += '<p><strong>Información nutricional no disponible.</strong></p>';
    }
    $('#fruitInfo').html(fruitInfo);
}

$('#notificaciones').on('click', function (e){
    Notification.requestPermission().then(function (result){
        if (result === "granted"){
            randomNotification();
        }
    });
})

function notificacion(message, calories){
    var notifTitle = "Sistema PWA";
    var notifBody = "Sabías que " + message + '\ contiene las siguientes calorías: ' + (calories ? calories : 'No disponible');
    var options = {
        body: notifBody,
        icon: 'icon512.png',
    };
    var notif = new Notification(notifTitle, options);    
}

function randomNotification(){
    var notifTitle = "Sistema PWA";
    var notifBody = "Se ha activado la notificación de FRUITAPI.";
    var notifImg = "icon512.png";
    var options = {
        body: notifBody,
        icons: notifImg,
    };
    var notif = new Notification(notifTitle, options);
}
function verificarConexion() {
    if (!navigator.onLine) {
        window.location.href = 'offline.html';
    }
}

// Verificar la conexión cuando se carga la página
verificarConexion();

// Escuchar eventos de cambio de conexión
window.addEventListener('online', verificarConexion);
window.addEventListener('offline', verificarConexion);