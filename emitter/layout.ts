import { cyan, green } from 'chalk';

import { Module, Component, Node, NodeType } from '../parser/formatters';

export const GardenHeight = 1.5;
export const TreeWidth = 3;
export const TreeDepth = 3;
export const TreeMargin = 4;
export const GardenMargin = 5;
export const WallThickness = 0.1;
export const GroundY = 0;
export const InitialX = 0;
export const InitialZ = 0;
export const WorldPadding = 50;
export const OuterWallHeight = 15;

export interface Size {
  width: number;
  height: number;
  depth: number;
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export enum LeafType {
  Plain,
  Special
}

export interface Leaf {
  label: string;
  type: LeafType;
  startOffset: number;
  endOffset: number;
}

export type LeaveSet = Leaf[];

export interface TreeLayout {
  name: string;
  position: Position;
  leaves: LeaveSet[];
  templateUrl: string;
}

export interface GardenLayout {
  name: string;
  size: Size;
  position: Position;
  trees: TreeLayout[];
}

export interface WorldLayout {
  size: Size;
  position: Position;
  gardens: GardenLayout[];
}

const getWorldLayout = (gardens: GardenLayout[]) => {
  console.log(cyan('Calculating world layout...'));

  let minX = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxZ = -Infinity;
  let x = 0;
  let y = 0;
  let z = 0;
  let width = 0;
  let height = 0;
  let depth = 0;
  for (let i = 0; i < gardens.length; i += 1) {
    const t = gardens[i];
    if (maxX < t.position.x) {
      maxX = t.position.x;
    }
    if (maxZ < t.position.z) {
      maxZ = t.position.z;
    }
    if (minX > t.position.x) {
      minX = t.position.x;
    }
    if (minZ > t.position.z) {
      minZ = t.position.z;
    }
  }
  minX -= WorldPadding;
  minZ -= WorldPadding;
  maxX += WorldPadding;
  maxZ += WorldPadding;
  x = minX + (maxX - minX) / 2;
  z = minZ + (maxZ - minZ);
  y = GroundY;
  width = maxX - minX;
  depth = maxZ - minZ + WorldPadding;
  height = OuterWallHeight;

  return { size: { width, height, depth }, position: { x, y, z } };
};

const getLeaves = (template: Node[]) => {
  const result: LeaveSet[] = [];
  template.forEach((node: Node, idx) => {
    if (idx >= 7) {
      return;
    }
    result[idx] = [
      {
        label: node.name,
        type: node.type === NodeType.Custom ? LeafType.Special : LeafType.Plain,
        startOffset: node.startOffset,
        endOffset: node.endOffset
      }
    ];
  });
  return result;
};

// We have less trees compared to previous layer
const getTreesLayout = (components: Component[], prevSize: Size, prevPosition: Position): TreeLayout[] => {
  const perRow = Math.max(Math.ceil(Math.sqrt(components.length)), 1);
  const initialX =
    prevPosition.x + prevSize.width + 2 * WallThickness + TreeMargin - (perRow - 1) * (2 / 3 * TreeMargin);
  const maxX = initialX + perRow * (TreeWidth + TreeMargin);
  let currentX = initialX;
  let currentZ = InitialZ + WallThickness + TreeMargin;
  const result: TreeLayout[] = [];
  for (let i = 0; i < components.length; i += 1) {
    const c = components[i];
    result.push({
      name: c.name,
      templateUrl: c.templateUrl,
      position: {
        x: currentX,
        y: GroundY,
        z: currentZ
      },
      leaves: getLeaves(c.template)
    });
    currentX += TreeWidth + TreeMargin;
    if (currentX >= maxX) {
      currentX = initialX;
      currentZ += TreeMargin + TreeDepth;
    }
  }
  return result;
};

const getInitialTreesLayout = (components: Component[]): TreeLayout[] => {
  const initialX = InitialX + TreeMargin + WallThickness;
  const initialZ = InitialZ + TreeMargin + WallThickness;
  const perRow = Math.ceil(Math.sqrt(components.length));
  const maxX = initialX + perRow * (TreeWidth + TreeMargin);
  let currentX = initialX;
  let currentZ = initialZ;
  const result: TreeLayout[] = [];
  for (let i = 0; i < components.length; i += 1) {
    const c = components[i];
    result.push({
      name: c.name,
      templateUrl: c.templateUrl,
      position: {
        x: currentX,
        y: GroundY,
        z: currentZ
      },
      leaves: getLeaves(c.template)
    });
    currentX += TreeWidth + TreeMargin;
    if (currentX >= maxX) {
      currentX = initialX;
      currentZ += TreeMargin + TreeDepth;
    }
  }
  return result;
};

const getGardenLayout = (module: Module, prevGarden: GardenLayout | undefined) => {
  if (prevGarden) {
    const trees = getTreesLayout(module.components, prevGarden.size, prevGarden.position);
    const perRow = Math.max(Math.ceil(Math.sqrt(module.components.length)), 1);
    let maxX = -Infinity;
    for (let i = 0; i < trees.length; i += 1) {
      const t = trees[i];
      if (maxX < t.position.x) {
        maxX = t.position.x;
      }
    }
    const result: GardenLayout = {
      name: module.name,
      size: {
        depth: prevGarden.size.depth,
        width:
          maxX -
          (prevGarden.position.x + prevGarden.size.width) +
          WallThickness +
          TreeMargin +
          (perRow - 1) * TreeMargin / 2,
        height: GardenHeight
      },
      position: {
        x: prevGarden.position.x + prevGarden.size.width + GardenMargin,
        y: prevGarden.position.y,
        z: prevGarden.position.z
      },
      trees
    };
    return result;
  } else {
    const trees = getInitialTreesLayout(module.components);
    let minX = Infinity;
    let minZ = Infinity;
    let maxX = -Infinity;
    let maxZ = -Infinity;
    for (let i = 0; i < trees.length; i += 1) {
      const t = trees[i];
      if (maxX < t.position.x) {
        maxX = t.position.x;
      }
      if (maxZ < t.position.z) {
        maxZ = t.position.z;
      }
      if (minX > t.position.x) {
        minX = t.position.x;
      }
      if (minZ > t.position.z) {
        minZ = t.position.z;
      }
    }
    minX -= TreeMargin + WallThickness;
    minZ -= TreeMargin + WallThickness;
    maxX += TreeMargin + WallThickness;
    maxZ += TreeMargin + WallThickness;
    const result: GardenLayout = {
      name: module.name,
      size: {
        height: GardenHeight,
        width: maxX - minX,
        depth: maxZ - minZ
      },
      position: {
        x: minX + (maxX - minX) / 2,
        y: GroundY,
        z: minZ + (maxZ - minZ)
      },
      trees
    };
    return result;
  }
};

const getGardensLayout = (modules: Module[]): GardenLayout[] => {
  console.log(cyan('Calculating gardens layout...'));

  const result: GardenLayout[] = [];
  modules = modules.sort((a, b) => b.components.length - a.components.length);
  for (let i = 0; i < modules.length; i += 1) {
    result.push(getGardenLayout(modules[i], result[result.length - 1]));
  }

  return result;
};

export const createWorldLayout = (modules: Module[]): WorldLayout => {
  console.log(cyan('Calculating layout...'));

  const gardens = getGardensLayout(modules);
  const layout = getWorldLayout(gardens);

  console.log(green('Layout calculated!'));

  return {
    size: layout.size,
    position: layout.position,
    gardens
  };
};
