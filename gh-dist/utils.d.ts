import { InstancedMesh, Vector2 } from 'three';

export declare enum PLANE {
    XZ = 0,
    XY = 1,
    ZY = 2
}
export declare const CHUNK_SIZE = 20;
export declare const mesh2Plane: (mesh: InstancedMesh, plane: PLANE, chunks: Vector2) => InstancedMesh<import('three').BufferGeometry<import('three').NormalBufferAttributes>, import('three').Material | import('three').Material[], import('three').InstancedMeshEventMap>;
