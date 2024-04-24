# Three infinite grid

Three.js extension to visualize customizable antialiased grid

![screenshot.png](screenshot.png)
Based on this [article](https://bgolus.medium.com/the-best-darn-grid-shader-yet-727f9278b9d8).

## Installation

Install the dependencies

```bash
npm install @chronosai/three-infinite-grid
```

## Usage

```js
/* 
* chunks - size of grid patches matrix (each patch is 20x20 units size)
* plane - the grid direction (XZ | XY | ZY)
*/

const grid = new ThreeInfiniteGrid({
  chunks: 5,
  plane: PLANES.XZ
});
scene.add(grid);
```

## License

[MIT](https://choosealicense.com/licenses/mit/)