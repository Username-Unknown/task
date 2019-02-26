export function getElementViewLeft (element) {
  let actualLeft = element.offsetLeft
  let current = element.offsetParent
  let elementScrollLeft
  while (current !== null) {
    actualLeft += current.offsetLeft
    current = current.offsetParent
  }
  elementScrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft
  return actualLeft - elementScrollLeft
}

export function getElementViewTop (element) {
  let actualTop = element.offsetTop
  let current = element.offsetParent
  let elementScrollTop
  while (current !== null) {
    actualTop += current.offsetTop
    current = current.offsetParent
  }
  elementScrollTop = document.body.scrollTop + document.documentElement.scrollTop
  return actualTop - elementScrollTop
}