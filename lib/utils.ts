import {
  Float32BufferAttribute,
  InstancedMesh,
  Matrix4,
  ShaderMaterial,
  Vector2,
  Vector3,
} from "three";

export enum PLANE {
  XZ,
  XY,
  ZY,
}

export const CHUNK_SIZE = 20;

export const mesh2Plane = (
  mesh: InstancedMesh,
  plane: PLANE,
  chunks: Vector2,
) => {
  const geometry = mesh.geometry;

  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  geometry.setAttribute(
    "uv",
    new Float32BufferAttribute(new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), 2),
  );

  const m = new Matrix4();
  const v = new Vector3();

  switch (plane) {
    case PLANE.XZ: {
      geometry.setFromPoints([
        new Vector3(0, 0, 0),
        new Vector3(CHUNK_SIZE, 0, 0),
        new Vector3(CHUNK_SIZE, 0, CHUNK_SIZE),
        new Vector3(0, 0, CHUNK_SIZE),
      ]);

      for (let y = 0; y < chunks.y; y++) {
        for (let x = 0; x < chunks.x; x++) {
          m.setPosition(
            v.set(
              x * CHUNK_SIZE - (CHUNK_SIZE * chunks.x) / 2,
              0,
              y * CHUNK_SIZE - (CHUNK_SIZE * chunks.y) / 2,
            ),
          );
          mesh.setMatrixAt(y * chunks.x + x, m);
        }
      }

      break;
    }
    case PLANE.XY: {
      geometry.setFromPoints([
        new Vector3(0, 0, 0),
        new Vector3(CHUNK_SIZE, 0, 0),
        new Vector3(CHUNK_SIZE, CHUNK_SIZE, 0),
        new Vector3(0, CHUNK_SIZE, 0),
      ]);

      for (let y = 0; y < chunks.y; y++) {
        for (let x = 0; x < chunks.x; x++) {
          m.setPosition(
            v.set(
              x * CHUNK_SIZE - (CHUNK_SIZE * chunks.x) / 2,
              y * CHUNK_SIZE - (CHUNK_SIZE * chunks.y) / 2,
              0,
            ),
          );
          mesh.setMatrixAt(y * chunks.x + x, m);
        }
      }

      break;
    }
    case PLANE.ZY: {
      geometry.setFromPoints([
        new Vector3(0, 0, 0),
        new Vector3(0, 0, CHUNK_SIZE),
        new Vector3(0, CHUNK_SIZE, CHUNK_SIZE),
        new Vector3(0, CHUNK_SIZE, 0),
      ]);

      for (let y = 0; y < chunks.y; y++) {
        for (let x = 0; x < chunks.x; x++) {
          m.setPosition(
            v.set(
              0,
              y * CHUNK_SIZE - (CHUNK_SIZE * chunks.y) / 2,
              x * CHUNK_SIZE - (CHUNK_SIZE * chunks.x) / 2,
            ),
          );
          mesh.setMatrixAt(y * chunks.x + x, m);
        }
      }

      break;
    }
  }

  mesh.instanceMatrix.needsUpdate = true;

  (mesh.material as ShaderMaterial).uniforms.uPlane.value = plane;
  return mesh;
};
