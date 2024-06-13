const DISTANCE = 4
const SPILL = 8

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


export {
    DISTANCE,
    SPILL,
    metadataItem
}
