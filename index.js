var indexMano = 0;
var arrayObjetos = [
    {objeto: '#tablero', funcion: function() { window.location.href = $('#tablero').attr('href') }},
    {objeto: '#balanza', funcion: function() { window.location.href = $('#balanza').attr('href') }},
    {objeto: '#conejos', funcion: function() { window.location.href = $('#conejos').attr('href') }},
    {objeto: '#botonAccesibilidad', funcion: function() { $('#botonAccesibilidad').click(); cambiarArrayMano(arrayModal); }}
];

var arrayModal = [
    {objeto: '#toggleActivar', funcion: function() { $('#toggleActivar').click(); }},
    {objeto: '#cerrarModal', funcion: function() {
        $('#cerrarModal').click(); }},
];

var arrayMano = arrayObjetos;


$(document).ready(function() {
    cambiarArrayMano(arrayObjetos);
    comprobarModoAcc();
});

$(document).keyup(function (event) {
    let modoAccesible = Cookies.get('modoAccesible');

    if (event.which == 13 && modoAccesible == 1) { //Se pulsa enter
        arrayMano[indexMano].funcion();
    }

    if (event.which == 32 && modoAccesible == 1) { //Se pulsa el espacio
        indexMano++;     
        cambiarPosMano();
    }
});

function cambiarPosMano() {
    if (indexMano == arrayMano.length)
        indexMano = 0;

    let objeto = $(arrayMano[indexMano].objeto);
    let posObjeto = objeto.offset();

    $('#mano').css({ "left": posObjeto.left + objeto.width() / 4, "top": posObjeto.top + objeto.height() / 3 });
}

function cambiarArrayMano(nuevoArray) {
    arrayMano = nuevoArray;
    indexMano = 0;
    cambiarPosMano();
}

function activarModal() {
    let modoAccesible = Cookies.get('modoAccesible');

    $('#modAccesibilidad').modal().on($.modal.BEFORE_CLOSE, function (event, modal) {
        cambiarArrayMano(arrayObjetos);
    });

    if (!modoAccesible || modoAccesible == 0) 
        $('#toggleActivar').text('Activar');
    else 
        $('#toggleActivar').text('Desactivar');
    
    cambiarArrayMano(arrayModal);

    
}

function toggleAccesibilidad() {
    let modoAccesible = Cookies.get('modoAccesible');
    if (!modoAccesible || modoAccesible == 0) {
        modoAccesible = 1;
        $('#toggleActivar').text('Desactivar');
    } else {
        modoAccesible = 0;
        $('#toggleActivar').text('Activar');
    }
    Cookies.set('modoAccesible', modoAccesible, { expires: 30 });

    $(':focus').blur();

    comprobarModoAcc();
}

function comprobarModoAcc() {
    let modoAccesible = Cookies.get('modoAccesible');

    if(modoAccesible == 1) {
        $('#mano').css({ display: "initial" });
        cambiarPosMano();

    } else
        $('#mano').css({ display: "none" });
    
}