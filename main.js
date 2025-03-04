import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planets
const planets = [];
const planetData = [
    { color: 0xaaaaaa, distance: 15, speed: 0.02 },
    { color: 0xff5733, distance: 25, speed: 0.015 },
    { color: 0x4287f5, distance: 35, speed: 0.01 },
    { color: 0xe6e600, distance: 45, speed: 0.008 }
];

planetData.forEach(data => {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: data.color });
    const planet = new THREE.Mesh(geometry, material);
    
    planet.userData = { distance: data.distance, speed: data.speed };
    planets.push(planet);
    scene.add(planet);
});

// Camera positioning
camera.position.set(0, 20, 70);
camera.lookAt(0, 0, 0);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    planets.forEach((planet, index) => {
        const angle = Date.now() * planet.userData.speed * 0.001;
        planet.position.x = Math.cos(angle) * planet.userData.distance;
        planet.position.z = Math.sin(angle) * planet.userData.distance;
    });

    renderer.render(scene, camera);
}

animate();

// UI Controls
document.getElementById('size').addEventListener('input', (event) => {
    planets[0].scale.set(event.target.value, event.target.value, event.target.value);
});

document.getElementById('speed').addEventListener('input', (event) => {
    planets[0].userData.speed = parseFloat(event.target.value);
});

document.getElementById('distance').addEventListener('input', (event) => {
    planets[0].userData.distance = parseFloat(event.target.value);
});
