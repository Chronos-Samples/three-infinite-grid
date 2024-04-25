import { PLANE } from './utils';
import { BufferGeometry, ColorRepresentation, InstancedMesh, Object3D, Vector2 } from 'three';

export type ThreeInfiniteGridOptions = {
    chunks?: Vector2;
    plane?: PLANE;
};
export declare class ThreeInfiniteGrid extends Object3D {
    private _mesh;
    private _chunks;
    private _plane;
    private _material;
    constructor({ chunks, plane }: ThreeInfiniteGridOptions);
    get mesh(): InstancedMesh<BufferGeometry<import('three').NormalBufferAttributes>, import('three').Material | import('three').Material[], import('three').InstancedMeshEventMap>;
    set plane(value: PLANE);
    get plane(): PLANE;
    set cellSize(value: number);
    get cellSize(): number;
    set majorGridFactor(value: number);
    get majorGridFactor(): number;
    set minorLineWidth(value: number);
    get minorLineWidth(): number;
    set majorLineWidth(value: number);
    get majorLineWidth(): number;
    set axisLineWidth(value: number);
    get axisLineWidth(): number;
    set minorLineColor(value: ColorRepresentation);
    get minorLineColor(): ColorRepresentation;
    set majorLineColor(value: ColorRepresentation);
    get majorLineColor(): ColorRepresentation;
    set xAxisColor(value: ColorRepresentation);
    get xAxisColor(): ColorRepresentation;
    set yAxisColor(value: ColorRepresentation);
    get yAxisColor(): ColorRepresentation;
    set zAxisColor(value: ColorRepresentation);
    get zAxisColor(): ColorRepresentation;
    set centerColor(value: ColorRepresentation);
    get centerColor(): ColorRepresentation;
    set opacity(value: number);
    get opacity(): number;
}
export default ThreeInfiniteGrid;
