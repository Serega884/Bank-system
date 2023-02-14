import { el, mount, setChildren } from "redom";
import { getAccount } from "./api.js";
import back from "../img/coolicon.svg";
import letter from "../img/coolicon2.svg";

export function createPageAccount() {
  const section = el("section.section__accounts");
  const container = el("div.container container__accounts");
  const youAccount = el("h3.texth3 account__text", "Ваши счета");
  const sorted = el("option", "Сортировка", { value: "sort" });
  const sortNumber = el("option", "По номеру", { value: "number" });
  const sortBalanse = el("option", "По балансу", { value: "balance" });
  const sortTrans = el("option", "По последней транзакции", {
    value: "transaction",
  });
  const list = el("select.account__sort#sorted");
  const ulAccounts = el("ul.account__lists");
  const buttonNewAccount = el(
    "button.btn btn-reset account__button",
    "Создать новый счет"
  );
  const divAccount = el("div.account__head");
  mount(section, container);
  setChildren(list, [sorted, sortNumber, sortBalanse, sortTrans]);
  setChildren(divAccount, [youAccount, list, buttonNewAccount]);
  setChildren(container, [divAccount, ulAccounts]);
  return {
    divAccount,
    list,
    sortBalanse,
    sortNumber,
    sortTrans,
    section,
    ulAccounts,
    buttonNewAccount,
  };
}

export function createAccount(account, balance, date) {
  const monthNames = [
    "Января",
    "Февраля",
    "Марта",
    "Апреля",
    "Мая",
    "Июня",
    "Июля",
    "Августа",
    "Сентября",
    "Октября",
    "Ноября",
    "Декабря",
  ];
  const card = el("li.account__list");
  const accountCard = el("h4.account__number", `${account}`);
  const balanceCard = el("p.account__balance", `${balance.toFixed(2)} ₽`);
  const dateTrans = el("p.account__lastTrans");
  const informBalance = el("div.account__balance-inform");
  const textLastTrans = el("p.account__text-trans", "Последняя транзакция:");
  setChildren(informBalance, [balanceCard, textLastTrans, dateTrans]);
  if (date) {
    let day = new Date(date);
    dateTrans.textContent = `${twoDigits(day.getDate())} ${
      monthNames[day.getMonth()]
    } ${day.getFullYear()}`;
  } else {
    dateTrans.textContent = `нет транзакций`;
  }
  const information = el("div.account__information");

  const button = el("a.btn-reset, btn, account__open", "Открыть");
  setChildren(information, [informBalance, button]);
  setChildren(card, [accountCard, information]);

  return {
    card,
    button,
    accountCard,
  };
}

function createTitleDetailed() {
  const section = el("section.section__acount-detailed");
  const container = el("div.container container__detailed");
  const url = new URLSearchParams(window.location.search);
  const balance = url.get("balance");
  const account = url.get("account");
  const divDetailedOne = el("div.div-one");
  const showAccount = el("h3.texth3 account__show", "Просмотр счета");
  const buttonBack = el(
    "a.btn-reset btn account__btn-back",
    "Вернуться назад",
    {}
  );
  const img = el("img.icon__back");
  img.src = back;
  buttonBack.append(img);
  const divDetailedTwo = el("div.div-two");
  const numberAccount = el("p.account__text-number", `№ ${account}`);
  const divBalance = el("div.div-balance");
  const textBalance = el("p.text-detailed account__text-balance", "Баланс");
  const balanceAccount = el("p.text-balance", `${balance}`);
  setChildren(divBalance, [textBalance, balanceAccount]);
  setChildren(divDetailedTwo, [numberAccount, divBalance]);
  setChildren(divDetailedOne, [showAccount, buttonBack]);
  setChildren(container, [divDetailedOne, divDetailedTwo]);
  return {
    buttonBack,
    divDetailedOne,
    divDetailedTwo,
    showAccount,
    account,
    balance,
    container,
    section,
  };
}

export function createAccountDetaled() {
  const createTitleDetail = createTitleDetailed();
  const section = createTitleDetail.section;
  const container = createTitleDetail.container;
  const buttonBack = createTitleDetail.buttonBack;
  const account = createTitleDetail.account;
  setChildren(section, container);
  const textNewTrans = el("p.text-detailed account__new-rans", "Новый перевод");
  const formNewTrans = el("form.account__form-trans");
  const numberRecipient = el("input.input-account account__input-recipient", {
    list: "number-recipient",
    type: "number",
    placeholder: "Номер получателя",
  });
  const dataList = el("datalist#number-recipient");
  const listRecipient = JSON.parse(localStorage.getItem("recipient")) || [];
  listRecipient.forEach((e) => {
    const lastRecipient = el("option.account__lastNumber-recipient", {
      value: `${e}`,
    });
    dataList.append(lastRecipient);
  });
  const labelRecipient = el(
    "label.label-form account__label-recipient",
    "Номер счета получателя",
    { for: "text" }
  );
  const labelSum = el("label.label-form account__label-sum", "Сумма перевода", {
    for: "number",
  });
  const sumRecipient = el("input.input-account account__sum-input", {
    type: "number",
    placeholder: "Введите сумму",
  });
  const errorMessage = el("div.form__error");
  const errorMessageSum = el("div.form__error");
  const number = el("div.account__number-recipient");
  const sum = el("div.account__sum-recipient");
  const button = el("button.btn-reset btn account__button-send", "Отправить");
  const imgLetter = el("img.icon__letter");
  imgLetter.src = letter;
  button.append(imgLetter);
  setChildren(number, [
    errorMessage,
    labelRecipient,
    numberRecipient,
    dataList,
  ]);
  setChildren(sum, [errorMessageSum, labelSum, sumRecipient]);
  setChildren(formNewTrans, [textNewTrans, number, sum, button]);
  const params = new URLSearchParams(window.location.search);
  params.append("detailed", `history`);
  const divChart = el("a.chart account__chart", { href: `${params}` });
  const chartTitle = el("p.text-detailed chart__title", "Динамика баланса");
  const canvasChart = el("canvas#myChart");
  setChildren(divChart, chartTitle, canvasChart);
  const divDetailedThree = el("div.div-three");
  setChildren(divDetailedThree, [formNewTrans, divChart]);
  const divDetailedFour = el("a.div-four", { href: `${params}` });
  const historyText = el(
    "p.text-detailed account__history-text",
    "История переводов"
  );
  const table = el("table.account__table");
  const tr = el("tr.account__table-head", [
    el("th.account__table-head-text", "Счет отправителя"),
    el("th.account__table-head-text", "Счет получателя"),
    el("th.account__table-head-text", "Сумма"),
    el("th.account__table-head-text", "Дата"),
  ]);
  setChildren(table, tr);
  setChildren(divDetailedFour, [historyText, table]);
  container.append(divDetailedThree, divDetailedFour);
  const tbody = updateList(account);
  table.append(tbody);
  const aChart = [divChart, divDetailedFour];

  return {
    errorMessage,
    errorMessageSum,
    buttonBack,
    section,
    numberRecipient,
    dataList,
    sumRecipient,
    button,
    canvasChart,
    table,
    tr,
    aChart,
    account,
    tbody,
  };
}

export function updateList(account) {
  const tbody = el("tbody.account__table-tbody");
  const accountApply = JSON.parse(localStorage.getItem("Login"));
  getAccount(account, accountApply[2]).then((res) => {
    const transAccount = res.payload.transactions || [];
    if (transAccount.length > 0) {
      for (
        let i = transAccount.length - 1;
        i > transAccount.length - 11 && i >= 0;
        i--
      ) {
        const trTable = createLineTable(
          transAccount[i].from,
          transAccount[i].to,
          transAccount[i].amount,
          changeViewDate(transAccount[i].date)
        );
        tbody.append(trTable);
      }
    }
  });
  return tbody;
}

export function createDiagramDetailed(mainDetailed) {
  const paramsBack = new URLSearchParams(window.location.search);
  paramsBack.delete("detailed");
  mainDetailed.innerHTML = "";
  const headDiagramm = createTitleDetailed();
  const buttonBack = headDiagramm.buttonBack;
  const container = headDiagramm.container;
  const section = headDiagramm.section;
  setChildren(section, container);
  const divChartOne = el("div.chart account__chart-detailed-one");
  const chartTitleOne = el("p.text-detailed chart__title", "Динамика баланса");
  const canvasChartOne = el("canvas#myChartOne", {
    style: { width: "100%", height: "200px" },
  });
  const divChartTwo = el("div.chart account__chart-detailed-two");
  const chartTitleTwo = el(
    "p.text-detailed chart__title",
    "Соотношение входящих и исходящих транзакций"
  );
  const canvasChartTwo = el("canvas#myChartTwo");
  const historyText = el(
    "p.text-detailed account__history-text",
    "История переводов"
  );
  const table = el("table#table-one.account__table overview-table-cases");
  const tr = el("tr.account__table-head overview-table-name", [
    el("th.account__table-head-text", "Счет отправителя"),
    el("th.account__table-head-text", "Счет получателя"),
    el("th.account__table-head-text", "Сумма"),
    el("th.account__table-head-text", "Дата"),
  ]);
  const divTable = el("a.div-four");
  const tbody = el("tbody.account__table-tbody");
  setChildren(table, [tr, tbody]);
  setChildren(divTable, [historyText, table]);
  setChildren(divChartOne, [chartTitleOne, canvasChartOne]);
  setChildren(divChartTwo, [chartTitleTwo, canvasChartTwo]);
  setChildren(container, [
    headDiagramm.divDetailedOne,
    headDiagramm.divDetailedTwo,
    divChartOne,
    divChartTwo,
    divTable,
  ]);

  return {
    section,
    buttonBack,
    canvasChartOne,
    canvasChartTwo,
    tbody,
    table,
  };
}

export function createCurrency() {
  const section = el("section.section__acount-detailed");
  const container = el("div.container container__currency");
  setChildren(section, container);
  const changeCurrency = el("div.currency__change");
  const titleCurrency = el("p.texth3 currency__title", "Валютный обмен");
  const divYouCurrency = el("div.currency__your");
  const textYouCurrency = el(
    "p.text-detailed currency__your-title",
    "Ваши валюты"
  );
  const blockYourCurrency = el("div.currency__your-block");
  const divChangeCurrency = el("div.currency__currency-change");
  const textChangeCurrency = el(
    "div.text-detailed currency__change-text",
    "Обмен валют"
  );
  const formChange = el("form#form-change.currency__change-form");
  const inputsForm = el("div.currency__inputs-change");
  const divFromTo = el("div.currency__from-to");
  const textFrom = el("p.text-currency", "Из");
  const textTo = el("p.text-currency", "в");
  const selectFrom = el("select.currency__select");
  const selectTo = el("select.currency__select");
  const divSumm = el("div.sum__currency");
  const textSum = el("p.text-currency currency__text-sum", "Сумма");
  const inputSumm = el("input.currency__sum-input", {
    type: "number",
    placeholder: "Введите сумму",
  });
  const error = el("div.form__error error__currency");
  const buttonChange = el(
    "button.btn-reset btn currency__button-change",
    "Обменять"
  );
  setChildren(divChangeCurrency, [textChangeCurrency, formChange]);
  setChildren(formChange, [inputsForm, buttonChange]);
  setChildren(divFromTo, [textFrom, selectFrom, textTo, selectTo]);
  setChildren(divSumm, [error, textSum, inputSumm]);
  setChildren(inputsForm, [divFromTo, divSumm]);
  setChildren(blockYourCurrency, textYouCurrency);
  setChildren(divYouCurrency, blockYourCurrency);
  setChildren(changeCurrency, [
    titleCurrency,
    divYouCurrency,
    divChangeCurrency,
  ]);
  const indexChange = el("div.currency__index-change");
  const div = el("div.margin__currency");
  setChildren(div, indexChange);
  const indexText = el(
    "p.text-detailed currency__index-text",
    "Изменение курсов в реальном времени"
  );
  const ul = el("ul.currency__index-lists");
  setChildren(indexChange, [indexText, ul]);
  setChildren(container, [changeCurrency, div]);

  return {
    error,
    div,
    container,
    ul,
    selectFrom,
    selectTo,
    inputSumm,
    section,
    blockYourCurrency,
    buttonChange,
  };
}

export function creatChartYandex() {
  const section = el("section.section__accounts");
  const container = el("div.container container__yandex-chart");
  const chartText = el("h3.texth3 text__yandex-chart", "Карта банкоматов");
  setChildren(section, container);
  const idMap = el("div#map", {
    style: {
      width: "1370px",
      height: "768px",
    },
  });
  setChildren(container, [chartText, idMap]);

  return {
    section,
    idMap,
  };
}

export function createscriptYandexChart() {
  const sc = el("script#map");
  setChildren(sc);
  sc.src =
    'https://api-maps.yandex.ru/2.1/?apikey=ваш API-ключ&width=371&height=240&lang=ru_RU" type="text/javascript';
  return sc;
}

export function createLineTable(from, to, summa, data) {
  const sum = el("td.account__table-line-text", `${summa.toFixed(2)}`);
  if (from === "74213041477477406320783754") {
    sum.textContent = `- ${sum.textContent} ₽`;
    sum.style.color = "#FD4E5D";
  } else {
    sum.textContent = `+ ${sum.textContent} ₽`;
    sum.style.color = "#76CA66";
  }
  const tr = el("tr.account__table-line", [
    el("td.account__table-line-text", `${from}`),
    el("td.account__table-line-text", `${to}`),
    sum,
    el("td.account__table-line-text", `${data}`),
  ]);
  return tr;
}

function twoDigits(num) {
  return ("0" + num).slice(-2);
}

export function changeViewDate(date) {
  const dateChange = new Date(date);
  return `${twoDigits(dateChange.getDate())}.${twoDigits(
    dateChange.getMonth() + 1
  )}.${dateChange.getFullYear()}`;
}
