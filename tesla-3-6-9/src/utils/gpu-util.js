const { GPU } = require('gpu.js');
let gpu, renderRed;

const DEG2RAD = Math.PI / 180.0;
const ANGLE_SIXTY = DEG2RAD * 60.0;
const ANGLE_NINETY = DEG2RAD * 90.0;

function rotate(cx, cy, x, y, angle) {
  const radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
    ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

  return [nx, ny];
};


/**
 * Simple utility to create virtual pattern (grid of vertices) within a polygon with specified spacing, burden and bearing.
 *
 * This is primarily used for drill holes functionality.
 *
 * @author Lane Welling
 */
class GPUtil {
  constructor(width, height) {
    this.width = Number(width)
    this.height = Number(height)
  }


  updateCanvas(opts) {
    if (!gpu) {
      gpu = new GPU({
        canvas: opts.canvas,
        mode: 'webgl'
      });

      renderRed = gpu.createKernel(function(center, radius, height) {
        const x = this.thread.x;

        // Inverse
        const y = height - this.thread.y;

        const r = radius;
        const cx = center[0];
        const cy = center[1];

        const distx = x - cx;
        const disty = y - cy;

        if (distx * distx + disty * disty > r * r || distx * distx + disty * disty < (r - this.constants.thick) * (r - this.constants.thick)) {
          this.color(192, 19, 128);
        } else {
          this.color(255, 0, 0);
        }
      })
      .setOutput([this.width, this.height])
      .setConstants({
        canvasHeight: this.height,
        thick: 1
      })
      .setFunctions([rotate])
      .setGraphical(true);
    }

    renderRed(opts.center, opts.radius, this.height);

    // gpu.destroy();
  }

  // computeCoordinates(feature) {
  //   const polygonHelper = new PolygonHelper(feature)
  //   if (!polygonHelper.getFeature()) throw new Error('Unsupported feature type!')
  //
  //   let burden = this.yspacing
  //   if (this.type === 'triangle') {
  //     burden *= Math.sqrt(3.0) * 0.5
  //   }
  //
  //   const { diagonal, ...box } = this._getMinMaxCoordinates(feature)
  //   const [maxNumStepsX, maxNumStepsY] = [
  //     Math.ceil(diagonal / this.xspacing),
  //     Math.ceil(diagonal / burden),
  //   ]
  //   const coordinates = []
  //   const minmin = box.minmin
  //   const center = box.center
  //   for (let j = -maxNumStepsY; j <= maxNumStepsY; ++j) {
  //     let i = j % 2 === 0 ? -maxNumStepsX : -maxNumStepsX - 1
  //     let coord = this._getBurdenCoordinate(minmin, [i, j])
  //     this._applyBearing(center, coord)
  //     while (i <= maxNumStepsX) {
  //       if (polygonHelper.isInside(coord)) {
  //         coordinates.push([coord[0], coord[1]])
  //       }
  //       // next
  //       coord = this._getSpacingCoordinate(coord)
  //       ++i
  //     }
  //   }
  //
  //   return coordinates
  // }
  //
  // _getSpacingCoordinate(center) {
  //   // Rotate clock-wise
  //   return [
  //     center[0] + this.xspacing * Math.cos(this.bearing),
  //     center[1] - this.xspacing * Math.sin(this.bearing),
  //   ]
  // }
  //
  // _getBurdenCoordinate(center, numSteps) {
  //   const offsetAngle = this.type === 'square' ? ANGLE_NINETY : ANGLE_SIXTY
  //   // Rotate clock-wise
  //   const coord = [
  //     center[0] + this.xspacing * Math.cos(-offsetAngle) * numSteps[0],
  //     center[1] - this.yspacing * Math.sin(-offsetAngle) * numSteps[1],
  //   ]
  //   return coord
  // }
  //
  // _applyBearing(center, coord) {
  //   if (this.bearing === 0) return coord
  //
  //   const cos = Math.cos(this.bearing)
  //   const sin = Math.sin(this.bearing)
  //   const [x, y] = coord
  //   const [cx, cy] = center
  //   coord[0] = cos * (x - cx) + sin * (y - cy) + cx
  //   coord[1] = cos * (y - cy) - sin * (x - cx) + cy
  //   return coord
  // }
  //
  // _getMinMaxCoordinates(feature) {
  //   const minmin = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
  //   const maxmax = [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
  //   feature
  //     .getGeometry()
  //     .getCoordinates()
  //     .forEach((loop) => {
  //       loop.forEach((coord) => {
  //         if (coord[0] <= minmin[0]) minmin[0] = coord[0]
  //         if (coord[1] <= minmin[1]) minmin[1] = coord[1]
  //
  //         if (coord[0] >= maxmax[0]) maxmax[0] = coord[0]
  //         if (coord[1] >= maxmax[1]) maxmax[1] = coord[1]
  //       })
  //     })
  //   const diagonal = Math.sqrt(
  //     Math.pow(maxmax[0] - minmin[0], 2) + Math.pow(maxmax[1] - minmin[1], 2)
  //   )
  //   const center = [(minmin[0] + maxmax[0]) / 2.0, (minmin[1] + maxmax[1]) / 2.0]
  //   return {
  //     minmin,
  //     maxmax,
  //     diagonal,
  //     center,
  //   }
  // }
}

export default GPUtil
