import { Module, Component } from '../parser/formatters';
import { WorldLayout, GardenLayout, WallThickness, TreeLayout, leaveset, LeafType } from './layout';
import { render } from 'mustache';
import { writeFileSync } from 'fs';

const Header =
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <script src="./node_modules/aframe/dist/aframe-master.js"></script>
  <script src="./node_modules/aframe-extras/dist/aframe-extras.min.js"></script>
</head>
<body>
  <a-scene physics="" canvas="" keyboard-shortcuts="" vr-mode-ui="">

  <a-entity geometry="primitive: plane; height: 18; width: 9.24" position="125 4.96 2.15" rotation="-90 270 0" material="shader: flat; 
  src: url(images/workflow.png)"></a-entity>
`;
const Footer = 
`
  <a-entity static-body="" geometry="primitive: plane; height: 400; width: 400" position="0 -0.2 0" rotation="-90 0 0" material="shader: flat; src: url(images/grass.jpg); repeat: 200 200"></a-entity>
  <a-entity id="restart" static-body="" geometry="primitive: plane; height: 400; width: 400" position="0 -5 0" rotation="-90 0 0" material="shader: flat; color: green"></a-entity>
  <!-- Camera -->
  <a-entity id="camera" camera="active:true" universal-controls="" kinematic-body="" jump-ability="enableDoubleJump: true; distance: 3;" position="11 1.4515555555555555 6" velocity="0 0 0" gamepad-controls="" keyboard-controls="" touch-controls="" hmd-controls="" mouse-controls="" rotation="4.35447924299426 92.93375437021959 0">
  <a-entity id="cursor" cursor="fuse: true; maxDistance: 5; timeout: 1" geometry="primitive: sphere; radius: 1;" material="color: red; opacity: 1;" position="0 -10 0" raycaster=""></a-entity>
  <a-animation attribute="position" begin="roof" dur="0" to="134 8 2.1"></a-animation>
  <a-animation attribute="position" begin="start" dur="0" to="125 1.8 2.1"></a-animation>
  </a-entity>
  <!-- Lighting and background -->
  <a-sky src="images/sky.jpg" radius="5000" material="color:#FFF;shader:flat;src:url(images/sky.jpg)" geometry="primitive:sphere;radius:5000;segmentsWidth:64;segmentsHeight:64" scale="-1 1 1"></a-sky>
  <a-entity light="color:#fff;type:ambient" data-aframe-default-light=""></a-entity><a-entity light="color:#fff;intensity:0.2" position="-1 2 1" data-aframe-default-light=""></a-entity><canvas class="a-canvas" width="1152" height="1598" style="height: 799px; width: 576px;"></canvas><div class="a-enter-vr" data-a-enter-vr-no-headset="" data-a-enter-vr-no-webvr=""><button class="a-enter-vr-button"></button><div class="a-enter-vr-modal"><p>Your browser does not support WebVR. To enter VR, use a VR-compatible browser or a mobile phone.</p><a href="http://mozvr.com/#start" target="_blank">Learn more.</a></div></div><div class="a-orientation-modal a-hidden"><button>Exit VR</button></div></a-scene>
</body>
</html>
`;

const TreeTemplate = `
<a-entity static-body="" geometry="primitive: box; depth: 0.1; height: {{height}}; width: 0.2" position="{{x}} {{y}} {{z}}" rotation="0 30 0" material="shader: standard; metalness: 0.6; src: url(images/dirt.jpg); repeat: 1 4">
  <a-entity static-body="" geometry="primitive: box; depth: 0.1; height: {{height}}; width: 0.2" position="-0.1 0 0" rotation="2 60 0" material="shader: standard; metalness: 0.6; src: url(images/dirt.jpg); repeat: 1 4"></a-entity>
  <a-entity static-body="" geometry="primitive: box; depth: 0.1; height: {{height}}; width: 0.2" position="0 0 0.1" rotation="2 -90 0" material="shader: standard; metalness: 0.6; src: url(images/dirt.jpg); repeat: 1 4"></a-entity>
</a-entity>
`;

const LeafTemplate = `
<a-entity
  geometry="primitive: box; depth: {{depth}}; height: {{height}}; width: {{width}}"
  position="{{x}} {{y}} {{z}}"
  rotation="{{rotateX}} {{rotateY}} {{rotateZ}}"
  material="shader: standard; metalness: 0.6; src: url(images/leaves.jpg); repeat: 1 4">
</a-entity>
`;

const BoxTemplate = `
<a-entity
  static-body=""
  geometry="primitive: box; depth: {{depth}}; height: {{height}}; width: {{width}}"
  position="{{x}} {{y}} {{z}}"
  rotation="{{rotateX}} {{rotateY}} {{rotateZ}}"
  material="shader: flat;
  src: url(images/logs.jpg);
  repeat: {{width}} {{height}}">
</a-entity>
`;

const ModuleLabel = `
<a-entity position="{{x}} {{y}} {{z}}" text="width: {{width}}; color: {{color}}; align: {{align}}; value: {{label}};"></a-entity>
`;

interface LeafProperties {
  color: string;
  x: number;
  y: number;
  z: number;
  label: string;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  width: number;
  height: number;
  depth: number;
}

interface TreeProperties {
  x: number;
  y: number;
  z: number;
  height: number;
}

interface LabelProperties {
  label: string;
  align: string;
  x: number;
  y: number;
  z: number;
  color: string;
  width: number;
}

interface BoxProperties {
  depth: number;
  height: number;
  width: number;
  x: number;
  y: number;
  z: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
}

const DoorSize = { width: 3, height: 6 };
const TreeHeight = 4;
const TreeBase = 1;

const getFrontWalls = (garden: GardenLayout) => {
  const frontWidth = garden.size.width;
  const frontBottomPartWidth = frontWidth / 2 - DoorSize.width / 2;
  const frontBottomPartHeight = DoorSize.height;

  const frontBottomLeft: BoxProperties = {
    depth: WallThickness,
    height: frontBottomPartHeight,
    width: frontBottomPartWidth,
    x: garden.position.x - (frontWidth / 4 + DoorSize.width / 4),
    y: garden.position.y,
    z: garden.position.z,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0
  };
  const frontBottomRight: BoxProperties = {
    depth: WallThickness,
    height: frontBottomPartHeight,
    width: frontBottomPartWidth,
    x: garden.position.x + frontBottomPartWidth + DoorSize.width - (frontWidth / 4 + DoorSize.width / 4),
    y: garden.position.y,
    z: garden.position.z,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0
  };
  const frontTop: BoxProperties = {
    depth: WallThickness,
    height: garden.size.height - frontBottomPartHeight - garden.position.y,
    width: garden.size.width,
    x: garden.position.x,
    y: frontBottomPartHeight,
    z: garden.position.z,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0
  };
  const moduleLabel: LabelProperties = {
    x: garden.position.x,
    y: 5,
    z: garden.position.z + 0.3,
    label: garden.name,
    align: 'center',
    color: 'white',
    width: garden.size.width
  };
  return render(ModuleLabel, moduleLabel) +
    render(BoxTemplate, frontTop) +
    render(BoxTemplate, frontBottomLeft) +
    render(BoxTemplate, frontBottomRight);
};

const getSideWalls = (garden: GardenLayout) => {
  const leftWall: BoxProperties = {
    x: garden.position.x - garden.size.width / 2 + WallThickness / 2,
    y: garden.position.y,
    z: garden.position.z - garden.size.depth / 2 + WallThickness / 2,
    width: garden.size.depth,
    height: garden.size.height,
    depth: WallThickness,
    rotateX: 0,
    rotateY: 90,
    rotateZ: 0
  };
  const rightWall: BoxProperties = {
    x: garden.position.x + garden.size.width / 2 - WallThickness / 2,
    y: garden.position.y,
    z: garden.position.z - garden.size.depth / 2 - WallThickness / 2,
    width: garden.size.depth,
    height: garden.size.height,
    depth: WallThickness,
    rotateX: 0,
    rotateY: 90,
    rotateZ: 0
  };
  const backWall: BoxProperties = {
    x: garden.position.x,
    y: garden.position.y,
    z: garden.position.z - garden.size.depth,
    width: garden.size.width,
    height: garden.size.height,
    depth: WallThickness,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0
  };
  return render(BoxTemplate, leftWall) + render(BoxTemplate, rightWall) + render(BoxTemplate, backWall);
};

const getLeaves = (leaves: leaveset[], position: {x: number, y: number, z: number}) => {
  const totalLevels = leaves.length;
  // const levelDisplacement = (TreeHeight - TreeBase) / totalLevels;
  const levelDisplacement = 0.4;

  const renderLevel = (leaves: leaveset, level: number) => {
    let currentRotation = Math.ceil(360 * Math.random());
    const result: string[] = [];
    for (let i = 0; i < leaves.length; i += 1) {
      let leaf = leaves[i];
      const leafProps: LeafProperties = {
        label: leaf.label,
        color: leaf.type === LeafType.Plain ? 'green' : 'yellow',
        x: position.x,
        y: TreeHeight - 2 - level * levelDisplacement,
        z: position.z,
        rotateX: 30 + Math.random() * 20,
        rotateY: currentRotation,
        rotateZ: 0,
        width: 0.8,
        height: 0.16,
        depth: 1.2
      };
      result.push(render(LeafTemplate, leafProps));
      if (i % 2) {
        currentRotation += 90;
      } else {
        currentRotation = 360 / i;
      }
    }
    return result.join('\n');
  };

  let result = '';
  for (let i = 0; i < leaves.length; i += 1) {
    result += renderLevel(leaves[i], i);
  }
  return result;
};

const getTrees = (trees: TreeLayout[]) => {
  return trees.map(t => [{
    x: t.position.x,
    z: t.position.z,
    y: 0,
    height: TreeHeight
  }, t]).map(([props, layout]: [TreeProperties, TreeLayout]) => {
    const leaves = getLeaves(layout.leaves, {
      x: layout.position.x,
      z: layout.position.z,
      y: 0
    });
    return render(TreeTemplate, props) + leaves;
  }).join('\n');
};

const renderGarden = (garden: GardenLayout) => {
  return getTrees(garden.trees) + getFrontWalls(garden) + getSideWalls(garden);
};

export const renderWorld = (layout: WorldLayout) => {
  console.log(JSON.stringify(layout, null, 2));
  const gardens = layout.gardens.map(g => renderGarden(g)).join('\n');
  writeFileSync('index2.html', Header + gardens + Footer);
};
