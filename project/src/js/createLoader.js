import { el, setChildren } from "redom";

export function createLoader() {
  const wrapLoader = el("div.loader__wrapper");
  const loader = el(
    "div.loadingio-spinner-rolling-iqkahbxgse",
    el("div.ldio-k0hvkshaeud", el("div"))
  );
  setChildren(wrapLoader, loader);
  return wrapLoader;
}

export function createBall() {
  const loader = el(
    "div.loadingio-spinner-interwind-ko27x9df2uf",
    el(
      "div.ldio-4iubwabg76",
      el(
        "div",
        el("div", el("div", el("div"))),
        el("div", el("div", el("div")))
      )
    )
  );
  return loader;
}
