import { el, mount, setChildren } from "redom";

export const createHeaderMain = () => {
  const container = el("div.container header__container");
  const logo = el("h1.header__logo", "Coin.");
  const header = el("header.header");
  const input = el("input#menu-toggle", { type: "checkbox" });
  const label = el(
    "label.menu-button-container",
    { for: "menu-toggle" },
    el("div.menu-button")
  );
  const buttonATM = el("li.btn btn-reset header__btn hide", "Банкоматы"),
    buttonAccount = el("li.btn btn-reset header__btn hide", "Счета"),
    buttonExchange = el("li.btn btn-reset header__btn hide", "Валюта"),
    buttonExit = el("li.btn btn-reset header__btn hide", "Выйти"),
    buttons = el("ul.header__buttons", [
      buttonATM,
      buttonAccount,
      buttonExchange,
      buttonExit,
    ]);
  setChildren(container, [logo, input, label, buttons]);
  mount(header, container);

  return {
    header,
    buttonATM,
    buttonAccount,
    buttonExchange,
    buttonExit,
  };
};
