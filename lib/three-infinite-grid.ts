import {
  BufferGeometry,
  Color,
  ColorRepresentation,
  DoubleSide,
  InstancedMesh,
  Object3D,
  Vector2,
} from "three";
import { MeshBasicNodeMaterial } from "three/webgpu";
import {
  abs,
  clamp,
  dFdx,
  dFdy,
  fract,
  length,
  max,
  mix,
  select,
  smoothstep,
  uniform,
  vec2,
  vec3,
  vec4,
  positionWorld,
} from "three/tsl";
import { mesh2Plane, PLANE } from "./utils";

export type ThreeInfiniteGridOptions = {
  chunks: Vector2;
  plane: PLANE;

  scale: number;
  minorLineWidth: number;
  minorLineColor: ColorRepresentation;
  majorGridFactor: number;
  majorLineWidth: number;
  majorLineColor: ColorRepresentation;
  axisLineWidth: number;
  xAxisColor: ColorRepresentation;
  yAxisColor: ColorRepresentation;
  zAxisColor: ColorRepresentation;
  centerColor: ColorRepresentation;
  opacity: number;
  debugWorldAB: boolean;
};

export const DEFAULT_SETTINGS = {
  chunks: new Vector2(300, 300),
  plane: PLANE.XZ,
  scale: 1,
  minorLineWidth: 0.01,
  minorLineColor: new Color("#000000"),
  majorGridFactor: 5,
  majorLineWidth: 0.02,
  majorLineColor: new Color("#000000"),
  axisLineWidth: 0.05,
  xAxisColor: new Color("#ff0000"),
  yAxisColor: new Color("#00ff00"),
  zAxisColor: new Color("#0000ff"),
  centerColor: new Color("#ffff00"),
  opacity: 1,
  debugWorldAB: false,
};

const floatU = (value: number) => uniform(value);
const colorU = (value: Color) => uniform(value);
const WIDTH_EPSILON = 0.000001;

const clampLineWidthValue = (value: number) => Math.max(value, 0);

type FloatUniform = ReturnType<typeof floatU>;
type ColorUniform = ReturnType<typeof colorU>;
type Vec2Node = ReturnType<typeof vec2>;
type Vec3Node = ReturnType<typeof vec3>;
type Vec4Node = ReturnType<typeof vec4>;

type GridUniforms = {
  uPlane: FloatUniform;
  uScale: FloatUniform;
  uLineWidth: FloatUniform;
  uLineColor: ColorUniform;
  uMajorGridFactor: FloatUniform;
  uMajorLineWidth: FloatUniform;
  uMajorLineColor: ColorUniform;
  uAxisLineWidth: FloatUniform;
  uXAxisColor: ColorUniform;
  uYAxisColor: ColorUniform;
  uZAxisColor: ColorUniform;
  uCenterColor: ColorUniform;
  uOpacity: FloatUniform;
  uDebugWorldAB: FloatUniform;
};

const createGridUniforms = (
  settings: ThreeInfiniteGridOptions,
): GridUniforms => ({
  uPlane: floatU(settings.plane),
  uScale: floatU(settings.scale),
  uLineWidth: floatU(settings.minorLineWidth),
  uLineColor: colorU(new Color(settings.minorLineColor)),
  uMajorGridFactor: floatU(settings.majorGridFactor),
  uMajorLineWidth: floatU(settings.majorLineWidth),
  uMajorLineColor: colorU(new Color(settings.majorLineColor)),
  uAxisLineWidth: floatU(settings.axisLineWidth),
  uXAxisColor: colorU(new Color(settings.xAxisColor)),
  uYAxisColor: colorU(new Color(settings.yAxisColor)),
  uZAxisColor: colorU(new Color(settings.zAxisColor)),
  uCenterColor: colorU(new Color(settings.centerColor)),
  uOpacity: floatU(settings.opacity),
  uDebugWorldAB: floatU(settings.debugWorldAB ? 1 : 0),
});

export class ThreeInfiniteGrid extends Object3D {
  private readonly _mesh: InstancedMesh;
  private readonly _chunks: Vector2;
  private readonly _uniforms: GridUniforms;

  constructor(settings: Partial<ThreeInfiniteGridOptions> | undefined) {
    super();

    this._chunks = new Vector2().copy(
      settings?.chunks || DEFAULT_SETTINGS.chunks,
    );

    const _settings: ThreeInfiniteGridOptions = Object.assign(
      {},
      DEFAULT_SETTINGS,
      settings,
    );
    _settings.minorLineWidth = clampLineWidthValue(_settings.minorLineWidth);
    _settings.majorLineWidth = clampLineWidthValue(_settings.majorLineWidth);
    _settings.axisLineWidth = clampLineWidthValue(_settings.axisLineWidth);

    this._uniforms = createGridUniforms(_settings);

    const geometry = new BufferGeometry();
    const material = new MeshBasicNodeMaterial({
      side: DoubleSide,
      transparent: true,
    });
    material.fragmentNode = buildGridNode(this._uniforms);

    this._mesh = new InstancedMesh(geometry, material, 1000);

    mesh2Plane(this._mesh, this.plane, this._chunks);

    this.add(this._mesh);
  }

  public get mesh() {
    return this._mesh;
  }

  public set plane(value: PLANE) {
    this._uniforms.uPlane.value = value;
    mesh2Plane(this._mesh, value, this._chunks);
  }
  public get plane() {
    return this._uniforms.uPlane.value as PLANE;
  }

  public set cellSize(value: number) {
    this._uniforms.uScale.value = value;
  }
  public get cellSize() {
    return this._uniforms.uScale.value as number;
  }

  public set minorLineWidth(value: number) {
    const nextLineWidth = clampLineWidthValue(value);
    this._uniforms.uLineWidth.value = nextLineWidth;
  }
  public get minorLineWidth() {
    return this._uniforms.uLineWidth.value as number;
  }

  public set minorLineColor(value: ColorRepresentation) {
    this._uniforms.uLineColor.value = new Color(value);
  }
  public get minorLineColor() {
    return this._uniforms.uLineColor.value as Color;
  }

  public set majorGridFactor(value: number) {
    this._uniforms.uMajorGridFactor.value = Math.max(2, value);
  }
  public get majorGridFactor() {
    return this._uniforms.uMajorGridFactor.value as number;
  }

  public set majorLineWidth(value: number) {
    this._uniforms.uMajorLineWidth.value = value;
  }
  public get majorLineWidth() {
    return this._uniforms.uMajorLineWidth.value as number;
  }

  public set majorLineColor(value: ColorRepresentation) {
    this._uniforms.uMajorLineColor.value = new Color(value);
  }
  public get majorLineColor() {
    return this._uniforms.uMajorLineColor.value as Color;
  }

  public set axisLineWidth(value: number) {
    this._uniforms.uAxisLineWidth.value = clampLineWidthValue(value);
  }
  public get axisLineWidth() {
    return this._uniforms.uAxisLineWidth.value as number;
  }

  public set xAxisColor(value: ColorRepresentation) {
    this._uniforms.uXAxisColor.value = new Color(value);
  }
  public get xAxisColor() {
    return this._uniforms.uXAxisColor.value as Color;
  }

  public set yAxisColor(value: ColorRepresentation) {
    this._uniforms.uYAxisColor.value = new Color(value);
  }
  public get yAxisColor() {
    return this._uniforms.uYAxisColor.value as Color;
  }

  public set zAxisColor(value: ColorRepresentation) {
    this._uniforms.uZAxisColor.value = new Color(value);
  }
  public get zAxisColor() {
    return this._uniforms.uZAxisColor.value as Color;
  }

  public set centerColor(value: ColorRepresentation) {
    this._uniforms.uCenterColor.value = new Color(value);
  }
  public get centerColor() {
    return this._uniforms.uCenterColor.value as Color;
  }

  public set opacity(value: number) {
    this._uniforms.uOpacity.value = Math.max(Math.min(value, 1), 0);
  }
  public get opacity() {
    return this._uniforms.uOpacity.value as number;
  }

  public set debugWorldAB(value: boolean) {
    this._uniforms.uDebugWorldAB.value = value ? 1 : 0;
  }
  public get debugWorldAB() {
    return (this._uniforms.uDebugWorldAB.value as number) > 0.5;
  }
}

const buildGridNode = (uniforms: GridUniforms) => {
  const smoothstepVec2 = (
    low: Vec2Node,
    high: Vec2Node,
    x: Vec2Node,
  ): Vec2Node =>
    vec2(
      smoothstep(low.x, high.x, x.x),
      smoothstep(low.y, high.y, x.y),
    ) as Vec2Node;

  const {
    uPlane,
    uScale,
    uLineWidth,
    uLineColor,
    uMajorGridFactor,
    uMajorLineWidth,
    uMajorLineColor,
    uAxisLineWidth,
    uXAxisColor,
    uYAxisColor,
    uZAxisColor,
    uCenterColor,
    uOpacity,
    uDebugWorldAB,
  } = uniforms;

  const isXY = uPlane.equal(PLANE.XY);
  const isZY = uPlane.equal(PLANE.ZY);
  const rawWorldPos = positionWorld;
  const planeWorldPos = select(
    isXY,
    vec3(rawWorldPos.x, rawWorldPos.y, 0.0),
    select(
      isZY,
      vec3(0.0, rawWorldPos.y, rawWorldPos.z),
      vec3(rawWorldPos.x, 0.0, rawWorldPos.z),
    ),
  ) as Vec3Node;

  const worldAB = select(
    isXY,
    vec2(planeWorldPos.x, planeWorldPos.y),
    select(
      isZY,
      vec2(planeWorldPos.z, planeWorldPos.y),
      vec2(planeWorldPos.x, planeWorldPos.z),
    ),
  ) as Vec2Node;
  const safeScale = max(uScale, 0.000001);
  const safeMajorFactor = max(uMajorGridFactor, 2.0);
  const safeMajorScale = max(safeScale.mul(safeMajorFactor), 0.000001);

  const pristineGrid = (gridUv: Vec2Node, lineWidth: FloatUniform) => {
    const clampedLineWidth = clamp(lineWidth, 0.0, 1.0);
    const uvDDXY = vec4(dFdx(gridUv), dFdy(gridUv));
    const uvDeriv: Vec2Node = vec2(
      length(vec2(uvDDXY.x, uvDDXY.z)),
      length(vec2(uvDDXY.y, uvDDXY.w)),
    ) as Vec2Node;
    const invertLine = clampedLineWidth.greaterThan(0.5);
    const targetWidth = select(
      invertLine,
      clampedLineWidth.oneMinus(),
      clampedLineWidth,
    );
    const targetWidth2 = vec2(targetWidth, targetWidth) as Vec2Node;
    const drawWidth: Vec2Node = clamp(
      targetWidth2,
      uvDeriv,
      vec2(0.5),
    ) as Vec2Node;
    const lineAA: Vec2Node = max(uvDeriv, vec2(0.000001)).mul(1.5) as Vec2Node;
    let gridUV: Vec2Node = abs(fract(gridUv).mul(2.0).sub(1.0)) as Vec2Node;
    gridUV = select(invertLine, gridUV, gridUV.oneMinus()) as Vec2Node;

    let grid2: Vec2Node = smoothstepVec2(
      drawWidth.add(lineAA),
      drawWidth.sub(lineAA),
      gridUV,
    );
    grid2 = grid2.mul(
      clamp(targetWidth2.div(drawWidth), vec2(0), vec2(1)),
    ) as Vec2Node;
    const blendT = clamp(
      uvDeriv.mul(2.0).sub(1.0),
      vec2(0),
      vec2(1),
    ) as Vec2Node;
    grid2 = vec2(
      mix(grid2.x, targetWidth, blendT.x),
      mix(grid2.y, targetWidth, blendT.y),
    ) as Vec2Node;
    grid2 = select(invertLine, grid2.oneMinus(), grid2) as Vec2Node;

    return mix(grid2.x, 1.0, grid2.y);
  };

  const minorUv = worldAB.div(safeScale) as Vec2Node;
  const majorUv = worldAB.div(safeMajorScale) as Vec2Node;
  const minorLineWidthUv = clamp(
    uLineWidth.div(safeScale),
    WIDTH_EPSILON,
    1.0 - WIDTH_EPSILON,
  ) as FloatUniform;
  const majorLineWidthUv = clamp(
    uMajorLineWidth.div(safeMajorScale),
    WIDTH_EPSILON,
    1.0 - WIDTH_EPSILON,
  ) as FloatUniform;

  let minorGrid = pristineGrid(minorUv, minorLineWidthUv);
  const majorGrid = pristineGrid(majorUv, majorLineWidthUv);
  minorGrid = minorGrid.mul(majorGrid.oneMinus());

  const axisHalfWidth = max(uAxisLineWidth.mul(0.5), WIDTH_EPSILON);
  const axisCoordA = select(
    isXY,
    planeWorldPos.y,
    select(isZY, planeWorldPos.y, planeWorldPos.z),
  );
  const axisCoordB = select(
    isXY,
    planeWorldPos.x,
    select(isZY, planeWorldPos.z, planeWorldPos.x),
  );
  const worldPosDx = dFdx(planeWorldPos);
  const worldPosDy = dFdy(planeWorldPos);
  const axisDxA = select(
    isXY,
    worldPosDx.y,
    select(isZY, worldPosDx.y, worldPosDx.z),
  );
  const axisDyA = select(
    isXY,
    worldPosDy.y,
    select(isZY, worldPosDy.y, worldPosDy.z),
  );
  const axisDxB = select(
    isXY,
    worldPosDx.x,
    select(isZY, worldPosDx.z, worldPosDx.x),
  );
  const axisDyB = select(
    isXY,
    worldPosDy.x,
    select(isZY, worldPosDy.z, worldPosDy.x),
  );

  const axisDerivA = length(vec2(axisDxA, axisDyA));
  const axisDrawWidthA = max(axisHalfWidth, axisDerivA);
  const axisLineAAA = max(axisDerivA, WIDTH_EPSILON).mul(1.5);
  const axisEdgeMinA = max(axisHalfWidth.sub(axisLineAAA), 0.0);
  const axisEdgeMaxA = max(
    axisHalfWidth.add(axisLineAAA),
    axisEdgeMinA.add(WIDTH_EPSILON),
  );
  let axisMaskA = smoothstep(
    axisEdgeMinA,
    axisEdgeMaxA,
    axisCoordA.abs(),
  ).oneMinus();
  axisMaskA = axisMaskA.mul(clamp(axisHalfWidth.div(axisDrawWidthA), 0.0, 1.0));
  axisMaskA = select(
    axisCoordA.abs().lessThan(axisHalfWidth.add(axisLineAAA.mul(4.0))),
    axisMaskA,
    0.0,
  );

  const axisDerivB = length(vec2(axisDxB, axisDyB));
  const axisDrawWidthB = max(axisHalfWidth, axisDerivB);
  const axisLineAAB = max(axisDerivB, WIDTH_EPSILON).mul(1.5);
  const axisEdgeMinB = max(axisHalfWidth.sub(axisLineAAB), 0.0);
  const axisEdgeMaxB = max(
    axisHalfWidth.add(axisLineAAB),
    axisEdgeMinB.add(WIDTH_EPSILON),
  );
  let axisMaskB = smoothstep(
    axisEdgeMinB,
    axisEdgeMaxB,
    axisCoordB.abs(),
  ).oneMinus();
  axisMaskB = axisMaskB.mul(clamp(axisHalfWidth.div(axisDrawWidthB), 0.0, 1.0));
  axisMaskB = select(
    axisCoordB.abs().lessThan(axisHalfWidth.add(axisLineAAB.mul(4.0))),
    axisMaskB,
    0.0,
  );

  const minorGapHalfWidth = max(axisHalfWidth.mul(4.05), WIDTH_EPSILON);
  const minorGapLineAAA = max(axisDerivA, WIDTH_EPSILON).mul(1.5);
  const minorGapEdgeMinA = max(minorGapHalfWidth.sub(minorGapLineAAA), 0.0);
  const minorGapEdgeMaxA = max(
    minorGapHalfWidth.add(minorGapLineAAA),
    minorGapEdgeMinA.add(WIDTH_EPSILON),
  );
  const minorKeepA = smoothstep(
    minorGapEdgeMinA,
    minorGapEdgeMaxA,
    axisCoordA.abs(),
  );
  const minorGapLineAAB = max(axisDerivB, WIDTH_EPSILON).mul(1.5);
  const minorGapEdgeMinB = max(minorGapHalfWidth.sub(minorGapLineAAB), 0.0);
  const minorGapEdgeMaxB = max(
    minorGapHalfWidth.add(minorGapLineAAB),
    minorGapEdgeMinB.add(WIDTH_EPSILON),
  );
  const minorKeepB = smoothstep(
    minorGapEdgeMinB,
    minorGapEdgeMaxB,
    axisCoordB.abs(),
  );

  minorGrid = minorGrid.mul(minorKeepA).mul(minorKeepB);

  let col: Vec4Node = vec4(uLineColor, minorGrid) as Vec4Node;
  col = mix(col, vec4(uMajorLineColor, 1.0), majorGrid) as Vec4Node;

  const axisColorA = select(
    isZY,
    vec4(uZAxisColor, 1.0),
    vec4(uXAxisColor, 1.0),
  ) as Vec4Node;
  const axisColorB = select(
    isXY,
    vec4(uYAxisColor, 1.0),
    select(isZY, vec4(uYAxisColor, 1.0), vec4(uZAxisColor, 1.0)),
  ) as Vec4Node;

  col = mix(col, axisColorB, axisMaskB) as Vec4Node;
  col = mix(col, axisColorA, axisMaskA) as Vec4Node;
  const centerMask = clamp(axisMaskA.mul(axisMaskB), 0.0, 1.0);
  col = mix(col, vec4(uCenterColor, 1.0), centerMask) as Vec4Node;

  const opacityMul = vec4(1.0, 1.0, 1.0, uOpacity) as Vec4Node;
  const finalCol = col.mul(opacityMul) as Vec4Node;
  const debugAB = fract(worldAB) as Vec2Node;
  const debugCol = vec4(debugAB.x, debugAB.y, 0.0, 1.0).mul(
    opacityMul,
  ) as Vec4Node;

  return select(uDebugWorldAB.greaterThan(0.5), debugCol, finalCol) as Vec4Node;
};

export default ThreeInfiniteGrid;
