/**
*
*   Practica GPC #2. Robot
*   
*/

//Variables imprescindibles
var renderer, scene, camera;

//Variables globales
var robot;
var base, antebrazo, brazo, pinzaFinal, pinzaFinal2, mano,eje,esparrago;
var cameraController;
var planta;
var r = t = 85;
var l = b = -r; 

//Acciones
init();
loadScene();
setupGUI();
render();

function setCameras(ar)
{
    //Construir las cuatro camaras
    var origen = new THREE.Vector3(-100,0,-100);

    //Ortográficas
    var camOrtografica;
    if(ar > 1)
        camOrtografica = new THREE.OrthographicCamera(l*ar,r*ar,t,b,-500,500);
    else
        camOrtografica = new THREE.OrthographicCamera(l,r,t/ar,b/ar,-500,500);

    planta = camOrtografica.clone();
    planta.position.set(-100,400,-100);
    planta.lookAt(origen);
    planta.up = new THREE.Vector3(0,0,-1);

    //Perspectiva
    camera = new THREE.PerspectiveCamera(50, ar, 0.1, 10000);
    camera.position.set(400,300,400);
    //camera.lookAt(new THREE.Vector3(0,0,0));

    
    scene.add(planta);
    scene.add(camera);
}

function init()
{
    //Crear el motor, la escena y la camara

    //Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0xFFFFFF));
    renderer.autoClear = false;
    renderer.shadowMap.enabled = true;
    document.getElementById("container").appendChild(renderer.domElement);

    //Escena
    scene = new THREE.Scene();

    //Camara
    var ar = window.innerWidth/window.innerHeight;
    
    setCameras(ar);

    cameraController = new THREE.OrbitControls(camera, renderer.domElement);
    cameraController.target.set(-100,0,-100);
    cameraController.noKeys = true;
    
    var luzAmbiente = new THREE.AmbientLight(0xFFFFFF, 0.2);
    scene.add( luzAmbiente );
    
    var luzPuntual = new THREE.PointLight(0xFFFFFF,0.5);
	luzPuntual.position.set( -100, 600, -100 );
    scene.add( luzPuntual );
    
    var luzFocal = new THREE.SpotLight(0xFFFFFF,0.5);
	luzFocal.position.set( -30,500,1 );
	luzFocal.target.position.set(-100,0,-100);
	luzFocal.penumbra = 0.2;
    luzFocal.castShadow = true;
    luzFocal.shadow.camera.far = 4000;
    scene.add(luzFocal);

    
    
    window.addEventListener('resize', updateAspect);
}

function updateAspect()
{
    //Indicarle al motor las nuevas dimensiones del canvas
    renderer.setSize(window.innerWidth, window.innerHeight);

    var ar = window.innerWidth/window.innerHeight;

    if(ar > 1)
    {
        planta.left = l*ar;
        planta.right = r*ar;
        planta.top = t;
        planta.bottom = b;
    }
    
    else
    {
        planta.left = l;
        planta.right = r;
        planta.top = t/ar;
        planta.bottom = b/ar;
    }

    camera.aspect = ar;

    //Se ha variado el volumen de la vista
    
    camera.updateProjectionMatrix();
    planta.updateProjectionMatrix();

}

function loadScene()
{
    //Cargar la escena con objetos

    //Materiales
    var material = new THREE.MeshBasicMaterial({color: 'grey'});
    robot = new THREE.Object3D();
    var paredes = [ 'images/posx.jpg','images/negx.jpg',
    'images/posy.jpg','images/negy.jpg',
    'images/posz.jpg','images/negz.jpg'
    ];
    var mapaEntorno = new THREE.CubeTextureLoader().load(paredes);
    scene.background = mapaEntorno;
    var materialBrillante = new THREE.MeshPhongMaterial({color:'white',
		                                                 specular:'white',
		                                                 shininess: 50,
		                                                 envMap:mapaEntorno });

    var texturaSuelo = new THREE.TextureLoader().load("../images/pisometal_1024x1024.jpg");
    
    var matsuelo = new THREE.MeshLambertMaterial({map: texturaSuelo});

    //Geometrías
    var geometry = new THREE.PlaneGeometry(1000,1000,20);                                                                                                                                                                                                                                                                                                                                                                                                                        
    var plane = new THREE.Mesh( geometry, matsuelo );
    
    plane.receiveShadow = true;
    plane.castShadow = true;
    plane.position.set(0,0,0);
    plane.rotation.x = -90*Math.PI/180;
    

    scene.add(plane);
    //Base
    var geometry = new THREE.CylinderGeometry( 50, 50, 15, 20 );
    
    var texturabase = new THREE.TextureLoader().load("../images/metal_128x128.jpg");
    
    var matbase = new THREE.MeshLambertMaterial({map: texturabase});

    var texturaarriba = new THREE.TextureLoader().load("../images/wood512.jpg");
    
    var matarriba = new THREE.MeshPhongMaterial({map: texturaarriba});
 
    base = new THREE.Mesh( geometry, matbase );
    base.position.x = -100;
    base.position.z = -100;
    base.position.y = 15/2;
    base.castShadow= true;
    base.receiveShadow= true;
  
    //Brazo
    brazo = new THREE.Object3D();
   
    
    var geometry = new THREE.CylinderGeometry( 18, 18, 20, 32 );
    
    eje = new THREE.Mesh( geometry, matbase );
    eje.castShadow= true;
    eje.receiveShadow= true;
    eje.rotation.x = 90*Math.PI/180;
    
    brazo.add( eje );
   
    var geometry = new THREE.BoxGeometry(18,120,10);
    esparrago = new THREE.Mesh(geometry, matbase);
    esparrago.castShadow= true;
    esparrago.receiveShadow= true;
    esparrago.position.y = eje.position.y+60;
    
    brazo.add(esparrago);

    var geometry = new THREE.SphereGeometry (20,0,32);
    var rotula = new THREE.Mesh(geometry, materialBrillante);
    rotula.castShadow= true;
    rotula.receiveShadow= true;
    rotula.position.y = esparrago.position.y+60;
    
    brazo.add(rotula);
    
    //Antebrazo
    antebrazo = new THREE.Object3D();

    var geometry = new THREE.CylinderGeometry( 22, 22, 6, 10 );
    var disco = new THREE.Mesh( geometry, matarriba );
    disco.castShadow= true;
    disco.receiveShadow= true;
    
    
    antebrazo.add(disco);

    var geometry = new THREE.BoxGeometry(4,80,0);
    var nervio1 = new THREE.Mesh(geometry, matarriba);
    nervio1.castShadow= true;
    nervio1.receiveShadow= true;
    nervio1.position.x = 12;
    nervio1.position.z = -8;
    nervio1.position.y = disco.position.y+3+40;
    
    antebrazo.add(nervio1);

    var geometry = new THREE.BoxGeometry(4,80,0);
    var nervio2 = new THREE.Mesh(geometry, matarriba);
    nervio2.castShadow= true;
    nervio2.receiveShadow= true;
    nervio2.position.x = -12;
    nervio2.position.z = -8;
    nervio2.position.y = disco.position.y+3+40;
    
    antebrazo.add(nervio2);

    var geometry = new THREE.BoxGeometry(4,80,0);
    var nervio3 = new THREE.Mesh(geometry, matarriba);
    nervio3.castShadow= true;
    nervio3.receiveShadow= true;
    nervio3.position.x = 12;
    nervio3.position.z = 8;
    nervio3.position.y = disco.position.y+3+40;
    
    antebrazo.add(nervio3);

    var geometry = new THREE.BoxGeometry(4,80,0);
    var nervio4 = new THREE.Mesh(geometry, matarriba);
    nervio4.castShadow= true;
    nervio4.receiveShadow= true;
    nervio4.position.x = -12;
    nervio4.position.z = 8;
    nervio4.position.y = disco.position.y+3+40;
    
    antebrazo.add(nervio4);
    antebrazo.position.set(0,120,0);
    //Mano
    mano =  new THREE.Object3D();
    var geometry = new THREE.CylinderGeometry( 15, 15, 40, 32 );
    var cylinderMano = new THREE.Mesh( geometry, matarriba );
    cylinderMano.castShadow= true;
    cylinderMano.receiveShadow= true;
   
    cylinderMano.rotation.x = 90*Math.PI/180;

    mano.add(cylinderMano);
    mano.position.y = disco.position.y+3+80;
    var pinza = new THREE.Geometry();
    var pinza2 = new THREE.Geometry();
    
    
    pinza.vertices.push(
        new THREE.Vector3(0, cylinderMano.position.y-10, 16+3),  // 0
        new THREE.Vector3(19, cylinderMano.position.y-10, 16+3),  // 1
        new THREE.Vector3(0, cylinderMano.position.y+10, 16+3),  // 2
        new THREE.Vector3(19, cylinderMano.position.y+10, 16+3),  // 3
        new THREE.Vector3(0, cylinderMano.position.y-10, 15),  // 4
        new THREE.Vector3(19, cylinderMano.position.y-10, 15),  // 5
        new THREE.Vector3(0, cylinderMano.position.y+10, 15),  // 6
        new THREE.Vector3(19, cylinderMano.position.y+10, 15),  // 7
        //
        new THREE.Vector3(19, cylinderMano.position.y-10, 15+4),  // 0
        new THREE.Vector3(38, cylinderMano.position.y-5, 15+2),  // 1
        new THREE.Vector3(19, cylinderMano.position.y+10, 15+4),  // 2
        new THREE.Vector3(38, cylinderMano.position.y+5, 15+2),  // 3
        new THREE.Vector3(19, cylinderMano.position.y-10, 15),  // 4
        new THREE.Vector3(38, cylinderMano.position.y-5, 15),  // 5
        new THREE.Vector3(19, cylinderMano.position.y+10, 15),  // 6
        new THREE.Vector3(38, cylinderMano.position.y+5, 15),  // 7
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
    new THREE.Vector3(0, cylinderMano.position.y-10, -19+4),  // 0
    new THREE.Vector3(19, cylinderMano.position.y-10, -19+4),  // 1
    new THREE.Vector3(0, cylinderMano.position.y+10, -19+4),  // 2
    new THREE.Vector3(19, cylinderMano.position.y+10, -19+4),  // 3
    new THREE.Vector3(0, cylinderMano.position.y-10, -19),  // 4
    new THREE.Vector3(19, cylinderMano.position.y-10, -19),  // 5
    new THREE.Vector3(0, cylinderMano.position.y+10, -19),  // 6
    new THREE.Vector3(19, cylinderMano.position.y+10, -19),  // 7
    //
    new THREE.Vector3(19, cylinderMano.position.y-10, -19+4),  // 0
    new THREE.Vector3(38, cylinderMano.position.y-5, -19+2),  // 1
    new THREE.Vector3(19, cylinderMano.position.y+10, -19+4),  // 2
    new THREE.Vector3(38, cylinderMano.position.y+5, -19+2),  // 3
    new THREE.Vector3(18, cylinderMano.position.y-10, -19),  // 4
    new THREE.Vector3(38, cylinderMano.position.y-5, -19),  // 5
    new THREE.Vector3(19, cylinderMano.position.y+10, -19),  // 6
    new THREE.Vector3(38, cylinderMano.position.y+5, -19),  // 7
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

    
    pinzaFinal = new THREE.Mesh(pinza, material);
    pinzaFinal2 = new THREE.Mesh(pinza2, material);
    pinzaFinal.castShadow= true;
    pinzaFinal.receiveShadow= true;
    pinzaFinal2.castShadow= true;
    pinzaFinal2.receiveShadow= true;
    mano.add(pinzaFinal)
    mano.add(pinzaFinal2)
    
    antebrazo.add(mano)
    brazo.add(antebrazo)
    base.add(brazo)
    robot.add(base)
    
    scene.add(robot)
    
    
    
    keyboard = new THREEx.KeyboardState(renderer.domElement);
    renderer.domElement.setAttribute("tabIndex", "0");
    renderer.domElement.focus();
    keyboard.domElement.addEventListener('keydown', function (event) {
        if (keyboard.eventMatches(event, 'left')) {
            robot.position.z -= 10;
        }
        if (keyboard.eventMatches(event, 'right')) {
            robot.position.z += 10;
        }
        if (keyboard.eventMatches(event, 'up')) {
            robot.position.x += 10;
        }
        if (keyboard.eventMatches(event, 'down')) {
            robot.position.x -= 10;
        }
    })
    scene.add( new THREE.AxesHelper(500));
    

   
    
}


function update()
{
    
    base.rotation.y = effectControl.giroBase * Math.PI / 180;
    
    brazo.rotation.z = effectControl.giroBrazo * Math.PI / 180;
    
    antebrazo.rotation.z = effectControl.giroAntebrazoY * Math.PI / 180;
    antebrazo.rotation.y = effectControl.giroAntebrazoZ * Math.PI / 180;
    mano.rotation.z = effectControl.giroPinzaZ * Math.PI / 180;
    pinzaFinal2.position.z = effectControl.aperturaPinza / 2;
    pinzaFinal.position.z = -effectControl.aperturaPinza / 2;

    
    
}

function setupGUI() {

    //Interfaz de usuario
    effectControl = {
        giroBase: 0,
        giroBrazo: 0,
        giroAntebrazoZ: 0,
        giroAntebrazoY: 0,
        giroPinzaZ: 0,
        aperturaPinza: 0,
        reiniciar: function () {
            location.reload();
        },
        color: "rgb(255,0,0)"
    }
    var gui = new dat.GUI();
    var sub = gui.addFolder("Controles Robot")
    sub.add(effectControl, "giroBase", -180, 180, 1).name("Giro Base");
    sub.add(effectControl, "giroBrazo", -45, 45, 1).name("Giro Brazo");
    sub.add(effectControl, "giroAntebrazoY", -180, 180, 1).name("Giro Antebrazo Y");
    sub.add(effectControl, "giroAntebrazoZ", -90, 90, 1).name("Giro Antebrazo Z");
    sub.add(effectControl, "giroPinzaZ", -40, 220, 1).name("Giro Pinza");
    sub.add(effectControl, "aperturaPinza", 0, 15, 1).name("Cierre pinza");

    sub.add(effectControl, "reiniciar")
    var sensorColor = sub.addColor(effectControl, "color").name("Color")
    sensorColor.onChange(function (color) {
        robot.traverse(function (hijo) {
            if (hijo instanceof THREE.Mesh) {
                hijo.material.color = new THREE.Color(color)
            }
        })
    })


}


function render()
{
    //Dibujar cada frame
    requestAnimationFrame(render);

    update();

    renderer.clear();

    if(window.innerWidth < window.innerHeight)
        renderer.setViewport(0,0,window.innerWidth/4, window.innerWidth/4);
    else
        renderer.setViewport(0,0,window.innerHeight/4, window.innerHeight/4);
    renderer.render(scene, planta);

    renderer.setViewport(0,0,window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);



    
}