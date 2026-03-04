import { InstancedMesh, Vector2 } from 'three/webgpu';

export declare enum PLANE {
    XZ = 0,
    XY = 1,
    ZY = 2
}
export declare const CHUNK_SIZE = 20;
export declare const createXZPlane: (mesh: InstancedMesh, size: number) => void;
export declare const mesh2Plane: (mesh: InstancedMesh, plane: PLANE, chunks: Vector2) => InstancedMesh<import('three/webgpu').BufferGeometry<import('three/webgpu').NormalBufferAttributes, import('three/webgpu').BufferGeometryEventMap>, import('three/webgpu').Material | import('three/webgpu').Material[], import('three/webgpu').InstancedMeshEventMap>;
