(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("three"), require("three/webgpu"), require("three/tsl")) : typeof define === "function" && define.amd ? define(["exports", "three", "three/webgpu", "three/tsl"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global["three-infinite-grid"] = {}, global.THREE, global.THREE, global.THREE));
})(this, function(exports2, three, webgpu, tsl) {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

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
    const m = new three.Matrix4();
    const vPos = new three.Vector3();
    const quaternion = new three.Quaternion().identity();
    const vScale = new three.Vector3(1, 1, 1);
    geometry.setFromPoints([
      new three.Vector3(0, 0, 0),
      new three.Vector3(initialSize, 0, 0),
      new three.Vector3(initialSize, 0, initialSize),
      new three.Vector3(0, 0, initialSize)
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
    geometry.setIndex([0, 1, 2, 0, 2, 3]);
    geometry.setAttribute(
      "uv",
      new three.Float32BufferAttribute(new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), 2)
    );
    createXZPlane(mesh, chunks.x * CHUNK_SIZE);
    switch (plane) {
      case 0: {
        mesh.setRotationFromEuler(new three.Euler(0, 0, 0));
        break;
      }
      case 1: {
        mesh.setRotationFromEuler(new three.Euler(90 * three.MathUtils.DEG2RAD, 0, 0));
        break;
      }
      case 2: {
        mesh.setRotationFromEuler(
          new three.Euler(-90 * three.MathUtils.DEG2RAD, 0, 90 * three.MathUtils.DEG2RAD)
        );
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    return mesh;
  };
  const DEFAULT_SETTINGS = {
    chunks: new three.Vector2(300, 300),
    plane: PLANE.XZ,
    scale: 1,
    minorLineWidth: 0.01,
    minorLineColor: new three.Color("#000000"),
    majorGridFactor: 5,
    majorLineWidth: 0.02,
    majorLineColor: new three.Color("#000000"),
    axisLineWidth: 0.05,
    xAxisColor: new three.Color("#ff0000"),
    yAxisColor: new three.Color("#00ff00"),
    zAxisColor: new three.Color("#0000ff"),
    centerColor: new three.Color("#ffff00"),
    opacity: 1,
    debugWorldAB: false
  };
  const floatU = (value) => tsl.uniform(value);
  const colorU = (value) => tsl.uniform(value);
  const WIDTH_EPSILON = 1e-6;
  const clampLineWidthValue = (value) => Math.max(value, 0);
  const createGridUniforms = (settings) => ({
    uPlane: floatU(settings.plane),
    uScale: floatU(settings.scale),
    uLineWidth: floatU(settings.minorLineWidth),
    uLineColor: colorU(new three.Color(settings.minorLineColor)),
    uMajorGridFactor: floatU(settings.majorGridFactor),
    uMajorLineWidth: floatU(settings.majorLineWidth),
    uMajorLineColor: colorU(new three.Color(settings.majorLineColor)),
    uAxisLineWidth: floatU(settings.axisLineWidth),
    uXAxisColor: colorU(new three.Color(settings.xAxisColor)),
    uYAxisColor: colorU(new three.Color(settings.yAxisColor)),
    uZAxisColor: colorU(new three.Color(settings.zAxisColor)),
    uCenterColor: colorU(new three.Color(settings.centerColor)),
    uOpacity: floatU(settings.opacity),
    uDebugWorldAB: floatU(settings.debugWorldAB ? 1 : 0)
  });
  class ThreeInfiniteGrid extends three.Object3D {
    constructor(settings) {
      super();
      __publicField(this, "_mesh");
      __publicField(this, "_chunks");
      __publicField(this, "_uniforms");
      this._chunks = new three.Vector2().copy(
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
      const geometry = new three.BufferGeometry();
      const material = new webgpu.MeshBasicNodeMaterial({
        side: three.DoubleSide,
        transparent: true
      });
      material.fragmentNode = buildGridNode(this._uniforms);
      this._mesh = new three.InstancedMesh(geometry, material, 1e3);
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
      this._uniforms.uLineColor.value = new three.Color(value);
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
      this._uniforms.uMajorLineColor.value = new three.Color(value);
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
      this._uniforms.uXAxisColor.value = new three.Color(value);
    }
    get xAxisColor() {
      return this._uniforms.uXAxisColor.value;
    }
    set yAxisColor(value) {
      this._uniforms.uYAxisColor.value = new three.Color(value);
    }
    get yAxisColor() {
      return this._uniforms.uYAxisColor.value;
    }
    set zAxisColor(value) {
      this._uniforms.uZAxisColor.value = new three.Color(value);
    }
    get zAxisColor() {
      return this._uniforms.uZAxisColor.value;
    }
    set centerColor(value) {
      this._uniforms.uCenterColor.value = new three.Color(value);
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
    const smoothstepVec2 = (low, high, x) => tsl.vec2(
      tsl.smoothstep(low.x, high.x, x.x),
      tsl.smoothstep(low.y, high.y, x.y)
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
    const rawWorldPos = tsl.positionWorld;
    const planeWorldPos = tsl.select(
      isXY,
      tsl.vec3(rawWorldPos.x, rawWorldPos.y, 0),
      tsl.select(
        isZY,
        tsl.vec3(0, rawWorldPos.y, rawWorldPos.z),
        tsl.vec3(rawWorldPos.x, 0, rawWorldPos.z)
      )
    );
    const worldAB = tsl.select(
      isXY,
      tsl.vec2(planeWorldPos.x, planeWorldPos.y),
      tsl.select(
        isZY,
        tsl.vec2(planeWorldPos.z, planeWorldPos.y),
        tsl.vec2(planeWorldPos.x, planeWorldPos.z)
      )
    );
    const safeScale = tsl.max(uScale, 1e-6);
    const safeMajorFactor = tsl.max(uMajorGridFactor, 2);
    const safeMajorScale = tsl.max(safeScale.mul(safeMajorFactor), 1e-6);
    const pristineGrid = (gridUv, lineWidth) => {
      const clampedLineWidth = tsl.clamp(lineWidth, 0, 1);
      const uvDDXY = tsl.vec4(tsl.dFdx(gridUv), tsl.dFdy(gridUv));
      const uvDeriv = tsl.vec2(
        tsl.length(tsl.vec2(uvDDXY.x, uvDDXY.z)),
        tsl.length(tsl.vec2(uvDDXY.y, uvDDXY.w))
      );
      const invertLine = clampedLineWidth.greaterThan(0.5);
      const targetWidth = tsl.select(
        invertLine,
        clampedLineWidth.oneMinus(),
        clampedLineWidth
      );
      const targetWidth2 = tsl.vec2(targetWidth, targetWidth);
      const drawWidth = tsl.clamp(
        targetWidth2,
        uvDeriv,
        tsl.vec2(0.5)
      );
      const lineAA = tsl.max(uvDeriv, tsl.vec2(1e-6)).mul(1.5);
      let gridUV = tsl.abs(tsl.fract(gridUv).mul(2).sub(1));
      gridUV = tsl.select(invertLine, gridUV, gridUV.oneMinus());
      let grid2 = smoothstepVec2(
        drawWidth.add(lineAA),
        drawWidth.sub(lineAA),
        gridUV
      );
      grid2 = grid2.mul(
        tsl.clamp(targetWidth2.div(drawWidth), tsl.vec2(0), tsl.vec2(1))
      );
      const blendT = tsl.clamp(
        uvDeriv.mul(2).sub(1),
        tsl.vec2(0),
        tsl.vec2(1)
      );
      grid2 = tsl.vec2(
        tsl.mix(grid2.x, targetWidth, blendT.x),
        tsl.mix(grid2.y, targetWidth, blendT.y)
      );
      grid2 = tsl.select(invertLine, grid2.oneMinus(), grid2);
      return tsl.mix(grid2.x, 1, grid2.y);
    };
    const minorUv = worldAB.div(safeScale);
    const majorUv = worldAB.div(safeMajorScale);
    const minorLineWidthUv = tsl.clamp(
      uLineWidth.div(safeScale),
      WIDTH_EPSILON,
      1 - WIDTH_EPSILON
    );
    const majorLineWidthUv = tsl.clamp(
      uMajorLineWidth.div(safeMajorScale),
      WIDTH_EPSILON,
      1 - WIDTH_EPSILON
    );
    let minorGrid = pristineGrid(minorUv, minorLineWidthUv);
    const majorGrid = pristineGrid(majorUv, majorLineWidthUv);
    minorGrid = minorGrid.mul(majorGrid.oneMinus());
    const axisHalfWidth = tsl.max(uAxisLineWidth.mul(0.5), WIDTH_EPSILON);
    const axisCoordA = tsl.select(
      isXY,
      planeWorldPos.y,
      tsl.select(isZY, planeWorldPos.y, planeWorldPos.z)
    );
    const axisCoordB = tsl.select(
      isXY,
      planeWorldPos.x,
      tsl.select(isZY, planeWorldPos.z, planeWorldPos.x)
    );
    const worldPosDx = tsl.dFdx(planeWorldPos);
    const worldPosDy = tsl.dFdy(planeWorldPos);
    const axisDxA = tsl.select(
      isXY,
      worldPosDx.y,
      tsl.select(isZY, worldPosDx.y, worldPosDx.z)
    );
    const axisDyA = tsl.select(
      isXY,
      worldPosDy.y,
      tsl.select(isZY, worldPosDy.y, worldPosDy.z)
    );
    const axisDxB = tsl.select(
      isXY,
      worldPosDx.x,
      tsl.select(isZY, worldPosDx.z, worldPosDx.x)
    );
    const axisDyB = tsl.select(
      isXY,
      worldPosDy.x,
      tsl.select(isZY, worldPosDy.z, worldPosDy.x)
    );
    const axisDerivA = tsl.length(tsl.vec2(axisDxA, axisDyA));
    const axisDrawWidthA = tsl.max(axisHalfWidth, axisDerivA);
    const axisLineAAA = tsl.max(axisDerivA, WIDTH_EPSILON).mul(1.5);
    const axisEdgeMinA = tsl.max(axisHalfWidth.sub(axisLineAAA), 0);
    const axisEdgeMaxA = tsl.max(
      axisHalfWidth.add(axisLineAAA),
      axisEdgeMinA.add(WIDTH_EPSILON)
    );
    let axisMaskA = tsl.smoothstep(
      axisEdgeMinA,
      axisEdgeMaxA,
      axisCoordA.abs()
    ).oneMinus();
    axisMaskA = axisMaskA.mul(tsl.clamp(axisHalfWidth.div(axisDrawWidthA), 0, 1));
    axisMaskA = tsl.select(
      axisCoordA.abs().lessThan(axisHalfWidth.add(axisLineAAA.mul(4))),
      axisMaskA,
      0
    );
    const axisDerivB = tsl.length(tsl.vec2(axisDxB, axisDyB));
    const axisDrawWidthB = tsl.max(axisHalfWidth, axisDerivB);
    const axisLineAAB = tsl.max(axisDerivB, WIDTH_EPSILON).mul(1.5);
    const axisEdgeMinB = tsl.max(axisHalfWidth.sub(axisLineAAB), 0);
    const axisEdgeMaxB = tsl.max(
      axisHalfWidth.add(axisLineAAB),
      axisEdgeMinB.add(WIDTH_EPSILON)
    );
    let axisMaskB = tsl.smoothstep(
      axisEdgeMinB,
      axisEdgeMaxB,
      axisCoordB.abs()
    ).oneMinus();
    axisMaskB = axisMaskB.mul(tsl.clamp(axisHalfWidth.div(axisDrawWidthB), 0, 1));
    axisMaskB = tsl.select(
      axisCoordB.abs().lessThan(axisHalfWidth.add(axisLineAAB.mul(4))),
      axisMaskB,
      0
    );
    const minorGapHalfWidth = tsl.max(axisHalfWidth.mul(4.05), WIDTH_EPSILON);
    const minorGapLineAAA = tsl.max(axisDerivA, WIDTH_EPSILON).mul(1.5);
    const minorGapEdgeMinA = tsl.max(minorGapHalfWidth.sub(minorGapLineAAA), 0);
    const minorGapEdgeMaxA = tsl.max(
      minorGapHalfWidth.add(minorGapLineAAA),
      minorGapEdgeMinA.add(WIDTH_EPSILON)
    );
    const minorKeepA = tsl.smoothstep(
      minorGapEdgeMinA,
      minorGapEdgeMaxA,
      axisCoordA.abs()
    );
    const minorGapLineAAB = tsl.max(axisDerivB, WIDTH_EPSILON).mul(1.5);
    const minorGapEdgeMinB = tsl.max(minorGapHalfWidth.sub(minorGapLineAAB), 0);
    const minorGapEdgeMaxB = tsl.max(
      minorGapHalfWidth.add(minorGapLineAAB),
      minorGapEdgeMinB.add(WIDTH_EPSILON)
    );
    const minorKeepB = tsl.smoothstep(
      minorGapEdgeMinB,
      minorGapEdgeMaxB,
      axisCoordB.abs()
    );
    minorGrid = minorGrid.mul(minorKeepA).mul(minorKeepB);
    let col = tsl.vec4(uLineColor, minorGrid);
    col = tsl.mix(col, tsl.vec4(uMajorLineColor, 1), majorGrid);
    const axisColorA = tsl.select(
      isZY,
      tsl.vec4(uZAxisColor, 1),
      tsl.vec4(uXAxisColor, 1)
    );
    const axisColorB = tsl.select(
      isXY,
      tsl.vec4(uYAxisColor, 1),
      tsl.select(isZY, tsl.vec4(uYAxisColor, 1), tsl.vec4(uZAxisColor, 1))
    );
    col = tsl.mix(col, axisColorB, axisMaskB);
    col = tsl.mix(col, axisColorA, axisMaskA);
    const centerMask = tsl.clamp(axisMaskA.mul(axisMaskB), 0, 1);
    col = tsl.mix(col, tsl.vec4(uCenterColor, 1), centerMask);
    const opacityMul = tsl.vec4(1, 1, 1, uOpacity);
    const finalCol = col.mul(opacityMul);
    const debugAB = tsl.fract(worldAB);
    const debugCol = tsl.vec4(debugAB.x, debugAB.y, 0, 1).mul(
      opacityMul
    );
    return tsl.select(uDebugWorldAB.greaterThan(0.5), debugCol, finalCol);
  };
  exports2.CHUNK_SIZE = CHUNK_SIZE;
  exports2.PLANE = PLANE;
  exports2.ThreeInfiniteGrid = ThreeInfiniteGrid;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
