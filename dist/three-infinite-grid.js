var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { Float32BufferAttribute, Euler, MathUtils, Matrix4, Vector3, Quaternion, Color, Vector2, Object3D, BufferGeometry, DoubleSide, InstancedMesh } from "three";
import { MeshBasicNodeMaterial } from "three/webgpu";
import { select, vec3, positionWorld, vec2, max, clamp, dFdx, dFdy, length, smoothstep, vec4, mix, fract, uniform, abs } from "three/tsl";
var PLANE = /* @__PURE__ */ ((PLANE2) => {
  PLANE2[PLANE2["XZ"] = 0] = "XZ";
  PLANE2[PLANE2["XY"] = 1] = "XY";
  PLANE2[PLANE2["ZY"] = 2] = "ZY";
  return PLANE2;
})(PLANE || {});
const CHUNK_SIZE = 20;
const getPlaneParameters = (size) => {
  let iterations = 0;
  let currentSize = size;
  while (currentSize > CHUNK_SIZE) {
    iterations++;
    currentSize = Math.round(currentSize / 3 * 1e3) / 1e3;
  }
  return { iterations, initialSize: currentSize };
};
const getIterationSize = (initialSize, iteration) => {
  return initialSize * Math.pow(3, iteration);
};
const createXZPlane = (mesh, size) => {
  const { iterations, initialSize } = getPlaneParameters(size);
  const geometry = mesh.geometry;
  const m = new Matrix4();
  const vPos = new Vector3();
  const quaternion = new Quaternion().identity();
  const vScale = new Vector3(1, 1, 1);
  geometry.setFromPoints([
    new Vector3(0, 0, 0),
    new Vector3(initialSize, 0, 0),
    new Vector3(initialSize, 0, initialSize),
    new Vector3(0, 0, initialSize)
  ]);
  let currentOffset = 0;
  vPos.set(-initialSize / 2, 0, -initialSize / 2);
  m.compose(vPos, quaternion, vScale);
  mesh.setMatrixAt(0, m);
  let matrixIndex = 1;
  for (let i = 0; i <= iterations; i++) {
    const iterationQuadSize = getIterationSize(initialSize, i);
    currentOffset += iterationQuadSize;
    vPos.set(-currentOffset - initialSize / 2, 0, -iterationQuadSize / 2);
    vScale.setScalar(Math.pow(3, i));
    m.compose(vPos, quaternion, vScale);
    mesh.setMatrixAt(matrixIndex, m);
    matrixIndex++;
    vPos.set(
      -currentOffset - initialSize / 2,
      0,
      -currentOffset - initialSize / 2
    );
    vScale.setScalar(Math.pow(3, i));
    m.compose(vPos, quaternion, vScale);
    mesh.setMatrixAt(matrixIndex, m);
    matrixIndex++;
    vPos.set(-iterationQuadSize / 2, 0, -currentOffset - initialSize / 2);
    vScale.setScalar(Math.pow(3, i));
    m.compose(vPos, quaternion, vScale);
    mesh.setMatrixAt(matrixIndex, m);
    matrixIndex++;
    vPos.set(
      currentOffset - iterationQuadSize + initialSize / 2,
      0,
      -currentOffset - initialSize / 2
    );
    vScale.setScalar(Math.pow(3, i));
    m.compose(vPos, quaternion, vScale);
    mesh.setMatrixAt(matrixIndex, m);
    matrixIndex++;
    vPos.set(
      currentOffset - iterationQuadSize + initialSize / 2,
      0,
      -iterationQuadSize / 2
    );
    vScale.setScalar(Math.pow(3, i));
    m.compose(vPos, quaternion, vScale);
    mesh.setMatrixAt(matrixIndex, m);
    matrixIndex++;
    vPos.set(
      currentOffset - iterationQuadSize + initialSize / 2,
      0,
      currentOffset - iterationQuadSize + initialSize / 2
    );
    vScale.setScalar(Math.pow(3, i));
    m.compose(vPos, quaternion, vScale);
    mesh.setMatrixAt(matrixIndex, m);
    matrixIndex++;
    vPos.set(
      -iterationQuadSize / 2,
      0,
      currentOffset - iterationQuadSize + initialSize / 2
    );
    vScale.setScalar(Math.pow(3, i));
    m.compose(vPos, quaternion, vScale);
    mesh.setMatrixAt(matrixIndex, m);
    matrixIndex++;
    vPos.set(
      -currentOffset - initialSize / 2,
      0,
      currentOffset - iterationQuadSize + initialSize / 2
    );
    vScale.setScalar(Math.pow(3, i));
    m.compose(vPos, quaternion, vScale);
    mesh.setMatrixAt(matrixIndex, m);
    matrixIndex++;
  }
  mesh.count = matrixIndex;
};
const mesh2Plane = (mesh, plane, chunks) => {
  const geometry = mesh.geometry;
  debugger;
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  geometry.setAttribute(
    "uv",
    new Float32BufferAttribute(new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), 2)
  );
  createXZPlane(mesh, chunks.x * CHUNK_SIZE);
  switch (plane) {
    case 0: {
      mesh.setRotationFromEuler(new Euler(0, 0, 0));
      break;
    }
    case 1: {
      mesh.setRotationFromEuler(new Euler(90 * MathUtils.DEG2RAD, 0, 0));
      break;
    }
    case 2: {
      mesh.setRotationFromEuler(
        new Euler(-90 * MathUtils.DEG2RAD, 0, 90 * MathUtils.DEG2RAD)
      );
    }
  }
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
};
const DEFAULT_SETTINGS = {
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
  debugWorldAB: false
};
const floatU = (value) => uniform(value);
const colorU = (value) => uniform(value);
const WIDTH_EPSILON = 1e-6;
const clampLineWidthValue = (value) => Math.max(value, 0);
const createGridUniforms = (settings) => ({
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
  uDebugWorldAB: floatU(settings.debugWorldAB ? 1 : 0)
});
class ThreeInfiniteGrid extends Object3D {
  constructor(settings) {
    super();
    __publicField(this, "_mesh");
    __publicField(this, "_chunks");
    __publicField(this, "_uniforms");
    this._chunks = new Vector2().copy(
      (settings == null ? void 0 : settings.chunks) || DEFAULT_SETTINGS.chunks
    );
    const _settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      settings
    );
    _settings.minorLineWidth = clampLineWidthValue(_settings.minorLineWidth);
    _settings.majorLineWidth = clampLineWidthValue(_settings.majorLineWidth);
    _settings.axisLineWidth = clampLineWidthValue(_settings.axisLineWidth);
    this._uniforms = createGridUniforms(_settings);
    const geometry = new BufferGeometry();
    const material = new MeshBasicNodeMaterial({
      side: DoubleSide,
      transparent: true
    });
    material.fragmentNode = buildGridNode(this._uniforms);
    this._mesh = new InstancedMesh(geometry, material, 1e3);
    mesh2Plane(this._mesh, this.plane, this._chunks);
    this.add(this._mesh);
  }
  get mesh() {
    return this._mesh;
  }
  set plane(value) {
    this._uniforms.uPlane.value = value;
    mesh2Plane(this._mesh, value, this._chunks);
  }
  get plane() {
    return this._uniforms.uPlane.value;
  }
  set cellSize(value) {
    this._uniforms.uScale.value = value;
  }
  get cellSize() {
    return this._uniforms.uScale.value;
  }
  set minorLineWidth(value) {
    const nextLineWidth = clampLineWidthValue(value);
    this._uniforms.uLineWidth.value = nextLineWidth;
  }
  get minorLineWidth() {
    return this._uniforms.uLineWidth.value;
  }
  set minorLineColor(value) {
    this._uniforms.uLineColor.value = new Color(value);
  }
  get minorLineColor() {
    return this._uniforms.uLineColor.value;
  }
  set majorGridFactor(value) {
    this._uniforms.uMajorGridFactor.value = Math.max(2, value);
  }
  get majorGridFactor() {
    return this._uniforms.uMajorGridFactor.value;
  }
  set majorLineWidth(value) {
    this._uniforms.uMajorLineWidth.value = value;
  }
  get majorLineWidth() {
    return this._uniforms.uMajorLineWidth.value;
  }
  set majorLineColor(value) {
    this._uniforms.uMajorLineColor.value = new Color(value);
  }
  get majorLineColor() {
    return this._uniforms.uMajorLineColor.value;
  }
  set axisLineWidth(value) {
    this._uniforms.uAxisLineWidth.value = clampLineWidthValue(value);
  }
  get axisLineWidth() {
    return this._uniforms.uAxisLineWidth.value;
  }
  set xAxisColor(value) {
    this._uniforms.uXAxisColor.value = new Color(value);
  }
  get xAxisColor() {
    return this._uniforms.uXAxisColor.value;
  }
  set yAxisColor(value) {
    this._uniforms.uYAxisColor.value = new Color(value);
  }
  get yAxisColor() {
    return this._uniforms.uYAxisColor.value;
  }
  set zAxisColor(value) {
    this._uniforms.uZAxisColor.value = new Color(value);
  }
  get zAxisColor() {
    return this._uniforms.uZAxisColor.value;
  }
  set centerColor(value) {
    this._uniforms.uCenterColor.value = new Color(value);
  }
  get centerColor() {
    return this._uniforms.uCenterColor.value;
  }
  set opacity(value) {
    this._uniforms.uOpacity.value = Math.max(Math.min(value, 1), 0);
  }
  get opacity() {
    return this._uniforms.uOpacity.value;
  }
  set debugWorldAB(value) {
    this._uniforms.uDebugWorldAB.value = value ? 1 : 0;
  }
  get debugWorldAB() {
    return this._uniforms.uDebugWorldAB.value > 0.5;
  }
}
const buildGridNode = (uniforms) => {
  const smoothstepVec2 = (low, high, x) => vec2(
    smoothstep(low.x, high.x, x.x),
    smoothstep(low.y, high.y, x.y)
  );
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
    uDebugWorldAB
  } = uniforms;
  const isXY = uPlane.equal(PLANE.XY);
  const isZY = uPlane.equal(PLANE.ZY);
  const rawWorldPos = positionWorld;
  const planeWorldPos = select(
    isXY,
    vec3(rawWorldPos.x, rawWorldPos.y, 0),
    select(
      isZY,
      vec3(0, rawWorldPos.y, rawWorldPos.z),
      vec3(rawWorldPos.x, 0, rawWorldPos.z)
    )
  );
  const worldAB = select(
    isXY,
    vec2(planeWorldPos.x, planeWorldPos.y),
    select(
      isZY,
      vec2(planeWorldPos.z, planeWorldPos.y),
      vec2(planeWorldPos.x, planeWorldPos.z)
    )
  );
  const safeScale = max(uScale, 1e-6);
  const safeMajorFactor = max(uMajorGridFactor, 2);
  const safeMajorScale = max(safeScale.mul(safeMajorFactor), 1e-6);
  const pristineGrid = (gridUv, lineWidth) => {
    const clampedLineWidth = clamp(lineWidth, 0, 1);
    const uvDDXY = vec4(dFdx(gridUv), dFdy(gridUv));
    const uvDeriv = vec2(
      length(vec2(uvDDXY.x, uvDDXY.z)),
      length(vec2(uvDDXY.y, uvDDXY.w))
    );
    const invertLine = clampedLineWidth.greaterThan(0.5);
    const targetWidth = select(
      invertLine,
      clampedLineWidth.oneMinus(),
      clampedLineWidth
    );
    const targetWidth2 = vec2(targetWidth, targetWidth);
    const drawWidth = clamp(
      targetWidth2,
      uvDeriv,
      vec2(0.5)
    );
    const lineAA = max(uvDeriv, vec2(1e-6)).mul(1.5);
    let gridUV = abs(fract(gridUv).mul(2).sub(1));
    gridUV = select(invertLine, gridUV, gridUV.oneMinus());
    let grid2 = smoothstepVec2(
      drawWidth.add(lineAA),
      drawWidth.sub(lineAA),
      gridUV
    );
    grid2 = grid2.mul(
      clamp(targetWidth2.div(drawWidth), vec2(0), vec2(1))
    );
    const blendT = clamp(
      uvDeriv.mul(2).sub(1),
      vec2(0),
      vec2(1)
    );
    grid2 = vec2(
      mix(grid2.x, targetWidth, blendT.x),
      mix(grid2.y, targetWidth, blendT.y)
    );
    grid2 = select(invertLine, grid2.oneMinus(), grid2);
    return mix(grid2.x, 1, grid2.y);
  };
  const minorUv = worldAB.div(safeScale);
  const majorUv = worldAB.div(safeMajorScale);
  const minorLineWidthUv = clamp(
    uLineWidth.div(safeScale),
    WIDTH_EPSILON,
    1 - WIDTH_EPSILON
  );
  const majorLineWidthUv = clamp(
    uMajorLineWidth.div(safeMajorScale),
    WIDTH_EPSILON,
    1 - WIDTH_EPSILON
  );
  let minorGrid = pristineGrid(minorUv, minorLineWidthUv);
  const majorGrid = pristineGrid(majorUv, majorLineWidthUv);
  minorGrid = minorGrid.mul(majorGrid.oneMinus());
  const axisHalfWidth = max(uAxisLineWidth.mul(0.5), WIDTH_EPSILON);
  const axisCoordA = select(
    isXY,
    planeWorldPos.y,
    select(isZY, planeWorldPos.y, planeWorldPos.z)
  );
  const axisCoordB = select(
    isXY,
    planeWorldPos.x,
    select(isZY, planeWorldPos.z, planeWorldPos.x)
  );
  const worldPosDx = dFdx(planeWorldPos);
  const worldPosDy = dFdy(planeWorldPos);
  const axisDxA = select(
    isXY,
    worldPosDx.y,
    select(isZY, worldPosDx.y, worldPosDx.z)
  );
  const axisDyA = select(
    isXY,
    worldPosDy.y,
    select(isZY, worldPosDy.y, worldPosDy.z)
  );
  const axisDxB = select(
    isXY,
    worldPosDx.x,
    select(isZY, worldPosDx.z, worldPosDx.x)
  );
  const axisDyB = select(
    isXY,
    worldPosDy.x,
    select(isZY, worldPosDy.z, worldPosDy.x)
  );
  const axisDerivA = length(vec2(axisDxA, axisDyA));
  const axisDrawWidthA = max(axisHalfWidth, axisDerivA);
  const axisLineAAA = max(axisDerivA, WIDTH_EPSILON).mul(1.5);
  const axisEdgeMinA = max(axisHalfWidth.sub(axisLineAAA), 0);
  const axisEdgeMaxA = max(
    axisHalfWidth.add(axisLineAAA),
    axisEdgeMinA.add(WIDTH_EPSILON)
  );
  let axisMaskA = smoothstep(
    axisEdgeMinA,
    axisEdgeMaxA,
    axisCoordA.abs()
  ).oneMinus();
  axisMaskA = axisMaskA.mul(clamp(axisHalfWidth.div(axisDrawWidthA), 0, 1));
  axisMaskA = select(
    axisCoordA.abs().lessThan(axisHalfWidth.add(axisLineAAA.mul(4))),
    axisMaskA,
    0
  );
  const axisDerivB = length(vec2(axisDxB, axisDyB));
  const axisDrawWidthB = max(axisHalfWidth, axisDerivB);
  const axisLineAAB = max(axisDerivB, WIDTH_EPSILON).mul(1.5);
  const axisEdgeMinB = max(axisHalfWidth.sub(axisLineAAB), 0);
  const axisEdgeMaxB = max(
    axisHalfWidth.add(axisLineAAB),
    axisEdgeMinB.add(WIDTH_EPSILON)
  );
  let axisMaskB = smoothstep(
    axisEdgeMinB,
    axisEdgeMaxB,
    axisCoordB.abs()
  ).oneMinus();
  axisMaskB = axisMaskB.mul(clamp(axisHalfWidth.div(axisDrawWidthB), 0, 1));
  axisMaskB = select(
    axisCoordB.abs().lessThan(axisHalfWidth.add(axisLineAAB.mul(4))),
    axisMaskB,
    0
  );
  const minorGapHalfWidth = max(axisHalfWidth.mul(4.05), WIDTH_EPSILON);
  const minorGapLineAAA = max(axisDerivA, WIDTH_EPSILON).mul(1.5);
  const minorGapEdgeMinA = max(minorGapHalfWidth.sub(minorGapLineAAA), 0);
  const minorGapEdgeMaxA = max(
    minorGapHalfWidth.add(minorGapLineAAA),
    minorGapEdgeMinA.add(WIDTH_EPSILON)
  );
  const minorKeepA = smoothstep(
    minorGapEdgeMinA,
    minorGapEdgeMaxA,
    axisCoordA.abs()
  );
  const minorGapLineAAB = max(axisDerivB, WIDTH_EPSILON).mul(1.5);
  const minorGapEdgeMinB = max(minorGapHalfWidth.sub(minorGapLineAAB), 0);
  const minorGapEdgeMaxB = max(
    minorGapHalfWidth.add(minorGapLineAAB),
    minorGapEdgeMinB.add(WIDTH_EPSILON)
  );
  const minorKeepB = smoothstep(
    minorGapEdgeMinB,
    minorGapEdgeMaxB,
    axisCoordB.abs()
  );
  minorGrid = minorGrid.mul(minorKeepA).mul(minorKeepB);
  let col = vec4(uLineColor, minorGrid);
  col = mix(col, vec4(uMajorLineColor, 1), majorGrid);
  const axisColorA = select(
    isZY,
    vec4(uZAxisColor, 1),
    vec4(uXAxisColor, 1)
  );
  const axisColorB = select(
    isXY,
    vec4(uYAxisColor, 1),
    select(isZY, vec4(uYAxisColor, 1), vec4(uZAxisColor, 1))
  );
  col = mix(col, axisColorB, axisMaskB);
  col = mix(col, axisColorA, axisMaskA);
  const centerMask = clamp(axisMaskA.mul(axisMaskB), 0, 1);
  col = mix(col, vec4(uCenterColor, 1), centerMask);
  const opacityMul = vec4(1, 1, 1, uOpacity);
  const finalCol = col.mul(opacityMul);
  const debugAB = fract(worldAB);
  const debugCol = vec4(debugAB.x, debugAB.y, 0, 1).mul(
    opacityMul
  );
  return select(uDebugWorldAB.greaterThan(0.5), debugCol, finalCol);
};
export {
  CHUNK_SIZE,
  PLANE,
  ThreeInfiniteGrid
};
