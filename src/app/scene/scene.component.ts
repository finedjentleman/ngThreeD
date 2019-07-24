import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
declare const require: (moduleId: string) => any;
const OrbitControls = require('three-orbit-controls')(THREE);

// LINK TO THE 3D MODEL
// https://sketchfab.com/3d-models/1972-datsun-240k-gt-non-commercial-use-only-b2303a552b444e5b8637fdf5169b41cb

// npm i --save three-gltf-loader
// npm i three-orbit-controls

/*
ALSO ADDED
{
"compilerOptions": {
    "types": ["node"]
}
TO tsconfig.app.json
*/

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit {

  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;

  constructor() { }

  ngOnInit() {


    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    let THIS = this; // ! the class instance

    this.scene = new THREE.Scene();
    this.scene.background =  new THREE.Color(0xdddddd);

    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth/window.innerHeight,
      1,
      5000
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    
    // TODO: Place the camera in front of the Model
    this.camera.rotation.y = 45/180 * Math.PI;
    this.camera.position.x = 800;
    this.camera.position.y = 100;
    this.camera.position.z = 1000;
    
    // TODO: 360 degrees View
    // ! ERROR TypeError: array[i].call is not a function at OrbitControls.dispatchEvent
    let controls = new OrbitControls(this.camera);
    controls.addEventListener('change', this.renderer.domElement); 
    

    // Light to illuminate the model
    var hlight = new THREE.AmbientLight(0x404040, 100);

    this.scene.add(hlight);

    // TODO: Add a DirectionalLight as AmbientLight illuminates all objects equally from all sides
    var directionalLight = new THREE.DirectionalLight(0xffffff, 100);
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // TODO: Add 4 PointLights and place them around the car
    // ! PointLight is similar to a lightbulb in the real world: automatically casting shadow
    var light1 = new THREE.PointLight(0xc4c4c4, 10);
    light1.position.set(0, 300, 500);
    this.scene.add(light1);
    var light2 = new THREE.PointLight(0xc4c4c4, 10);
    light2.position.set(500, 100, 0);
    this.scene.add(light2);
    var light3 = new THREE.PointLight(0xc4c4c4, 10);
    light3.position.set(0, 100, -500);
    this.scene.add(light3);
    var light4 = new THREE.PointLight(0xc4c4c4, 10);
    light4.position.set(-500, 300, 0);
    this.scene.add(light4);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    let loader = new GLTFLoader(); // ! NOT THREE.GLTFLoader()
    loader.load('assets/models/scene.gltf', function(gltf){
      // ! using THIS instead of this, as 'this' in the callback function of load refers to
      // ! the function onload and not the class instance.
      
      let car = gltf.scene.children[0]; // ! For scaling down the car
      car.scale.set(0.5, 0.5, 0.5);

      THIS.scene.add(gltf.scene); // ! THIS
      THIS.animate(); // ! to animate the scene when camera is rotated
    });

  }

  animate(){
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }

  onWindowResize(){ // for component to stay in the middle
    this.camera.aspect = window.innerWidth/window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }


}
