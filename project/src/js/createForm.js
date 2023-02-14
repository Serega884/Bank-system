import { el, mount, setChildren } from "redom";

export function createForm() {
  const section = el("section.section__form");
  const container = el("div.container container__createForm");
  const formName = el("h3.texth3 form__name", "Вход в аккаунт");
  const form = el("form#from.form");
  const errorMessage = el("div.form__error");
  const labelName = el("label.form__label", "Логин", { for: "name" });
  const loginName = el("input.form__input input__name", {
    type: "name",
    placeholder: "Логин",
  });
  const labelPassword = el("label.form__label", "Пароль", { for: "password" });
  const loginPassword = el("input.form__input input__password", {
    type: "password",
    placeholder: "Пароль",
  });
  const formButton = el("button.btn-reset btn form__button", "Войти");
  const login = el("div.form__login", [errorMessage, labelName, loginName]);
  const password = el("div.form__password", [labelPassword, loginPassword]);
  setChildren(form, [formName, login, password, formButton]);
  mount(container, form);
  mount(section, container);
  return {
    errorMessage,
    container,
    section,
    formButton,
    loginName,
    loginPassword,
  };
}
