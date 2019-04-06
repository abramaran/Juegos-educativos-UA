/* function pantallaCompleta() {
    var elem = document.documentElement;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }
} */

function pantallaCompleta() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

$(function () {
    let color = Math.floor(Math.random() * 359);
    let colores = [];
    let $casillas = $('.casilla');
    
    color = generarColores($casillas, colores, color);

    bordesCasillas($casillas, colores);
    $('#cubilete').click(function() {
        $('#cubilete').effect( "shake", {times:4, direction:'up'}, 1000 );
    })
})

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