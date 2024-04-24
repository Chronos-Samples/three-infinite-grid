varying vec4 vUv;
varying vec4 vPos;

uniform int uPlane;
uniform float uScale;
uniform float uMajorGridFactor;

#define XZ_PLANE 0
#define XY_PLANE 1
#define ZY_PLANE 2

void main() {
    vPos = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);

    float division = uScale * uMajorGridFactor;

    vec3 worldPos = (modelMatrix * instanceMatrix * vec4(position, 1.0)).xyz;

    // trick to reduce visual artifacts when far from the world origin
    vec3 cameraCenteringOffset = floor(cameraPosition / division) * division;
    if(uPlane == XZ_PLANE){
        vUv.yx = (worldPos - cameraCenteringOffset).xz;
        vUv.wz = worldPos.xz;
    }

    if(uPlane == XY_PLANE){
        vUv.yx = (worldPos - cameraCenteringOffset).xy;
        vUv.wz = worldPos.xy;
    }

    if(uPlane == ZY_PLANE){
        vUv.yx = (worldPos - cameraCenteringOffset).zy;
        vUv.wz = worldPos.zy;
    }

    gl_Position = vPos;
}