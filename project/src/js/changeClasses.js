export function removeClass(component, className) {
  component.forEach((el) => el.classList.remove(className));
}
