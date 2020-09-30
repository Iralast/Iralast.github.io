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
    camera = new THREE.PerspectiveCamera(30, ar, 0.1, 10000);
    scene.add(camera);
    camera.position.set(300,300,300);
    
    camera.lookAt(new THREE.Vector3(0,150,0));
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
    //base.add( new THREE.AxisHelper(200));

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
    var pinza2 = new THREE.Geometry();
    
    
    pinza.vertices.push(
        new THREE.Vector3(-100, cylinderMano.position.y-10, -106+26+4),  // 0
        new THREE.Vector3(-100+19, cylinderMano.position.y-10, -106+26+4),  // 1
        new THREE.Vector3(-100, cylinderMano.position.y+10, -106+26+4),  // 2
        new THREE.Vector3(-100+19, cylinderMano.position.y+10, -106+26+4),  // 3
        new THREE.Vector3(-100, cylinderMano.position.y-10, -106+26),  // 4
        new THREE.Vector3(-100+19, cylinderMano.position.y-10, -106+26),  // 5
        new THREE.Vector3(-100, cylinderMano.position.y+10, -106+26),  // 6
        new THREE.Vector3(-100+19, cylinderMano.position.y+10, -106+26),  // 7
        //
        new THREE.Vector3(-100+19, cylinderMano.position.y-10, -106+26+4),  // 0
        new THREE.Vector3(-100+38, cylinderMano.position.y-5, -106+26+2),  // 1
        new THREE.Vector3(-100+19, cylinderMano.position.y+10, -106+26+4),  // 2
        new THREE.Vector3(-100+38, cylinderMano.position.y+5, -106+26+2),  // 3
        new THREE.Vector3(-100+18, cylinderMano.position.y-10, -106+26),  // 4
        new THREE.Vector3(-100+38, cylinderMano.position.y-5, -106+26),  // 5
        new THREE.Vector3(-100+19, cylinderMano.position.y+10, -106+26),  // 6
        new THREE.Vector3(-100+38, cylinderMano.position.y+5, -106+26),  // 7
    );

    pinza.faces.push(
    // front
    new THREE.Face3(0, 3, 2),
    new THREE.Face3(0, 1, 3),
    // right
    new THREE.Face3(1, 7, 3),
    new THREE.Face3(1, 5, 7),
    // back
    new THREE.Face3(5, 6, 7),
    new THREE.Face3(5, 4, 6),
    // left
    new THREE.Face3(4, 2, 6),
    new THREE.Face3(4, 0, 2),
    // top
    new THREE.Face3(2, 7, 6),
    new THREE.Face3(2, 3, 7),
    // bottom
    new THREE.Face3(4, 1, 0),
    new THREE.Face3(4, 5, 1),

    //
    new THREE.Face3(0+8, 3+8, 2+8),
    new THREE.Face3(0+8, 1+8, 3+8),
    // right
    new THREE.Face3(1+8, 7+8, 3+8),
    new THREE.Face3(1+8, 5+8, 7+8),
    // back
    new THREE.Face3(5+8, 6+8, 7+8),
    new THREE.Face3(5+8, 4+8, 6+8),
    new THREE.Face3(4+8, 2+8, 6+8),
    new THREE.Face3(4+8, 0+8, 2+8),
    new THREE.Face3(2+8, 7+8, 6+8),
    new THREE.Face3(2+8, 3+8, 7+8),
    new THREE.Face3(4+8, 1+8, 0+8),
    new THREE.Face3(4+8, 5+8, 1+8),
);

    
pinza2.vertices.push(
    new THREE.Vector3(-100, cylinderMano.position.y-10, -106-18+4),  // 0
    new THREE.Vector3(-100+19, cylinderMano.position.y-10, -106-18+4),  // 1
    new THREE.Vector3(-100, cylinderMano.position.y+10, -106-18+4),  // 2
    new THREE.Vector3(-100+19, cylinderMano.position.y+10, -106-18+4),  // 3
    new THREE.Vector3(-100, cylinderMano.position.y-10, -106-18),  // 4
    new THREE.Vector3(-100+19, cylinderMano.position.y-10, -106-18),  // 5
    new THREE.Vector3(-100, cylinderMano.position.y+10, -106-18),  // 6
    new THREE.Vector3(-100+19, cylinderMano.position.y+10, -106-18),  // 7
    //
    new THREE.Vector3(-100+19, cylinderMano.position.y-10, -106-18+4),  // 0
    new THREE.Vector3(-100+38, cylinderMano.position.y-5, -106-18+2),  // 1
    new THREE.Vector3(-100+19, cylinderMano.position.y+10, -106-18+4),  // 2
    new THREE.Vector3(-100+38, cylinderMano.position.y+5, -106-18+2),  // 3
    new THREE.Vector3(-100+18, cylinderMano.position.y-10, -106-18),  // 4
    new THREE.Vector3(-100+38, cylinderMano.position.y-5, -106-18),  // 5
    new THREE.Vector3(-100+19, cylinderMano.position.y+10, -106-18),  // 6
    new THREE.Vector3(-100+38, cylinderMano.position.y+5, -106-18),  // 7
);


pinza2.faces.push(
// front
new THREE.Face3(0, 3, 2),
new THREE.Face3(0, 1, 3),
// right
new THREE.Face3(1, 7, 3),
new THREE.Face3(1, 5, 7),
// back
new THREE.Face3(5, 6, 7),
new THREE.Face3(5, 4, 6),
// left
new THREE.Face3(4, 2, 6),
new THREE.Face3(4, 0, 2),
// top
new THREE.Face3(2, 7, 6),
new THREE.Face3(2, 3, 7),
// bottom
new THREE.Face3(4, 1, 0),
new THREE.Face3(4, 5, 1),

//
new THREE.Face3(0+8, 3+8, 2+8),
new THREE.Face3(0+8, 1+8, 3+8),
// right
new THREE.Face3(1+8, 7+8, 3+8),
new THREE.Face3(1+8, 5+8, 7+8),
// back
new THREE.Face3(5+8, 6+8, 7+8),
new THREE.Face3(5+8, 4+8, 6+8),
new THREE.Face3(4+8, 2+8, 6+8),
new THREE.Face3(4+8, 0+8, 2+8),
new THREE.Face3(2+8, 7+8, 6+8),
new THREE.Face3(2+8, 3+8, 7+8),
new THREE.Face3(4+8, 1+8, 0+8),
new THREE.Face3(4+8, 5+8, 1+8),
);

    pinza.computeFaceNormals();
    pinza2.computeFaceNormals();
    var pinzaFinal = new THREE.Mesh(pinza, material);
    var pinzaFinal2 = new THREE.Mesh(pinza2, material);
    mano.add(pinzaFinal);
    mano.add(pinzaFinal2);
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