// Main Three.js script for Piazza Duomo Catania

// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
document.body.appendChild(renderer.domElement);

// Set sky color
scene.background = new THREE.Color(0x87ceeb);

// Lighting System
// Main directional light (sun)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 100, 50);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.left = -70;
directionalLight.shadow.camera.right = 70;
directionalLight.shadow.camera.top = 70;
directionalLight.shadow.camera.bottom = -70;
scene.add(directionalLight);

// Hemisphere light for ambient illumination
const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x444444, 0.6);
scene.add(hemisphereLight);

// Creating the Piazza Ground
const groundGeometry = new THREE.PlaneGeometry(150, 150, 10, 10);
const textureLoader = new THREE.TextureLoader();
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x8a8275,
  roughness: 0.8,
  bumpScale: 0.1,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Modeling the Elephant Fountain (U Liotru)
// Create elephant fountain group
const elephantFountain = new THREE.Group();

// Base/pedestal
const pedestalGeometry = new THREE.BoxGeometry(5, 1, 5);
const marbleMaterial = new THREE.MeshStandardMaterial({
  color: 0xf5f5f5,
  roughness: 0.3,
});
const pedestal = new THREE.Mesh(pedestalGeometry, marbleMaterial);
pedestal.position.y = 0.5;
pedestal.castShadow = true;
pedestal.receiveShadow = true;
elephantFountain.add(pedestal);

// Basin
const basinGeometry = new THREE.CylinderGeometry(7, 7, 0.5, 32);
const basin = new THREE.Mesh(basinGeometry, marbleMaterial);
basin.position.y = 0.25;
basin.castShadow = true;
basin.receiveShadow = true;
elephantFountain.add(basin);

// Elephant body
const elephantBodyGeometry = new THREE.CylinderGeometry(1.5, 2, 4, 8);
const elephantMaterial = new THREE.MeshStandardMaterial({
  color: 0x222222,
  roughness: 0.7,
});
const elephantBody = new THREE.Mesh(elephantBodyGeometry, elephantMaterial);
elephantBody.position.y = 3;
elephantBody.rotation.x = Math.PI / 24;
elephantBody.castShadow = true;
elephantBody.receiveShadow = true;
elephantFountain.add(elephantBody);

// Elephant head
const elephantHeadGeometry = new THREE.SphereGeometry(1.2, 16, 16);
const elephantHead = new THREE.Mesh(elephantHeadGeometry, elephantMaterial);
elephantHead.position.set(0, 4.5, 1.5);
elephantHead.castShadow = true;
elephantHead.receiveShadow = true;
elephantFountain.add(elephantHead);

// Elephant trunk
const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 2.5, 8);
const trunk = new THREE.Mesh(trunkGeometry, elephantMaterial);
trunk.position.set(0, 3.5, 2.5);
trunk.rotation.x = Math.PI / 3;
trunk.castShadow = true;
trunk.receiveShadow = true;
elephantFountain.add(trunk);

// Elephant legs
function createElephantLeg(x, z) {
  const legGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 8);
  const leg = new THREE.Mesh(legGeometry, elephantMaterial);
  leg.position.set(x, 2, z);
  leg.castShadow = true;
  leg.receiveShadow = true;
  return leg;
}

elephantFountain.add(createElephantLeg(0.8, 0.8));
elephantFountain.add(createElephantLeg(-0.8, 0.8));
elephantFountain.add(createElephantLeg(0.8, -0.8));
elephantFountain.add(createElephantLeg(-0.8, -0.8));

// Obelisk
const obeliskGeometry = new THREE.BoxGeometry(1, 8, 1);
const obeliskMaterial = new THREE.MeshStandardMaterial({
  color: 0x8b4513,
  roughness: 0.5,
});
const obelisk = new THREE.Mesh(obeliskGeometry, obeliskMaterial);
obelisk.position.y = 8;
obelisk.castShadow = true;
obelisk.receiveShadow = true;
elephantFountain.add(obelisk);

// Obelisk top (pyramid)
const obeliskTopGeometry = new THREE.ConeGeometry(0.7, 1, 4);
const obeliskTop = new THREE.Mesh(obeliskTopGeometry, obeliskMaterial);
obeliskTop.position.y = 12.5;
obeliskTop.castShadow = true;
obeliskTop.receiveShadow = true;
elephantFountain.add(obeliskTop);

// Enhance elephant fountain details
const obeliskDetails = new THREE.Group();
const obeliskPatterns = new THREE.BoxGeometry(1.2, 0.2, 1.2);
const obeliskDetailMaterial = new THREE.MeshStandardMaterial({
  color: 0x9a6b4b,
});

for (let i = 0; i < 6; i++) {
  const pattern = new THREE.Mesh(obeliskPatterns, obeliskDetailMaterial);
  pattern.position.y = 6 + i * 1.2;
  obeliskDetails.add(pattern);
}

elephantFountain.add(obeliskDetails);

// Position the fountain in the center of the piazza
elephantFountain.position.set(0, 0, 0);
scene.add(elephantFountain);

// Creating Sant'Agata Cathedral
// Cathedral group
const cathedral = new THREE.Group();

// Main structure
const cathedralBaseGeometry = new THREE.BoxGeometry(30, 20, 15);
const cathedralMaterial = new THREE.MeshStandardMaterial({
  color: 0x8a8275, // Darker stone color
  roughness: 0.9,
  metalness: 0.1,
});
const cathedralBase = new THREE.Mesh(cathedralBaseGeometry, cathedralMaterial);
cathedralBase.position.y = 10;
cathedralBase.castShadow = true;
cathedralBase.receiveShadow = true;
cathedral.add(cathedralBase);

// Facade details
const facadeDetailGeometry = new THREE.BoxGeometry(20, 25, 1);
const facadeDetail = new THREE.Mesh(facadeDetailGeometry, cathedralMaterial);
facadeDetail.position.set(0, 12.5, 8);
facadeDetail.castShadow = true;
facadeDetail.receiveShadow = true;
cathedral.add(facadeDetail);

// Add detailed facade ornaments
function createOrnament(width, height, depth) {
  const ornamentGeometry = new THREE.BoxGeometry(width, height, depth);
  const ornament = new THREE.Mesh(ornamentGeometry, cathedralMaterial);
  ornament.castShadow = true;
  return ornament;
}

// Add columns to cathedral facade
for (let i = -3; i <= 3; i++) {
  if (i !== 0) {
    const column = createOrnament(1.5, 15, 1);
    column.position.set(i * 3, 12, 8.5);
    cathedral.add(column);
  }
}

// Cathedral steps
const stepsGeometry = new THREE.BoxGeometry(25, 1, 5);
const stepsMaterial = new THREE.MeshStandardMaterial({
  color: 0xcccccc,
  roughness: 0.6,
});
const steps = new THREE.Mesh(stepsGeometry, stepsMaterial);
steps.position.set(0, 0.5, 10);
steps.castShadow = true;
steps.receiveShadow = true;
cathedral.add(steps);

// Cathedral doors
const doorGeometry = new THREE.BoxGeometry(3, 6, 0.5);
const doorMaterial = new THREE.MeshStandardMaterial({
  color: 0x5c4033,
  roughness: 0.5,
});

const leftDoor = new THREE.Mesh(doorGeometry, doorMaterial);
leftDoor.position.set(-5, 3, 8.3);
cathedral.add(leftDoor);

const rightDoor = new THREE.Mesh(doorGeometry, doorMaterial);
rightDoor.position.set(5, 3, 8.3);
cathedral.add(rightDoor);

const mainDoor = new THREE.Mesh(new THREE.BoxGeometry(5, 8, 0.5), doorMaterial);
mainDoor.position.set(0, 4, 8.3);
cathedral.add(mainDoor);

// Dome based on the Baroque style of Catania
const domeGeometry = new THREE.SphereGeometry(
  6,
  32,
  16,
  0,
  Math.PI * 2,
  0,
  Math.PI / 2
);
const domeMaterial = new THREE.MeshStandardMaterial({
  color: 0xc0c0c0,
  roughness: 0.4,
});
const dome = new THREE.Mesh(domeGeometry, domeMaterial);
dome.position.set(0, 25, 0);
dome.castShadow = true;
dome.receiveShadow = true;
cathedral.add(dome);

// Dome base
const domeBaseGeometry = new THREE.CylinderGeometry(6, 6, 5, 32);
const domeBase = new THREE.Mesh(domeBaseGeometry, cathedralMaterial);
domeBase.position.set(0, 22.5, 0);
domeBase.castShadow = true;
domeBase.receiveShadow = true;
cathedral.add(domeBase);

// Windows
function createWindow(x, y, z) {
  const windowGeometry = new THREE.PlaneGeometry(2, 3);
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x87cefa,
    roughness: 0.3,
    metalness: 0.5,
    side: THREE.DoubleSide,
  });
  const window = new THREE.Mesh(windowGeometry, windowMaterial);
  window.position.set(x, y, z);
  return window;
}

// Add windows to the facade
for (let i = -2; i <= 2; i++) {
  if (i !== 0) {
    // Skip center for main door
    const window = createWindow(i * 4, 15, 8.1);
    cathedral.add(window);
  }
}

// Add windows to the sides
for (let i = -3; i <= 3; i++) {
  const leftWindow = createWindow(-15.1, 10, i * 2);
  leftWindow.rotation.y = Math.PI / 2;
  cathedral.add(leftWindow);

  const rightWindow = createWindow(15.1, 10, i * 2);
  rightWindow.rotation.y = Math.PI / 2;
  cathedral.add(rightWindow);
}

// Position the cathedral
cathedral.position.set(0, 0, 40); // Move cathedral to the north
cathedral.rotation.y = Math.PI; // Rotate to face the elephant fountain
scene.add(cathedral);

// Add surrounding buildings (simplified)
function createBuilding(width, height, depth, x, z, color = 0xe8d8c0) {
  const buildingGroup = new THREE.Group();

  // Main structure
  const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
  const buildingMaterial = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.8,
  });
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.position.y = height / 2;
  building.castShadow = true;
  building.receiveShadow = true;
  buildingGroup.add(building);

  // Add windows
  const windowRows = Math.floor(height / 3);
  const windowCols = Math.floor(width / 3);

  for (let row = 0; row < windowRows; row++) {
    for (let col = 0; col < windowCols; col++) {
      // Skip some windows randomly
      if (Math.random() > 0.8) continue;

      const windowGeometry = new THREE.PlaneGeometry(1.5, 2);
      const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x87cefa,
        roughness: 0.3,
        metalness: 0.5,
        side: THREE.DoubleSide,
      });

      // Front windows
      const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      frontWindow.position.set(
        -width / 2 + 1.5 + col * 3,
        2 + row * 3,
        depth / 2 + 0.1
      );
      buildingGroup.add(frontWindow);

      // Back windows
      const backWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      backWindow.position.set(
        -width / 2 + 1.5 + col * 3,
        2 + row * 3,
        -depth / 2 - 0.1
      );
      backWindow.rotation.y = Math.PI;
      buildingGroup.add(backWindow);
    }
  }

  // Add door
  const doorGeometry = new THREE.PlaneGeometry(2, 3);
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x5c4033,
    roughness: 0.5,
    side: THREE.DoubleSide,
  });
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(0, 1.5, depth / 2 + 0.1);
  buildingGroup.add(door);

  buildingGroup.position.set(x, 0, z);
  scene.add(buildingGroup);

  return buildingGroup;
}

// Create surrounding buildings
const building1 = createBuilding(30, 20, 15, 40, 30, 0xe8d8c0); // Palazzo dei Chierici
const building2 = createBuilding(30, 20, 15, -40, 30, 0xdbc8a0); // Palazzo degli Elefanti
const building3 = createBuilding(25, 18, 15, 35, -35, 0xe0d0b0); // Eastern buildings
const building4 = createBuilding(25, 18, 15, -35, -35, 0xd8c8b0); // Western buildings

// Add more buildings to create the enclosed piazza feel
const building5 = createBuilding(40, 16, 12, -60, 0, 0xe5d5b5); // West side
const building6 = createBuilding(40, 16, 12, 60, 0, 0xe2d2b2); // East side

// Add simple trees
function createTree(x, z) {
  const treeGroup = new THREE.Group();

  // Trunk
  const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 3, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = 1.5;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  treeGroup.add(trunk);

  // Foliage (using multiple spheres for more natural look)
  const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });

  function addFoliageSphere(x, y, z, radius) {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 8, 8),
      foliageMaterial
    );
    sphere.position.set(x, y, z);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    treeGroup.add(sphere);
  }

  addFoliageSphere(0, 4, 0, 1.8);
  addFoliageSphere(1, 3.8, 0, 1.5);
  addFoliageSphere(-1, 3.7, 0, 1.5);
  addFoliageSphere(0, 3.9, 1, 1.5);
  addFoliageSphere(0, 3.8, -1, 1.5);
  addFoliageSphere(0, 5.2, 0, 1.5);

  treeGroup.position.set(x, 0, z);
  scene.add(treeGroup);
}

// Add trees around the piazza
for (let i = 0; i < 8; i++) {
  const angle = (i / 8) * Math.PI * 2;
  const x = Math.cos(angle) * 40;
  const z = Math.sin(angle) * 40;
  createTree(x, z);
}

// Create street lamps
function createStreetLamp(x, z) {
  const lampGroup = new THREE.Group();

  // Pole
  const poleGeometry = new THREE.CylinderGeometry(0.2, 0.3, 8, 8);
  const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.y = 4;

  // Lamp head
  const headGeometry = new THREE.BoxGeometry(1, 1.5, 1);
  const headMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 8;

  // Light
  const light = new THREE.PointLight(0xffd28a, 0.8, 15);
  light.position.y = 7.8;

  lampGroup.add(pole);
  lampGroup.add(head);
  lampGroup.add(light);
  lampGroup.position.set(x, 0, z);

  return lampGroup;
}

// Add lamps around the piazza
const lampPositions = [
  [-20, 20],
  [20, 20],
  [-20, -20],
  [20, -20],
  [-40, 0],
  [40, 0],
  [0, -40],
  [0, 40],
];

lampPositions.forEach(([x, z]) => {
  scene.add(createStreetLamp(x, z));
});

// First-person camera controls
const controls = new THREE.PointerLockControls(camera, document.body);

// Initial camera position
camera.position.set(0, 2, 15); // Position near the elephant fountain
camera.lookAt(0, 8, 0); // Look at the elephant fountain

// Movement variables
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// Event listeners for movement
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      moveForward = true;
      break;
    case "ArrowLeft":
    case "KeyA":
      moveLeft = true;
      break;
    case "ArrowDown":
    case "KeyS":
      moveBackward = true;
      break;
    case "ArrowRight":
    case "KeyD":
      moveRight = true;
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      moveForward = false;
      break;
    case "ArrowLeft":
    case "KeyA":
      moveLeft = false;
      break;
    case "ArrowDown":
    case "KeyS":
      moveBackward = false;
      break;
    case "ArrowRight":
    case "KeyD":
      moveRight = false;
      break;
  }
});

// Click to start controls
const instructions = document.getElementById("instructions");
document.addEventListener("click", () => {
  controls.lock();
});

controls.addEventListener("lock", () => {
  instructions.classList.add("hidden");
});

controls.addEventListener("unlock", () => {
  instructions.classList.remove("hidden");
});

// Responsive design
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Disable matrix auto updates for static objects
elephantFountain.matrixAutoUpdate = false;
elephantFountain.updateMatrix();
cathedral.matrixAutoUpdate = false;
cathedral.updateMatrix();

// Optimize renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Only render when needed
let needsUpdate = true;
controls.addEventListener("change", () => {
  needsUpdate = true;
});

// Adaptive rendering based on device capability
function setAdaptiveQuality() {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  if (isMobile) {
    renderer.setPixelRatio(1);
    // Reduce geometry complexity for mobile
    // Example: reduce segments in cylindrical and spherical geometries
  }
}
setAdaptiveQuality();

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  // Movement logic
  if (controls.isLocked) {
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * 20.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 20.0 * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    // Simple collision detection with ground
    if (camera.position.y < 2) camera.position.y = 2;

    // Boundary constraints to keep player in the piazza
    if (camera.position.x > 70) camera.position.x = 70;
    if (camera.position.x < -70) camera.position.x = -70;
    if (camera.position.z > 70) camera.position.z = 70;
    if (camera.position.z < -70) camera.position.z = -70;
  }

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  needsUpdate = true;
});

// Start the animation loop
animate();
