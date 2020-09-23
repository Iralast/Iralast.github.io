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
    renderer.setClearColor(new THREE.Color(0x0000AA));

    document.getElementById("container").appendChild(renderer.domElement);

    //Escena
    scene = new THREE.Scene();

    //Camara
    var ar = window.innerWidth/window.innerHeight;
    camera = new THREE.PerspectiveCamera(50, ar, 0.1, 1000);
    scene.add(camera);
    camera.position.set(200,200,200);
    
    camera.lookAt(new THREE.Vector3(0,100,0));
}

function loadScene()
{
    //Cargar la escena con objetos

    //Materiales
    var material = new THREE.MeshBasicMaterial({color: 'red', wireframe:true});
    robot = new THREE.Object3D();
    //Geometrías
    var geometry = new THREE.PlaneGeometry(1000,1000,32);                                                                                                                                                                                                                                                                                                                                                                                                                        
    var plane = new THREE.Mesh( geometry, material );
    
    plane.position.set(0,0,0);
    plane.rotation.x = 90*Math.PI/180;
    

    scene.add(plane);
    //Base
    var geometry = new THREE.CylinderGeometry( 50, 50, 15, 32 );
    var base = new THREE.Mesh( geometry, material );
    base.position.x = -100;
    base.position.z = -100;
    robot.add( base );

    //Brazo
    var brazo = new THREE.Object3D();
    base.add(brazo);

    


   
    var geometry = new THREE.BoxGeometry(18,120,12);
    var box = new THREE.Mesh(geometry, material);
    box.position.x = -100;
    box.position.z = -100;
    
    brazo.add(box);

    scene.add( robot);

    scene.add( new THREE.AxisHelper(3));

    
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