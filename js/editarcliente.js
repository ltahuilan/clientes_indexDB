(function() {

    let DB;
    let idCliente;
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', function(){
        conectarDB();

        //esperar hasta que haya terminado de cargar los datos desde indexDB
        setTimeout(() => {
            getQueryString();            
        }, 100);

        formulario.addEventListener('submit', editarCliente)

    })
        
    //conectar con indexDB
    function conectarDB() {
        const openRequest = window.indexedDB.open('crm', 1);

        openRequest.onerror = function() {
            console.log('Ha ocurrido un error al conectar con IndexDB');
        }

        openRequest.onsuccess = function() {
            DB = openRequest.result;
        }
    }

    //leer el querystring
    function getQueryString() {
        const queryString = new URLSearchParams(window.location.search);
        idCliente = queryString.get('id');

        if(idCliente){
            getCliente(idCliente);
        };
    }


    //obtner los datos del cliente
    function getCliente(id) {
        const transaction = DB.transaction('crm', 'readonly').objectStore('crm');
        const openCursor = transaction.openCursor();
        openCursor.onsuccess = function(event) {
            const cursor = event.target.result;
            if(cursor) {
                if( cursor.value.id === Number(id) ){
                    //object literal enhancement
                    const {nombre, email, telefono, empresa} = cursor.value;

                    //mostrar los valores en el formulario
                    nombreInput.value = nombre;
                    emailInput.value = email;
                    telefonoInput.value = telefono;
                    empresaInput.value = empresa;
                }
                cursor.continue();
            }
        }
    }


    function editarCliente(event) {
        event.preventDefault();

        //validar el formulario de
        if(nombreInput.value.trim() === '' || emailInput.value.trim() === '' || telefonoInput.value.trim() === '' || empresaInput.value.trim() === '') {
            mostrarAlerta('Todos los campos son requeridos', 'error');
            return;
        }

        //llenar objeto con los datos editados del formulario
        const clienteEditado = {
            nombre: nombreInput.value.trim(),
            email: emailInput.value.trim(),
            telefono: telefonoInput.value.trim(),
            empresa: empresaInput.value.trim(),
            id: Number(idCliente)
        };

        console.log(clienteEditado);
        // return;

        // conectarDB();

        const transaction = DB.transaction('crm', 'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.put(clienteEditado);
        transaction.oncomplete = function() {
            mostrarAlerta('Cliente editado correctamente');

            setTimeout(() => {
                window.location.href = 'index.html'
            }, 1000);
        }

        transaction.onerror = function() {
            mostrarAlerta('Error al editar cliente en indexDB', 'error');
        }       
    }

})();