var sonidoInstrucciones = new Audio('instrucciones-balanza.ogg');
var sonidoFelicidades = new Audio('../minijuego-completado.ogg');
var sonidoCorrecto = new Audio('../correctosuave.wav');
var sonidoIncorrecto = new Audio('../vuelveaintentarlo.ogg');
var sonidoVictoria = new Audio('../victoria.wav');
/* var sonidoMenuPrincipal = new Audio('../menu-principal.ogg');
var sonidoReiniciar = new Audio('../reiniciar.ogg');
 */


var indexMano = 0;
var arrayObjetos = [
    {objeto: '#1', funcion: function() { desplazar('#1'); }},
    {objeto: '#2', funcion: function() { desplazar('#2'); }},
    {objeto: '#3', funcion: function() { desplazar('#3'); }},
    {objeto: '#4', funcion: function() { desplazar('#4'); }},
    {objeto: '#5', funcion: function() { desplazar('#5'); }},
    {objeto: '#6', funcion: function() { desplazar('#6'); }},
    {objeto: '#7', funcion: function() { desplazar('#7'); }},
    {objeto: '#8', funcion: function() { desplazar('#8'); }},
    {objeto: '#9', funcion: function() { desplazar('#9'); }},
    {objeto: '#botonVolver', funcion: function() { window.location.href = $('#botonVolver').attr('href') }},
    {objeto: '#botonPantC', funcion: function() { pantallaCompleta() }}
];

var arrayVictoria = [
    {objeto: '#volverVict', funcion: function() { window.location.href = $('#volverVict').attr('href') }},
    {objeto: '#empezarVict', funcion: function() { $('#empezarVict').click() }}
];

var arrayMano = [
    {objeto: '#volverInstr', funcion: function() { window.location.href = $('#volverInstr').attr('href') }},
    {objeto: '#empezarInstr', funcion: function() { $('#empezarInstr').click() }}
];

function cargarImagenes() {
    var imagenesSuma = [["Peso Suma/S1.png", 1], ["Peso Suma/S2.png", 2], ["Peso Suma/S3.png", 3], ["Peso Suma/S4.png", 4],
                        ["Peso Suma/S5.png", 5], ["Peso Suma/S6.png", 6], ["Peso Suma/S7.png", 7], ["Peso Suma/S8.png", 8]];
      
    var imagenesTotal = [["Peso Total/T2.png", 2], ["Peso Total/T3.png", 3], ["Peso Total/T4.png", 4], ["Peso Total/T5.png", 5],
                         ["Peso Total/T6.png", 6], ["Peso Total/T7.png", 7], ["Peso Total/T8.png", 8], ["Peso Total/T9.png", 9]];


    var tamanyo = imagenesSuma.length;
    var suma = Math.floor(tamanyo*Math.random());
    var total = Math.floor(tamanyo*Math.random());

    //Para evitar restas donde la pesa de la derecha sea menor que la de la izquierda
    //Le sumo uno para que coja números que, como mínimo, se lleven 2 unidades (se nota más el efecto de la balanza)
    if(parseInt(imagenesSuma[suma][1]) + 1 < parseInt(imagenesTotal[total][1])) {    
        document.getElementById("pesoSuma").src = imagenesSuma[suma][0];
        document.getElementById("pesoTotal").src = imagenesTotal[total][0];

    } else {
        cargarImagenes();
    }
}

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


$(document).ready(function() {
    comprobarModoAcc();

    cargarImagenes();

    //Estas líneas son para extraer el número que hay en el src de la imagen
    var numSuma = parseFloat($("#pesoSuma").attr("src").replace(/[^0-9]+/g, ''));
    var numTotal = parseFloat($("#pesoTotal").attr("src").replace(/[^0-9]+/g, ''));

    //La ecuación
    $("#divEcuacion").append("<h2>" + numSuma + " <span class='fas fa-plus'></span> ? = " + numTotal + "</h2>");

    //Para nivelar las balanzas, hay que repartir un margen del 20% de manera proporcional entre las pesas
    //Aún así, ya hay un margin-top fijo mínimo de 8%
    var marginSuma = 5 + numSuma/(numSuma+numTotal) * 20;
    var marginTotal = 5 + numTotal/(numSuma+numTotal) * 20;

    $("#pesoSuma").css({"margin-top": marginSuma + "%"});
    $("#pesoTotal").css({"margin-top": marginTotal + "%"});

    $(".draggable").draggable({
        start: function() {
            $(this).css({"background": "yellow"});
        },
        stop: function() {
            $(this).css({"background": "none", "position": "relative"});
        }
    });
    

    $("#pesoSuma").droppable({
        accept: ".draggable",
    
        drop: function(event, ui) {
            droppeado(ui.draggable);
        },

        over: function(event, ui) {
            $(ui.draggable).css({"background": "orange"});
        },

        
        out: function(event, ui) {
            sacarPesa(ui.draggable);
        }
    });

    $('#pesas, #balanza').hide();
    $('#modInstrucciones').modal({ showClose: false, clickClose: true }).on($.modal.BEFORE_CLOSE, function (event, modal) {
        let jugado = Cookies.get('balanzaJugado');
        if (!jugado) jugado = 0;
        Cookies.set('balanzaJugado', ++jugado, { expires: 30 });

    });
    $('#modInstrucciones').on($.modal.BEFORE_CLOSE, function (event, modal) {
        $('#pesas, #balanza').show();
        sonidoInstrucciones.pause();
        cambiarArrayMano(arrayObjetos);
    });

    cambiarPosMano();

;;
    sonidoInstrucciones.play();
}
);


//Cada vez que cambia el tamaño de la pantalla, se vuelven a hacer los cálculos necesarios para recolocar la pesa suelta
$(window).on("resize", function(){
    var marginPesa = parseFloat($("#pesoSuma").css("margin-top")) + parseFloat($(".dentro").css("height"))
                     - parseFloat($("#pesoSuma").css("height")) / 40;

    $(".dentro").css({"margin-top": marginPesa + "px"});
});


//Si se ha restado bien, muestra un mensaje modal
function comprobarResultado(pesa) {
    var numSuma = parseFloat($("#pesoSuma").attr("src").replace(/[^0-9]+/g, ''));
    var numTotal = parseFloat($("#pesoTotal").attr("src").replace(/[^0-9]+/g, ''));

    if(pesa == (numTotal - numSuma))
        modalVictoria();
    else {
        sonidoIncorrecto.play();
        let fallos = Cookies.get('balanzaFallos');
        if (!fallos) fallos = 0;
        Cookies.set('balanzaFallos', ++fallos, { expires: 30 });
    }
}

function modalVictoria() {
    let aciertos = Cookies.get('balanzaAciertos');
    if (!aciertos) aciertos = 0;
    Cookies.set('balanzaAciertos', ++aciertos, { expires: 30 });

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
        $('#pesas, #balanza').fadeOut(500);
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


function droppeado(ui) {
    //Antes de nada, comprobamos que no haya ya una pesa en la balanza. Si es el caso, devolvemos el draggable a su posición
    if($("#balanza img").hasClass("dentro")) {
        $(ui).draggable('option','revert',true);
        return false;
    }

    var pesa = parseFloat(ui.attr("id"));

    //Cuando soltamos la pesa en la balanza, la borramos de la zona donde están todas y la añadimos al <div> de la balanza
    //Usamos la clase "dentro" para ajustar las propiedades
    $(ui).remove();
    $("#pesoSuma").after("<img id='" + pesa + "' class='draggable dentro' src='Pesas/" + pesa + ".png'></img>");

    $(".dentro").draggable({
        start: function() {
            $(this).css({"background": "yellow"});
        },
        stop: function() {
            $(this).css({"background": "none"});
        }
    });


    //Calculamos dónde colocar la pesa que hemos soltado de manera que quede bien situada dentro del peso
    var marginPesa = parseFloat($("#pesoSuma").css("margin-top")) + parseFloat($(".dentro").css("height"))
                    - parseFloat($("#pesoSuma").css("height")) / 40;

    $(".dentro").css({"margin-top" : marginPesa + "px"})

    var numSuma = parseFloat($("#pesoSuma").attr("src").replace(/[^0-9]+/g, ''));
    var numTotal = parseFloat($("#pesoTotal").attr("src").replace(/[^0-9]+/g, ''));

    //Ahora, para la animación, repetimos el mismo proceso que antes: partir del valor de la pesa que 
    //droppeemos, se repartirá el margen de manera proporcional.
    var marginSuma = 5 + (numSuma+pesa)/(numSuma+pesa+numTotal) * 20;
    var marginTotal = 5 + numTotal/(numSuma+pesa+numTotal) * 20;


    //Guardamos el margen actual del peso de la suma para futuras operaciones
    var marginAntes = parseFloat($("#pesoSuma").css("margin-top"));


    //Procedemos con el efecto de los pesos subiendo y bajando
    $("#pesoSuma").animate({"margin-top": marginSuma + "%"}, "slow");
    $("#pesoTotal").animate({"margin-top": marginTotal + "%"}, "slow");

    //Asignamos manualmente el nuevo margin-top, ya que .animate() no se lo asigna
    $("#pesoSuma").css({"margin-top": marginSuma + "%"});

    //A continuación, calculamos el margin-top de la pesa suelta a partir de cuánto haya variado el margin de #pesoSuma
    //Todo este costoso proceso se debe a que, para obtener un diseño responsive, trabajamos con porcentajes. No obstante,
    //a la hora de trabajar con la pesa suelta, para que se mantenga en una posición absoluta, hay que hacer numerosos
    //cálculos para obtener medidas en px pero que a la vez sean responsive.
    marginPesa = parseFloat($(".dentro").css("margin-top")) + parseFloat($("#pesoSuma").css("margin-top")) - marginAntes;

    //Después de finalizar la animación, comprobamos si la resta es correcta, pasándole el valor de la pesa droppeada
    $(".dentro").animate({"margin-top": marginPesa + "px"}, "slow", function(){
        comprobarResultado(pesa);
        cambiarPosMano();            
    });
}


function sacarPesa(pesa) {
    var numSuma = parseFloat($("#pesoSuma").attr("src").replace(/[^0-9]+/g, ''));
    var numTotal = parseFloat($("#pesoTotal").attr("src").replace(/[^0-9]+/g, ''));
    //Reseteamos todo
    marginSuma = 5 + numSuma/(numSuma+numTotal) * 20;
    marginTotal = 5 + numTotal/(numSuma+numTotal) * 20;

    $("#pesoSuma").animate({"margin-top": marginSuma + "%"}, "slow");
    $("#pesoTotal").animate({"margin-top": marginTotal + "%"}, "slow");

    //Colocamos la pesa suelta en su <div> original y reseteamos sus propiedades
    $("#pesas").append($(pesa));
    $(pesa).removeClass("dentro");
    $(pesa).css({"margin-top": 0, "left": 0 + "px", "top": 0 + "px"});

    $(".draggable").draggable({
        start: function() {
            $(this).css({"background": "yellow"});
        },
        stop: function() {
            $(this).css({"background": "none", "margin-top": 0, "position": "relative", "left": 0 + "px", "top": 0 + "px"});
        }
    });
}


function desplazar(pesa) {

    if($(pesa).hasClass("dentro")) {
        sacarPesa(pesa);
        cambiarPosMano();

    } else {
        if(!$("#balanza img").hasClass("dentro")) {
            $(pesa).animate($('#pesoSuma').position(), {
                complete: function() { 
                    droppeado($(pesa));
                }
            });
        }
    }
}


function cambiarArrayMano(nuevoArray) {
    arrayMano = nuevoArray;
    indexMano = 0;
    cambiarPosMano();
}

function comprobarModoAcc() {
    let modoAccesible = Cookies.get('modoAccesible');

    if(modoAccesible == 1) {
        $('#mano').css({ display: "initial" });
        cambiarPosMano();

    } else
        $('#mano').css({ display: "none" });
    
}