const DISTANCE = 8
const SPILL = 4

const metadataItem = (
    id,
    keyname,
    parentId,
    x=(Math.random() * 400), y=(Math.random() * 400), h=40, w=80
) => ({
    id: String(id),
    keyname,
    parentId: String(parentId),
    children: [],
    x,
    y,
    h,
    w
})


export {
    DISTANCE,
    SPILL,
    metadataItem
}
