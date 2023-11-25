//IIFE Immediately-Invoked Function Expressions
(function(){
    //zona de variables globales
    let DB;

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', function(){
        connectDB();
        formulario.addEventListener('submit', agregarCliente)
    });

    function connectDB(){
        const openRequest = indexedDB.open('crm', 1);

        openRequest.onerror = function() {
            console.log('Ha ocurrido un error con indexDB');
        }

        openRequest.onsuccess = function() {
            //asignar una instancia de la conexion de la DB
            DB = openRequest.result;
            console.log('Conexión con indexDB correcta...');
        }
    }

    //agregar cliente
    function agregarCliente(event) {
        event.preventDefault();

        const nombre = document.querySelector('#nombre').value.trim();
        const email = document.querySelector('#email').value.trim();
        const telefono = document.querySelector('#telefono').value.trim();
        const empresa = document.querySelector('#empresa').value.trim();

        //validar campos vacío
        if(nombre === '' || email === '' || telefono === '' || empresa === '') {
            mostrarAlerta('Todos los campos son requeridos', 'error');
            return;
        }

        //crear un objeto con los datos del formualario
        const cliente = {nombre, email, telefono, empresa};
        cliente.id = Date.now();

        //crear la transaccion
        const transaction = DB.transaction('crm', 'readwrite');

        //obtener el almacen de datos
        const objectStore = transaction.objectStore('crm');

        //ejecutar la petición
        objectStore.add(cliente);

        transaction.oncomplete = () => {
            mostrarAlerta('Cliente guardado correctamente');
            //redireccionar a index
            setTimeout(() => {
                window.location.href = 'index.html';             
            }, 1000);
        }

        transaction.onerror = () => {
            mostrarAlerta('Ha ocurrido un error en indexDB', 'error');
        }
    }
})();