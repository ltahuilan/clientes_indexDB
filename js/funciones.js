
//construir alerta
function mostrarAlerta(mensaje, tipo) {
    const alerta = document.querySelector('.alerta');
    if(!alerta) {            
        const divAlerta = document.createElement('DIV');
        divAlerta.classList.add('border', 'rounded-lg', 'font-bold', 'p-3', 'mt-6', 'text-center');
        divAlerta.textContent = mensaje;

        if(tipo === 'error'){
            divAlerta.classList.add('alerta', 'border-red-300', 'bg-red-200', 'text-red-700');
        }else {
            divAlerta.classList.add('border-green-300', 'bg-green-200', 'text-green-700');
        }

        formulario.appendChild(divAlerta);
        // formulario.insertBefore('.first', divAlerta);

        setTimeout(() => {
        divAlerta.remove();
        }, 3000);
    }
}