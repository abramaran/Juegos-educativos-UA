$(function () {
    creaEcuacion();
    $('#modCaptcha').modal({ showClose: false, clickClose: false }).on($.modal.BEFORE_CLOSE, function (event, modal) {
        rellenarStats();
    });
});

function creaEcuacion() {
    let divisor, igual;
    divisor = Math.round(Math.random() * 10 + 1);
    igual = Math.round(Math.random() * 10 + 1);
    $('#ecuacion').text('x/' + divisor + ' = ' + igual);
    $('#validar').click({param1: (igual*divisor)}, checkCaptcha);
}

function checkCaptcha(event) {
    if ($('#captcha').val() == event.data.param1) {
        $.modal.close();
    } else {
        $('#falloCaptcha').css('visibility', 'visible');
        creaEcuacion();
    }
}

function borrarCookies(juego) {
    Cookies.remove(juego + 'Jugado');
    Cookies.remove(juego + 'Aciertos');
    Cookies.remove(juego + 'Fallos');
    $('#' + juego.charAt(0) + 'Jugado').text(0);
    $('#' + juego.charAt(0) + 'Aciertos').text(0);
    $('#' + juego.charAt(0) + 'Fallos').text(0);
}

function rellenarStats() {
    let tJugado = Cookies.get('tableroJugado');
    if (!tJugado)
        tJugado = 0;
    $('#tJugado').text(tJugado);
    let tAciertos = Cookies.get('tableroAciertos');
    if (!tAciertos)
        tAciertos = 0;
    $('#tAciertos').text(tAciertos);
    let tFallos = Cookies.get('tableroFallos');
    if (!tFallos)
        tFallos = 0;
    $('#tFallos').text(tFallos);
    let bJugado = Cookies.get('balanzaJugado');
    if (!bJugado)
        bJugado = 0;
    $('#bJugado').text(bJugado);
    let bAciertos = Cookies.get('balanzaAciertos');
    if (!bAciertos)
        bAciertos = 0;
    $('#bAciertos').text(bAciertos);
    let bFallos = Cookies.get('balanzaFallos');
    if (!bFallos)
        bFallos = 0;
    $('#bFallos').text(bFallos);
    let cJugado = Cookies.get('conejosJugado');
    if (!cJugado)
        cJugado = 0;
    $('#cJugado').text(cJugado);
    let cAciertos = Cookies.get('conejosAciertos');
    if (!cAciertos)
        cAciertos = 0;
    $('#cAciertos').text(cAciertos);
    let cFallos = Cookies.get('conejosFallos');
    if (!cFallos)
        cFallos = 0;
    $('#cFallos').text(cFallos);
}
