const editSignoForm = document.getElementById('editSignoForm');
const db = firebase.firestore();
const tiempoInactividad = 180000;
let timeout;

const urlParams = new URLSearchParams(window.location.search);
const signoId = urlParams.get('id');

editSignoForm.addEventListener('submit', function (e) {
    e.preventDefault();

    //Hay un problema cargando el form y los datos pero no muestra error en consola.
    const updatedSigno = {
        posic: parseInt(document.getElementById('txtPosic').value),
        signo: document.getElementById('txtSigno').value,
        rango: document.getElementById('txtRango').value,
        elemento: document.getElementById('txtElemento').value,
        astroCeleste: document.getElementById('txtAstroCeleste').value,
        piedraPreciosa: document.getElementById('txtPiedraPreciosa').value,
    };

    // Actualiza el signo zodiacal en Firestore con los nuevos datos
    db.collection("datosZodiaco").doc(signoId).update(updatedSigno)
        .then(function () {
            alert("Los datos se han actualizado correctamente");
        })
        .catch(function (error) {
            alert("Error al actualizar los datos: " + error);
        });
});

// Obtén los datos del signo zodiacal
db.collection("datosZodiaco").doc(signoId).get().then(function (doc) {
    if (doc.exists) {
        const data = doc.data();
        // Rellena los campos del formulario con los valores existentes
        document.getElementById('txtPosic').value = data.posic;
        document.getElementById('txtSigno').value = data.signo;
        document.getElementById('txtRango').value = data.rango;
        document.getElementById('txtElemento').value = data.elemento;
        document.getElementById('txtAstroCeleste').value = data.astroCeleste;
        document.getElementById('txtPiedraPreciosa').value = data.piedraPreciosa;
    } else {
        console.log("El documento no existe");
    }
}).catch(function (error) {
    console.log("Error obteniendo el documento:", error);
});

function reiniciarTimeout() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        // Cerrar la sesión del usuario automáticamente
        auth.signOut().then(() => {
            document.location.href = 'login.html';
        }).catch((error) => {
            console.error('Error al cerrar la sesión: ' + error);
        });
    }, tiempoInactividad);
}

reiniciarTimeout();

// Agregar manejadores de eventos para reiniciar el temporizador cuando el usuario interactúa
document.addEventListener('click', reiniciarTimeout);
document.addEventListener('mousemove', reiniciarTimeout);
document.addEventListener('keydown', reiniciarTimeout);