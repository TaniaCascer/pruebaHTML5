var miTablero;
var temporizador;
var miCronometro;

///////////////////////////////////////////////////////////////////////////////
/* Objeto cronometro. */
///////////////////////////////////////////////////////////////////////////////
		 
function incrementar()
{
if (!miTablero.juegoFinalizado)
	{
	this.cuenta++;
	$("#cronometro").html(this.cuenta);
	temporizador = setTimeout("miCronometro.incrementar()", 1000);
	}
}

function cronometro(cuenta)
{
this.cuenta = cuenta;
$("#cronometro").html(this.cuenta);
this.incrementar = incrementar;
}

///////////////////////////////////////////////////////////////////////////////
/* Objeto recopilador de imagenes. */
///////////////////////////////////////////////////////////////////////////////

function extraerImagen()
{
var posicionAleatoria = Math.floor(Math.random() * this.imagenes.length);
var imagenEscogida = this.imagenes.splice(posicionAleatoria, 1)[0];
return imagenEscogida;
}

function recopiladorImagenes(numeroCasillas)
{
this.imagenes = new Array(numeroCasillas / 2);
for (i = 0; i < this.imagenes.length; i++)
	{
	this.imagenes[i] = "imagen_" + (i+1); 
	}
this.imagenes = this.imagenes.concat(this.imagenes);
this.extraerImagen = extraerImagen;
}

///////////////////////////////////////////////////////////////////////////////
/* Objeto casilla. */
///////////////////////////////////////////////////////////////////////////////

function mismaPosicion(otraPosX, otraPosY)
{
return this.posX == otraPosX && this.posY == otraPosY;
}

function estaVacia()
{
return this.posX == -1 && this.posY == -1 && this.urlImagen == "";
}

function vaciar()
{
this.posX = -1;
this.posY = -1;
this.urlImagen = "";
}

function copiar(nuevaCasilla)
{
this.posX = nuevaCasilla.posX;
this.posY = nuevaCasilla.posY;
this.urlImagen = nuevaCasilla.urlImagen;
}

function casilla(posX, posY, urlImagen)
{
this.posX = posX;
this.posY = posY;
this.urlImagen = urlImagen;
this.descubierta = false;
this.estaVacia = estaVacia;
this.copiar = copiar;
this.vaciar = vaciar;
this.mismaPosicion = mismaPosicion;
}

///////////////////////////////////////////////////////////////////////////////
/* Objeto tablero. */
///////////////////////////////////////////////////////////////////////////////

function comprobarMovimientos(posX, posY)
{
var casillaPinchada = miTablero.casillas[posX * Math.sqrt(miTablero.numeroCasillas) + posY];
casillaPinchada.descubierta = true;
if (miTablero.movimiento1.estaVacia())
	{
	miTablero.movimiento1.copiar(casillaPinchada);
	}
else if (!miTablero.movimiento1.mismaPosicion(posX, posY))
	{
	$("#numeroIntentos").html(parseInt($("#numeroIntentos").html()) + 1);
	miTablero.movimiento2.copiar(miTablero.casillas[posX * Math.sqrt(miTablero.numeroCasillas) + posY]);
	if (miTablero.movimiento1.urlImagen != miTablero.movimiento2.urlImagen)
		{
		miTablero.casillas[miTablero.movimiento1.posX * Math.sqrt(miTablero.numeroCasillas) + miTablero.movimiento1.posY].descubierta = false;
		miTablero.casillas[miTablero.movimiento2.posX * Math.sqrt(miTablero.numeroCasillas) + miTablero.movimiento2.posY].descubierta = false;
		$("#img_" + miTablero.movimiento1.posX + "_" + miTablero.movimiento1.posY).slideUp(500);
		$("#img_" + miTablero.movimiento2.posX + "_" + miTablero.movimiento2.posY).slideUp(500);
		}
	else
		miTablero.numeroAciertos++;
	if (miTablero.numeroAciertos == miTablero.numeroCasillas / 2)
		{
		clearTimeout(temporizador);
		miTablero.juegoFinalizado = true;		
		$("ol").append("<li>Finalizado en " + $("#cronometro").html() + " segundos, tras " + $("#numeroIntentos").html() + " intentos</li>");
		var record = $("#record").html();
		if (record == "")
			$("#record").html("Finalizado en <span id='mejorTiempo'>" + $("#cronometro").html() + "</span> segundos, tras <span id='mejorIntentos'>" + $("#numeroIntentos").html() + "</span> intentos");
		else
			{
			var mejorTiempo = $("#mejorTiempo");
			var mejorIntentos = $("#mejorIntentos");
			if (parseInt($("#cronometro").html()) < parseInt(mejorTiempo.html()))
				{
				mejorTiempo.html($("#cronometro").html());
				mejorIntentos.html($("#numeroIntentos").html());
				}
			}
		$("#enhorabuena").slideDown();
		}
	miTablero.movimiento1.vaciar();
	miTablero.movimiento2.vaciar();
	}
miTablero.esperandoMovimiento = true;
}

function mostrarCasilla(posX, posY)
{
if (miTablero.esperandoMovimiento == false)
	return;
if ((miTablero.casillas[posX * Math.sqrt(miTablero.numeroCasillas) + posY].descubierta) == false)
	{
	esperandoMovimiento = false;
	$("#img_" + posX + "_" + posY).slideDown(500, function(){miTablero.comprobarMovimientos(posX, posY);});
	}
}

function agregarCasilla(posX, posY)
{
var nuevaImagen = this.miRecopiladorImagenes.extraerImagen();
var nuevaCasilla = new casilla(posX, posY, nuevaImagen);
this.casillas[posX * Math.sqrt(this.numeroCasillas) + posY] = nuevaCasilla;
var nuevaCasillaHTML = "<td class='casilla' id='casilla_" + posX + "_" + posY + "'></td>";
$("#fila_" + posX).append(nuevaCasillaHTML);
$("#casilla_" + posX + "_" + posY).append("<img id='img_" + posX + "_" + posY + "' class='oculto' src='imagenes/" + nuevaImagen + ".jpg' />");
$("#casilla_" + posX + "_" + posY).click(function(){miTablero.mostrarCasilla(posX, posY)});
}

function rellenar()
{
for (i = 0; i < Math.sqrt(this.numeroCasillas); i++)
	{
	var nuevaFila = "<tr id='fila_" + i + "'></tr>";
	$("table").append(nuevaFila);
	for (j = 0; j < Math.sqrt(this.numeroCasillas); j++)
		{
		this.agregarCasilla(i, j);
		}
	}
}

function reiniciar()
{
$("#numeroIntentos").html("0");
miTablero.miRecopiladorImagenes = new recopiladorImagenes(miTablero.numeroCasillas);
miTablero.rellenar();
miCronometro = new cronometro(0);
this.movimiento1 = new casilla(-1, -1, "");
this.movimiento2 = new casilla(-1, -1, "");
this.numeroAciertos = 0;
this.juegoFinalizado = false;
this.esperandoMovimiento = true;
clearTimeout(temporizador);
temporizador = setTimeout("miCronometro.incrementar()", 1000);
}

function tablero(numeroCasillas)
{
this.numeroCasillas = Math.pow(Math.floor(Math.sqrt(numeroCasillas)), 2);
this.casillas = new Array(this.numeroCasillas);
this.miRecopiladorImagenes = new recopiladorImagenes(this.numeroCasillas);
this.movimiento1 = new casilla(-1, -1, "");
this.movimiento2 = new casilla(-1, -1, "");
this.numeroAciertos = 0;
this.juegoFinalizado = false;
this.rellenar = rellenar;
this.agregarCasilla = agregarCasilla;
this.mostrarCasilla = mostrarCasilla;
this.comprobarMovimientos = comprobarMovimientos;
this.esperandoMovimiento = true;
this.reiniciar = reiniciar;
}

///////////////////////////////////////////////////////////////////////////////
/* Programa de carga. */
///////////////////////////////////////////////////////////////////////////////

$(document).ready(
	function(){
		miTablero = new tablero(18);
		miTablero.rellenar();
		miCronometro = new cronometro(0);
		temporizador = setTimeout("miCronometro.incrementar()", 1000);
		$("#reiniciar").click(
			function(){
				miTablero.reiniciar();
				$("#enhorabuena").slideUp();
				$("#tablero").empty();
				miTablero.miRecopiladorImagenes = new recopiladorImagenes(miTablero.numeroCasillas);
				miTablero.rellenar();
				miCronometro = new cronometro(0);
				
				}
			)
		}
);