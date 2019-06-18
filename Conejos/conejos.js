var cociente;
var completado = true;

var sonidoInstrucciones = new Audio('instrucciones-conejos.ogg');
var sonidoFelicidades = new Audio('../minijuego-completado.ogg');
var sonidoCorrecto = new Audio('../correctosuave.wav');
var sonidoIncorrecto = new Audio('../vuelveaintentarlo.ogg');
var sonidoVictoria = new Audio('../victoria.wav');

var indexMano = 0;
var arrayMano = [
    {objeto: '#volverInstr', funcion: function() { window.location.href = $('#volverInstr').attr('href') }},
    {objeto: '#empezarInstr', funcion: function() { $('#empezarInstr').click() }}
];
var arrayZanahorias = [
    {objeto: '#botonVolver', funcion: function() { window.location.href = $('#botonVolver').attr('href') }},
    {objeto: '#botonPantC', funcion: function() { pantallaCompleta() }}
];
var arrayCirculos = [
    {objeto: '#botonVolver', funcion: function() { window.location.href = $('#botonVolver').attr('href') }},
    {objeto: '#botonPantC', funcion: function() { pantallaCompleta() }}
];
var arrayVictoria = [
    {objeto: '#volverVict', funcion: function() { window.location.href = $('#volverVict').attr('href') }},
    {objeto: '#empezarVict', funcion: function() { $('#empezarVict').click() }}
]
var arrayIncorrecto = [
    {objeto: '.close-modal', funcion: function() { $('.close-modal').click(); }}
]

function prepararDivision() {
    var maximo = 20;
    var dividendo = Math.floor(maximo*Math.random());
    var divisor = Math.floor(maximo*Math.random());

    if (dividendo % divisor != 0 || divisor > 5 || divisor == 1 || divisor == 0 || dividendo == 0) {
        prepararDivision();

    } else {
        //La ecuación
        $("#divZanahorias").after("<h2>" + dividendo + " <span class='fas fa-divide'></span> " + divisor + " = ?</h2>");

        //Añadimos el número de zanahorias a repartir
        for(var i=0; i<dividendo; i++) {
            $("#divZanahorias").append("<img src='zanahoria.png' class='zanahoria' id='Z" + i + "'></img>");
        }

        //Hacemos lo mismo con los conejos y sus círculos
        for(var i=0; i<divisor; i++) {
            $("#divConejos").append("<img src='conejo.png' class='conejo' id='" + i +"'></img>");
            $("#divCirculos").append("<div class='circulo' id='C" + i +"'></div>");
        }
        
        cociente = dividendo/divisor;
        var ancho = cociente * 5;

        if(ancho < 10) {
            ancho = 10;
        } else if (ancho > 20) {
            ancho = 20;
        }

        $(".circulo").css({"width" : ancho + "%"})

        calcularTamanyoConejo();
    }
}

function contarCantidad() {

    completado = true;

    for(var i=0; i<$("#divCirculos").children().length; i++)
        if($('#divCirculos').children().eq(i).children().length != cociente)
            completado = false;

    if(completado) {
        for(var i=0; i<$("#divConejos").children().length; i++)
            $('#divConejos').children().eq(i).attr("src", "conejoFeliz.png"); 

        modalVictoria();
    
    } else {
        $('#modIncorrecto').modal().on($.modal.BEFORE_CLOSE, function (event, modal) {
            cambiarArrayMano(arrayZanahorias);
        });
        sonidoIncorrecto.play();
        let fallos = Cookies.get('conejosFallos');
        if (!fallos) fallos = 0;
        Cookies.set('conejosFallos', ++fallos, { expires: 30 });
        cambiarArrayMano(arrayIncorrecto);
    }
        
}

$(document).ready(function() {
    comprobarModoAcc();

    prepararDivision();

    $(".zanahoria").draggable({
        start: function() {
            $(this).css({ "background": "yellow" });
        },
        stop: function() {
            $(this).css({ "background": "none" });
        }
    });

    $(".circulo").droppable({
        accept: ".zanahoria",
    
        drop: function(event, ui) {            
            sueltaZanahoria(ui.draggable, this);
        },

        over: function(event, ui) {
            $(ui.draggable).css({ "background": "orange" });
        },


        out: function(event, ui) {
            if($(ui.draggable).hasClass("zanahoriaDropped")) {
                $(this).children().last().remove();
                $(ui.draggable).removeClass("zanahoriaDropped");
            }

            $(ui.draggable).css({ "background": "yellow" });            
        }
    });
    $('#modInstrucciones').modal({ showClose: false }).on($.modal.BEFORE_CLOSE, function (event, modal) {
        let jugado = Cookies.get('conejosJugado');
        if (!jugado) jugado = 0;
        Cookies.set('conejosJugado', ++jugado, { expires: 30 });
        sonidoInstrucciones.pause();
        cambiarArrayMano(arrayZanahorias);
    });
    cambiarPosMano();
    sonidoInstrucciones.play();
    arrayZanahorias = creaArrayZanahorias();
    arrayCirculos = creaArrayCirculos();
});

//Se activa cada vez que se cambia el tamaño de la ventana
//Así se puede hacer responsive el padding del conejo, que depende del tamaño actual que tengan los círculos
$(window).on("resize", function(){
    calcularTamanyoConejo();
});

function sueltaZanahoria(zanahoria, circulo) {
    let $zanahoria = $(zanahoria);
    if (!$zanahoria.hasClass("zanahoriaDropped")) {
        //$(circulo.objeto).append("<p style='display: none'></p>");
        $zanahoria.addClass("zanahoriaDropped").css({position: 'initial', paddingBottom: '0px'});;
        $(circulo).append($zanahoria);
    }
    arrayZanahorias = creaArrayZanahorias();
    cambiarArrayMano(arrayZanahorias);
}

function calcularTamanyoConejo(){
    var paddingConejo = $(".circulo").innerWidth()/2 - $(".conejo").width()/2;
    $(".conejo").css({"padding-left" : paddingConejo + "px", "padding-right" : paddingConejo + "px"});
}

function reiniciar() {
    $(".zanahoria").removeClass("zanahoriaDropped").css({"top" : 0, "left" : 0});
    $('#divZanahorias').append($(".zanahoria")); //devuelve las zanahorias a la posición original
    $(".circulo").empty(); //borrar todos los hijos de los círculos
    $(".conejo").attr("src", "conejo.png");
}

function modalVictoria() {
    let aciertos = Cookies.get('conejosAciertos');
    if (!aciertos) aciertos = 0;
    Cookies.set('conejosAciertos', ++aciertos, { expires: 30 });

    sonidoVictoria.play();
    sonidoVictoria.addEventListener('ended', function () {
        sonidoFelicidades.play();
    });
    $('#modVictoria').on($.modal.OPEN, function (event, modal) {
        startConfetti();
        cambiarArrayMano(arrayVictoria);
    });
    $('#modVictoria').on($.modal.BEFORE_CLOSE, function (event, modal) {
        stopConfetti();
        location.reload();
    });
    setTimeout(function () {
        $('#modVictoria').modal({ fadeDuration: 500 });
    }, 2500);
}

function pantallaCompleta() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

/**
 * Funciones de accesibilidad (mano)
 */
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


function cambiarArrayMano(nuevoArray) {
    arrayMano = nuevoArray;
    indexMano = 0;
    cambiarPosMano();
}

function cambiarPosMano() {
    if (indexMano == arrayMano.length)
        indexMano = 0;

    let objeto = $(arrayMano[indexMano].objeto);
    let posObjeto = objeto.offset();
    let $mano = $('#mano')
    $mano.css({ "left": posObjeto.left + objeto.width() / 2 - $mano.children(":first").width() / 2, "top": posObjeto.top + objeto.height() / 3 });
}

function creaArrayCirculos() {
    let array = [];
    $('.circulo').each(function (i) {
       array.push({
           objeto: '#' + $(this).attr('id'),
           funcion: function () {
               sueltaZanahoria($('#mano > .zanahoria'), this.objeto);
           }
       }) 
    });
    array.push( {objeto: '#botonVolver', funcion: function() { window.location.href = $('#botonVolver').attr('href') }},
    {objeto: '#botonPantC', funcion: function() { pantallaCompleta() }});

    return array;
}
function creaArrayZanahorias() {
    let array = [];
    $('#divZanahorias > .zanahoria, #divCirculos .zanahoria').each(function (i) {
        array.push({
            objeto: '#' + $(this).attr('id'),
            funcion: function () {
                cogeZanahoria(this);
            }
        });
    });
    array.push( 
        {objeto: '#corregir', funcion: function () { contarCantidad() }},
        {objeto: '#reiniciar', funcion: function () { reiniciar() }},
        {objeto: '#botonVolver', funcion: function() { window.location.href = $('#botonVolver').attr('href') }},
        {objeto: '#botonPantC', funcion: function() { pantallaCompleta() }});

    return array;
}

function cogeZanahoria(zanahoria) {
    $(zanahoria.objeto).css({position: 'absolute', paddingBottom: '3em'}).removeClass('zanahoriaDropped');    
    $('#mano').append($(zanahoria.objeto));
    cambiarArrayMano(arrayCirculos);
}

function comprobarModoAcc() {
    let modoAccesible = Cookies.get('modoAccesible');

    if(modoAccesible == 1) {
        $('#mano').css({ display: "initial" });
        cambiarPosMano();

    } else
        $('#mano').css({ display: "none" });
    
}