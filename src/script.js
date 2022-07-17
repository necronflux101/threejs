import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const sphereGeometry = new THREE.SphereBufferGeometry(0.75, 64, 64); //Defining a sphere

// Loading
const textureLoader = new THREE.TextureLoader();
const normalTexture = new textureLoader.load('/textures/planet_normal.png');

// Materials

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7;
material.roughness = 0.2;
material.normalMap = normalTexture;
material.color = new THREE.Color(0x9d7419)

// Mesh
const sphere = new THREE.Mesh(sphereGeometry, material)
scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;


const pointLight2 = new THREE.PointLight(0x9b0505, 2);
pointLight2.position.set(-1.78, 0.79, 1.33);
pointLight2.intensity = 2.2;

const pointLight3 = new THREE.PointLight(0x5d9cbb, 2);
pointLight3.position.set(2.68, -1.28, -0.09);
pointLight3.intensity = 2.28;

// const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1)
// const pointLightHelper2 = new THREE.PointLightHelper(pointLight3, 1)

scene.add(pointLight);
scene.add(pointLight2);
scene.add(pointLight3);

// scene.add(pointLightHelper);
// scene.add(pointLightHelper2);

// const lightColor = {
//     color: 0xff0000
// }

// const light1 = gui.addFolder('Light 1');

// light1.add(pointLight2.position, 'x').min(-3).max(3).step(0.01);
// light1.add(pointLight2.position, 'y').min(-6).max(3).step(0.01);
// light1.add(pointLight2.position, 'z').min(-3).max(3).step(0.01);
// light1.add(pointLight2, 'intensity').min(0).max(10).step(0.01);
// light1.addColor(lightColor, 'color').onChange(() => {
//     pointLight2.color.set(lightColor.color);
// })

// const light2 = gui.addFolder('Light 2');

// light2.add(pointLight3.position, 'x').min(-3).max(3).step(0.01);
// light2.add(pointLight3.position, 'y').min(-6).max(3).step(0.01);
// light2.add(pointLight3.position, 'z').min(-3).max(3).step(0.01);
// light2.add(pointLight3, 'intensity').min(0).max(10).step(0.01);
// light2.addColor(lightColor, 'color').onChange(() => {
//     pointLight3.color.set(lightColor.color);
// })


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX)
    mouseY = (event.clientY - windowHalfY)
}
document.addEventListener('mousemove', onDocumentMouseMove)

let lastScrollTop = 0;
const updateSphere = (event) => {
    //sphere.position.y = window.scrollY * 0.001;
    console.log('Event: ', event)
    const st = window.pageYOffset || document.documentElement.scrollTop;

    if (st > lastScrollTop) {
        // downscroll code
        sphere.position.z += 0.0001 * lastScrollTop;
    } else
    if(st === 0){
        const originalZ = 0.14159999999999992;
        sphere.position.z = originalZ;
    } 
    else
    {
        // upscroll code
        sphere.position.z -= 0.0001 * lastScrollTop;
    }

    console.log('Postion: ',st, sphere.position)
    lastScrollTop = st <= 0 ? 0 : st;
}

window.addEventListener('scroll', updateSphere);

const clock = new THREE.Clock()

const tick = () => {

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    const elapsedTime = clock.getElapsedTime();

    // Update objects
    sphere.rotation.y = .5 * elapsedTime;

    sphere.rotation.y += .5 * (targetX - sphere.rotation.y);

    //sphere.rotation.x = .25 * elapsedTime;

    sphere.rotation.x += .05 * (targetY - sphere.rotation.x);



    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
