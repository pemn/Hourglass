/*
  hourglass javascript - engine

  Copyright 2016 Vale
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
 
  http://www.apache.org/licenses/LICENSE-2.0
  
  v1.0 06/2016 paulo.ernesto
  carol
*/

var Engine = {
    clock: null,
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    container: null
};

var gui, oX, oY;

function showHelp() {
    // Custom buttoms
    var message_help = document.createElement( 'div' );
    message_help.className = "message-box";
    message_help.innerHTML = "Hotkeys<br/>";
    message_help.innerHTML += "F1 : Help<br/>";
    message_help.innerHTML += "Esc : Exit<br/>";
    message_help.innerHTML += "Space : Minimize<br/>";
    message_help.innerHTML += "Tab/Click : Turn<br/>";
    message_help.innerHTML += "Right Click : Menu<br/>";
    message_help.innerHTML += "<br/>";
    message_help.innerHTML += "Bugs/Sugestions:<br/>";
    message_help.innerHTML += "github.com/pemn/hourglass<br/>";
    message_help.innerHTML += Globals.version + "<br/>";
    
    document.body.appendChild( message_help );
    setTimeout(function(){document.body.removeChild(message_help)}, 5000);
}

function onDocumentKey( event ) {
    // console.log("onDocumentKey " + event.keyCode);
    if(event.keyCode == 0x20) {
        // if running on nwjs, minimize. Otherwise do nothing
        if(Globals.chrome) chrome.app.window.current().minimize();
        // if(typeof(nw) !== "undefined") nw.Window.get().minimize();
    }  else if(event.keyCode == 0x1b) {
        // this usualy will only work on nwjs or as a chrome app
        window.close();
    } else if(event.keyCode == 0x70) {
        showHelp();
    } else if(event.keyCode == 0x09) {
        // reset hourglass
        Engine.hourglass.turn();
    }
}


function onDocumentMouseMove(event) {
    window.moveTo(window.screenX + event.screenX - oX, window.screenY + event.screenY - oY);
    oX = event.screenX;
    oY = event.screenY;
}


function onRendererMouseMove(event) {
    if ( Engine.hourglass.intersect(Engine.camera, event.clientX / window.innerWidth, event.clientY / window.innerHeight)) {
        Engine.renderer.domElement.style.cursor = "default";
    } else {
        Engine.renderer.domElement.style.cursor = "move";
    }
}

function onDocumentMouseUp(event) {
    window.removeEventListener('mousemove', onDocumentMouseMove);
    window.removeEventListener('mouseup', onDocumentMouseUp);
}

function onDocumentMouseDown( event ) {
    if(event.button != 2) return;
    event.preventDefault();
    dat.GUI.toggleHide();
    if(gui.closed) {
        gui.open()
    } else {
        gui.close()
    }
}

function onRendererMouseDown( event ) {
    if(event.button != 0) return;
    event.preventDefault();

    if ( Engine.hourglass.intersect(Engine.camera, event.clientX / window.innerWidth, event.clientY / window.innerHeight)) {
        Engine.hourglass.turn();
    } else {
        // if the user clicked a empty region, move the window
        oX = event.screenX;
        oY = event.screenY;
        
        window.addEventListener('mousemove', onDocumentMouseMove);
        window.addEventListener('mouseup', onDocumentMouseUp);
    }
}

Engine.init = function() {

    var SCREEN_WIDTH = window.innerWidth || 2;
    var SCREEN_HEIGHT = window.innerHeight || 2;

    // CLOCK
    this.clock = new THREE.Clock(true);

    // CONTAINER
    this.container = document.createElement( 'div' );
    document.body.appendChild( this.container );

    // CAMERA
    this.camera = new THREE.PerspectiveCamera( 45, SCREEN_WIDTH / SCREEN_HEIGHT);
    // this.camera = new THREE.OrthographicCamera( SCREEN_WIDTH / - 2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT / - 2, 1.0, this.camera_far );
    this.camera.position.set( SCREEN_HEIGHT * 0.63, SCREEN_HEIGHT * 0.0, 0.0 );

    // SCENE
    this.scene = new THREE.Scene();

    // RENDERER
    this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.setClearColor( 0, 0.0 );
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.left = 0;
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.container.appendChild( this.renderer.domElement );

    // CONTROLS
    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    this.controls.enabled = false;
    this.controls.mouseButtons = { PAN: THREE.MOUSE.MIDDLE, ORBIT: THREE.MOUSE.RIGHT };
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.0;
    this.controls.keyPanSpeed = 0.0;
    this.controls.autoRotate = false;

    // LIGHTS
    
    this.light = new THREE.PointLight( 0xffffff, 1.0, 0 );

    this.scene.add( this.light );

    this.hourglass = new Hourglass(this.scene, this.renderer);
    // this.hourglass = new Hourglass();

    // EVENTS
    // mouse move and clicks
    this.renderer.domElement.addEventListener('mousemove', onRendererMouseMove, false);
    this.renderer.domElement.addEventListener('mousedown', onRendererMouseDown, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    // capture all keystrokes
    document.addEventListener('keydown', onDocumentKey, false);
    // prevent context menu from showing up in chrome app
    document.addEventListener("contextmenu", function (event) {event.preventDefault()}, false);
    // start the render loop
    this.animate();
}

// render loop
Engine.animate = function() {
    requestAnimationFrame( Engine.animate );
    Engine.controls.update();
    Engine.hourglass.update();
    // render scene
    Engine.renderer.render( Engine.scene, Engine.camera );
    Engine.light.position.copy(Engine.camera.position);
}

// EVENTS

window.addEventListener( 'resize', function(event) {
    // console.log("onWindowResize ");
    Engine.camera.aspect = window.innerWidth / window.innerHeight;
    Engine.camera.updateProjectionMatrix();
    Engine.renderer.setSize( window.innerWidth, window.innerHeight );
});


document.addEventListener('DOMContentLoaded', function() {
    // console.log("DOMContentLoaded");
    window.moveTo(window.screen.availWidth - window.outerWidth - 20, window.screen.availHeight * 0.1);

    Engine.init();
    // GUI
    gui = new dat.GUI({ autoplace: false, width: "100%" });
    gui.close();
    // convenience close option for when the close button is hidden
    gui.add(window, 'close');
    //gui.add({exit: function() {window.close()}}, 'exit');
    dat.GUI.toggleHide();
    // gui.addColor(Globals, 'color_glass').onChange(function(value) {Engine.hourglass.glass_material.color.set(value)});
    // gui.addColor(Globals, 'color_sand').onChange(function(value) {Engine.hourglass.sand_material.color.set(value)});
    gui.add(Globals, 'wait');
    gui.add(Engine.hourglass, 'fill', 0.0, 1.0).listen().onChange(function(value) {Engine.hourglass.setFill(value)});
    // nwjs or chrome.app only section
    if(Globals.chrome) {
        // read settings stored on the presistent localStorage
        ["always_on_top","hide_close","no_sound"].map(Globals.loadItem);

        // Close buttom (since we are a frameless window)
        var div = document.createElement( 'div' );
        div.className = "custom-buttom";
        div.id = "close_buttom"
        div.textContent = "X";
        // apply the stored show hide button setting
        div.style.visibility = Globals.hide_close ? "hidden" : "visible";
        div.addEventListener('click', function() {window.close()}, false);
        document.body.appendChild( div );

        // disable sound
        gui.add(Globals, 'no_sound');

        // always on top checkbox
        gui.add(Globals, 'always_on_top').onChange(chrome.app.window.current().setAlwaysOnTop);
        // apply the stored always on top setting
        if(Globals.always_on_top) chrome.app.window.current().setAlwaysOnTop(true);

        // hide close button checkbox
        gui.add(Globals, 'hide_close').onChange(function(value) {
            document.getElementById("close_buttom").style.visibility = value ? "hidden" : "visible";
        });
    }
    // briefly show the help panel
    showHelp();
});

window.addEventListener("beforeunload", function(){
    // store settings on the persistent localStorage
   ["always_on_top","hide_close","no_sound"].map(Globals.saveItem);
   return(false);
});
