import * as THREE from 'three';
import { db } from "./firebaseConfig.js";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Setup Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Background Color (Dark Grey Space Look)
scene.background = new THREE.Color(0x222222);

// Sun (Bright & Visible)
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planets
const planets = [];
const planetData = [
    { color: 0xaaaaaa, distance: 20, speed: 0.02 },
    { color: 0xff5733, distance: 30, speed: 0.015 },
    { color: 0x4287f5, distance: 40, speed: 0.01 },
    { color: 0xe6e600, distance: 50, speed: 0.008 }
];

planetData.forEach(data => {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: data.color });
    const planet = new THREE.Mesh(geometry, material);
    
    planet.userData = { distance: data.distance, speed: data.speed };
    planets.push(planet);
    scene.add(planet);
});

// Lighting for Better Visibility
const light = new THREE.PointLight(0xffffff, 1.5, 100);
light.position.set(0, 0, 0);
scene.add(light);

camera.position.z = 60;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    planets.forEach((planet) => {
        planet.position.x = Math.cos(Date.now() * planet.userData.speed * 0.001) * planet.userData.distance;
        planet.position.z = Math.sin(Date.now() * planet.userData.speed * 0.001) * planet.userData.distance;
    });

    renderer.render(scene, camera);
}

animate();

// Controls
document.getElementById('size').addEventListener('input', (event) => {
    planets.forEach(planet => {
        planet.scale.set(event.target.value, event.target.value, event.target.value);
    });
});

document.getElementById('speed').addEventListener('input', (event) => {
    planets.forEach(planet => {
        planet.userData.speed = parseFloat(event.target.value);
    });
});

document.getElementById('distance').addEventListener('input', (event) => {
    planets.forEach(planet => {
        planet.userData.distance = parseFloat(event.target.value);
    });
});

// Firebase Save & Load
async function saveConfig() {
    await addDoc(collection(db, "solarSystem"), {
        size: document.getElementById('size').value,
        speed: document.getElementById('speed').value,
        distance: document.getElementById('distance').value
    });
    alert('Configuration Saved!');
}

async function loadConfig() {
    const querySnapshot = await getDocs(collection(db, "solarSystem"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        document.getElementById('size').value = data.size;
        document.getElementById('speed').value = data.speed;
        document.getElementById('distance').value = data.distance;
    });
}

document.getElementById('save').addEventListener('click', saveConfig);
document.getElementById('load').addEventListener('click', loadConfig);
