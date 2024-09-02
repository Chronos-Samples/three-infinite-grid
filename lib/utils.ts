import {
  Euler,
  Float32BufferAttribute,
  InstancedMesh,
  Matrix4,
  Quaternion,
  ShaderMaterial,
  Vector2,
  Vector3,
} from "three";
import { DEG2RAD } from "three/src/math/MathUtils";

export enum PLANE {
  XZ,
  XY,
  ZY,
}

export const CHUNK_SIZE = 20;

const getPlaneParameters = (size: number) => {
  let iterations = 0;
  let currentSize = size;

  while (currentSize > CHUNK_SIZE) {
    iterations++;
    currentSize = Math.round((currentSize / 3) * 1000) / 1000;
  }

  return { iterations, initialSize: currentSize };
};

const getIterationSize = (initialSize: number, iteration: number) => {
  return initialSize * Math.pow(3, iteration);
};

export const createXZPlane = (mesh: InstancedMesh, size: number) => {
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
    new Vector3(0, 0, initialSize),
  ]);

  let currentOffset = 0;

  vPos.set(-initialSize / 2, 0, -initialSize / 2);
  m.compose(vPos, quaternion, vScale);
  mesh.setMatrixAt(0, m);

  let matrixIndex = 1;

  for (let i = 0; i <= iterations; i++) {
    const iterationQuadSize = getIterationSize(initialSize, i);
    currentOffset += iterationQuadSize;

    //left
    vPos.set(-currentOffset - initialSize / 2, 0, -iterationQuadSize / 2);
    vScale.setScalar(Math.pow(3, i));
    m.compose(vPos, quaternion, vScale);
    mesh.setMatrixAt(matrixIndex, m);
    matrixIndex++;

    //left - top
    vPos.set(
      -currentOffset - initialSize / 2,
      0,
      -currentOffset - initialSize / 2,
    );
    vScale.setScalar(Math.pow(3, i));
    m.compose(vPos, quaternion, vScale);
    mesh.setMatrixAt(matrixIndex, m);
    matrixIndex++;

    //top
    vPos.set(-iterationQuadSize / 2, 0, -currentOffset - initialSize / 2);
    vScale.setScalar(Math.pow(3, i));
    m.compose(vPos, quaternion, vScale);
    mesh.setMatrixAt(matrixIndex, m);
    matrixIndex++;

    //top - right
    vPos.set(
      currentOffset - iterationQuadSize + initialSize / 2,
      0,
      -currentOffset - initialSize / 2,
    );
    vScale.setScalar(Math.pow(3, i));
    m.compose(vPos, quaternion, vScale);
    mesh.setMatrixAt(matrixIndex, m);
    matrixIndex++;

    //right
    vPos.set(
      currentOffset - iterationQuadSize + initialSize / 2,
      0,
      -iterationQuadSize / 2,
    );
    vScale.setScalar(Math.pow(3, i));
    m.compose(vPos, quaternion, vScale);
    mesh.setMatrixAt(matrixIndex, m);
    matrixIndex++;

    //right - bottom
    vPos.set(
      currentOffset - iterationQuadSize + initialSize / 2,
      0,
      currentOffset - iterationQuadSize + initialSize / 2,
    );
    vScale.setScalar(Math.pow(3, i));
    m.compose(vPos, quaternion, vScale);
    mesh.setMatrixAt(matrixIndex, m);
    matrixIndex++;

    //bottom
    vPos.set(
      -iterationQuadSize / 2,
      0,
      currentOffset - iterationQuadSize + initialSize / 2,
    );
    vScale.setScalar(Math.pow(3, i));
    m.compose(vPos, quaternion, vScale);
    mesh.setMatrixAt(matrixIndex, m);
    matrixIndex++;

    //bottom - left
    vPos.set(
      -currentOffset - initialSize / 2,
      0,
      currentOffset - iterationQuadSize + initialSize / 2,
    );
    vScale.setScalar(Math.pow(3, i));
    m.compose(vPos, quaternion, vScale);
    mesh.setMatrixAt(matrixIndex, m);
    matrixIndex++;
  }
  mesh.count = matrixIndex;
};

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

  createXZPlane(mesh, chunks.x * CHUNK_SIZE);

  switch (plane) {
    case PLANE.XZ: {
      mesh.setRotationFromEuler(new Euler(0, 0, 0));
      break;
    }
    case PLANE.XY: {
      mesh.setRotationFromEuler(new Euler(90 * DEG2RAD, 0, 0));
      break;
    }
    case PLANE.ZY: {
      mesh.setRotationFromEuler(new Euler(-90 * DEG2RAD, 0, 90 * DEG2RAD));
    }
  }

  mesh.instanceMatrix.needsUpdate = true;

  (mesh.material as ShaderMaterial).uniforms.uPlane.value = plane;
  return mesh;
};
