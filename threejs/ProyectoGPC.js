var sphereShape, sphereBody, world;
var camera, scene, renderer;
var planes = [], planesBody = [];
var controls,time = Date.now();
var reloj = new THREE.Clock();

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

initPhysics();
initVisual();
loadScene();
startAnimation();
render();

function initPhysics(){
    
    world = new CANNON.World(); 
   	world.gravity.set(0,-40,0); 
   	
   	world.solver.iterations = 10; 

    var mass = 5, radius = 1.3;
    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({ mass: mass });
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(40,5,-600);
                
    sphereBody.linearDamping = 0.9;
    world.add(sphereBody);

                
}

function initVisual() {

                

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
    reloj.start();
                
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
    //Geometrías
    
    var geometry = new THREE.BoxGeometry(100,100,5);                                                                                                                                                                                                                                                                                                                                                                                                                        
   
    createPlane(new CANNON.Vec3(50,50,2.5),new CANNON.Vec3(0,0,0), geometry, material,true);
   
    createPlane(new CANNON.Vec3(50,50,2.5),new CANNON.Vec3(0,0,-150), geometry, material,true);

    createPlane(new CANNON.Vec3(50,50,2.5),new CANNON.Vec3(0,0,-300), geometry, material,true); //2
   

    var geometry2 = new THREE.BoxGeometry(25,25,5);    

    createPlane(new CANNON.Vec3(12.5,25,2.5),new CANNON.Vec3(-40,0,-400), geometry2, material,true);
    createPlane(new CANNON.Vec3(12.5,25,2.5),new CANNON.Vec3(-3,0,-450), geometry2, material,true);
    createPlane(new CANNON.Vec3(12.5,25,2.5),new CANNON.Vec3(40,0,-500), geometry2, material,true);

  

    var geometry3 = new THREE.BoxGeometry(25,150,5);  

    createPlane(new CANNON.Vec3(12.5,75,2.5),new CANNON.Vec3(40,0,-600), geometry3, material,true);

    var geometry4 = new THREE.BoxGeometry(25,25,30);  
    createPlane(new CANNON.Vec3(12.5,12.5,15),new CANNON.Vec3(67,15,-560), geometry4, material,false);  //7
    createPlane(new CANNON.Vec3(12.5,12.5,15),new CANNON.Vec3(67,15,-590), geometry4, material,false);  //8
    createPlane(new CANNON.Vec3(12.5,12.5,15),new CANNON.Vec3(67,15,-620), geometry4, material,false); //9
 
     
}

function createPlane(tamCannon, position, geometry, material, horizontal)
{   
    var planeBox = new CANNON.Box(tamCannon);
    plane =  new THREE.Mesh( geometry, material );

    if(horizontal)
        plane.rotation.x = 90*Math.PI/180;

    planeBody = new CANNON.Body({mass: 0});
    planeBody.addShape(planeBox);
    planeBody.position.copy(position);

    if(horizontal)
        planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    
    plane.position.copy(planeBody.position);

    planesBody.push(planeBody);
    planes.push(plane);

    world.add(planeBody);
    scene.add(plane);
}

function startAnimation()
{
    var mvtoDer = new TWEEN.Tween( planesBody[2].position ).to( {x: [100],
        y: [0],
        z: [-300] },6000 );
    var mvtoIzq = new TWEEN.Tween( planesBody[2].position ).to( {x: [-100],
        y: [0],
        z: [-300] }, 6000 );
  
    
  
    mvtoDer.chain( mvtoIzq );
    mvtoIzq.chain( mvtoDer );
    
    mvtoDer.start();
    
    var mvtoDer = new TWEEN.Tween( planesBody[7].position ).to( {x: [40],
        y: [15],
        z: [-560] },5000 );
    var mvtoIzq = new TWEEN.Tween( planesBody[7].position ).to( {x: [67],
        y: [15],
        z: [-560] }, 5000 );

    mvtoDer.chain( mvtoIzq );
    mvtoIzq.chain( mvtoDer );
        
    mvtoDer.start();

    var mvtoDer = new TWEEN.Tween( planesBody[8].position ).to( {x: [40],
        y: [15],
        z: [-590] },5500 );
    var mvtoIzq = new TWEEN.Tween( planesBody[8].position ).to( {x: [67],
        y: [15],
        z: [-590] }, 5500 );

    mvtoDer.chain( mvtoIzq );
    mvtoIzq.chain( mvtoDer );
        
    mvtoDer.start();

    var mvtoDer = new TWEEN.Tween( planesBody[9].position ).to( {x: [40],
        y: [15],
        z: [-620] },6000 );
    var mvtoIzq = new TWEEN.Tween( planesBody[9].position ).to( {x: [67],
        y: [15],
        z: [-620] }, 6000 );

    mvtoDer.chain( mvtoIzq );
    mvtoIzq.chain( mvtoDer );
        
    mvtoDer.start();

}         
function update() {
    var delta = reloj.getDelta();    
    if(controls.enabled)
        world.step(delta);

    planes[2].position.copy(planesBody[2].position);
    planes[2].quaternion.copy(planesBody[2].quaternion);
    planes[7].position.copy(planesBody[7].position);
    planes[7].quaternion.copy(planesBody[7].quaternion);
    planes[8].position.copy(planesBody[8].position);
    planes[8].quaternion.copy(planesBody[8].quaternion);
    planes[9].position.copy(planesBody[9].position);
    planes[9].quaternion.copy(planesBody[9].quaternion);
    
    if(sphereBody.position.y < -20)
    {
        sphereBody.position.set(0,5,0);
        camera.position.set( 0,10,0 );
        //camera.lookAt( new THREE.Vector3( 0,5,-50 ) );
        
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
            