var sphereShape, sphereBody, world, physicsMaterial, walls=[], balls=[], ballMeshes=[], boxes=[], boxMeshes=[];

var camera, scene, renderer;
var geometry, material, mesh;
var controls,time = Date.now();
var aux;
var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

    var element = document.body;

    var pointerlockchange = function ( event ) {

        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

            controls.enabled = true;

            blocker.style.display = 'none';

        } else {

            controls.enabled = false;

            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';

            instructions.style.display = '';

        }

        }

        var pointerlockerror = function ( event ) {
            instructions.style.display = '';
        }

         // Hook pointer lock state change events
        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
        document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

        document.addEventListener( 'pointerlockerror', pointerlockerror, false );
        document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
        document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

        instructions.addEventListener( 'click', function ( event ) {
            instructions.style.display = 'none';

            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

            if ( /Firefox/i.test( navigator.userAgent ) ) {

                var fullscreenchange = function ( event ) {

                    if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                        document.removeEventListener( 'fullscreenchange', fullscreenchange );
                        document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                            element.requestPointerLock();
                    }

                }

                document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
                element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
                element.requestFullscreen();

                } else {

                    element.requestPointerLock();

                }

                }, false );

            } else {

                instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

            }

initCannon();
init();
loadScene();
startAnimation();
render();

function initCannon(){
    
    world = new CANNON.World(); 
   	world.gravity.set(0,-40,0); 
   	
   	world.solver.iterations = 10; 

    // Create a slippery material (friction coefficient = 0.0)
    physicsMaterial = new CANNON.Material("slipperyMaterial");
    var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
                                                                        physicsMaterial,
                                                                        0.0, // friction coefficient
                                                                        0.3  // restitution
                                                                        );
    // We must add the contact materials to the world
    world.addContactMaterial(physicsContactMaterial);

    // Create a sphere
    var mass = 5, radius = 1.3;
    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({ mass: mass });
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0,5,0);
                
    sphereBody.linearDamping = 0.9;
    world.add(sphereBody);

                
}

function init() {

                

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set( 0,10,0 );
	camera.lookAt( new THREE.Vector3( 0,5,-50 ) );
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 0, 500 );

    controls = new PointerLockControls( camera , sphereBody );
    scene.add( controls.getObject() );

    stats = new Stats();
    stats.showPanel(0);	// FPS inicialmente. Picar para cambiar panel.
    document.getElementById( 'container' ).appendChild( stats.domElement );

    renderer = new THREE.WebGLRenderer();
                
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xFFFFFF);

    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', updateAspectRatio, false );

                
}

function updateAspectRatio()
{
    renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
}

var dt = 1/60;

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
    
  
   

   // document.addEventListener("keydown", onDocumentKeyDown, false);
    

    scene.add( new THREE.AxesHelper(500));  
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
function update() {
                
    if(controls.enabled)
        world.step(dt);

    plane3.position.copy(planeBody3.position);
    plane3.quaternion.copy(planeBody3.quaternion);
    console.log(sphereBody.position);
    if(sphereBody.position.y < -20)
    {
        sphereBody.position.set(0,5,0);
     
        
        camera.position.set( 0,10,0 );
        
    }
                                    
                
    TWEEN.update();
    stats.update();
    controls.update( Date.now() - time );
    renderer.render( scene, camera );
    time = Date.now();

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
            