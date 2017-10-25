/**
 * Created by HHH on 2017/10/20.
 */
export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }

  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function getAttr (ele, name, value) {
  const PRE_FIX = 'data-'
  if (value === undefined) {
    return ele.getAttribute(PRE_FIX + name)
  }
  return ele.setAttribute(PRE_FIX + name, value)
}
