/**
 * Simple utility to create virtual pattern (grid of vertices) within a polygon with specified spacing, burden and bearing.
 *
 * This is primarily used for drill holes functionality.
 *
 * @author Lane Welling
 */
class CanvasUtil {
  fitToContainer(canvas){
    // Make it visually fill the positioned parent
    canvas.style.width ='100%';
    canvas.style.height='100%';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
}

export default CanvasUtil
