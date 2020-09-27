/**
*
*   Practica GPC #2. Robot
*   
*/

//Variables imprescindibles
var renderer, scene, camera;

//Variables globales
var robot, angulo = 0;

//Acciones
init();
loadScene();
render();

function init()
{
    //Crear el motor, la escena y la camara

    //Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0xFFFFFF));

    document.getElementById("container").appendChild(renderer.domElement);

    //Escena
    scene = new THREE.Scene();

    //Camara
    var ar = window.innerWidth/window.innerHeight;
    camera = new THREE.PerspectiveCamera(40, ar, 0.1, 10000);
    scene.add(camera);
    camera.position.set(300,300,300);
    
    camera.lookAt(new THREE.Vector3(0,100,0));
}

function loadScene()
{
    //Cargar la escena con objetos

    //Materiales
    var material = new THREE.MeshBasicMaterial({color: 'red', wireframe:true});
    robot = new THREE.Object3D();
    //Geometrías
    var geometry = new THREE.PlaneGeometry(1000,1000,20);                                                                                                                                                                                                                                                                                                                                                                                                                        
    var plane = new THREE.Mesh( geometry, material );
    
    plane.position.set(0,0,0);
    plane.rotation.x = 90*Math.PI/180;
    

    scene.add(plane);
    //Base
    var geometry = new THREE.CylinderGeometry( 50, 50, 15, 20 );
    var cylinder = new THREE.Mesh( geometry, material );
    cylinder.position.x = -100;
    cylinder.position.z = -100;
    cylinder.position.y = 15/2;
    
    
    var base = new THREE.Object3D();
    base.add(cylinder);
    base.add( new THREE.AxisHelper(200));

    //Brazo
    var brazo = new THREE.Object3D();
    
    
    var geometry = new THREE.CylinderGeometry( 18, 18, 20, 32 );
    var eje = new THREE.Mesh( geometry, material );
    
    eje.position.x = -100;
    eje.position.z = -100;
    eje.position.y = 18;
    eje.rotation.x = 90*Math.PI/180;
    
    
    brazo.add( eje );
    

   
    var geometry = new THREE.BoxGeometry(18,120,10);
    var esparrago = new THREE.Mesh(geometry, material);
    esparrago.position.x = -100;
    esparrago.position.z = -100;
    esparrago.position.y = eje.position.y+60;
    
    brazo.add(esparrago);

    var geometry = new THREE.SphereGeometry (20,0,32);
    var rotula = new THREE.Mesh(geometry, material);
    rotula.position.x = -100;
    rotula.position.z = -100;
    rotula.position.y = esparrago.position.y+60;
    

    brazo.add(rotula);
    
    //Antebrazo
    var antebrazo = new THREE.Object3D();

    var geometry = new THREE.CylinderGeometry( 22, 22, 6, 10 );
    var disco = new THREE.Mesh( geometry, material );
    
    disco.position.x = -100;
    disco.position.z = -100;
    disco.position.y = rotula.position.y;
    
    antebrazo.add(disco);

    var geometry = new THREE.BoxGeometry(4,80,0);
    var nervio1 = new THREE.Mesh(geometry, material);
    nervio1.position.x = -90;
    nervio1.position.z = -110;
    nervio1.position.y = disco.position.y+3+40;
    
    antebrazo.add(nervio1);

    var geometry = new THREE.BoxGeometry(4,80,0);
    var nervio2 = new THREE.Mesh(geometry, material);
    nervio2.position.x = -90;
    nervio2.position.z = -90;
    nervio2.position.y = disco.position.y+3+40;
    
    antebrazo.add(nervio2);

    var geometry = new THREE.BoxGeometry(4,80,0);
    var nervio3 = new THREE.Mesh(geometry, material);
    nervio3.position.x = -110;
    nervio3.position.z = -110;
    nervio3.position.y = disco.position.y+3+40;
    
    antebrazo.add(nervio3);

    var geometry = new THREE.BoxGeometry(4,80,0);
    var nervio4 = new THREE.Mesh(geometry, material);
    nervio4.position.x = -110;
    nervio4.position.z = -90;
    nervio4.position.y = disco.position.y+3+40;
    
    antebrazo.add(nervio4);

    //Mano
    var mano =  new THREE.Object3D();
    var geometry = new THREE.CylinderGeometry( 15, 15, 40, 32 );
    var cylinderMano = new THREE.Mesh( geometry, material );
    
    cylinderMano.position.x = -100;
    cylinderMano.position.z = -100;
    cylinderMano.position.y = disco.position.y+3+80;
    cylinderMano.rotation.x = 90*Math.PI/180;

    mano.add(cylinderMano);

    var pinza = new THREE.Geometry();
    var vertices = [
                        -90, cylinderMano.position.y+10, -90, //arriba derecha
                        -90, cylinderMano.position.y+10, -90+4, //arriba izquierda
                        -90, cylinderMano.position.y-10, -90, //abajo derecha
                        -90, cylinderMano.position.y-10, -90+4, //abajo izquierda
                        -90+19, cylinderMano.position.y+10, -90, //arriba fuera derecha
                        -90+19, cylinderMano.position.y+10, -90+4, //arriba fuera izquierda
                        -90+19, cylinderMano.position.y-10, -90, //abajo fuera derecha
                        -90+19, cylinderMano.position.y-10, -90+4 //abajo fuera izquierda
    ];

    var colores = [
                    0x000000,
                    0x000000,
                    0x000000,
                    0x000000,
                    0x000000,
                    0x000000,
                    0x000000,
                    0x000000
    ];

    var indices = [
                        0,1,2, 7,3,4, 0,1,2,
                        0,2,3, 4,3,2, 4,2,5,
                        6,7,4, 6,4,5, 1,5,2,
                        1,6,5, 7,6,1, 7,1,0
    ];


    for(var i =0; i < vertices.length; i+=3)
    {
        var vertice = new THREE.Vector3(vertices[i],vertices[i+1], vertices[i+2]);
        pinza.vertices.push(vertice);
    }

    for(var i = 0; i < indices.length; i+=3)
    {
        var triangulo = new THREE.Face3(indices[i], indices[i+1], indices[i+2]);

        for(var j = 0; j < 3; j++)
        {
            var color = new THREE.Color(colores[indices[i+j]]);
            triangulo.vertexColors.push(color);
        }

        pinza.faces.push(triangulo);
    }


    var pinzaFinal = new THREE.Mesh(pinza, material);
    mano.add(pinzaFinal);
    antebrazo.add(mano);
    brazo.add(antebrazo);
    base.add(brazo);
    robot.add(base);
    scene.add( robot);

    //scene.add( new THREE.AxesHelper(500));

    
}

function update()
{
    
}

function render()
{
    //Dibujar cada frame
    requestAnimationFrame(render);

    update();

    renderer.render(scene, camera);
    
}