var cociente;
var completado = true;

var sonidoInstrucciones = new Audio('instrucciones-conejos.ogg');
var sonidoFelicidades = new Audio('../minijuego-completado.ogg');
var sonidoCorrecto = new Audio('../correctosuave.wav');
var sonidoIncorrecto = new Audio('../vuelveaintentarlo.ogg');
var sonidoVictoria = new Audio('../victoria.wav');

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
            $("#divZanahorias").append("<img src='zanahoria.png' class='zanahoria'></img>");
        }

        //Hacemos lo mismo con los conejos y sus círculos
        for(var i=0; i<divisor; i++) {
            $("#divConejos").append("<img src='conejo.png' class='conejo' id='" + i +"'></img>");
            $("#divCirculos").append("<img src='circulo.png' class='circulo' id='C" + i +"'></img>");
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
        $('#modIncorrecto').modal();
        let fallos = Cookies.get('conejosFallos');
        if (!fallos) fallos = 0;
        Cookies.set('conejosFallos', ++fallos, { expires: 30 });
    }
        
}

$(document).ready(function() {

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
            if(!$(ui.draggable).hasClass("zanahoriaDropped")) {
                $(this).append("<p hidden></p>");
                $(ui.draggable).addClass("zanahoriaDropped");
            }
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
    });
;;
    sonidoInstrucciones.play();
});

//Se activa cada vez que se cambia el tamaño de la ventana
//Así se puede hacer responsive el padding del conejo, que depende del tamaño actual que tengan los círculos
$(window).on("resize", function(){
    calcularTamanyoConejo();
});

function calcularTamanyoConejo(){
    var paddingConejo = $(".circulo").innerWidth()/2 - $(".conejo").width()/2;
    $(".conejo").css({"padding-left" : paddingConejo + "px", "padding-right" : paddingConejo + "px"});
}

function reiniciar() {
    $(".zanahoria").css({"top" : 0, "left" : 0}); //devuelve las zanahorias a la posición original
    $(".zanahoria").removeClass("zanahoriaDropped");
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