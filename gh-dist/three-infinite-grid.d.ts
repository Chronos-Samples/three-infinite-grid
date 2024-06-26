import { PLANE } from './utils';
import { BufferGeometry, Color, ColorRepresentation, InstancedMesh, Object3D, Vector2 } from 'three';

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
export declare const DEFAULT_SETTINGS: {
    chunks: Vector2;
    plane: PLANE;
    scale: number;
    majorGridFactor: number;
    minorLineWidth: number;
    majorLineWidth: number;
    axisLineWidth: number;
    minorLineColor: Color;
    majorLineColor: Color;
    xAxisColor: Color;
    yAxisColor: Color;
    zAxisColor: Color;
    centerColor: Color;
    opacity: number;
};
export declare class ThreeInfiniteGrid extends Object3D {
    private readonly _mesh;
    private readonly _chunks;
    private _material;
    constructor(settings: Partial<ThreeInfiniteGridOptions> | undefined);
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
