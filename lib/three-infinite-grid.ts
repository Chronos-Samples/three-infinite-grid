import {
  BufferGeometry,
  Color,
  ColorRepresentation,
  DoubleSide,
  InstancedMesh,
  IUniform,
  Object3D,
  ShaderMaterial,
  Vector2,
} from "three";

import frag from "./three-infinite-grid.frag?raw";
import vert from "./three-infinite-grid.vert?raw";
import { mesh2Plane, PLANE } from "./utils";

export type ThreeInfiniteGridOptions = {
  chunks: Vector2;
  plane: PLANE;

  scale: number;
  majorGridFactor: number;
  minorLineWidth: number;
  majorLineWidth: number;
  axisLineWidth: number;
  minorLineColor: ColorRepresentation;
  majorLineColor: ColorRepresentation;
  xAxisColor: ColorRepresentation;
  yAxisColor: ColorRepresentation;
  zAxisColor: ColorRepresentation;
  centerColor: ColorRepresentation;
  opacity: number;
};

export const DEFAULT_SETTINGS = {
  chunks: new Vector2(100, 100),
  plane: PLANE.XZ,
  scale: 1,
  majorGridFactor: 10,
  minorLineWidth: 0.01,
  majorLineWidth: 0.015,
  axisLineWidth: 0.05,
  minorLineColor: new Color("#000000"),
  majorLineColor: new Color("#000000"),
  xAxisColor: new Color("#ff0000"),
  yAxisColor: new Color("#00ff00"),
  zAxisColor: new Color("#0000ff"),
  centerColor: new Color("#ffff00"),
  opacity: 1,
};

export class ThreeInfiniteGrid extends Object3D {
  private readonly _mesh: InstancedMesh;
  private readonly _chunks: Vector2;
  private _material: ShaderMaterial;

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
    const _uniforms: { [key: string]: IUniform } = {};
    (Object.keys(_settings) as Array<keyof ThreeInfiniteGridOptions>).forEach(
      (propKey) => {
        const uniformKey = `u${propKey.charAt(0).toUpperCase()}${propKey.slice(1)}`;
        _uniforms[uniformKey] = { value: _settings[propKey] };
      },
    );

    const geometry = new BufferGeometry();
    const material = new ShaderMaterial({
      side: DoubleSide,
      uniforms: _uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
    });

    this._material = material;

    this._mesh = new InstancedMesh(
      geometry,
      material,
      this._chunks.x * this._chunks.y,
    );

    mesh2Plane(this._mesh, this.plane, this._chunks);

    this.add(this._mesh);
  }

  public get mesh() {
    return this._mesh;
  }

  public set plane(value: PLANE) {
    this._material.uniforms.uPlane.value = value;
    mesh2Plane(this._mesh, value, this._chunks);
  }
  public get plane() {
    return this._material.uniforms.uPlane.value;
  }

  public set cellSize(value: number) {
    this._material.uniforms.uScale.value = value;
  }
  public get cellSize() {
    return this._material.uniforms.uScale.value;
  }

  public set majorGridFactor(value: number) {
    this._material.uniforms.uMajorGridFactor.value = value;
  }
  public get majorGridFactor() {
    return this._material.uniforms.uMajorGridFactor.value;
  }

  public set minorLineWidth(value: number) {
    this._material.uniforms.uMinorLineWidth.value = value;
  }
  public get minorLineWidth() {
    return this._material.uniforms.uMinorLineWidth.value;
  }

  public set majorLineWidth(value: number) {
    this._material.uniforms.uMajorLineWidth.value = value;
  }
  public get majorLineWidth() {
    return this._material.uniforms.uMajorLineWidth.value;
  }

  public set axisLineWidth(value: number) {
    this._material.uniforms.uAxisLineWidth.value = value;
  }
  public get axisLineWidth() {
    return this._material.uniforms.uAxisLineWidth.value;
  }

  //color
  public set minorLineColor(value: ColorRepresentation) {
    this._material.uniforms.uMinorLineColor.value = value;
  }
  public get minorLineColor() {
    return this._material.uniforms.uMinorLineColor.value;
  }
  public set majorLineColor(value: ColorRepresentation) {
    this._material.uniforms.uMajorLineColor.value = value;
  }
  public get majorLineColor() {
    return this._material.uniforms.uMajorLineColor.value;
  }
  public set xAxisColor(value: ColorRepresentation) {
    this._material.uniforms.uXAxisColor.value = value;
  }
  public get xAxisColor() {
    return this._material.uniforms.uXAxisColor.value;
  }
  public set yAxisColor(value: ColorRepresentation) {
    this._material.uniforms.uYAxisColor.value = value;
  }
  public get yAxisColor() {
    return this._material.uniforms.uYAxisColor.value;
  }
  public set zAxisColor(value: ColorRepresentation) {
    this._material.uniforms.uZAxisColor.value = value;
  }
  public get zAxisColor() {
    return this._material.uniforms.uZAxisColor.value;
  }
  public set centerColor(value: ColorRepresentation) {
    this._material.uniforms.uCenterColor.value = value;
  }
  public get centerColor() {
    return this._material.uniforms.uCenterColor.value;
  }

  public set opacity(value: number) {
    this._material.uniforms.uOpacity.value = Math.max(Math.min(value, 1), 0);
  }
  public get opacity() {
    return this._material.uniforms.uOpacity.value;
  }
}

export default ThreeInfiniteGrid;
