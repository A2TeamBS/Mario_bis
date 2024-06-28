import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias : true});
renderer.setSize(window.innerWidth, window.innerHeight);

const objLoader = new OBJLoader();
objLoader.load(
    'mario.obj',
    (object) => {
        const texture = new THREE.TextureLoader().load('mario.png');
        object.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshPhongMaterial({ map: texture, shininess: 0 });
            }
        });
        object.position.set(0, -1.5, 0);
        scene.add(object);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
        console.log('An error happened', error);
    }
);

const light = new THREE.PointLight(0xfffff, 500);
light.position.set(-15, -15, 2);
scene.add(light);

const lightb = new THREE.PointLight(0xFF0000, 500);
lightb.position.set(15, 15, -2);
scene.add(lightb);

const lightc = new THREE.PointLight(0xFFFFFF, 2);
lightc.position.set(0, 0, 1);
scene.add(lightc);

const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x242424 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, 0, -10);
scene.add(plane);

const cubeGroup = new THREE.Group();
const cubeGroupb = new THREE.Group();

const cubegeometry = new THREE.IcosahedronGeometry(2, 0);

const cubematerial = new THREE.MeshPhysicalMaterial({
    color: 0xFF0000, // Rouge
    transparent: true,
    opacity: 0.8,
    roughness: 0.2,
    metalness: 1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.0,
});
const cubeMesh = new THREE.Mesh(cubegeometry, cubematerial);

const edges = new THREE.EdgesGeometry(cubegeometry);
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xFF0000});
const edgesObject = new THREE.LineSegments(edges, edgeMaterial);

const cubegeometryb = new THREE.IcosahedronGeometry(2, 0);

const cubematerialb = new THREE.MeshPhysicalMaterial({
    color: 0xFF0000, // Rouge
    transparent: true,
    opacity: 0.8,
    roughness: 0.2,
    metalness: 1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.0,
});
const cubeMeshb = new THREE.Mesh(cubegeometryb, cubematerialb);

const edgesb = new THREE.EdgesGeometry(cubegeometryb);
const edgeMaterialb = new THREE.LineBasicMaterial({ color: 0xfffff});
const edgesObjectb = new THREE.LineSegments(edgesb, edgeMaterialb);

cubeGroup.add(cubeMesh);
cubeGroup.add(edgesObject);

cubeGroupb.add(cubeMeshb);
cubeGroupb.add(edgesObjectb);

scene.add(cubeGroup);
scene.add(cubeGroupb);

cubeGroup.scale.set(0.5, 0.5, 0.5);
cubeGroup.position.set(-2, 2, -3);

cubeGroupb.scale.set(0.2, 0.2, 0.2);
cubeGroupb.position.set(1, -0.5, 2);

const cameraDistance = 4;
const cameraTarget = new THREE.Vector3(0, 0, 0);

camera.position.set(0, 0, cameraDistance);
camera.lookAt(cameraTarget);

let cameraPosition = new THREE.Vector3(0, 0, cameraDistance);
let cameraRotation = new THREE.Vector2(0, 0);
const easingSpeed = 0.1;

const mouse = new THREE.Vector2();
const targetRotation = new THREE.Vector2(0, 0);
const sensitivity = 0.05;

const onMouseMove = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    targetRotation.x = mouse.x * sensitivity * Math.PI / 2;
    targetRotation.y = mouse.y * sensitivity * Math.PI / 2;
};

window.addEventListener('mousemove', onMouseMove);

function animate() {
    requestAnimationFrame(animate);

    const cameraPosition = new THREE.Vector3(
        Math.sin(targetRotation.x) * cameraDistance,
        Math.sin(targetRotation.y) * cameraDistance,
        Math.cos(targetRotation.x) * cameraDistance
    );
    camera.position.lerp(cameraPosition, easingSpeed);
    camera.lookAt(cameraTarget);
    renderer.render(scene, camera);
};

function resize()
{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize, false);

animate();
