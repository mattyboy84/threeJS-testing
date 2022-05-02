import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import * as dat from 'dat.gui';
import gsap from 'gsap';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import SimplexNoise from 'simplex-noise';

const simplex = new SimplexNoise();
//const a = simplex.noise2D
const rayCaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const gui = new dat.GUI();//dat gui is a real time debug to change values
const world = {
    plane: {
        width: 5,
        height: 5,
        widthSegments: 10,
        heightSegments: 10,
    }
};
{

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
}
console.log(simplex);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,
    0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();

new OrbitControls(camera, renderer.domElement);
//typically the back of the plane isn't visible since the light doesn't orbit to reflect on it

renderer.setSize(window.innerWidth, window.innerHeight);//sets size of renderer
renderer.setPixelRatio(devicePixelRatio);//suppose to reduce how jagid objects are rendered
document.body.appendChild(renderer.domElement);//adds a HTML Canvas object to the website's index.


const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);

const planeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors: true,
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

function randomZ() {
    let j=0, k=0;
    console.log(planeMesh.geometry);
    const array = planeMesh.geometry.attributes.position.array;
    for (let i = 0; i < array.length; i += 3) {
        const x = array[i];
        const y = array[i + 1];
        const z = array[i + 2];


        array[i + 2] = z + simplex.noise2D(j/20,k/20);
        j++;
        if (j > world.plane.widthSegments){
            j=0;
            k++;
        }
        //array[i+2]=z+ (Math.random()/10);
    }
}
randomZ();

//for (let i = 0; i < world.plane.widthSegments; i++) {
    for (let j = 0; j < world.plane.heightSegments; j++) {
        console.log(simplex.noise2D(j/100,1));

    }
//}

function refreshGeometry() {
    planeMesh.geometry.dispose();//gets rid of the geometry
    planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
    colorGeometry();
    randomZ();
}

function colorGeometry() {
    const colors = [];
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
        colors.push(0, 0.19, 0.4);
        //colors.push(Math.random(), Math.random(), Math.random()); //random rainbow color
    }
    planeMesh.geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3));
}
colorGeometry();












function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    //rayCaster.setFromCamera(mousePosition, camera);
}


animate();