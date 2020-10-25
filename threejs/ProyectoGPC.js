var sphereShape, sphereBody, world;
var camera, scene, renderer;
var planes = [], planesBody = [];
var spikes = [], spikesBody = [];
var controls,time = Date.now();
var reloj = new THREE.Clock();
var spike;
var cont = 1;
var aux = 0;
var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );
var blocker2 = document.getElementById( 'blocker2' );
var diedText = document.getElementById( 'text' );
var izq = false;
var der = false;
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
var material;
var muerte = false;
var ganado = false;
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
    sphereBody.position.set(0,5,-1);
                
    sphereBody.linearDamping = 0.9;
    world.add(sphereBody);
    spikesBody = [];
    planesBody = [];

                
}

function initVisual() {

                
    spikes = [];
    planes = [];

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 500 );
    camera.position.set( 0,10,0 );
    camera.lookAt( new THREE.Vector3( 0,5,-50 ) );
   
    scene = new THREE.Scene();
// scene.add(sound);
    scene.fog = new THREE.Fog( 0x000000, 0, 500 );
   
    var cubeTexture = new THREE.CubeTextureLoader().setPath( '../images/' ).load( [
        'piedras.jpg',
        'piedras.jpg',
        'piedras.jpg',
        'piedras.jpg',
        'piedras.jpg',
        'piedras.jpg'
        ] );
    scene.background = cubeTexture;
    controls = new PointerLockControls( camera , sphereBody );
    scene.add( controls.getObject() );

    stats = new Stats();
    stats.showPanel(0);	// FPS inicialmente. Picar para cambiar panel.
    document.getElementById( 'container' ).appendChild( stats.domElement );

    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
                
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xFFFFFF);
    
    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', updateAspectRatio, false );
    reloj.start();

    var light = new THREE.AmbientLight( 0xFFFFFF,2.0); // soft white light
    scene.add( light );


    var luzFocal = new THREE.SpotLight(0xFFFFFF,2.0);
	luzFocal.position.set( 40,300,-1400 );
	luzFocal.target.position.set(0,0,0);
	luzFocal.penumbra = 0.2;
    luzFocal.castShadow = true;
    luzFocal.shadow.camera.far = 1400;
    scene.add(luzFocal);


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

    var listener = new THREE.AudioListener();
    listener.autoplay = true;
    camera.add( listener );

    // create a global audio source
    var sound = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( '../sounds/sound.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 0.5 );
        sound.play();
        
        
    });    
    
    var loader = new THREE.TextureLoader().load("../images/plataforma2.jpeg", function(texture){
        texture.wrapS = texture.wrapY = THREE.RepeatWrapping;
        
        
    });

    var loader3 = new THREE.TextureLoader().load("../images/arrow.jpg", function(texture){
        texture.wrapS = texture.wrapY = THREE.RepeatWrapping;
        
        
    });

    var loader2 = new THREE.TextureLoader().load("../images/objetosTeTiran.jpg", function(texture){
        texture.wrapS = texture.wrapY = THREE.RepeatWrapping;
        
    });

    var loader4 = new THREE.TextureLoader().load("../images/plataformasGrandes.jpg", function(texture){
       // texture.wrapS = texture.wrapY = THREE.RepeatWrapping;
        
    });
    var material = new THREE.MeshLambertMaterial({map: loader4});
    var materialPequenyas = new THREE.MeshLambertMaterial({map: loader});
    var materialParedes = new THREE.MeshLambertMaterial({map: loader2});
    var materialAlargado = new THREE.MeshLambertMaterial({map: loader3});
   
    //var material = new THREE.MeshBasicMaterial({color: 'red', wireframe:true});
   
    //Geometrías
    
    var geometry = new THREE.BoxGeometry(100,100,5);                                                                                                                                                                                                                                                                                                                                                                                                                        
   
    createPlane(new CANNON.Vec3(50,50,2.5),new CANNON.Vec3(0,0,0), geometry, material,true);
   
    createPlane(new CANNON.Vec3(50,50,2.5),new CANNON.Vec3(0,0,-150), geometry, material,true);

    createPlane(new CANNON.Vec3(50,50,2.5),new CANNON.Vec3(-100,0,-300), geometry, material,true); //2
   

    var geometry2 = new THREE.BoxGeometry(25,25,5);    

    createPlane(new CANNON.Vec3(12.5,25,2.5),new CANNON.Vec3(-40,0,-400), geometry2, materialPequenyas,true);
    createPlane(new CANNON.Vec3(12.5,25,2.5),new CANNON.Vec3(-3,0,-460), geometry2, materialPequenyas,true);
    createPlane(new CANNON.Vec3(12.5,25,2.5),new CANNON.Vec3(40,0,-510), geometry2, materialPequenyas,true);

  

    var geometry3 = new THREE.BoxGeometry(25,150,5);  

    createPlane(new CANNON.Vec3(12.5,75,2.5),new CANNON.Vec3(40,0,-630), geometry3, materialAlargado,true);

    var geometry4 = new THREE.BoxGeometry(25,25,30);  
    createPlane(new CANNON.Vec3(13,12.5,15),new CANNON.Vec3(65,15,-600), geometry4, materialParedes,false);  //7
    createPlane(new CANNON.Vec3(13,12.5,15),new CANNON.Vec3(65,15,-630), geometry4, materialParedes,false);  //8
    createPlane(new CANNON.Vec3(13,12.5,15),new CANNON.Vec3(65,15,-660), geometry4, materialParedes,false); //9
 
    createPlane(new CANNON.Vec3(12.5,75,2.5),new CANNON.Vec3(40,0,-820), geometry3, materialAlargado,true);

    var loader = new THREE.ObjectLoader();
    loader.load('models/spikes-threejs/spikes.json', 
                function(obj){
                    obj.position.set(40,-15,-785);
                    obj.scale.set(25,15,15);
                    spikes.push(obj);
                    scene.add(obj);
                   
    });
    var planeBox2 = new CANNON.Box(new CANNON.Vec3(12.5,7.5,2.5));

    planeBody2 = new CANNON.Body({mass: 0});
    planeBody2.addShape(planeBox2);
    planeBody2.position.copy(new CANNON.Vec3(40,-15,-785));

 
    planeBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);

    spikesBody.push(planeBody2);

    
    world.add(planeBody2);

    
   
   var loader = new THREE.ObjectLoader();
    loader.load('models/spikes-threejs/spikes.json', 
                function(obj){
                    obj.position.set(40,-15,-800);
                    obj.scale.set(25,15,15)
                   
                    spikes.push(obj);
                    scene.add(obj);
    });
    var planeBox2 = new CANNON.Box(new CANNON.Vec3(12.5,7.5,2.5));

    planeBody2 = new CANNON.Body({mass: 0});
    planeBody2.addShape(planeBox2);
    planeBody2.position.copy(new CANNON.Vec3(40,-15,-800));

 
    planeBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);

    spikesBody.push(planeBody2);

    
    world.add(planeBody2);

    var loader = new THREE.ObjectLoader();
    loader.load('models/spikes-threejs/spikes.json', 
                function(obj){
                    obj.position.set(40,-15,-815);
                    obj.scale.set(25,15,15)
                   
                    spikes.push(obj);
                    scene.add(obj);
    });

    var planeBox2 = new CANNON.Box(new CANNON.Vec3(12.5,7.5,2.5));

    planeBody2 = new CANNON.Body({mass: 0});
    planeBody2.addShape(planeBox2);
    planeBody2.position.copy(new CANNON.Vec3(40,-15,-815));

 
    planeBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);

    spikesBody.push(planeBody2);

    
    world.add(planeBody2);
    var loader = new THREE.ObjectLoader();
    loader.load('models/spikes-threejs/spikes.json', 
                function(obj){
                    obj.position.set(40,-15,-830);
                    obj.scale.set(25,15,15)
                   
                    spikes.push(obj);
                    scene.add(obj);
    });
    var planeBox2 = new CANNON.Box(new CANNON.Vec3(12.5,7.5,2.5));

    planeBody2 = new CANNON.Body({mass: 0});
    planeBody2.addShape(planeBox2);
    planeBody2.position.copy(new CANNON.Vec3(40,-15,-830));

 
    planeBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);

    spikesBody.push(planeBody2);

    
    world.add(planeBody2);
    var loader = new THREE.ObjectLoader();
    loader.load('models/spikes-threejs/spikes.json', 
                function(obj){
                    obj.position.set(40,-15,-845);
                    obj.scale.set(25,15,15)
                   
                    spikes.push(obj);
                    scene.add(obj);
    });
    var planeBox2 = new CANNON.Box(new CANNON.Vec3(12.5,7.5,2.5));

    planeBody2 = new CANNON.Body({mass: 0});
    planeBody2.addShape(planeBox2);
    planeBody2.position.copy(new CANNON.Vec3(40,-15,-845));

 
    planeBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);

    spikesBody.push(planeBody2);

    
    world.add(planeBody2);

    createPlane(new CANNON.Vec3(12.5,25,2.5),new CANNON.Vec3(40,0,-960), geometry2, materialPequenyas,true);//11
    createPlane(new CANNON.Vec3(12.5,75,2.5),new CANNON.Vec3(40,0,-1090), geometry3, materialAlargado,true);

    var geometry4 = new THREE.BoxGeometry(25,25,30);  
    createPlane(new CANNON.Vec3(13,12.5,15),new CANNON.Vec3(15,15,-1060), geometry4, materialParedes,false);  //13
    createPlane(new CANNON.Vec3(13,12.5,15),new CANNON.Vec3(65,15,-1090), geometry4, materialParedes,false);  //14
    createPlane(new CANNON.Vec3(13,12.5,15),new CANNON.Vec3(15,15,-1120), geometry4, materialParedes,false); //15


    createPlane(new CANNON.Vec3(50,50,2.5),new CANNON.Vec3(40,0,-1250), geometry, material,true);

    document.documentElement.addEventListener(
        "mousedown", function(){
          mouse_IsDown = true;
          if (listener.context.state !== 'running') {
          listener.context.resume();
        }})

}

function createPlane(tamCannon, position, geometry, material, horizontal)
{   
    var planeBox = new CANNON.Box(tamCannon);
    plane =  new THREE.Mesh( geometry, material );
    plane.castShadow = true;
    plane.receiveShadow = true;
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
    mvtoDer1 = new TWEEN.Tween( planesBody[2].position ).to( {x: [100],
        y: [0],
        z: [-300] },10000);
    mvtoIzq1 = new TWEEN.Tween( planesBody[2].position ).to( {x: [-100],
        y: [0],
        z: [-300] }, 10000);

    
  
    mvtoDer1.onComplete(function(){

        der = true;
        izq = false;

    });

    mvtoIzq1.onComplete(function(){

        der = false;
        izq = true;

    });
  
    mvtoDer1.chain( mvtoIzq1 );
    mvtoIzq1.chain( mvtoDer1 );
    
    mvtoDer1.start();
    
    var mvtoDer = new TWEEN.Tween( planesBody[7].position ).to( {x: [40],
        y: [15],
        z: [-600] },5000 );
    var mvtoIzq = new TWEEN.Tween( planesBody[7].position ).to( {x: [65],
        y: [15],
        z: [-600] }, 5000 );

    mvtoDer.chain( mvtoIzq );
    mvtoIzq.chain( mvtoDer );
        
    mvtoDer.start();

    var mvtoDer2 = new TWEEN.Tween( planesBody[8].position ).to( {x: [40],
        y: [15],
        z: [-630] },5500 );
    var mvtoIzq2 = new TWEEN.Tween( planesBody[8].position ).to( {x: [65],
        y: [15],
        z: [-630] }, 5500 );

    mvtoDer2.chain( mvtoIzq2 );
    mvtoIzq2.chain( mvtoDer2 );
        
    mvtoDer2.start();

    var mvtoDer3 = new TWEEN.Tween( planesBody[9].position ).to( {x: [40],
        y: [15],
        z: [-660] },6000 );
    var mvtoIzq3 = new TWEEN.Tween( planesBody[9].position ).to( {x: [65],
        y: [15],
        z: [-660] }, 6000 );

    mvtoDer3.chain( mvtoIzq3 );
    mvtoIzq3.chain( mvtoDer3 );
        
    mvtoDer3.start();
    

    for(var i = 0; i < 2; i++)
    {
        var mvtoArriba = new TWEEN.Tween( spikesBody[i].position ).to( {x: [40],
            y: [2],
            z: [spikesBody[i].position.z] },1000 );
        var mvtoAbajo = new TWEEN.Tween( spikesBody[i].position ).to( {x: [40],
            y: [-15],
            z: [spikesBody[i].position.z] }, 5000 );
    
        mvtoArriba.chain( mvtoAbajo );
        mvtoAbajo.chain( mvtoArriba );
        mvtoArriba.delay(2000);
        mvtoArriba.start();
    }
    
    for(var i = 2; i < spikesBody.length; i++)
    {
        var mvtoArriba1 = new TWEEN.Tween( spikesBody[i].position ).to( {x: [40],
            y: [2],
            z: [spikesBody[i].position.z] },1000 );
        var mvtoAbajo1 = new TWEEN.Tween( spikesBody[i].position ).to( {x: [40],
            y: [-15],
            z: [spikesBody[i].position.z] }, 5000 );
    
        mvtoArriba1.chain( mvtoAbajo1 );
        mvtoAbajo1.chain( mvtoArriba1 );
                
        mvtoArriba1.start();
        mvtoArriba1.delay(4000);
    }
    
  

    var mvtoDer4 = new TWEEN.Tween( planesBody[13].position ).to( {x: [15],
        y: [15],
        z: [-1060] },5000 );
    var mvtoIzq4 = new TWEEN.Tween( planesBody[13].position ).to( {x: [65],
        y: [15],
        z: [-1060] }, 5000 );

    mvtoDer4.chain( mvtoIzq4 );
    mvtoIzq4.chain( mvtoDer4 );
    mvtoIzq4.delay(1000);
    mvtoDer4.start();

    var mvtoDer5 = new TWEEN.Tween( planesBody[14].position ).to( {x: [15],
        y: [15],
        z: [-1090] },5500 );
    var mvtoIzq5 = new TWEEN.Tween( planesBody[14].position ).to( {x: [65],
        y: [15],
        z: [-1090] }, 5500 );
    
    mvtoDer5.chain( mvtoIzq5 );
    mvtoIzq5.chain( mvtoDer5 );
    mvtoDer5.delay(1000);
    mvtoIzq5.start();

    var mvtoDer6 = new TWEEN.Tween( planesBody[15].position ).to( {x: [15],
        y: [15],
        z: [-1120] },6000 );
    var mvtoIzq6 = new TWEEN.Tween( planesBody[15].position ).to( {x: [65],
        y: [15],
        z: [-1120] }, 6000 );

    mvtoDer6.chain( mvtoIzq6 );
    mvtoIzq6.chain( mvtoDer6 );
    mvtoIzq6.delay(1000); 
    mvtoDer6.start();

}        




function update() {
    var delta = reloj.getDelta();
    
    if(sphereBody.position.x == 0 && sphereBody.position.z == 0 && muerte == true)
    {
        cont++;
        muerte = false;
        //startAnimation();
        
    }

    if(sphereBody.position.x == 0 && sphereBody.position.z == 0 && ganado == true)
    {
        cont = 1;
        ganado = false;
        //startAnimation();
        
    }
    

    if(controls.enabled)
        world.step(delta);

    
    for(var i = 0; i < planes.length; i++)
    {
        planes[i].position.copy(planesBody[i].position);
        planes[i].quaternion.copy(planesBody[i].quaternion);
    }
    
    for(var i = 0; i < spikes.length; i++)
    {
        spikes[i].position.copy(spikesBody[i].position);
    }


    if(sphereBody.position.y < -20)
    {
        blocker2.style.display = '-webkit-box';
        blocker2.style.display = '-moz-box';
        blocker2.style.display = 'box';
        diedText.innerHTML = 'You died, number of attempts: ' + cont;
        //aux++;
       
        controls.enabled = false;
        setTimeout(function(){  
           
            controls.enabled = true;
            
            blocker2.style.display = 'none';       
             
            
        }, 3000); 
        setTimeout(function(){  
            
            
            camera.position.set( 0,10,0 ); 
            sphereBody.position.set(0,6,0);     
            
            
        }, 1000); 
        muerte = true;
        /*initPhysics();
        initVisual();
        loadScene(); 
        startAnimation(); */
        
    }
    
    for(var i = 0; i < spikes.length; i++)
    {
        if(sphereBody.position.z < spikes[i].position.z+10 && sphereBody.position.z > spikes[i].position.z-10 && sphereBody.position.x > planes[10].position.x - 6.75 && sphereBody.position.x < planes[10].position.x + 6.75 && spikes[i].position.y >= -8)
        {
            controls.enabled = false;
            blocker2.style.display = '-webkit-box';
            blocker2.style.display = '-moz-box';
            blocker2.style.display = 'box';
            diedText.innerHTML = 'You died, number of attempts: ' + cont;
            
            controls.enabled = false;
            setTimeout(function(){  
                controls.enabled = true;
                
                
                blocker2.style.display = 'none'; 
                      
            
            
            }, 3000); 
            setTimeout(function(){  
                
                camera.position.set( 0,10,0 ); 
                sphereBody.position.set(0,6,0);     
            
            
            }, 1000); 

            muerte = true;
            
        }
    }

    if(sphereBody.position.y <= 4 && sphereBody.position.z > planes[2].position.z-50 && sphereBody.position.z < planes[2].position.z+50)
    {
        
        if(der == false)
        {
            sphereBody.velocity.x += 0.8;
        }

        else
        {
            sphereBody.velocity.x -= 0.8;
        }
    }


    if(sphereBody.position.y <= 4 && sphereBody.position.z > planes[planes.length-1].position.z-30 && sphereBody.position.z < planes[planes.length-1].position.z+30)
    {
        
    
        blocker2.style.display = '-webkit-box';
        blocker2.style.display = '-moz-box';
        blocker2.style.display = 'box';
        diedText.innerHTML = 'You win, number of attempts: ' + cont;
        //controls.enabled = false;
        setTimeout(function(){  
            //controls.enabled = true;
            
            
            blocker2.style.display = 'none'; 
            
        
        
        }, 4000); 
        setTimeout(function(){  
            
            camera.position.set( 0,10,0 ); 
            sphereBody.position.set(0,6,0);   
            ganado = true;  
        
        
        }, 2000); 

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
            