/*
  hourglass javascript - actors
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
 
  http://www.apache.org/licenses/LICENSE-2.0
  
  v1.0 06/2016 paulo.ernesto
  carol
*/

// Unicode has an HOURGLASS symbol at U+231B (⌛).

// hardcoded defauls
// some values may be changed by the dat.gui
var Globals = {
    wait: 3600,
    color_wood: 0xE37222,
    color_glass: 0x3d7edb,
    color_sand: 0xecb11f,
    asset_beep: 'assets/beep.ogg',
    asset_glass_texture: 'assets/glass_texture.png',
    asset_wood_texture: 'assets/wood_texture.png',
    hide_close: false,
    always_on_top: false,
    rate: 1.0
};

Globals.audio_beep = new Audio(Globals.asset_beep);

Globals.loadStorage = function () {
    if (window.localStorage !== null) {
        this.hide_close = window.localStorage.getItem("hide_close") == "true";
        this.always_on_top = window.localStorage.getItem("always_on_top") == "true";
    }
}

// simple particle effect for falling sand
// uses moving points
var FallingSand = function(scene, distance) {
    if (!scene) return;
    this.scene = scene;
    this.count = 256;
    this.distance = distance;
    this.speed = 0.01;
    this.draw = new Array();
    var points = new THREE.Geometry();
    for (var i = 0; i < this.count; i++) {
        this.draw.push([Math.random(),Math.random(),Math.random()]);
        var y = this.count * this.draw[i][1] * -1.0;
        var z = Math.sqrt(Math.abs(y)) * (this.draw[i][2] * 2 - 1);
        var x = Math.sqrt(Math.abs(y)) * (this.draw[i][0] * 2 - 1);
        var pos = new THREE.Vector3(x, y, z);
        points.vertices.push(pos);
    }
    var material = new THREE.PointsMaterial( {size: distance * 0.02, color: Globals.color_sand } );
    var actor = new THREE.Points(points, material);
    this.actor = actor;
    scene.add(actor);
}

FallingSand.prototype.update = function(fill) {
    if(fill == 0) {
        this.actor.visible = false;
        return;
    }
    
    this.actor.visible = true;
    
    for (var i = 0; i < this.count; i++) {
        this.draw[i][1] += this.speed;
        if(this.draw[i][1] > 1.0) {
            this.draw[i][0] = Math.random();
            this.draw[i][1] = Math.random();
            this.draw[i][2] = Math.random();
        }
        var y = this.distance * this.draw[i][1] * -1.0;
        var z = Math.sqrt(Math.abs(y)) * (this.draw[i][2] * 2 - 1);
        var x = Math.sqrt(Math.abs(y)) * (this.draw[i][0] * 2 - 1);
        this.actor.geometry.vertices[i].set(x, y, z);
    }
    this.actor.geometry.verticesNeedUpdate = true;
}

// a interactive hourglass with dynamic sand
var Hourglass = function(scene, renderer){
    this.clock = new THREE.Clock();
    this.clock.start();
    if (!scene) return;
    this.scene = scene;
    this.play = 0.0;
    this.fill = 1.0;
    this.last_fill = undefined;

    this.unity = Math.floor(renderer.getSize().height * 0.1);

    var actor,geometry,mesh,texture
    actor = new THREE.Object3D();
    actor.name = "glass";

    // top wood disk
    geometry = new THREE.CylinderGeometry( this.unity * 1.2, this.unity * 1.2, this.unity * 0.2, 32 );
    texture = new THREE.TextureLoader().load( Globals.asset_wood_texture );
    this.wood_material = new THREE.MeshPhongMaterial( {color: Globals.color_wood, map: texture} );
    mesh = new THREE.Mesh(geometry, this.wood_material);
    mesh.position.set(0,this.unity * 2.0,0);
    actor.add(mesh);

    // bottom wood disk
    geometry = new THREE.CylinderGeometry( this.unity * 1.2, this.unity * 1.2, this.unity * 0.2, 32 );
    mesh = new THREE.Mesh(geometry, this.wood_material);
    mesh.position.set(0,this.unity * -2.0,0);
    actor.add(mesh);
    
    // the glass spiral
    var points = [];
    for ( var i = -100; i <= 100; i ++ ) {
        // the 0.006 factor control the shape of the hourglass
        points.push( new THREE.Vector2( Math.sin(Math.abs(i) * Math.PI * 0.006) * this.unity + this.unity * 0.05, i * this.unity * 0.02) );
    }
    geometry = new THREE.LatheGeometry( points, 32 );
    texture = new THREE.TextureLoader().load( Globals.asset_glass_texture );
    this.glass_material
    this.glass_material = new THREE.MeshPhongMaterial( {color: Globals.color_glass, transparent: true, opacity: 0.4, map: texture } );
    mesh = new THREE.Mesh(geometry, this.glass_material);
    actor.add(mesh);
    this.glass = actor;
    scene.add(actor);

    actor = new THREE.Object3D();
    actor.name = "sand";
    this.sand_material = new THREE.MeshPhongMaterial( {color: Globals.color_sand } );

    // create empty placeholder geometries for the sand parts
    mesh = new THREE.Mesh(new THREE.Geometry(), this.sand_material);
    this.sand_a_body = mesh;
    actor.add(mesh);
    mesh = new THREE.Mesh(new THREE.Geometry(), this.sand_material);
    this.sand_b_body = mesh;
    actor.add(mesh);
    this.sand = actor;
    scene.add(actor);

    this.particles = new FallingSand(this.scene, this.unity * 2);

    Hourglass.Singleton = this;
    this.timer = setInterval(function () {
        if(typeof(Hourglass.Singleton) !== "undefined") Hourglass.Singleton.clockUpdate();
    }, 1000);

}

Hourglass.prototype.turn = function() {
    if(!this.scene) return;
    this.play = 1.0;
    this.clock = new THREE.Clock();
    this.clock.start();
    if(typeof(nw) !== "undefined") nw.Window.get().setAlwaysOnTop(Globals.always_on_top);
}

Hourglass.prototype.sand_state = function() {
    if(!this.scene) return;
    // early exit to avoid redoing work on small changes
    if(this.fill === this.last_fill) {
        return;
    }
    this.last_fill = this.fill;
    // since the hourglass filling volume is not linear, convert the linear fill to a geometric fill
    var volume_fill = Math.sqrt(this.fill)

    // top sand lathe guideline
    if(this.fill > 0.001) {
        var points = [];
        for ( var i = 0; i <= volume_fill * 100; i ++ ) {
            points.push( new THREE.Vector2( Math.sin(i * Math.PI * 0.006) * this.unity, i * this.unity * 0.02) );
        }
        points.push(new THREE.Vector2( 0.01, volume_fill * this.unity * 1.5 ) );
        this.sand_a_body.geometry.dispose();
        this.sand_a_body.geometry = new THREE.LatheGeometry( points , 32 );
        this.sand_a_body.visible = true;
    } else if(this.sand_a_body.visible) {
        this.sand_a_body.visible = false;
    }
    // bottom sand lathe guideline
    if(this.fill < 0.999) {
        var volume_fill = Math.sqrt(this.fill)
        var points = [];
        for ( var i = 100; i >= volume_fill * 100; i -- ) {
            points.push( new THREE.Vector2( Math.sin(Math.abs(i) * Math.PI * 0.006) * this.unity, i * -1.0 * this.unity * 0.02) );
        }
        points.push(new THREE.Vector2( 0.01, -1.0 * volume_fill * this.unity * 1.5 ) );
        this.sand_b_body.geometry.dispose();
        this.sand_b_body.geometry = new THREE.LatheGeometry( points , 32 );
        this.sand_b_body.visible = true;
    } else {
        this.sand_b_body.visible = false;
    }
}

Hourglass.prototype.update = function() {
    if(!this.scene) return;

    if(this.play > 0) {
        this.play -= 0.01;
        this.particles.actor.visible = false;
        this.glass.rotation.z += Math.PI * 0.01;
        if(this.glass.rotation.z >= Math.PI * 2.0) {
            this.glass.rotation.z -= Math.PI * 2.0;
        }
        this.sand.rotation.z += Math.PI * 0.01;
        if(this.sand.rotation.z >= Math.PI * 2.0) {
            this.sand.rotation.z -= Math.PI * 2.0;
        }
        // snap the rotation to zero to prevent subtle inconsistencies
        if(this.play <= 0) {
            this.sand.rotation.z = 0;
        }
    } else if(this.clock.running) {
        this.particles.update(this.fill);
        this.sand_state();
    }
}

Hourglass.prototype.clockUpdate = function() {
    if(this.clock.running) {
        if (this.clock.getElapsedTime() >= Globals.wait) {
            this.clock.stop();
            this.fill = 0;
            this.sand_state();
            if(typeof(nw) !== "undefined") {
                var win = nw.Window.get();
                win.restore();
                win.setAlwaysOnTop(true);
            }
            // play a hardcoded sound file
            Globals.audio_beep.play();
        } else {
            this.fill = Math.min(1.0, 1.0 - this.clock.getElapsedTime() / Globals.wait);
        }
    }
}

Hourglass.prototype.setRate = function(rate) {
    if(!this.clock.running) {
        this.clock = new THREE.Clock();
        this.clock.start();
    }
    this.clock.elapsedTime = Globals.wait * rate;
}

Hourglass.prototype.intersect = function(camera, x, y) {
    if(!this.scene) return;
    
    var intersects;
    if(camera) {
        var mouse = new THREE.Vector3();
        mouse.x = x * 2 - 1;
        mouse.y = - y * 2 + 1;
        mouse.z = 0.5;

        mouse.unproject( camera );

        var raycaster = new THREE.Raycaster( camera.position, mouse.sub( camera.position ).normalize() );
        // check if the region user clicked in over the body of the hourglass
        intersects = raycaster.intersectObjects( this.glass.children );
    }

    return ( intersects.length > 0 );
}

Hourglass.prototype.Singleton = undefined;

