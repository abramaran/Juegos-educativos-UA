const casillasTotales = 20;
var casillasAvanzadas = 0;
var parteJuego = 'tirar';
var resultadoDados = 0;
var posPeon;

var sonidoCubilete = new Audio('agitarDados.mp3');
var sonidoInstrucciones = new Audio('instrucciones-tablero.ogg');
var sonidoFelicidades = new Audio('../minijuego-completado.ogg');
var sonidoCorrecto = new Audio('../correctosuave.wav');
var sonidoIncorrecto = new Audio('../vuelveaintentarlo.ogg');
var sonidoVictoria = new Audio('../victoria.wav');

var indexMano = 0;
var arrayCubilete = [
    {objeto: '#cubilete', funcion: function() { $("#cubilete").click() }},
    {objeto: '#botonVolver', funcion: function() { window.location.href = $('#botonVolver').attr('href') }},
    {objeto: '#botonPantC', funcion: function() { pantallaCompleta() }}
];
var arrayCasillas = creaArrayManoCasillas();
var arrayVictoria = [
    {objeto: '#volverVict', funcion: function() { window.location.href = $('#volverVict').attr('href') }},
    {objeto: '#empezarVict', funcion: function() { $('#empezarVict').click() }}
]
var arrayMano = [
    {objeto: '#volverInstr', funcion: function() { window.location.href = $('#volverInstr').attr('href') }},
    {objeto: '#empezarInstr', funcion: function() { $('#empezarInstr').click() }}
];

$(function () {
    let color = Math.floor(Math.random() * 359);
    let colores = [];
    let $casillas = $('.casilla');

    let peon = $('#peon');
    peon.draggable({ revert: "invalid" });
    posPeon = peon.position();

    color = generarColores($casillas, colores, color);

    bordesCasillas($casillas, colores);
    $('#cubilete').click(tirarDados).on('dragstart', function (event) { event.preventDefault(); }); //evitar que arrastren la imagen

    $('#modInstrucciones').modal({ showClose: false }).on($.modal.BEFORE_CLOSE, function (event, modal) {
        let jugado = Cookies.get('tableroJugado');
        if (!jugado) jugado = 0;
        Cookies.set('tableroJugado', ++jugado, { expires: 30 });
        sonidoInstrucciones.pause();
        cambiarArrayMano(arrayCubilete);
    });
    cambiarPosMano();

    sonidoInstrucciones.play();
    arrayCasillas = creaArrayManoCasillas();

    // ---------- Funciones privadas -------------------
    function generarColores($casillas, colores, color) {
        for (let index = 0; index < $casillas.length; index++) {
            colores.push(color);
            color += 18;
            if (color > 359)
                color = 0;
        }
        let revertir = colores.slice(7, 13);
        revertir.reverse();
        revertir.forEach(function (elem, i) {
            colores[i + 7] = elem;
        });
        return color;
    }

    function bordesCasillas($casillas, colores) {
        $('.hueco').first().css('border-right', '4px solid rebeccapurple');
        $casillas.each(function (i) {
            $(this).css('background-color', `hsl(${colores[i]}, 100%, 78%)`);
            if ((i > 0 && i <= 6) || (i > 7 && i <= 12) || (i > 14)) {
                $(this).css('border-left', '0px');
            }
            if (i == 6 || i == 13) {
                $(this).css('border-top', '0px').css('border-bottom', '0px');
            }
        });
    }
});

function hacerDroppable(numero) {
    $('.casilla').droppable({
        classes: {
            //"ui-droppable-active": "ui-state-active", //Este da la solucion
            "ui-droppable-hover": "ui-state-hover"
        },
        drop: function (event, ui) {
            droppeado(numero, ui.draggable, this);
        }
    });
}

function droppeado(numero, ui, casilla) {
    if (casilla.id == numero) {
        $(casilla).addClass("ui-state-highlight").find("p").html("Dropped!");
        posPeon = $('#peon').position();
        let aciertos = Cookies.get('tableroAciertos');
        if (!aciertos)
            aciertos = 0;
        Cookies.set('tableroAciertos', ++aciertos, { expires: 30 });
        if (numero < 20) {
            parteJuego = 'tirar';
            cambiarArrayMano(arrayCubilete);
            sonidoCorrecto.play();
            $('#cubilete').addClass('emphasis');
        }
        else {
            modalVictoria();
        }
        $('#peon').effect("bounce", { times: 2 }).draggable('disable');
    }
    else {
        //ui.draggable.animate(ui.draggable.data("uiDraggable").originalPosition, "slow");
        
        ui.css({position: 'absolute'}).animate(posPeon, "slow");
        
        sonidoIncorrecto.play();
        let fallos = Cookies.get('tableroFallos');
        if (!fallos)
            fallos = 0;
        Cookies.set('tableroFallos', ++fallos, { expires: 30 });
    }
}

/**
 * Cambia las caras de los dados para que salga otro numero.
 */
function recolocaDados(numA, numB) {
    $('.cube > .front').eq(0).css('background-image', 'url("dado/' + numA + '.svg"');
    $('.cube > .back').eq(0).css('background-image', 'url("dado/' + (7 - numA) + '.svg"');
    if (numA == 6) numA = 1;
    numA++;
    $('.cube > .right').eq(0).css('background-image', 'url("dado/' + numA + '.svg"');
    $('.cube > .left').eq(0).css('background-image', 'url("dado/' + (7 - numA) + '.svg"');
    if (numA == 6) numA = 2;
    numA++;
    $('.cube > .top').eq(0).css('background-image', 'url("dado/' + numA + '.svg"');
    $('.cube > .bottom').eq(0).css('background-image', 'url("dado/' + (7 - numA) + '.svg"');

    // Ahora para el segundo dado
    $('.cube > .front').eq(1).css('background-image', 'url("dado/' + numB + '.svg"');
    $('.cube > .back').eq(1).css('background-image', 'url("dado/' + (7 - numB) + '.svg"');
    if (numB == 6) numB = 1;
    numB++;
    $('.cube > .right').eq(1).css('background-image', 'url("dado/' + numB + '.svg"');
    $('.cube > .left').eq(1).css('background-image', 'url("dado/' + (7 - numB) + '.svg"');
    if (numB == 6) numB = 2;
    numB++;
    $('.cube > .top').eq(1).css('background-image', 'url("dado/' + numB + '.svg"');
    $('.cube > .bottom').eq(1).css('background-image', 'url("dado/' + (7 - numB) + '.svg"');

}

function tirarDados(e) {
    e.preventDefault;
    if (parteJuego == 'tirar') {
        let cube = document.querySelectorAll('.cube');
        let wrap = document.querySelectorAll('.wrap');
        let cubilete = $('#cubilete');

        cubilete.removeClass('emphasis');
        resetearAnimacion(cubilete, wrap, cube);
        let { valorA, valorB } = valoresDados();
        recolocaDados(valorA, valorB);
        resultadoDados = casillasAvanzadas + valorA + valorB;
        hacerDroppable(resultadoDados);
        casillasAvanzadas += valorA + valorB;
        playAnimacion(cubilete, cube, wrap);
        parteJuego = 'mover';
        cambiarArrayMano(arrayCasillas);
        $('#peon').draggable('enable');
    }

    function playAnimacion(cubilete, cube, wrap) {
        sonidoCubilete.play();
        cubilete.effect("shake", { times: 4, direction: 'up' }, 2000);
        cubilete.attr("src", "cubileteesfuerzo.png");
        setTimeout(function () {
            cubilete.attr("src", "cubiletesalir.png");
            setTimeout(function () {
                cubilete.attr("src", "cubiletemio.png");
            }, 2000);
        }, 1500);
        cube[0].classList.add('cube-anim');
        wrap[0].classList.add('wrap-anim');
        cube[1].classList.add('cube-anim');
        wrap[1].classList.add('wrap-anim');
    }

    function valoresDados() {
        let valorA = Math.floor(Math.random() * 6 + 1);
        let valorB = Math.floor(Math.random() * 6 + 1);
        //Comprobar que el niño no se pueda pasar ni quedarse a una casilla de la meta.
        if (casillasAvanzadas + valorA + valorB == casillasTotales - 1) {
            console.log('henlo');
            if (valorA > 1) {
                valorA--;
            } else if (valorB > 1) {
                valorB--;
            } else {
                valorA++;
            }
        } else if (casillasAvanzadas + valorA + valorB > casillasTotales) {
            valorA = Math.floor(Math.random() * (casillasTotales - 1 - casillasAvanzadas) + 1);
            valorB = casillasTotales - casillasAvanzadas - valorA;
        }
        return { valorA, valorB };
    }

    function resetearAnimacion(cubilete, wrap, cube) {
        let anchoCubilete = cubilete.width();
        let anchoWrap = $('.wrap').width();
        for (let i = 0; i < wrap.length; i++) {
            const icube = cube[i];
            const iwrap = wrap[i];
            icube.classList.remove('cube-anim');
            iwrap.classList.remove('wrap-anim');
            iwrap.style.top = cubilete.position().top - 10 + 'px';
            iwrap.style.left = cubilete.position().left + (anchoCubilete * 0.25 - anchoWrap / 2 + anchoCubilete * 0.5 * i) + 'px';
            iwrap.style.zIndex = -1 - i;
            iwrap.style.setProperty('--ydado', -40 + (Math.random() * 5 + 1) + 'vh');
            iwrap.style.setProperty('--xdado', (Math.pow(-1, i + 1) * (Math.random() * 2 + 3) + 'vh'));
            iwrap.style.setProperty('--delayDado', (Math.random() * 0.7 + 1.5) + 's');
            icube.offsetWidth;
        }
    }
}

function modalVictoria() {
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

    console.log(posObjeto);
    $('#mano').css({ "left": posObjeto.left + objeto.width() / 4, "top": posObjeto.top + objeto.height() / 3 });
}

function creaArrayManoCasillas() {
    let casillas = $('.casilla');
    let array = [];
    
    for (let i = 0; i < 7; i++) {
        const element = casillas[i];
        array.push( {objeto: '#' + $(element).attr('id'), funcion: function() { 
            //let coorAnim = {top: $(element).position().top - posPeon.top, left: $(element).position().left - posPeon.left};
            $('#peon').css({position: 'absolute'}).animate($(element).position(), {complete: function() {droppeado(resultadoDados, $('#peon'), element)}} ) }
        } );
    }
    for (let i = 12; i >= 7; i--) {
        const element = casillas[i];
        array.push( {objeto: '#' + $(element).attr('id'), funcion: function() { 
            $('#peon').css({position: 'absolute'}).animate($(element).position(), {complete: function() {droppeado(resultadoDados, $('#peon'), element)}} ) }
        } );
    }
    for (let i = 13; i < 20; i++) {
        const element = casillas[i];
        array.push( {objeto: '#' + $(element).attr('id'), funcion: function() { 
            $('#peon').css({position: 'absolute'}).animate($(element).position(), {complete: function() {droppeado(resultadoDados, $('#peon'), element)}} ) }
        } );
    }
    
    array.push( {objeto: '#botonVolver', funcion: function() { window.location.href = $('#botonVolver').attr('href') }},
                {objeto: '#botonPantC', funcion: function() { pantallaCompleta() }});

    return array;
}

function cambiarArrayMano(nuevoArray) {
    arrayMano = nuevoArray;
    indexMano = 0;
    cambiarPosMano();
}