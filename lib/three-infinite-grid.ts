import {
  BufferGeometry,
  Color,
  ColorRepresentation,
  DoubleSide,
  InstancedMesh,
  Object3D,
  ShaderMaterial,
  Vector2,
} from "three";

import frag from "./three-infinite-grid.frag?raw";
import vert from "./three-infinite-grid.vert?raw";
import { mesh2Plane, PLANE } from "./utils";

export type ThreeInfiniteGridOptions = {
  chunks?: Vector2;
  plane?: PLANE;
};

export class ThreeInfiniteGrid extends Object3D {
  private _mesh: InstancedMesh;
  private _chunks: Vector2 = new Vector2(100, 100);
  private _plane: PLANE = PLANE.XZ;
  private _material: ShaderMaterial;

  constructor({ chunks, plane }: ThreeInfiniteGridOptions) {
    super();

    if (chunks) this._chunks.copy(chunks);
    if (plane) this._plane = plane;

    const geometry = new BufferGeometry();
    const material = new ShaderMaterial({
      side: DoubleSide,
      uniforms: {
        uMajorGridFactor: {
          value: 10,
        },
        uMinorLineWidth: {
          value: 0.01,
        },
        uMajorLineWidth: {
          value: 0.015,
        },
        uAxisLineWidth: {
          value: 0.05,
        },
        uMinorLineColor: {
          value: new Color("#000000"),
        },
        uMajorLineColor: {
          value: new Color("#000000"),
        },
        uXAxisColor: {
          value: new Color("#ff0000"),
        },
        uYAxisColor: {
          value: new Color("#0000ff"),
        },
        uZAxisColor: {
          value: new Color("#00ff00"),
        },
        uCenterColor: {
          value: new Color("#ffff00"),
        },
        uScale: {
          value: 1,
        },
        uOpacity: {
          value: 0.3,
        },
        uPlane: {
          value: this._plane,
        },
      },
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

    mesh2Plane(this._mesh, this._plane, this._chunks);

    this.add(this._mesh);
  }

  public get mesh() {
    return this._mesh;
  }

  public set plane(value: PLANE) {
    this._plane = value;
    mesh2Plane(this._mesh, value, this._chunks);
  }
  public get plane() {
    return this._plane;
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
