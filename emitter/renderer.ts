import { render } from 'mustache';
import { cyan, green } from 'chalk';

import { Module, Component } from '../parser/formatters';
import {
  WorldLayout,
  GardenLayout,
  WallThickness,
  TreeLayout,
  TreeWidth,
  LeaveSet,
  LeafType,
  Position,
  Size
} from './layout';

const Header = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="icon" href="favicon.png">
  <title>ng-xmas</title>
  <script src="./src/aframe-master.js"></script>
  <script src="./src/aframe-extras.min.js"></script>
  <script src="./src/aframe-controller-cursor-component.min.js"></script>
  <script src="./src/aframe-particle-system-component.min.js"></script>
</head>
<body>
  <a href="https://github.com/mgechev" class="github-corner" aria-label="View source on Github"><svg width="80" height="80" viewBox="0 0 250 250" style="z-index: 100000; fill:goldenrod; color:#fff; position: fixed; top: 20px; border: 0; left: 20px; transform: scale(-1.5, 1.5);" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a>
  <a-scene physics="" canvas="" keyboard-shortcuts="" vr-mode-ui="">

`;

const Footer = `
<a-entity id="restart" static-body="" geometry="primitive: plane; height: 400; width: 400" position="0 -5 0" rotation="-90 0 0" material="shader: flat; color: green"></a-entity>
  <!-- Snow -->
  <a-entity position="0 2.25 -15" particle-system="preset: snow; particleCount: 5000"></a-entity>

  <!-- Camera -->
  <a-entity id="camera" camera="active:true" universal-controls="" kinematic-body="" jump-ability="enableDoubleJump: true; distance: 3;" position="11 1.4515555555555555 45" velocity="0 0 0" gamepad-controls="" keyboard-controls="" touch-controls="" hmd-controls="" mouse-controls="" rotation="4.35447924299426 92.93375437021959 0">
  <a-animation attribute="position" begin="roof" dur="0" to="134 8 2.1"></a-animation>
  <a-animation attribute="position" begin="start" dur="0" to="125 1.8 2.1"></a-animation>
  <!-- Lighting and background -->
  <a-sky  radius="5000" material="color:#000;shader:flat;" geometry="primitive:sphere;radius:5000;segmentsWidth:64;segmentsHeight:64" scale="-1 1 1"></a-sky>
    <a-entity light="color:#fff;type:ambient" data-aframe-default-light=""></a-entity>
    <a-entity light="color:#fff;intensity:0.2" position="-1 2 1" data-aframe-default-light=""></a-entity>
    <canvas class="a-canvas" width="1152" height="1598" style="height: 799px; width: 576px;"></canvas>
    <div class="a-enter-vr" data-a-enter-vr-no-headset="" data-a-enter-vr-no-webvr="">
      <button class="a-enter-vr-button"></button>
    <div class="a-enter-vr-modal">
      <p>Your browser does not support WebVR. To enter VR, use a VR-compatible browser or a mobile phone.</p>
      <a href="http://mozvr.com/#start" target="_blank">Learn more.</a>
      </div>
    </div>
    <div class="a-orientation-modal a-hidden"><button>Exit VR</button></div></a-scene>
<script>
(function () {
  const entities = [].slice.call(document.getElementsByTagName('a-entity')).
    filter(e => /leaf-\\d-\\d-\\d/.test(e.id));
  entities.forEach(e => e.addEventListener('click', _ => {
    if (e.getAttribute('data-shaked')) {
      return;
    } else {
      e.setAttribute('data-shaked', true);
    }
    const treeId = e.getAttribute('data-tree-id');
    const tree = document.getElementById(treeId);
    tree.emit('shake-front-' + treeId);
    setTimeout(() => {
      document.getElementById(treeId).emit('shake-back-' + treeId);
      setTimeout(() => document.getElementById(treeId).emit('shake-ready-' + treeId), 150);
    }, 150);
    e.emit('shake-' + e.id);
    fetch('http://localhost:8081', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: tree.getAttribute('data-template-url'),
        start: e.getAttribute('data-start-offset'),
        end: e.getAttribute('data-end-offset')
      })
    });
  }));
}());
</script>
</body>
</html>
`;

const TreeTemplate = `
<a-entity id="{{id}}" geometry="primitive: box; depth: 0.1; height: {{height}}; width: 0.2" position="{{x}} {{y}} {{z}}" rotation="0 30 0" material="shader: standard; metalness: 0.6; src: url(images/dirt.jpg); repeat: 1 4" data-template-url="{{{templateUrl}}}">
  <a-entity static-body="" geometry="primitive: box; depth: 0.1; height: {{height}}; width: 0.2" position="-0.1 0 0" rotation="2 60 0" material="shader: standard; metalness: 0.6; src: url(images/dirt.jpg); repeat: 1 4"></a-entity>
  <a-entity static-body="" geometry="primitive: box; depth: 0.1; height: {{height}}; width: 0.2" position="0 0 0.1" rotation="2 -90 0" material="shader: standard; metalness: 0.6; src: url(images/dirt.jpg); repeat: 1 4"></a-entity>
  <a-entity position="0 0 0.4" rotation="-35 -30 0" text="side: double; width: 5; color: black; align: center; value: {{label}};">
  </a-entity>
  {{{leaves}}}
  <a-animation attribute="rotation"¬
               dur="150"¬
               to="5 30 0"¬
               begin="shake-front-{{id}}"
               repeat="0">¬
  </a-animation>¬
  <a-animation attribute="rotation"¬
               dur="150"¬
               to="-3 30 0"¬
               begin="shake-back-{{id}}"
               repeat="0">¬
  </a-animation>¬
  <a-animation attribute="rotation"¬
               dur="150"¬
               to="0 30 0"¬
               begin="shake-ready-{{id}}"
               repeat="0">¬
  </a-animation>¬
</a-entity>
`;

const LeafTemplate = `
<a-cone position="{{x}} {{y}} {{z}}" id="{{id}}"
  data-start-offset="{{startOffset}}" data-end-offset="{{endOffset}}"
  data-tree-id="{{treeId}}" radius-bottom="{{radiusBottom}}" radius-top="0"
  geometry="height: {{height}};"
  material="shader: standard; metalness: 0.6; color: #8CB300; repeat: 1 1">
    <a-entity position="0 -{{halfHeight}} {{halfLeaf}}"
      rotation="0 0 0"
      geometry="primitive: sphere; radius: 0.1"
      material="shader: standard; metalness: 0.6; color: {{color}}; repeat: 1 1">
      text="side: double; width: 30; color: white; align: center; value: {{label}};">
    </a-entity>
    <a-entity position="-{{halfLeaf}} -{{halfHeight}} 0"
      rotation="0 -90 0"
      geometry="primitive: sphere; radius: 0.1"
      material="shader: standard; metalness: 0.6; color: {{color}}; repeat: 1 1">
      text="side: double; width: 30; color: white; align: center; value: {{label}};">
    </a-entity>
    <a-entity position="{{halfLeaf}} -{{halfHeight}} 0"
      rotation="0 90 0"
      geometry="primitive: sphere; radius: 0.1"
      material="shader: standard; metalness: 0.6; color: {{color}}; repeat: 1 1">
      text="side: double; width: 30; color: white; align: center; value: {{label}};">
    </a-entity>
    <a-entity position="0 -{{halfHeight}} -{{halfLeaf}}"
      rotation="0 180 0"
      geometry="primitive: sphere; radius: 0.1"
      material="shader: standard; metalness: 0.6; color: {{color}}; repeat: 1 1">
      text="side: double; width: 30; color: white; align: center; value: {{label}};">
    </a-entity>
</a-cone>
`;

const BoxTemplate = `
<a-entity
  static-body=""
  geometry="primitive: box; depth: {{depth}}; height: {{height}}; width: {{width}}"
  position="{{x}} {{y}} {{z}}"
  rotation="{{rotateX}} {{rotateY}} {{rotateZ}}"
  material="shader: flat; transparent: true;
  src: url(images/fence.jpg);
  repeat: {{repeatWidth}} 1">
</a-entity>
`;

const ModuleLabelTemplate = `
<a-entity geometry="primitive: plane; height: 1.2; width: {{width}}" position="{{x}} {{y}} {{z}}" rotation="0 {{rotation}} 0" material="shader: flat; side: double; background: #ddd;">
  <a-entity position="0 0 0" text="width: 4; color: #222; align: {{align}}; value: {{label}};"></a-entity>
  <a-entity static-body="" geometry="primitive: plane; height: 1.5; width: 2" position="0 0 -0.02" rotation="0 0 0" material="shader: flat; side: double; src: url(images/wood.jpg); repeat: 2 2;"></a-entity>
  <a-entity static-body="" geometry="primitive: cylinder; height: 2; radius: 0.06" position="1 -1 -0.1" rotation="0 0 0" material="shader: flat; src: url(images/log.jpg); repeat: 3 1"></a-entity>
  <a-entity static-body="" geometry="primitive: cylinder; height: 2; radius: 0.06" position="-1 -1 -0.1" rotation="0 0 0" material="shader: flat; src: url(images/log.jpg); repeat: 3 1"></a-entity>
</a-entity>
`;

const FrameTemplate = `
<a-entity
  static-body=""
  geometry="primitive: box; depth: {{depth}}; height: {{height}}; width: {{width}}"
  position="{{x}} {{y}} {{z}}"
  rotation="{{rotateX}} {{rotateY}} {{rotateZ}}"
  material="shader: flat; src: url(images/mountain.jpg); repeat: 1 1">
</a-entity>
`;

const FloorTemplate = `
<a-entity static-body="" geometry="primitive: plane; height: {{depth}}; width: {{width}}" position="{{x}} {{y}} {{z}}" rotation="-90 0 0" material="shader: flat; src: url(images/grass.jpg); repeat: 200 200"></a-entity>
`;

interface FloorProperties {
  depth: number;
  width: number;
  x: number;
  y: number;
  z: number;
}

interface FrameProperties {
  x: number;
  y: number;
  z: number;
  depth: number;
  height: number;
  width: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
}

interface LeafProperties {
  color: string;
  x: number;
  y: number;
  z: number;
  label: string;
  radiusBottom: number;
  height: number;
  halfLeaf: number;
  halfHeight: number;
  id: string;
  treeId: string;
  endOffset: number;
  startOffset: number;
}

interface TreeProperties {
  x: number;
  y: number;
  z: number;
  height: number;
  label: string;
  id: string;
  leaves: string;
  templateUrl: string;
}

interface LabelProperties {
  label: string;
  align: string;
  x: number;
  y: number;
  z: number;
  color: string;
  width: number;
  rotation: number;
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
  repeatWidth: number;
}

const DoorSize = { width: 3, height: 1.5 };
const TreeBase = 1;
const LeafWidth = 0.7;
const LeafDepth = 0.7;

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
    rotateZ: 0,
    repeatWidth: frontBottomPartWidth
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
    rotateZ: 0,
    repeatWidth: frontBottomPartWidth
  };
  // const frontTop: BoxProperties = {
  //   depth: WallThickness,
  //   height: garden.size.height - frontBottomPartHeight - garden.position.y,
  //   width: garden.size.width,
  //   x: garden.position.x,
  //   y: frontBottomPartHeight,
  //   z: garden.position.z,
  //   rotateX: 0,
  //   rotateY: 0,
  //   rotateZ: 0
  // };
  const moduleLabel: LabelProperties = {
    x: garden.position.x - DoorSize.width,
    y: 1.8,
    z: garden.position.z + 1,
    label: garden.name,
    align: 'center',
    color: 'white',
    width: 2,
    rotation: Math.random() * 15 * (Math.random() > 0.5 ? -1 : 1)
  };
  return (
    render(ModuleLabelTemplate, moduleLabel) +
    // render(BoxTemplate, frontTop) +
    render(BoxTemplate, frontBottomLeft) +
    render(BoxTemplate, frontBottomRight)
  );
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
    rotateZ: 0,
    repeatWidth: garden.size.depth
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
    rotateZ: 0,
    repeatWidth: garden.size.depth
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
    rotateZ: 0,
    repeatWidth: garden.size.depth
  };
  return render(BoxTemplate, leftWall) + render(BoxTemplate, rightWall) + render(BoxTemplate, backWall);
};

const getLeaves = (layout: TreeLayout, tree: TreeProperties, partialId: string) => {
  const leaveSets = layout.leaves;
  const treeId = tree.id;
  const totalLevels = leaveSets.length;
  const renderLevel = (leaves: LeaveSet, level: number) => {
    const perRow = Math.ceil(Math.sqrt(leaves.length));
    const result: string[] = [];
    const dimensions = Math.min(Math.min(level + 1, 7) * 0.5, 3);
    const height = dimensions + dimensions * 0.1 + 1;
    const fromBottom = leaveSets.length - 1 - level + 1.7 + height * (leaveSets.length >= 5 ? 0.3 : 0);
    for (let i = 0; i < leaves.length; i += 1) {
      let leaf = leaves[i];
      let leafId = partialId + '-' + i;
      let leafProps: LeafProperties = {
        startOffset: leaf.startOffset,
        endOffset: leaf.endOffset,
        label: leaf.label,
        color: leaf.type === LeafType.Plain ? 'red' : 'goldenrod',
        x: 0,
        y: fromBottom,
        z: 0,
        radiusBottom: dimensions,
        height,
        halfHeight: height / 2 + 0.11,
        halfLeaf: dimensions - dimensions * 0.11,
        treeId: treeId,
        id: leafId
      };
      result.push(render(LeafTemplate, leafProps));
    }
    // 0.5 - 2.5
    // 0.5, 1, 1.5, 2, ...
    return result.join('\n');
  };

  let result = '';
  for (let i = leaveSets.length - 1; i >= 0; i -= 1) {
    result += renderLevel(leaveSets[i], i);
  }
  return result;
};

const getTrees = (trees: TreeLayout[], gardenId: number) => {
  return trees
    .map((t, idx) => [
      {
        x: t.position.x,
        z: t.position.z,
        y: 0,
        height: Math.min(10, t.leaves.length) * 2 + 1,
        label: t.name,
        id: 'tree-' + gardenId + '-' + idx,
        leaves: '',
        templateUrl: t.templateUrl
      },
      t,
      idx
    ])
    .map(([props, layout, treeIdx]: [TreeProperties, TreeLayout, number]) => {
      const leaves = getLeaves(layout, props, 'leaf-' + gardenId + '-' + treeIdx);
      props.leaves = leaves;
      return render(TreeTemplate, props);
    })
    .join('\n');
};

const renderGarden = (garden: GardenLayout, idx: number) => {
  return getTrees(garden.trees, idx) + getFrontWalls(garden) + getSideWalls(garden);
};

const renderFrame = (p: Position, size: Size) => {
  const front: FrameProperties = {
    x: p.x,
    y: p.y,
    z: p.z,
    width: size.width,
    depth: 1,
    height: size.height,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0
  };

  const back: FrameProperties = {
    x: p.x,
    y: p.y,
    z: p.z - size.depth,
    width: size.width,
    depth: 1,
    height: size.height,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0
  };

  const left: FrameProperties = {
    x: p.x - size.width / 2,
    y: p.y,
    z: p.z - size.depth / 2,
    width: size.depth,
    depth: 1,
    height: size.height,
    rotateX: 0,
    rotateY: 90,
    rotateZ: 0
  };

  const right: FrameProperties = {
    x: p.x + size.width / 2,
    y: p.y,
    z: p.z - size.depth / 2,
    width: size.depth,
    depth: 1,
    height: size.height,
    rotateX: 0,
    rotateY: 90,
    rotateZ: 0
  };

  return (
    render(FrameTemplate, front) +
    render(FrameTemplate, back) +
    render(FrameTemplate, left) +
    render(FrameTemplate, right)
  );
};

const renderFloor = (p: Position, s: Size) => {
  const template: FloorProperties = {
    x: p.x,
    y: -0.2,
    z: p.z,
    width: s.width + p.x,
    depth: s.depth + p.z
  };
  return render(FloorTemplate, template);
};

export const renderWorld = (layout: WorldLayout) => {
  console.log(cyan('🎁\t', 'Rendering world...'));

  const gardens = layout.gardens.map((g, idx) => renderGarden(g, idx)).join('\n');
  const frame = renderFrame(layout.position, layout.size);
  const floor = renderFloor(layout.position, layout.size);
  const world = Header + gardens + frame + floor + Footer;

  console.log(green('✅\t', 'World rendered!'));

  return world;
};
