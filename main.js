import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import * as dat from 'dat.gui';
import gsap from 'gsap';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
//https://www.youtube.com/watch?v=YK1Sw_hnm58
//start server - npm run dev
//gui - npm i dat.gui --save
const rayCaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const mousePosition = new THREE.Vector3();
//
const gui = new dat.GUI();//dat gui is a real time debug to change values
const world = {
  plane: {
    width: 5,
    height: 5,
    widthSegments: 10,
    heightSegments: 10,
  }
};
//3rd prop=min, 4th prop=max, 5th= step
gui.add(world.plane, 'width', 1, 20, 1).onChange(() => {//width slider
  refreshGeometry();
});
//
gui.add(world.plane, 'height', 1, 20, 1).onChange(() => {//height slider
  refreshGeometry();
});
//
gui.add(world.plane, 'widthSegments', 1, 50, 1).onChange(() => {//widthSegments slider
  refreshGeometry();
});
//
gui.add(world.plane, 'heightSegments', 1, 50, 1).onChange(() => {//heightSegments slider
  refreshGeometry();
});
//
//camera, FOV, aspect ratio, near clipping frame,far clipping frame
//camera can see objects between 0.1 & 1000 units
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,
  0.1, 1000);

const renderer = new THREE.WebGLRenderer();

new OrbitControls(camera, renderer.domElement);
//typically the back of the plane isn't visible since the light doesn't orbit to reflect on it

renderer.setSize(window.innerWidth, window.innerHeight);//sets size of renderer
renderer.setPixelRatio(devicePixelRatio);//suppose to reduce how jagid objects are rendered
document.body.appendChild(renderer.domElement);//adds a HTML Canvas object to the website's index.


//width, length, height of the box
//const box = new THREE.BoxGeometry(5, 5, 5);
//const material = new THREE.MeshBasicMaterial({ color: 0x00FF00});
//const mesh = new THREE.Mesh(box,material);//A Mesh is madeup of a geometry & material
//
//scene.add(mesh);//box is now on the screen
//
//
//const sphereGeometry = new THREE.SphereGeometry(4,32,16);
//const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00});
//const sphereMesh = new THREE.Mesh(sphereGeometry,sphereMaterial);
//
//scene.add(sphereMesh);//sphere is now on the screen

const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
//normally a plane will only have 1 side - the other side isn't visible unless you add 'side: THREE.DoubleSide' to plane material
//const planeMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000, side: THREE.DoubleSide});
//for light to show the verticies of the PhongMaterial add 'flatShading: THREE.FlatShading'
//enabling vertexColors will have the materials verticies read its RGB value from the additional color attribute
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

function refreshGeometry() {
  planeMesh.geometry.dispose();//gets rid of the geometry
  planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
  colorGeometry();
  randomZ();
}

function randomZ() {
  const array = planeMesh.geometry.attributes.position.array;
  for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i + 2] = z + Math.random();

  }
}
randomZ();

function colorGeometry() {
  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4);
    //colors.push(Math.random(), Math.random(), Math.random()); //random rainbow color
  }
  planeMesh.geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3));
}
colorGeometry();

//adding a new attribute to the geometry - colour, R, G, B 0-1


//light - colour of light, intenisty max=1;
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
//this orbits the light spurce, back of plane can now be seen.
//new OrbitControls(light, renderer.domElement);

scene.add(light);


camera.position.z = 5;//moves the camera back so it can move the shape


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  //planeMesh.rotation.x+=0.008;
  //planeMesh.rotation.y+=0.01;

  rayCaster.setFromCamera(mousePosition, camera);
  const intersect = rayCaster.intersectObject(planeMesh);
  if (intersect.length > 0) {//intersect with plane
    //console.log(intersect[0].face);
    //console.log(intersect[0].object.geometry.attributes.color);
    const color = intersect[0].object.geometry.attributes.color;
    //vertice 1
    color.setX(intersect[0].face.a, 0.1);
    color.setY(intersect[0].face.a, 0.5);
    color.setZ(intersect[0].face.a, 1.0);
    //vertice 2
    color.setX(intersect[0].face.b, 0.1);
    color.setY(intersect[0].face.b, 0.5);
    color.setZ(intersect[0].face.b, 1.0);
    //vertice 3
    color.setX(intersect[0].face.c, 0.1);
    color.setY(intersect[0].face.c, 0.5);
    color.setZ(intersect[0].face.c, 1.0);
    //color.needsUpdate = true;
    //hoverColor = { R: 0.1, G: 0.5, B: 1.0 };

    //SetX - R, SetY - G, SetZ - B
    //

    const defaultColor = { R: 0, G: 0.19, B: 0.4 };
    const hoverColor = { R: 0.1, G: 0.5, B: 1.0 };

    gsap.to(hoverColor, {
      R: defaultColor.R,
      G: defaultColor.G,
      B: defaultColor.B,
      duration: 1,
      onUpdate: () => {
        //vertice 1
        color.setX(intersect[0].face.a, hoverColor.R);
        color.setY(intersect[0].face.a, hoverColor.G);
        color.setZ(intersect[0].face.a, hoverColor.B);
        //vertice 2
        color.setX(intersect[0].face.b, hoverColor.R);
        color.setY(intersect[0].face.b, hoverColor.G);
        color.setZ(intersect[0].face.b, hoverColor.B);
        //vertice 3
        color.setX(intersect[0].face.c, hoverColor.R);
        color.setY(intersect[0].face.c, hoverColor.G);
        color.setZ(intersect[0].face.c, hoverColor.B);
        color.needsUpdate = true;
      }
    })
  }
}


animate();


addEventListener("mousemove", (event) => {
  //normalize the cords.
  mousePosition.set((event.clientX / window.innerWidth) * 2 - 1, (-(event.clientY / window.innerHeight) * 2 + 1));
  //console.log(mousePosition);
});