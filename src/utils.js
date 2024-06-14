const DISTANCE = 4
const SPILL = 8
const PADDING = 0

const metadataItem = ({
    id,
    keyname,
    parentId,
    x=(Math.random() * 400),
    y=(Math.random() * 400),
    h=60,
    w=120
}) => ({
    id: String(id),
    keyname,
    parentId: String(parentId),
    children: [],
    x,
    y,
    h,
    w
})

const createAdvancedOrthogonalPath = (startPoint, endPoint, middlePoint = null) => {
    startPoint = [
        Math.max(100, 100, startPoint[0]),
        Math.max(100, 100, startPoint[1]),
    ]
    const path = [startPoint];
    const [startX, startY] = startPoint;
    const [endX, endY] = endPoint;

    // middlePoint = [
    //     Math.min(100, startPoint[0] / 2),
    //     Math.min(100, startPoint[1] / 2),
    // ]

    // Determine the direction to extend the padding
    const horizontalPadding = startX < endX ? PADDING : -PADDING;
    const verticalPadding = startY < endY ? PADDING : -PADDING;

    // Extend outward by PADDING pixels before bending
    if (Math.abs(endX - startX) > Math.abs(endY - startY)) {
      // Horizontal path
      path.push([startX + horizontalPadding, startY]);

      if (middlePoint) {
        path.push([middlePoint[0], startY + verticalPadding]);
        path.push(middlePoint);
        path.push([middlePoint[0], endY - verticalPadding]);
      } else {
        path.push([endX - horizontalPadding, startY]);
      }
    } else {
      // Vertical path
      path.push([startX, startY + verticalPadding]);

      if (middlePoint) {
        path.push([startX + horizontalPadding, middlePoint[1]]);
        path.push(middlePoint);
        path.push([endX - horizontalPadding, middlePoint[1]]);
      } else {
        path.push([startX, endY - verticalPadding]);
      }
    }

    // Finally, move to the end point
    path.push(endPoint);

    return path;
}

export {
    DISTANCE,
    SPILL,
    PADDING,
    metadataItem,
    createAdvancedOrthogonalPath
}
