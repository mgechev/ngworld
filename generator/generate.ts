import { Module, Component } from '../parser/formatters';

const GardenHeight = 30;
const TreeWidth = 10;
const TreeDepth = 10;
const TreeMargin = 2.5;
const WallThickness = 1;
const GroundZ = 0;
const InitialX = 0;
const InitialY = 0;

interface Size {
  width: number;
  height: number;
  depth: number;
}

interface Position {
  x: number;
  y: number;
  z: number;
}

interface LeafLayout {
  name: string;
  position: Position;
}

interface TreeLayout {
  name: string;
  position: Position;
  leafs: LeafLayout[];
}

interface GardenLayout {
  name: string;
  size: Size;
  position: Position;
  trees: TreeLayout[];
}

interface WorldLayout {
  size: Size;
  gardens: GardenLayout[];
}

const getWorldSize = (modules: GardenLayout[]) => {
  return null;
};

// We have less trees compared to previous layer
const getTreesLayout = (components: Component[], prevSize: Size, prevPosition: Position): TreeLayout[] => {
  const perRow = Math.floor(prevSize.width / (2 * TreeMargin + TreeWidth));
  const initialX = prevPosition.x + prevSize.width + 2 * WallThickness + TreeDepth;
  let currentX = initialX;
  const maxX = initialX + perRow * TreeWidth;
  let currentY = prevPosition.y + WallThickness;
  const result: TreeLayout[] = [];
  for (let i = 0; i < components.length; i += 1) {
    const c = components[i];
    result.push({
      name: c.name,
      position: {
        x: currentX,
        y: currentY,
        z: GroundZ
      },
      leafs: []
    });
    currentX += TreeWidth + TreeMargin;
    if (currentX >= maxX) {
      currentX = initialX;
      currentY += TreeMargin + TreeDepth;
    }
  }
  return result;
};

const getInitialTreesLayout = (components: Component[]): TreeLayout[] => {
  const initialX = InitialX + TreeMargin + WallThickness;
  const initialY = InitialY + TreeMargin + WallThickness;
  const perRow = Math.floor(Math.sqrt(components.length));
  const maxX = initialX + perRow * TreeWidth;
  let currentX = initialX;
  let currentY = initialY;
  const result: TreeLayout[] = [];
  for (let i = 0; i < components.length; i += 1) {
    const c = components[i];
    result.push({
      name: c.name,
      position: {
        x: currentX,
        y: currentY,
        z: GroundZ
      },
      leafs: []
    });
    currentX += TreeWidth + TreeMargin;
    if (currentX >= maxX) {
      currentX = initialX;
      currentY += TreeMargin + TreeDepth;
    }
  }
  return result;
};

const getGardenLayout = (module: Module, prevGarden: GardenLayout | undefined) => {
  if (prevGarden) {
    const trees = getTreesLayout(module.components, prevGarden.size, prevGarden.position);
    const result: GardenLayout = {
      name: module.name,
      size: {
        depth: prevGarden.size.depth,
        height: GardenHeight,
        width: 123
      },
      position: {
        x: prevGarden.position.x + prevGarden.size.width,
        y: prevGarden.position.y,
        z: prevGarden.position.z
      },
      trees
    };
    return result;
  } else {
    const trees = getInitialTreesLayout(module.components);
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < trees.length; i += 1) {
      const t = trees[i];
      if (maxX < t.position.x) {
        maxX = t.position.x;
      } 
      if (maxY < t.position.y) {
        maxY = t.position.y;
      } 
      if (minX > t.position.x) {
        minX = t.position.x;
      }
      if (minY > t.position.y) {
        minY = t.position.y;
      }
    }
    minX -= (TreeMargin + WallThickness);
    minY -= (TreeMargin + WallThickness);
    const result: GardenLayout = {
      name: module.name,
      size: {
        height: 123,
        width: maxX + WallThickness + TreeMargin,
        depth: maxY + WallThickness + TreeMargin
      },
      position: {
        x: minX,
        y: minY,
        z: GroundZ
      },
      trees
    };
    return result;
  }
};

const getGardensLayout = (modules: Module[]): GardenLayout[] => {
  const result: GardenLayout[] = [];
  modules = modules.sort((a, b) => b.components.length - a.components.length);
  for (let i = 0; i < modules.length; i += 1) {
    result.push(getGardenLayout(modules[i], result[result.length - 1]));
  }
  return result;
};

const createWorldLayout = (modules: Module[]): WorldLayout => {
  const gardens = getGardensLayout(modules);
  return {
    size: getWorldSize(gardens),
    gardens
  };
};

const renderWorld = (layout: WorldLayout) => {
  console.log(JSON.stringify(layout, null, 2));
};

export const generate = (modules: Module[]) => {
  let layout = createWorldLayout(modules);
  return renderWorld(layout);
};