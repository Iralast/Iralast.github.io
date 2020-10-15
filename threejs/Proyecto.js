/**
*
*   Practica GPC #2. Robot
*   
*/

//Variables imprescindibles
var renderer, scene, camera, reloj, cameraControls,camControls, world;

//Variables globales
var planeBody3,plane3,sphereBox, sphereShape, aux = 0;

//Acciones
initPhysicWorld();
initVisualWorld();
loadScene();
startAnimation();
render();

/**
 * Inicializa el mundo fisico con un
 * suelo y cuatro paredes de altura infinita
 */
function initPhysicWorld()
{
	// Mundo 
  	world = new CANNON.World(); 
   	world.gravity.set(0,-9.8,0); 
   	///world.broadphase = new CANNON.NaiveBroadphase(); 
   	world.solver.iterations = 10; 

}

/**
 * Inicializa la escena visual
 */
function initVisualWorld()
{
	// Inicializar el motor de render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( new THREE.Color(0xFFFFFF) );
	document.getElementById( 'container' ).appendChild( renderer.domElement );

	// Crear el grafo de escena
	scene = new THREE.Scene();

	// Reloj
	reloj = new THREE.Clock();
	reloj.start();

	// Crear y situar la camara
	var aspectRatio = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera( 75, aspectRatio , 0.1, 1000 );
	camera.position.set( 0,10,0 );
	camera.lookAt( new THREE.Vector3( 0,5,-50 ) );
	// Control de camara
	/*cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    cameraControls.target.set(0,5,-50);
    cameraControls.noKeys = true;*/
    stats = new Stats();
	stats.showPanel(0);	// FPS inicialmente. Picar para cambiar panel.
	document.getElementById( 'container' ).appendChild( stats.domElement );
    
	// Callbacks
	window.addEventListener('resize', updateAspectRatio );
}


function updateAspectRatio()
{
    renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
}

function loadScene()
{
    //Cargar la escena con objetos

    //Materiales
    var material = new THREE.MeshBasicMaterial({color: 'red', wireframe:true});
    var foxMaterial = new CANNON.Material("foxMaterial")
    var groundMaterial = new CANNON.Material("groundMaterial")
    var foxToGround = new CANNON.ContactMaterial(foxMaterial,groundMaterial,
        { friction: 0.0, 
            restitution: 0.0 });
    world.addContactMaterial(foxToGround);
    //Geometrías
    var planeBox = new CANNON.Box(new CANNON.Vec3(50,50,1));
    var planeBody = new CANNON.Body({mass: 0, material: groundMaterial});
    planeBody.addShape(planeBox);
    planeBody.position.copy(new CANNON.Vec3(0,0,0));
    planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    world.add(planeBody);
    var geometry = new THREE.BoxGeometry(100,100,5);                                                                                                                                                                                                                                                                                                                                                                                                                        
    var plane = new THREE.Mesh( geometry, material );
    
    plane.position.copy(planeBody.position);
    plane.rotation.x = 90*Math.PI/180;
    
    

    scene.add(plane);
   
    var foxMaterial = new CANNON.Material("foxMaterial")
    var mass = 5, radius = 1.3;
                sphereShape = new CANNON.Sphere(radius);
                sphereBody = new CANNON.Body({ mass: mass, material: foxMaterial });
                sphereBody.addShape(sphereShape);
                sphereBody.position.set(0,5,0);
                sphereBody.linearDamping = 0.9;
                world.add(sphereBody);

   
    var plane2 =  new THREE.Mesh( geometry, material );
    plane2.rotation.x = 90*Math.PI/180;
    var planeBody2 = new CANNON.Body({mass: 0, material: groundMaterial});
    planeBody2.addShape(planeBox);
    planeBody2.position.copy(new CANNON.Vec3(0,0,-150));
    planeBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    world.add(planeBody2);
    plane2.position.copy(planeBody2.position);

    scene.add(plane2);

    plane3 =  new THREE.Mesh( geometry, material );
    plane3.rotation.x = 90*Math.PI/180;
    planeBody3 = new CANNON.Body({mass: 0, material: groundMaterial});
    planeBody3.addShape(planeBox);
    planeBody3.position.copy(new CANNON.Vec3(0,0,-300));
    planeBody3.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    world.add(planeBody3);
    plane3.position.copy(planeBody3.position);

    
    scene.add(plane3);
    
    camControls = new PointerLockControls(camera, sphereBody);
    camControls.enabled = true;
    scene.add( camControls.getObject() )
   

   // document.addEventListener("keydown", onDocumentKeyDown, false);
    

    scene.add( new THREE.AxesHelper(500));  
}

function onDocumentKeyDown(event)
{
    var keyCode = event.which;


    
}

function startAnimation()
{
    var mvtoDer = new TWEEN.Tween( planeBody3.position ).to( {x: [100],
        y: [0],
        z: [-300] },6000 );
    var mvtoIzq = new TWEEN.Tween( planeBody3.position ).to( {x: [-100],
        y: [0],
        z: [-300] }, 6000 );
  
    
  
    mvtoDer.chain( mvtoIzq );
    mvtoIzq.chain( mvtoDer );
    
    mvtoDer.start();
}

function update()
{
    
    var segundos = reloj.getDelta();	// tiempo en segundos que ha pasado
    world.step( segundos );	
    camControls.update(segundos);
    //console.log(foxBody.position)
    //camera.position.copy(foxBody.position);
    //camera.quaternion.copy(foxBody.quaternion);

    plane3.position.copy(planeBody3.position);
    plane3.quaternion.copy(planeBody3.quaternion);

    if(sphereBody.position.y < -100)
    {
        sphereBody.position.y = 2.6;
        sphereBodyy.position.x = 0;
        sphereBody.position.z = 0;
        
        camera.position.set( 0,10,0 );
        
    }
   
    
    TWEEN.update();
    stats.update();
}



function render()
{
    //Dibujar cada frame
    requestAnimationFrame(render);

    update();

    renderer.clear();

   
    renderer.setViewport(0,0,window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);



    
}