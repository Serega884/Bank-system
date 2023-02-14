/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("Разработка frontend-части банковской системы для стартапа", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001");
  });
  it("Происходит авторизация", () => {
    cy.get(".input__name").type("developer");
    cy.get(".input__password").type("skillbox");
    cy.contains("Войти").click();
    cy.get(".account__text").should("contain.text", "Ваши счета");
  });
  it("Возможность просмотра списка счетов", () => {
    cy.get(".input__name").type("developer");
    cy.get(".input__password").type("skillbox");
    cy.contains("Войти").click();
    cy.get(".account__list").should("exist");
  });

  it("Возможность просмотра счета", () => {
    cy.get(".input__name").type("developer");
    cy.get(".input__password").type("skillbox");
    cy.contains("Войти").click();
    cy.get(".account__list:first-child").contains("Открыть").click();
    cy.get(".chart__title").should("contain.text", "Динамика баланса");
  });

  it("Возможность перевода со счета на счет", () => {
    cy.get(".input__name").type("developer");
    cy.get(".input__password").type("skillbox");
    cy.contains("Войти").click();
    cy.get(".account__list:first-child").contains("Открыть").click();
    cy.get(".account__input-recipient").type("83007466568586715170861036");
    cy.get(".account__sum-input").type("120");
    cy.contains("Отправить").click();
    cy.get(".account__table-line:first-child").contains("- 120.00 ₽");
  });
});
