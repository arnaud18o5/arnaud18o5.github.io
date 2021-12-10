// copier coller code iss tracker
import * as THREE from "../node_modules/three/build/three.js";
import {GLTFLoader} from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'

import { RoughnessMipmapper } from '../node_modules/three/examples/jsm/utils/RoughnessMipmapper.js';
import Stats from './Stats';

import React, { Component } from "react";
import ReactDOM from "react-dom";
import {OrbitControls} from "../node_modules/three/examples/jsm/controls/OrbitControls"
import { Object3D } from "three";
import { useEffect, useRef, useState } from "react";


export default function ItemViewer(props){
    const mountRef = useRef(null);
    const [pos, setPos] = useState(false);

    useEffect(() => {
    let pointclouds;
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xffffff );
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let x = 0
let y = 0;
let z = 0;

const camera = new THREE.PerspectiveCamera(
    75,
    (window.innerWidth) / (window.innerHeight),
    0.1,
    1000
)
camera.position.z = 20
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth *0.3, window.innerHeight * 0.3)
mountRef.current.appendChild( renderer.domElement );
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

    
const loader = new GLTFLoader()
loader.load(
    "https://lauriaristorage.blob.core.windows.net/" + props.link,
    function (gltf) {
        gltf.scene.name = "gltf"
        var box = new THREE.Box3().setFromObject(gltf.scene);
        scene.add(gltf.scene)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)
const mgeo = new THREE.SphereGeometry(1,1);
  const mmat = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
  const moon = new THREE.Mesh(mgeo,mmat);
  moon.name = "intersection";
const pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.set(0,0,0);
    const ambientLight = new THREE.AmbientLight(0xFFFFFF);
    ambientLight.intensity = 5;
    scene.add( ambientLight)
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth  / (window.innerHeight)
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth *0.3, window.innerHeight*0.3)
    render()
}
window.addEventListener('pointermove', onMouseMove);

function onMouseMove(event){
    if(mountRef.current !== null){
    let posDiv = mountRef.current.getBoundingClientRect();
    if(event.clientX > posDiv.x && event.clientX < posDiv.x + posDiv.width && event.clientY > posDiv.y && event.clientY < posDiv.y + posDiv.height){
        mouse.x = ( (event.clientX - posDiv.x) / posDiv.width ) * 2 - 1;
        mouse.y = - (( event.clientY - posDiv.y) / posDiv.height ) * 2 + 1;
    }
}
  
}

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()

}

function render() {
  raycaster.setFromCamera( mouse, camera);

	// calculate objects intersecting the picking ray


  const point = new Object3D();
  const intersects = raycaster.intersectObjects( scene.children );
  for (let i = 0; i < intersects.length; i++) {
    // You can do anything you want here, this is just an example to make the hovered object transparent
    //console.log(intersects[i].object.parent.name); 
    const newMaterial = intersects[i].object.material.clone();
    newMaterial.transparent = false;
    newMaterial.opacity = 0.5;
    intersects[i].object.material = newMaterial;
    if(i === 2){
      x = intersects[2].point.x;
      y = intersects[2].point.y;
      z = intersects[2].point.z;
    }
     

   
    
  }

  window.addEventListener("click", onClick, false);

  function onClick(event){
      if(mountRef.current !== null){
        let posDiv = mountRef.current.getBoundingClientRect();
        if(event.clientX > posDiv.x && event.clientX < posDiv.x + posDiv.width && event.clientY > posDiv.y && event.clientY < posDiv.y + posDiv.height){
          let position = moon.position;
          props.click(position.x, position.y, position.z);
        }
    }
    
  }
  
  
moon.position.set(x,y,z);
  scene.add(moon);
    renderer.render(scene, camera)
}

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}


animate()

//return () => mountRef.current.removeChild( renderer.domElement);
    }, [])
    
    

    return (
        <div ref={mountRef} style={{cursor: "none"}}id="3d">
        </div>
    )
  
}

//580