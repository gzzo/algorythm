export const node = ({ val, next = null, prev = null }) => {
  return {
    val,
    next,
    prev,
  }
}
