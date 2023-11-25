(function() {

    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', function() {
        crmDB();
        mostrarClientes();
        listadoClientes.addEventListener('click', function(event) {
            eliminarCliente(event);
        });
    });

    function crmDB(){

        //conectar con la BD
        const openRequest = indexedDB.open('crm', 1);

        //Si ocurre un error...
        openRequest.onerror = function(){
            console.log('Ha ocurrido un error en indexBD');
        };

        //success
        openRequest.onsuccess = function(){
            //asinar una instancia de la conexión de la BD
            DB = openRequest.result;

        };

        //crear el schema de la BD y configuracion de la BD
        openRequest.onupgradeneeded = function(event){
            const db = event.target.result;
            const objectStore = db.createObjectStore('crm', {
                keyPath: 'id',
                autoIncremente: true
            });

            objectStore.createIndex('nombre', 'nombre', {unique: false});
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('telefono', 'telefono', {unique: false});
            objectStore.createIndex('empresa', 'empresa', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});

            console.log('DB creada correctamente...');
        }
    }


    function mostrarClientes() {
        //conectar con indexDB
        const openRequest = indexedDB.open('crm', 1);

        //en caso de error
        openRequest.onerror = function() {
            console.log('Hubo un error al conectar con indexDB...');
        }

        //todo OK
        openRequest.onsuccess = function() {
            DB = openRequest.result;
            const objectStore = DB.transaction('crm', 'readonly').objectStore('crm');    
    
            objectStore.openCursor().onsuccess = function(event) {
                const cursor = event.target.result;
                
                if(cursor) {
                    const {nombre, email, telefono, empresa, id} = cursor.value;
                    listadoClientes.innerHTML += 
                    `<tr>
                        <td class="px-6 py-4 border-b border-gray-300">
                            <p class="font-bold text-lg leading-5">${nombre}</p>
                            <p class="font-medium text-sm leading-10 text-gray-600">${email}</p>
                        </td>
                        <td class="px-6 py-4 border-b border-gray-300">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 border-b border-gray-300">
                            <p class="text-gray-700">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 border-b border-gray-300">
                            <a href="editar-cliente.html?id=${id}" class="font-medium text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="font-medium text-red-500 hover:text-red-900 eliminar">Eliminar</a>
                        </td>
                    </tr>`;

                    cursor.continue();

                }else {
                    console.log('No hay más registros');
                }

            }
        }
    }

    function eliminarCliente(event) {

        if(event.target.classList.contains('eliminar')) {
            const idEliminar = Number(event.target.dataset.cliente);
            const confirmar = confirm('Eliminar cliente?');
            
            if(confirmar) {
                //eliminar registro de indexDB
                const transaction = DB.transaction('crm', 'readwrite');
                const objectStore = transaction.objectStore('crm');
                objectStore.delete(idEliminar);
                transaction.oncomplete = function() {
                    // alert('Cliente eliminado correctamente');

                    //eliminar elemento del html
                    event.target.parentElement.parentElement.remove();
                }
            }
        }
    }
})();