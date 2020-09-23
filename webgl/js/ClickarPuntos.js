/**
 *  Seminario GPC #1. Hacer click y pintar un punto rojo
*/

// SHADER DE VERTICES
var VSHADER_SOURCE = 
'attribute vec4 posicion;        \n' +
'void main(){                    \n' +
'    gl_Position = posicion;     \n' +
'    gl_PointSize = 10.0;        \n' +
'}                               \n' ;

// SHADER DE FRAGMENTOS
var FSHADER_SOURCE = 
'varying highp vec4 vColor;                  \n' +
'void main(){                                \n' +
'    gl_FragColor = vColor                   \n' +
'}                                           \n' ;

function main()
{
    // recuperar el canvas (lienzo)
    var canvas = document.getElementById("canvas");

    // obtener el contexto de render (herramientas de dibujo)
    var gl = getWebGLContext(canvas);

    // fijar color de borrado del lienzo
    gl.clearColor( 0.0, 0.0, 0.3, 1.0);

    // Cargar, compilar y montar los shaders en un 'program'
    if( !initShaders( gl, VSHADER_SOURCE, FSHADER_SOURCE))
    {
        console.log("Fallo la carga de los shaders");
        return;
    }

    gl.clear(gl.COLOR_BUFFER_BIT);

    // enlace del script con el shader
    var coordenadas = gl.getAttribLocation(gl.program, "posicion");
    
    var bufferVertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
    gl.vertexAttribPointer(coordenadas,3,gl.FLOAT, false,0,0);
    gl.enableVertexAttribArray(coordenadas);

    /*var color = gl.getAttribLocation(gl.program, "vColor");
    var bufferColor = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferColor);
    gl.vertexAttribPointer(color,4,gl.FLOAT, false,0,0);
    gl.enableVertexAttribArray(color);*/

    // escuchar eventos de raton 
    canvas.onmousedown = function(evento) { click(evento, gl, canvas, coordenadas); };
}

var clicks =[]

function click(evento, gl, canvas, coordenadas)
{
    // coordenadas del click
    var x = evento.clientX;
    var y = evento.clientY;
    var rect = evento.target.getBoundingClientRect();

    // conversion de coordenadas al sistema de webgl por defecto
    // cuadradado de 2x2 centrado

    x = ((x - rect.left)-canvas.width/2) * 2/canvas.width;
    y = (canvas.height/2-(y-rect.top)) * 2/canvas.height;

    // guardar coordenadas
    clicks.push(x); clicks.push(y); clicks.push(0.0);

    var puntos = new Float32Array(clicks);

    // borrar el canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // insertar las coordendas como atributo y dibujarlos uno a uno
    /*for( var i = 0; i < puntos.length; i += 2)
    {
        gl.vertexAttrib3f(coordenadas, puntos[i], puntos[i+1], 0.0);
        gl.drawArrays( gl.POINTS, 0, 1);
    }*/
    
    
    gl.bufferData(gl.ARRAY_BUFFER, puntos, gl.STATIC_DRAW);
    
    gl.drawArrays(gl.POINTS,0,puntos.length/3);
    gl.drawArrays(gl.LINE_STRIP,0,puntos.length/3);
}


