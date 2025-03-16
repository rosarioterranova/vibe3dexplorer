// Main Three.js script for Piazza Duomo Catania

// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance", // Request high performance GPU
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.outputEncoding = THREE.sRGBEncoding; // Better color accuracy
renderer.physicallyCorrectLights = true; // More realistic lighting
document.body.appendChild(renderer.domElement);

// Set sky color - adjusted to better match Mediterranean blue
scene.background = new THREE.Color(0x4ca7cb);

// Lighting System - enhanced for Mediterranean sunlight
// Main directional light (sun)
const directionalLight = new THREE.DirectionalLight(0xfffaf0, 1.2);
directionalLight.position.set(50, 100, 50);
directionalLight.castShadow = true;
// Optimize shadow maps for performance
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 200;
directionalLight.shadow.camera.left = -70;
directionalLight.shadow.camera.right = 70;
directionalLight.shadow.camera.top = 70;
directionalLight.shadow.camera.bottom = -70;
// Fix shadow flickering
directionalLight.shadow.bias = -0.001;
directionalLight.shadow.normalBias = 0.02;
scene.add(directionalLight);

// Hemisphere light for ambient illumination
const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x555555, 0.7);
scene.add(hemisphereLight);

// Creating the Piazza Ground with distinctive radial pattern
const groundGeometry = new THREE.CircleGeometry(75, 32);
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

// Add radial pattern to match the piazza's distinctive design
function createPiazzaPattern() {
  const patternGroup = new THREE.Group();

  // Create central circle
  const centerCircleGeometry = new THREE.CircleGeometry(15, 32);
  const centerCircle = new THREE.Mesh(
    centerCircleGeometry,
    new THREE.MeshStandardMaterial({
      color: 0x9a9285,
      roughness: 0.7,
    })
  );
  centerCircle.rotation.x = -Math.PI / 2;
  centerCircle.position.y = 0.05;
  patternGroup.add(centerCircle);

  // Create radial lines
  const lineCount = 8;
  for (let i = 0; i < lineCount; i++) {
    const lineGeometry = new THREE.PlaneGeometry(60, 2);
    const line = new THREE.Mesh(
      lineGeometry,
      new THREE.MeshStandardMaterial({
        color: 0x9a9285,
        roughness: 0.7,
      })
    );
    line.rotation.x = -Math.PI / 2;
    line.position.y = 0.05;
    line.rotation.z = (i / lineCount) * Math.PI * 2;
    patternGroup.add(line);
  }

  // Create concentric circles
  const circleRadii = [25, 40, 55];
  circleRadii.forEach((radius) => {
    const circleGeometry = new THREE.RingGeometry(radius - 1, radius, 64);
    const circle = new THREE.Mesh(
      circleGeometry,
      new THREE.MeshStandardMaterial({
        color: 0x9a9285,
        roughness: 0.7,
        side: THREE.DoubleSide,
      })
    );
    circle.rotation.x = -Math.PI / 2;
    circle.position.y = 0.05;
    patternGroup.add(circle);
  });

  return patternGroup;
}

const piazzaPattern = createPiazzaPattern();
scene.add(piazzaPattern);

// Modeling the Elephant Fountain (U Liotru) - enhanced to match reference
const elephantFountain = new THREE.Group();

// Base/pedestal - improved with more accurate proportions
const pedestalBaseGeometry = new THREE.BoxGeometry(7, 1, 7);
const marbleMaterial = new THREE.MeshStandardMaterial({
  color: 0xf0f0f0,
  roughness: 0.3,
});
const pedestalBase = new THREE.Mesh(pedestalBaseGeometry, marbleMaterial);
pedestalBase.position.y = 0.5;
pedestalBase.castShadow = true;
pedestalBase.receiveShadow = true;
elephantFountain.add(pedestalBase);

// Pedestal mid-section
const pedestalMidGeometry = new THREE.BoxGeometry(6, 2, 6);
const pedestalMid = new THREE.Mesh(pedestalMidGeometry, marbleMaterial);
pedestalMid.position.y = 2;
pedestalMid.castShadow = true;
pedestalMid.receiveShadow = true;
elephantFountain.add(pedestalMid);

// Basin
const basinGeometry = new THREE.CylinderGeometry(8, 8, 0.8, 32);
const basin = new THREE.Mesh(basinGeometry, marbleMaterial);
basin.position.y = 0.4;
basin.castShadow = true;
basin.receiveShadow = true;
elephantFountain.add(basin);

// Elephant body - improved to match the lava stone elephant
const elephantMaterial = new THREE.MeshStandardMaterial({
  color: 0x202020, // Darker to match the lava stone
  roughness: 0.9,
  bumpScale: 0.02,
});

// Create a more realistic elephant using multiple geometries
// Main body - use ellipsoid shape instead of box
const elephantBodyGeometry = new THREE.SphereGeometry(2.2, 16, 12);
elephantBodyGeometry.scale(1, 0.8, 1.5);
const elephantBody = new THREE.Mesh(elephantBodyGeometry, elephantMaterial);
elephantBody.position.y = 4.25;
elephantBody.castShadow = true;
elephantBody.receiveShadow = true;
elephantFountain.add(elephantBody);

// Elephant head - more rounded
const elephantHeadGeometry = new THREE.SphereGeometry(1.2, 16, 12);
elephantHeadGeometry.scale(1, 0.9, 1.2);
const elephantHead = new THREE.Mesh(elephantHeadGeometry, elephantMaterial);
elephantHead.position.set(0, 4.75, 3.2);
elephantHead.castShadow = true;
elephantHead.receiveShadow = true;
elephantFountain.add(elephantHead);

// Elephant ears - more realistic curved shape
function createElephantEar(isLeft) {
  const earGroup = new THREE.Group();

  // Create a more realistic ear shape using multiple segments
  const earGeometry = new THREE.CircleGeometry(1.2, 12, 0, Math.PI);
  const ear = new THREE.Mesh(earGeometry, elephantMaterial);

  // Add some thickness to the ear
  const earBackGeometry = new THREE.CircleGeometry(1.1, 12, 0, Math.PI);
  const earBack = new THREE.Mesh(earBackGeometry, elephantMaterial);
  earBack.position.z = -0.1;

  // Add ear rim
  const earRimGeometry = new THREE.TorusGeometry(1.15, 0.1, 8, 12, Math.PI);
  const earRim = new THREE.Mesh(earRimGeometry, elephantMaterial);
  earRim.rotation.x = Math.PI / 2;

  earGroup.add(ear);
  earGroup.add(earBack);
  earGroup.add(earRim);

  // Position and rotate the ear
  earGroup.position.set(isLeft ? -1.3 : 1.3, 5, 3);
  earGroup.rotation.y = isLeft ? -Math.PI / 2 : Math.PI / 2;
  earGroup.rotation.x = -Math.PI / 3;
  earGroup.rotation.z = isLeft ? -Math.PI / 12 : Math.PI / 12;

  return earGroup;
}

const leftEar = createElephantEar(true);
elephantFountain.add(leftEar);

const rightEar = createElephantEar(false);
elephantFountain.add(rightEar);

// Elephant trunk - more curved and realistic
function createElephantTrunk() {
  const trunkGroup = new THREE.Group();

  // Create trunk segments for a more natural curve
  const segments = 5;
  const trunkLength = 3.5;
  const segmentLength = trunkLength / segments;

  for (let i = 0; i < segments; i++) {
    const radius = 0.5 - i * 0.06;
    const segmentGeometry = new THREE.CylinderGeometry(
      radius - 0.05,
      radius,
      segmentLength,
      12
    );

    const segment = new THREE.Mesh(segmentGeometry, elephantMaterial);

    // Position each segment with increasing curve
    const curve = i * 0.15;
    segment.position.y = -i * segmentLength;
    segment.rotation.x = curve;

    // If not the first segment, position relative to previous
    if (i > 0) {
      segment.position.z = curve * segmentLength * 1.5;
    }

    trunkGroup.add(segment);
  }

  // Add trunk tip (slightly different shape)
  const tipGeometry = new THREE.SphereGeometry(0.2, 8, 8);
  tipGeometry.scale(1, 1, 1.2);
  const tip = new THREE.Mesh(tipGeometry, elephantMaterial);
  tip.position.set(0, -trunkLength, 1.2);
  trunkGroup.add(tip);

  // Position the entire trunk
  trunkGroup.position.set(0, 4.75, 4.2);
  trunkGroup.rotation.x = Math.PI / 6;

  return trunkGroup;
}

const trunk = createElephantTrunk();
elephantFountain.add(trunk);

// Elephant legs - more realistic with joints
function createElephantLeg(x, z, isFront) {
  const legGroup = new THREE.Group();

  // Upper leg
  const upperLegGeometry = new THREE.CylinderGeometry(0.7, 0.6, 1.5, 10);
  const upperLeg = new THREE.Mesh(upperLegGeometry, elephantMaterial);
  upperLeg.position.y = -0.75;
  legGroup.add(upperLeg);

  // Knee joint
  const kneeGeometry = new THREE.SphereGeometry(0.6, 10, 10);
  kneeGeometry.scale(1, 0.8, 1);
  const knee = new THREE.Mesh(kneeGeometry, elephantMaterial);
  knee.position.y = -1.5;
  legGroup.add(knee);

  // Lower leg
  const lowerLegGeometry = new THREE.CylinderGeometry(0.6, 0.7, 1.5, 10);
  const lowerLeg = new THREE.Mesh(lowerLegGeometry, elephantMaterial);
  lowerLeg.position.y = -2.25;
  legGroup.add(lowerLeg);

  // Foot
  const footGeometry = new THREE.SphereGeometry(0.7, 10, 10);
  footGeometry.scale(1.1, 0.6, 1.1);
  const foot = new THREE.Mesh(footGeometry, elephantMaterial);
  foot.position.y = -3;
  legGroup.add(foot);

  // Position the leg
  legGroup.position.set(x, 4.25, z);

  // Slightly different angle for front/back legs
  if (isFront) {
    legGroup.rotation.x = -0.05;
  } else {
    legGroup.rotation.x = 0.05;
  }

  return legGroup;
}

// Add legs with proper positioning
elephantFountain.add(createElephantLeg(1.3, 1.8, true));
elephantFountain.add(createElephantLeg(-1.3, 1.8, true));
elephantFountain.add(createElephantLeg(1.3, -1.8, false));
elephantFountain.add(createElephantLeg(-1.3, -1.8, false));

// Add details like wrinkles and texture to the elephant
function addElephantDetails() {
  // Add wrinkles using bump maps or displacement
  const wrinkleTexture = new THREE.TextureLoader().load(
    "https://threejs.org/examples/textures/displacement/2.jpg"
  );
  elephantBody.material = elephantBody.material.clone();
  elephantBody.material.bumpMap = wrinkleTexture;
  elephantBody.material.bumpScale = 0.05;

  elephantHead.material = elephantHead.material.clone();
  elephantHead.material.bumpMap = wrinkleTexture;
  elephantHead.material.bumpScale = 0.03;

  // Add eyes
  const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.2,
  });

  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.7, 5.1, 3.8);
  elephantFountain.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(0.7, 5.1, 3.8);
  elephantFountain.add(rightEye);

  // Add tusks
  const tuskGeometry = new THREE.CylinderGeometry(0.15, 0.1, 1.5, 8);
  const tuskMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0f0e0,
    roughness: 0.3,
  });

  const leftTusk = new THREE.Mesh(tuskGeometry, tuskMaterial);
  leftTusk.position.set(-0.6, 4.2, 3.8);
  leftTusk.rotation.x = Math.PI / 3;
  leftTusk.rotation.z = -Math.PI / 12;
  elephantFountain.add(leftTusk);

  const rightTusk = new THREE.Mesh(tuskGeometry, tuskMaterial);
  rightTusk.position.set(0.6, 4.2, 3.8);
  rightTusk.rotation.x = Math.PI / 3;
  rightTusk.rotation.z = Math.PI / 12;
  elephantFountain.add(rightTusk);
}

// Add the detailed features
addElephantDetails();

// Add the obelisk on top of the elephant
function addObelisk() {
  // Obelisk - adjusted to match reference
  const obeliskGeometry = new THREE.BoxGeometry(1.2, 8, 1.2);
  const obeliskMaterial = new THREE.MeshStandardMaterial({
    color: 0x8c3a1d, // More reddish tone to match granite
    roughness: 0.5,
  });
  const obelisk = new THREE.Mesh(obeliskGeometry, obeliskMaterial);
  obelisk.position.y = 9;
  obelisk.castShadow = true;
  obelisk.receiveShadow = true;
  elephantFountain.add(obelisk);

  // Obelisk top (pyramid)
  const obeliskTopGeometry = new THREE.ConeGeometry(0.8, 1.5, 4);
  const obeliskTop = new THREE.Mesh(obeliskTopGeometry, obeliskMaterial);
  obeliskTop.position.y = 13.75;
  obeliskTop.castShadow = true;
  obeliskTop.receiveShadow = true;
  elephantFountain.add(obeliskTop);

  // Add cross on top (visible in reference)
  const crossGeometry1 = new THREE.BoxGeometry(0.2, 1, 0.2);
  const crossGeometry2 = new THREE.BoxGeometry(0.6, 0.2, 0.2);
  const crossMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37, // Gold color
    metalness: 0.8,
    roughness: 0.2,
  });
  const crossVertical = new THREE.Mesh(crossGeometry1, crossMaterial);
  crossVertical.position.y = 14.75;
  elephantFountain.add(crossVertical);

  const crossHorizontal = new THREE.Mesh(crossGeometry2, crossMaterial);
  crossHorizontal.position.y = 14.5;
  elephantFountain.add(crossHorizontal);

  // Add decorative details to obelisk
  const obeliskDetails = new THREE.Group();
  const obeliskPatterns = new THREE.BoxGeometry(1.3, 0.3, 1.3);
  const obeliskDetailMaterial = new THREE.MeshStandardMaterial({
    color: 0xa56b46,
  });

  for (let i = 0; i < 5; i++) {
    const pattern = new THREE.Mesh(obeliskPatterns, obeliskDetailMaterial);
    pattern.position.y = 6 + i * 2;
    obeliskDetails.add(pattern);
  }

  elephantFountain.add(obeliskDetails);
}

// Add the obelisk
addObelisk();

// Position the fountain in the center of the piazza
elephantFountain.position.set(0, 0, 0);
elephantFountain.rotation.y = Math.PI; // Rotate to face cathedral

// Add the elephant fountain to the scene
scene.add(elephantFountain);

// Create Sant'Agata Cathedral - improved to match the baroque style
const cathedral = new THREE.Group();

// Main structure
const cathedralBaseGeometry = new THREE.BoxGeometry(40, 25, 20);
const cathedralMaterial = new THREE.MeshStandardMaterial({
  color: 0xe0d5cb, // Lighter stone color to match the limestone facade
  roughness: 0.9,
  metalness: 0.1,
});
const cathedralBase = new THREE.Mesh(cathedralBaseGeometry, cathedralMaterial);
cathedralBase.position.y = 12.5;
cathedralBase.castShadow = true;
cathedralBase.receiveShadow = true;
cathedral.add(cathedralBase);

// Facade details
const facadeDetailGeometry = new THREE.BoxGeometry(30, 35, 1.5);
const facadeDetailMaterial = new THREE.MeshStandardMaterial({
  color: 0xe8e0d5,
  roughness: 0.85,
});
const facadeDetail = new THREE.Mesh(facadeDetailGeometry, facadeDetailMaterial);
facadeDetail.position.set(0, 17.5, 10.5);
facadeDetail.castShadow = true;
facadeDetail.receiveShadow = true;
cathedral.add(facadeDetail);

// Upper facade decoration
const upperFacadeGeometry = new THREE.BoxGeometry(20, 10, 1);
const upperFacade = new THREE.Mesh(upperFacadeGeometry, facadeDetailMaterial);
upperFacade.position.set(0, 35, 10.5);
upperFacade.castShadow = true;
upperFacade.receiveShadow = true;
cathedral.add(upperFacade);

// Triangular pediment
const pedimentGeometry = new THREE.CylinderGeometry(10, 10, 8, 3, 1, true);
const pediment = new THREE.Mesh(pedimentGeometry, facadeDetailMaterial);
pediment.rotation.z = Math.PI;
pediment.position.set(0, 42, 10.5);
pediment.scale.set(1, 1, 0.2);
pediment.castShadow = true;
pediment.receiveShadow = true;
cathedral.add(pediment);

// Function to create ornamental elements
function createOrnament(width, height, depth, x, y, z) {
  const ornamentGeometry = new THREE.BoxGeometry(width, height, depth);
  const ornament = new THREE.Mesh(ornamentGeometry, facadeDetailMaterial);
  ornament.position.set(x, y, z);
  ornament.castShadow = true;
  ornament.receiveShadow = true;
  return ornament;
}

// Add columns to cathedral facade (visible in reference)
for (let i = -3; i <= 3; i += 2) {
  const columnHeight = 20;
  const column = createOrnament(2, columnHeight, 2, i * 4, 15, 11.5);
  cathedral.add(column);

  // Column capital
  const capitalGeometry = new THREE.BoxGeometry(3, 1.5, 3);
  const capital = new THREE.Mesh(capitalGeometry, facadeDetailMaterial);
  capital.position.set(i * 4, 15 + columnHeight / 2 + 0.75, 11.5);
  cathedral.add(capital);

  // Column base
  const baseGeometry = new THREE.BoxGeometry(2.5, 1, 2.5);
  const base = new THREE.Mesh(baseGeometry, facadeDetailMaterial);
  base.position.set(i * 4, 15 - columnHeight / 2 - 0.5, 11.5);
  cathedral.add(base);
}

// Add statues along the top edge (visible in reference)
for (let i = -4; i <= 4; i += 2) {
  if (i !== 0) {
    // Skip center
    const statueBaseGeometry = new THREE.BoxGeometry(1.5, 1, 1.5);
    const statueBase = new THREE.Mesh(statueBaseGeometry, facadeDetailMaterial);
    statueBase.position.set(i * 3, 40, 10.5);
    cathedral.add(statueBase);

    // Simple statue representation
    const statueGeometry = new THREE.CylinderGeometry(0.3, 0.5, 3, 8);
    const statueMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      roughness: 0.5,
    });
    const statue = new THREE.Mesh(statueGeometry, statueMaterial);
    statue.position.set(i * 3, 42, 10.5);
    cathedral.add(statue);
  }
}

// Cathedral steps - improved based on reference
const stepsGroup = new THREE.Group();
const stepsCount = 5;
const stepWidth = 35;
const stepDepth = 1.5;
const stepsMaterial = new THREE.MeshStandardMaterial({
  color: 0xd5d0c8,
  roughness: 0.6,
});

for (let i = 0; i < stepsCount; i++) {
  const stepsGeometry = new THREE.BoxGeometry(
    stepWidth - i * 2,
    0.8,
    stepDepth
  );
  const step = new THREE.Mesh(stepsGeometry, stepsMaterial);
  // Fix the position to face the correct direction (toward the elephant fountain)
  step.position.set(0, 0.4 + i * 0.8, 11 - (i * stepDepth) / 2);
  step.castShadow = true;
  step.receiveShadow = true;
  stepsGroup.add(step);
}

cathedral.add(stepsGroup);

// Cathedral doors - enhanced with baroque details
const mainDoorWidth = 6;
const mainDoorHeight = 12;
const doorMaterial = new THREE.MeshStandardMaterial({
  color: 0x5d2a14, // Rich wood color
  roughness: 0.5,
});

// Main central door (more prominent in reference)
const mainDoorGeometry = new THREE.BoxGeometry(
  mainDoorWidth,
  mainDoorHeight,
  0.5
);
const mainDoor = new THREE.Mesh(mainDoorGeometry, doorMaterial);
mainDoor.position.set(0, 6, 11.3);
cathedral.add(mainDoor);

// Arch above main door
const mainDoorArchGeometry = new THREE.CylinderGeometry(
  mainDoorWidth / 2,
  mainDoorWidth / 2,
  1,
  32,
  1,
  false,
  0,
  Math.PI
);
const mainDoorArch = new THREE.Mesh(mainDoorArchGeometry, facadeDetailMaterial);
mainDoorArch.rotation.x = Math.PI / 2;
mainDoorArch.position.set(0, mainDoorHeight + 0.5, 11.3);
cathedral.add(mainDoorArch);

// Side doors
const sideDoorWidth = 4;
const sideDoorHeight = 8;
const leftDoorGeometry = new THREE.BoxGeometry(
  sideDoorWidth,
  sideDoorHeight,
  0.5
);
const leftDoor = new THREE.Mesh(leftDoorGeometry, doorMaterial);
leftDoor.position.set(-10, 4, 11.3);
cathedral.add(leftDoor);

const rightDoor = new THREE.Mesh(leftDoorGeometry, doorMaterial);
rightDoor.position.set(10, 4, 11.3);
cathedral.add(rightDoor);

// Dome - positioned as seen in reference
const domeGeometry = new THREE.SphereGeometry(
  8,
  16,
  16,
  0,
  Math.PI * 2,
  0,
  Math.PI / 2
);
const domeMaterial = new THREE.MeshStandardMaterial({
  color: 0xd8c0a8, // Matching the brown/terracotta tone
  roughness: 0.4,
});
const dome = new THREE.Mesh(domeGeometry, domeMaterial);
dome.position.set(-15, 30, -5); // Positioned as seen in reference
dome.castShadow = true;
dome.receiveShadow = true;
cathedral.add(dome);

// Dome lantern
const lanternGeometry = new THREE.CylinderGeometry(2, 2, 3, 16);
const lantern = new THREE.Mesh(lanternGeometry, facadeDetailMaterial);
lantern.position.set(-15, 34, -5);
lantern.castShadow = true;
lantern.receiveShadow = true;
cathedral.add(lantern);

// Dome base
const domeBaseGeometry = new THREE.CylinderGeometry(9, 9, 5, 16);
const domeBase = new THREE.Mesh(domeBaseGeometry, cathedralMaterial);
domeBase.position.set(-15, 26, -5);
domeBase.castShadow = true;
domeBase.receiveShadow = true;
cathedral.add(domeBase);

// Windows
function createWindow(x, y, z, width = 2, height = 3, rotation = 0) {
  const windowGroup = new THREE.Group();

  // Deep window recess
  const recessGeometry = new THREE.BoxGeometry(width + 0.4, height + 0.4, 0.3);
  const recessMaterial = new THREE.MeshStandardMaterial({
    color: 0xd5d0c8,
    roughness: 0.8,
  });
  const recess = new THREE.Mesh(recessGeometry, recessMaterial);
  recess.position.z = -0.15;
  windowGroup.add(recess);

  // Window frame with depth
  const frameGeometry = new THREE.BoxGeometry(width + 0.2, height + 0.2, 0.1);
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xe0d5c0,
    roughness: 0.6,
  });
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.position.z = -0.05;
  windowGroup.add(frame);

  // Glass pane
  const glassGeometry = new THREE.PlaneGeometry(width, height);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x87cefa,
    metalness: 0.3,
    roughness: 0.2,
    transmission: 0.9,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const glass = new THREE.Mesh(glassGeometry, glassMaterial);
  glass.position.z = -0.1;
  glass.renderOrder = 1;
  windowGroup.add(glass);

  windowGroup.position.set(x, y, z);
  if (rotation) windowGroup.rotation.y = rotation;
  return windowGroup;
}

// Add windows to the facade
for (let i = -2; i <= 2; i++) {
  if (i !== 0) {
    // Skip center for main window
    const window = createWindow(i * 5, 26, 11.3, 2.5, 4);
    cathedral.add(window);
  }
}

// Position the cathedral
cathedral.position.set(0, 0, -40); // Cathedral faces the elephant fountain
scene.add(cathedral);

// Add surrounding buildings (improved to match architecture in references)
function createBuildingWindow(width, height, x, y, z, style) {
  const windowWidth = style === "historic" ? 1.8 : 1.5;
  const windowHeight = style === "historic" ? 3 : 2;

  // Window frame
  const frameGeometry = new THREE.BoxGeometry(
    windowWidth + 0.4,
    windowHeight + 0.4,
    0.2
  );
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xe0d5c0,
    roughness: 0.6,
  });
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.position.set(x, y, z);

  // Glass pane
  const windowGeometry = new THREE.PlaneGeometry(windowWidth, windowHeight);
  const windowMaterial = new THREE.MeshPhysicalMaterial({
    color: style === "historic" ? 0x334455 : 0x87cefa,
    roughness: 0.3,
    metalness: 0.5,
    side: THREE.DoubleSide,
    transparent: true,
    transmission: 0.6,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  const windowPane = new THREE.Mesh(windowGeometry, windowMaterial);
  windowPane.position.set(x, y, z + 0.11);
  windowPane.renderOrder = 1;

  return [frame, windowPane];
}

function createBuilding(
  width,
  height,
  depth,
  x,
  z,
  color = 0xeadbc8,
  style = "standard"
) {
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

  // Roof detail for historic buildings
  if (style === "historic") {
    const roofGeometry = new THREE.BoxGeometry(width + 1, 1, depth + 1);
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: 0xc0aa90,
      roughness: 0.7,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = height + 0.5;
    roof.castShadow = true;
    roof.receiveShadow = true;
    buildingGroup.add(roof);
  }

  // Add windows - more Mediterranean style
  const windowRows = Math.floor(height / 4);
  const windowCols = Math.floor(width / 4);

  for (let row = 0; row < windowRows; row++) {
    for (let col = 0; col < windowCols; col++) {
      // Skip some windows randomly for variety
      if (Math.random() > 0.9) continue;

      // Front windows
      const windowSpacingX = width / (windowCols + 1);
      const windowSpacingY = height / (windowRows + 1);

      const windowX = -width / 2 + windowSpacingX + col * windowSpacingX;
      const windowY = windowSpacingY + row * windowSpacingY;
      const windowZ = depth / 2;

      const [frame, windowPane] = createBuildingWindow(
        width,
        height,
        windowX,
        windowY,
        windowZ,
        style
      );

      buildingGroup.add(frame);
      buildingGroup.add(windowPane);
    }
  }

  // Add balconies for historic buildings (common in Sicilian architecture)
  if (style === "historic") {
    const balconyCount = Math.min(3, windowCols);
    for (let i = 0; i < balconyCount; i++) {
      const balconyWidth = 3;
      const balconyDepth = 1.2;
      const balconyGeometry = new THREE.BoxGeometry(
        balconyWidth,
        0.3,
        balconyDepth
      );
      const balconyMaterial = new THREE.MeshStandardMaterial({
        color: 0xd5d0c8,
        roughness: 0.7,
      });

      const balcony = new THREE.Mesh(balconyGeometry, balconyMaterial);
      balcony.position.set(
        -width / 2 +
          width / (balconyCount + 1) +
          i * (width / (balconyCount + 1)),
        height / 3,
        depth / 2 + balconyDepth / 2
      );

      // Simple balcony railing
      const railingGeometry = new THREE.BoxGeometry(balconyWidth, 1, 0.1);
      const railing = new THREE.Mesh(railingGeometry, balconyMaterial);
      railing.position.set(0, 0.65, balconyDepth / 2 - 0.05);
      balcony.add(railing);

      buildingGroup.add(balcony);
    }
  }

  // Add door
  const doorWidth = style === "historic" ? 3 : 2;
  const doorHeight = style === "historic" ? 5 : 3;
  const doorGeometry = new THREE.PlaneGeometry(doorWidth, doorHeight);
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: style === "historic" ? 0x5d3a23 : 0x5c4033,
    roughness: 0.5,
    side: THREE.DoubleSide,
  });

  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(0, doorHeight / 2, depth / 2 + 0.1);
  buildingGroup.add(door);

  buildingGroup.position.set(x, 0, z);
  return buildingGroup;
}

// Create surrounding buildings matching the reference images
// Palazzo dei Chierici (right side of cathedral)
const palazzoChierici = createBuilding(
  35,
  22,
  18,
  45,
  -15,
  0xe5d5c5,
  "historic"
);
scene.add(palazzoChierici);

// Palazzo degli Elefanti (city hall, left side)
const palazzoElefanti = createBuilding(
  40,
  22,
  18,
  -45,
  -15,
  0xe8d8c8,
  "historic"
);
scene.add(palazzoElefanti);

// Additional buildings around the square
const building1 = createBuilding(30, 20, 20, 45, 30, 0xe0d0b0, "historic");
scene.add(building1);

const building2 = createBuilding(30, 20, 20, -45, 30, 0xe5d5b5, "historic");
scene.add(building2);

const building3 = createBuilding(30, 18, 18, 45, -60, 0xdbc8a0, "historic");
scene.add(building3);

const building4 = createBuilding(30, 18, 18, -45, -60, 0xe2d2b2, "historic");
scene.add(building4);

// Add buildings facing the cathedral across the piazza
const frontBuildings = new THREE.Group();

function createFrontBuilding(width, height, depth, x, z) {
  const building = createBuilding(
    width,
    height,
    depth,
    x,
    z,
    0xe5d5c5,
    "historic"
  );

  // Add more detailed windows and balconies specific to Catanese architecture
  const windowCount = Math.floor(width / 4);
  for (let i = 0; i < windowCount; i++) {
    const balcony = new THREE.Group();
    // Ornate balcony base
    const balconyBase = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.3, 1.2),
      new THREE.MeshStandardMaterial({ color: 0xd5d0c8 })
    );
    balcony.add(balconyBase);

    // Baroque-style supports
    const support1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.8, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xc0b5a5 })
    );
    support1.position.set(-1.2, -0.4, 0.4);
    balcony.add(support1);

    balcony.position.set(-width / 2 + 3 + i * 4, height / 2, depth / 2 + 0.6);
    building.add(balcony);
  }

  return building;
}

// Add row of buildings facing the cathedral
const buildingsFacingCathedral = [
  createFrontBuilding(30, 20, 15, 0, 50),
  createFrontBuilding(25, 18, 15, -35, 50),
  createFrontBuilding(25, 18, 15, 35, 50),
];

buildingsFacingCathedral.forEach((building) => {
  frontBuildings.add(building);
});

// Add courtyard on the right side of cathedral
function createCourtyard(isLeft = false) {
  const courtyard = new THREE.Group();
  const xPosition = isLeft ? -55 : 55;

  // Main arcade structure
  const arcadeGeometry = new THREE.BoxGeometry(40, 12, 2);
  const arcadeMaterial = new THREE.MeshStandardMaterial({
    color: 0xe8d8c8,
    roughness: 0.7,
  });

  // Create arched colonnade
  for (let i = 0; i < 5; i++) {
    const column = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 8, 12),
      arcadeMaterial
    );
    column.position.set(xPosition + (isLeft ? -1 : 1) * i * 8, 4, -40);
    courtyard.add(column);

    // Arch
    const archGeometry = new THREE.TorusGeometry(4, 0.8, 12, 12, Math.PI);
    const arch = new THREE.Mesh(archGeometry, arcadeMaterial);
    arch.rotation.z = Math.PI / 2;
    arch.position.set(xPosition + (isLeft ? -1 : 1) * i * 8, 8, -40);
    courtyard.add(arch);
  }

  // Upper floor with balconies
  const upperFloor = new THREE.Mesh(
    new THREE.BoxGeometry(40, 10, 15),
    arcadeMaterial
  );
  upperFloor.position.set(xPosition, 13, -40);
  courtyard.add(upperFloor);

  // Add decorative elements
  const details = new THREE.Group();
  // Add cornices
  const corniceGeometry = new THREE.BoxGeometry(42, 0.5, 2.5);
  const cornice = new THREE.Mesh(corniceGeometry, arcadeMaterial);
  cornice.position.set(xPosition, 18, -40);
  details.add(cornice);

  // Add windows to the upper floor
  for (let i = 0; i < 5; i++) {
    const windowX = xPosition + (isLeft ? -1 : 1) * (i * 8 - 16);
    const window = createWindow(windowX, 13, -32, 2, 3);
    details.add(window);
  }

  courtyard.add(details);

  // Add potted plants
  const plantPositions = [
    [xPosition - 10, -30],
    [xPosition - 10, -50],
    [xPosition + 10, -30],
    [xPosition + 10, -50],
  ];

  plantPositions.forEach(([x, z]) => {
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 0.8, 1.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    pot.position.set(x, 0.75, z);
    courtyard.add(pot);

    // Add plant
    const plant = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x2d5a27 })
    );
    plant.position.set(x, 2, z);
    courtyard.add(plant);
  });

  return courtyard;
}

// Create right courtyard
const rightCourtyard = createCourtyard(false);
scene.add(rightCourtyard);

// Create left courtyard
const leftCourtyard = createCourtyard(true);
scene.add(leftCourtyard);

// Add frontBuildings back to the scene
scene.add(frontBuildings);

// Optimize for static objects
elephantFountain.matrixAutoUpdate = false;
elephantFountain.updateMatrix();
cathedral.matrixAutoUpdate = false;
cathedral.updateMatrix();
frontBuildings.matrixAutoUpdate = false;
frontBuildings.updateMatrix();
rightCourtyard.matrixAutoUpdate = false;
rightCourtyard.updateMatrix();
leftCourtyard.matrixAutoUpdate = false;
leftCourtyard.updateMatrix();
ground.matrixAutoUpdate = false;
ground.updateMatrix();
piazzaPattern.matrixAutoUpdate = false;
piazzaPattern.updateMatrix();

// Create street lamps matching the ornate design in references
function createStreetLamp(x, z) {
  const lampGroup = new THREE.Group();

  // Base
  const baseGeometry = new THREE.CylinderGeometry(0.8, 1, 0.5, 8);
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = 0.25;
  lampGroup.add(base);

  // Pole
  const poleGeometry = new THREE.CylinderGeometry(0.3, 0.4, 7, 8);
  const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.y = 4;
  lampGroup.add(pole);

  // Decorative element on pole (visible in reference)
  const decorGeometry = new THREE.SphereGeometry(0.5, 8, 8);
  const decorMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
  const decor = new THREE.Mesh(decorGeometry, decorMaterial);
  decor.position.y = 6;
  lampGroup.add(decor);

  // Create branching arms for lights as seen in references
  const armCount = 5;
  for (let i = 0; i < armCount; i++) {
    const angle = (i / armCount) * Math.PI * 2;

    // Arm
    const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
    const arm = new THREE.Mesh(armGeometry, poleMaterial);
    arm.rotation.z = Math.PI / 2 - 0.2; // Slightly angled upward
    arm.rotation.y = angle;
    arm.position.set(Math.cos(angle) * 0.3, 7.5, Math.sin(angle) * 0.3);
    lampGroup.add(arm);

    // Light globe
    const globeGeometry = new THREE.SphereGeometry(0.4, 8, 8);
    const globeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffee,
      emissive: 0xffffaa,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.9,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);

    // Position at end of arm
    globe.position.set(Math.cos(angle) * 1.8, 7.5 + 0.8, Math.sin(angle) * 1.8);
    lampGroup.add(globe);

    // Add point light
    const light = new THREE.PointLight(0xffd28a, 0.5, 10);
    light.position.copy(globe.position);
    lampGroup.add(light);
  }

  lampGroup.position.set(x, 0, z);
  return lampGroup;
}

// Add lamps around the piazza based on reference images
const lampPositions = [
  [-30, 30],
  [30, 30],
  [-30, -30],
  [30, -30],
  [0, 60],
  [0, -60],
  [60, 0],
  [-60, 0],
];

lampPositions.forEach(([x, z]) => {
  scene.add(createStreetLamp(x, z));
});

// Add trees around the piazza (visible in references)
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
  const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x3a5f0b }); // Mediterranean green

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

// Add trees at strategic positions (visible in references)
createTree(35, 35);
createTree(-35, 35);
createTree(35, -35);
createTree(-35, -35);
createTree(60, 0);
createTree(-60, 0);

// First-person camera controls
const controls = new THREE.PointerLockControls(camera, document.body);

// Initial camera position
camera.position.set(0, 2, 30); // Better position to view the piazza
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
  if (instructions) {
    instructions.classList.add("hidden");
  }
});

controls.addEventListener("unlock", () => {
  if (instructions) {
    instructions.classList.remove("hidden");
  }
});

// Responsive design
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Enable shadows with optimized settings
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false; // Only update shadows when needed
renderer.shadowMap.needsUpdate = true; // Force initial shadow map update

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

  // Get GPU info if available
  const gl = renderer.getContext();
  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  const gpu = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    : "";
  const isLowEndGPU = gpu.indexOf("Intel") !== -1 || isMobile;

  if (isMobile || isLowEndGPU) {
    // Low quality settings
    renderer.setPixelRatio(1);
    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.height = 512;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    // Reduce geometry detail
    scene.traverse(function (object) {
      if (object.isMesh && object.geometry) {
        // Skip important objects
        if (object === elephantFountain) return;

        // Simplify geometry where possible
        if (object.geometry.type.includes("BufferGeometry")) {
          if (object.geometry.attributes.position.count > 1000) {
            // Reduce draw calls by making some objects not cast shadows
            object.castShadow = false;
          }
        }
      }
    });
  }
}

setAdaptiveQuality();

// Use frustum culling for better performance
const frustum = new THREE.Frustum();
const projScreenMatrix = new THREE.Matrix4();
const cameraViewProjectionMatrix = new THREE.Matrix4();

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  if (controls.isLocked) {
    const delta = clock.getDelta();

    // Optimize movement calculations
    velocity.x -= velocity.x * 5.0 * delta;
    velocity.z -= velocity.z * 5.0 * delta;

    if (moveForward || moveBackward || moveLeft || moveRight) {
      direction.z = Number(moveForward) - Number(moveBackward);
      direction.x = Number(moveRight) - Number(moveLeft);
      direction.normalize();

      velocity.z -= direction.z * 40.0 * delta;
      velocity.x -= direction.x * 40.0 * delta;

      controls.moveRight(-velocity.x * delta);
      controls.moveForward(-velocity.z * delta);

      needsUpdate = true;
    }

    // Optimized collision detection
    camera.position.y = Math.max(2, camera.position.y);
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -70, 70);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -70, 70);
  }

  if (needsUpdate) {
    // Update the frustum for culling
    cameraViewProjectionMatrix.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

    // Perform frustum culling on dynamic objects
    scene.traverse(function (object) {
      if (object.isMesh && object.userData.dynamic) {
        if (!object.geometry.boundingSphere) {
          object.geometry.computeBoundingSphere();
        }

        // Only render objects in view
        const objectWorldPosition = object.position
          .clone()
          .applyMatrix4(object.matrixWorld);
        const objectBoundingSphere = object.geometry.boundingSphere.clone();
        objectBoundingSphere.center.copy(objectWorldPosition);

        object.visible = frustum.intersectsSphere(objectBoundingSphere);
      }
    });

    renderer.render(scene, camera);
    needsUpdate = false;
  }
}

// Start the animation loop
animate();
