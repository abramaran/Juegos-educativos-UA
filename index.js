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
        $('#cerrarModal').click(); 
        cambiarArrayMano(arrayObjetos); }},
];

var arrayMano = [
    {objeto: '#volverInstr', funcion: function() { window.location.href = $('#volverInstr').attr('href') }},
    {objeto: '#empezarInstr', funcion: function() { $('#empezarInstr').click() }}
];


$(document).ready(function() {
    cambiarArrayMano(arrayObjetos);

});

$(document).keyup(function (event) {
    if (event.which == 13) { //Se pulsa enter
        arrayMano[indexMano].funcion();
    }

    if (event.which == 32) { //Se pulsa el espacio
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
    if (!modoAccesible) {
        $('#toggleActivar').text('Desactivar');
    } else 
        $('#toggleActivar').text('Activar');

    $('#modAccesibilidad').modal();
}

function toggleAccesibilidad() {
    let modoAccesible = Cookies.get('modoAccesible');
    if (!modoAccesible) {
        modoAccesible = 0;
        $('#toggleActivar').text('Desactivar');
    } else {
        modoAccesible = 1;
        $('#toggleActivar').text('Activar');
    }
    Cookies.set('modoAccesible', modoAccesible, { expires: 30 });
}