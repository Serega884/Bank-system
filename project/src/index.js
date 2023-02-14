import "@babel/polyfill";
import { el, mount, setChildren } from "redom";
import "./index.html";
import "./index.scss";
import {
  getAccounts,
  createNewAccount,
  getCurrencyAccounts,
  getAccount,
  getPassword,
  exchangeCurrency,
  changeCurrency,
} from "./js/api";
import { createHeaderMain } from "./js/createHeader";
import { createForm } from "./js/createForm";
import { removeClass } from "./js/changeClasses";
import {
  createPageAccount,
  createAccount,
  createAccountDetaled,
  updateList,
  createDiagramDetailed,
  createLineTable,
  changeViewDate,
  createCurrency,
  createscriptYandexChart,
  creatChartYandex,
} from "./js/createAccounts";
import { createArr, createFirstArr, createArrBal } from "./js/diagram";
import { monthBalance } from "./js/diagram";
import Chart from "chart.js/auto";
import { Paginator } from "./js/paginationTable.js";
import Choices from "choices.js";
import { createBall, createLoader } from "./js/createLoader";

const scriptY = createscriptYandexChart();
document.body.append(scriptY);
const createApp = () => {
  document.body.innerHTML = "";
  const main = el("main.main");
  let formBul = false;
  const header = createHeaderMain();

  const buttons = [
    header.buttonATM,
    header.buttonAccount,
    header.buttonExchange,
    header.buttonExit,
  ];
  window.addEventListener("popstate", (event) => {
    const stateU = JSON.stringify(event.state);
    const ur = new URLSearchParams(window.location.search);
    console.log(stateU);
    if (stateU == 1) {
      createApp();
    } else if (stateU == 2) {
      const urlButton = new URLSearchParams(window.location.search);
      const account = urlButton.get("account");
      const accountApply = JSON.parse(localStorage.getItem("Login"));

      createDiagram(buttons, account, accountApply[2], createDiagramList, true);
    } else if (stateU == 3) {
      const urlButton = new URLSearchParams(window.location.search);
      const account = urlButton.get("account");
      const accountApply = JSON.parse(localStorage.getItem("Login"));
      createDiagram(
        buttons,
        account,
        accountApply[2],
        createDiagramList,
        false
      );
    } else if (stateU == 4) {
      history.pushState(1, "", `?${ur}`);
      currencyView();
    } else if (stateU == 5) {
      creatMap();
      creatMapConfig();
    } else {
      createApp();
    }
  });
  mount(document.body, header.header);
  mount(document.body, main);
  if (!localStorage.getItem("Login")) {
    const form = createForm();
    mount(main, form.section);
    // eslint-disable-next-line no-useless-escape
    let re =
      // eslint-disable-next-line no-useless-escape
      /^[A-Za-z0-9\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]{6,}$/gi;

    form.loginName.addEventListener(
      "input",
      () => (form.errorMessage.textContent = "")
    );

    form.formButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (formBul) {
        return;
      } else {
        if (!re.test(form.loginName.value)) {
          form.errorMessage.textContent = "Неверно указан пароль или логин";
        } else {
          getPassword(form.loginName.value, form.loginPassword.value).then(
            (result) => {
              if (result.error === "") {
                formBul = true;
                const infoLogin = [
                  form.loginName.value,
                  form.loginPassword.value,
                  result.payload.token,
                ];
                localStorage.setItem("Login", JSON.stringify(infoLogin));
                form.section.remove();
                accounts(result);
              } else if (result.error == "Invalid password") {
                form.errorMessage.textContent = "Неверно указан пароль";
              } else {
                form.errorMessage.textContent =
                  "Такого пользователя не существует";
              }
            }
          );
        }
      }
    });
  } else {
    const accountApply = JSON.parse(localStorage.getItem("Login"));
    accounts(accountApply[2]);
  }

  buttons[1].addEventListener("click", (ent) => {
    ent.preventDefault();
    if (buttons[1].classList.contains("btn__active") == false) {
      buttons.forEach((button) => button.classList.remove("btn__active"));
      ent.target.classList.add("btn__active");
      const accountApply = JSON.parse(localStorage.getItem("Login"));
      accounts(accountApply[2]);
    } else {
      return;
    }
  });
  buttons[2].addEventListener("click", (e) => {
    e.preventDefault();
    createSpinner(main);
    if (buttons[2].classList.contains("btn__active") == false) {
      currencyView();
    } else {
      return;
    }
  });

  buttons[3].addEventListener("click", (e) => {
    e.preventDefault();
    if (buttons[2].classList.contains("btn__active") == false) {
      buttons.forEach((button) => button.classList.remove("btn__active"));
      e.target.classList.add("btn__active");
      localStorage.removeItem("Login");
      createApp();
    } else {
      return;
    }
  });

  function currencyView(ent) {
    if (ent) {
      ent.preventDefault();
    }
    const accountApply = JSON.parse(localStorage.getItem("Login"));
    const url = new URLSearchParams(window.location.search);
    url.set("currency", accountApply[2]);
    history.pushState(4, "", `?${url}`);
    buttons.forEach((button) => button.classList.remove("btn__active"));
    buttons[2].classList.add("btn__active");
    const createNewCurrency = createCurrency();
    function createCurrencyList(res) {
      createNewCurrency.blockYourCurrency.innerHTML = "";
      for (let k in res.payload) {
        if (res.payload[k].amount > 0) {
          const block = el("div.currency__block", [
            el("div.currency__name-currency", `${k}`),
            el("div.currency__points"),
            el(
              "div.currency__amount",
              `${parseFloat(res.payload[k].amount).toFixed(2)}`
            ),
          ]);
          createNewCurrency.blockYourCurrency.append(block);
          const currencyFrom = el("option.currensy__name-change", `${k}`);
          const currencyTo = el("option.currensy__name-change", `${k}`);
          createNewCurrency.selectFrom.append(currencyFrom);
          createNewCurrency.selectTo.append(currencyTo);
        }
      }
    }
    getCurrencyAccounts(accountApply[2]).then((res) => {
      createCurrencyList(res);
      setChildren(main, createNewCurrency.section);
      createNewCurrency.inputSumm.addEventListener(
        "input",
        () => (createNewCurrency.error.textContent = "")
      );
      createNewCurrency.buttonChange.addEventListener("click", (en) => {
        en.preventDefault();
        if (
          createNewCurrency.inputSumm.value < 0 ||
          createNewCurrency.inputSumm.value == ""
        ) {
          createNewCurrency.error.textContent = "Введена не корректная сумма";
          createNewCurrency.inputSumm.value = "";
          return;
        }
        changeCurrency(
          createNewCurrency.selectFrom.value,
          createNewCurrency.selectTo.value,
          createNewCurrency.inputSumm.value,
          accountApply[2]
        ).then((res) => {
          console.log(res);
          if (res.error == "Unknown currency code") {
            createNewCurrency.error.textContent =
              "Передан не верный валютный код";
          } else if (res.error == "Invalid amount") {
            createNewCurrency.error.textContent = "Не указана сумма перевода";
          } else if (res.error == "Not enough currency") {
            createNewCurrency.error.textContent =
              "На валютном счете списания нет средств";
          } else if (res.error == "Overdraft prevented") {
            createNewCurrency.error.textContent =
              "На счете не достаточно средств";
          } else {
            createCurrencyList(res);
            createNewCurrency.inputSumm.value = "";
          }
        });
      });
      const heightContainer = createNewCurrency.container.offsetHeight;
      const number = Math.floor((heightContainer - 167) / 62);
      console.log(number);
      createNewCurrency.div.style.height = `${heightContainer - 167}px`;
      const socket = new WebSocket("ws://localhost:3000/currency-feed");
      const cashList = JSON.parse(localStorage.getItem("currency"));
      const socketData = cashList || [];
      const spin = createBall();
      setChildren(createNewCurrency.ul, spin);
      socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (socketData.length > number) {
          socketData.pop();
        }
        const list = [];
        socketData.unshift({
          name: `${data.from}/${data.to}`,
          amount: `${data.rate}`,
          change: `${data.change}`,
        });
        localStorage.setItem("currency", JSON.stringify(socketData));
        for (let i = 0; i < socketData.length; i++) {
          const li = el("li.currency__block");
          const nameCurrency = el(
              "div.currency__name-currency",
              `${socketData[i].name}`
            ),
            rateCurrency = el("div.currency__points");
          const amountCurrency = el(
            "div.currency__amount",
            `${parseFloat(socketData[i].amount).toFixed(2)}`
          );
          const triangle = el("div.currency__change-triangle");
          if (socketData[i].change == 1) {
            triangle.classList.add("currency__points-up");
          } else if (socketData[i].change == -1) {
            triangle.classList.add("currency__points-down");
          }
          setChildren(li, [
            nameCurrency,
            rateCurrency,
            amountCurrency,
            triangle,
          ]);
          list.push(li);
        }

        setChildren(createNewCurrency.ul, list);
      };
    });
  }
  buttons[0].addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      if (buttons[0].classList.contains("btn__active") == false) {
        const url = new URLSearchParams(window.location.search);
        url.set("chart", "ATM");
        window.history.pushState(5, "", `?${url}`);
        creatMap();
        creatMapConfig();
      } else {
        return;
      }
    },
    false
  );

  function creatMapConfig() {
    // eslint-disable-next-line no-undef
    ymaps.ready(init);
    function init() {
      // eslint-disable-next-line no-undef
      const myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 10,
      });

      // eslint-disable-next-line no-undef
      const atm1 = new ymaps.GeoObject({
        geometry: {
          type: "Point",
          coordinates: [55.86, 37.54],
        },
      });
      // eslint-disable-next-line no-undef
      const atm2 = new ymaps.GeoObject({
        geometry: {
          type: "Point",
          coordinates: [55.66, 37.64],
        },
      });
      // eslint-disable-next-line no-undef
      const atm3 = new ymaps.GeoObject({
        geometry: {
          type: "Point",
          coordinates: [55.56, 37.46],
        },
      });
      // eslint-disable-next-line no-undef
      const atm4 = new ymaps.GeoObject({
        geometry: {
          type: "Point",
          coordinates: [55.66, 37.84],
        },
      });
      myMap.geoObjects.add(atm1);
      myMap.geoObjects.add(atm2);
      myMap.geoObjects.add(atm3);
      myMap.geoObjects.add(atm4);
    }
  }

  function creatMap() {
    if (buttons[0].classList.contains("btn__active") == false) {
      buttons.forEach((button) => button.classList.remove("btn__active"));
      buttons[0].classList.add("btn__active");
    } else {
      return;
    }
    const spinner = createLoader();

    setChildren(main, spinner);
    const Ymap = creatChartYandex();
    const widthMap = document.documentElement.clientWidth;
    const heightMap = document.documentElement.clientHeight - 240;
    Ymap.idMap.style.width = `${widthMap - 100}px`;
    Ymap.idMap.style.height = `${heightMap}px`;
    setChildren(main, Ymap.section);
  }

  function accounts(result) {
    removeClass(buttons, "hide");
    const createAccounts = createPageAccount();
    window.history.pushState(1, "", "index.html");
    let token = "";
    if (result.payload != undefined) {
      token = result.payload.token;
    } else {
      token = result;
    }

    createAccounts.buttonNewAccount.addEventListener("click", (e) => {
      e.preventDefault();
      createNewAccount(token);
      createApp();
    });

    const choices = new Choices(createAccounts.list, {
      searchEnabled: false,
      itemSelectText: "",
      renderSelectedChoices: true,
    });

    createAccounts.list.addEventListener("change", (e) => {
      createAccounts.ulAccounts.innerHTML = "";
      const spinner = createLoader();
      spinner.style.height = `${(window.innerHeight / 100) * 70}px`;
      createAccounts.ulAccounts.append(spinner);
      if (e.target.value == "number") {
        getAccounts(token).then((res) => {
          createArrCards(res, "number");
          spinner.remove();
        });
      } else if (e.target.value == "balance") {
        getAccounts(token).then((res) => {
          createArrCards(res, "balance");
          spinner.remove();
        });
      } else if (e.target.value == "transaction") {
        getAccounts(token).then((res) => {
          createArrCards(res, "transaction");
          spinner.remove();
        });
      } else {
        getAccounts(token).then((res) => {
          createArrCards(res);
          spinner.remove();
        });
      }
    });
    const spinner = createLoader();
    spinner.style.height = `${(window.innerHeight / 100) * 70}px`;
    createAccounts.ulAccounts.append(spinner);
    getAccounts(token).then((res) => {
      createArrCards(res);
      spinner.remove();
    });

    function createArrCards(res, sort) {
      let arrSort = [];
      if (sort == "number") {
        arrSort = res.payload.sort((a, b) => a.account - b.account);
      } else if (sort == "balance") {
        arrSort = res.payload.sort((a, b) => a.balance - b.balance);
      } else if (sort == "transaction") {
        console.log(res);
        arrSort = res.payload.sort(
          (a, b) => a.transactions[0] - b.transactions[0]
        );
      } else {
        arrSort = res.payload;
      }
      arrSort.forEach((e) => {
        let card;
        if (e.transactions[0]) {
          card = createAccount(e.account, e.balance, e.transactions[0].date);
          mount(createAccounts.ulAccounts, card.card);
        } else {
          card = createAccount(e.account, e.balance);
          mount(createAccounts.ulAccounts, card.card);
        }

        const urlButton = new URLSearchParams(window.location.search);
        urlButton.append("account", `${e.account}`);
        urlButton.append("balance", e.balance);
        card.button.href = `?${urlButton.toString()}`;
        card.button.addEventListener("click", (event) => {
          event.preventDefault();

          history.pushState(2, "", `?${urlButton}`);
          const accountApply = JSON.parse(localStorage.getItem("Login"));

          createDiagram(
            buttons,
            e.account,
            accountApply[2],
            createDiagramList,
            true
          );
        });
      });

      buttons[1].classList.add("btn__active");
    }
    main.innerHTML = "";
    mount(main, createAccounts.section);
  }

  function createDiagram(buttons, account, accountApply, foo, bool) {
    const spinner = createLoader();
    spinner.style.backgroundColor = "transparent";
    setChildren(main, spinner);
    buttons[1].classList.remove("btn__active");

    getAccount(account, accountApply).then((res) => {
      const balance = res.payload.balance;
      const maxBalanceOne = balance;
      const one = new Date();
      const oneStart = new Date();
      oneStart.setDate(1);
      const twoMonth = createArr(res, oneStart, 1);
      const threeMonth = createArr(res, oneStart, 2);
      const fourMonth = createArr(res, oneStart, 3);
      const fiveMonth = createArr(res, oneStart, 4);
      const sixMonth = createArr(res, oneStart, 5);
      const sevenMonth = createArr(res, oneStart, 6);
      const eightMonth = createArr(res, oneStart, 7);
      const nineMonth = createArr(res, oneStart, 8);
      const tenMonth = createArr(res, oneStart, 9);
      const elevenMonth = createArr(res, oneStart, 10);
      const twelveMonth = createArr(res, oneStart, 11);
      const oneMonth = createFirstArr(res, one);
      const oneBal = monthBalance(oneMonth, balance, maxBalanceOne);
      const twoBal = monthBalance(twoMonth, oneBal.bal, oneBal.bal);
      const threeBal = monthBalance(threeMonth, twoBal.bal, twoBal.bal);
      const fourBal = monthBalance(fourMonth, threeBal.bal, threeBal.bal);
      const fiveBal = monthBalance(fiveMonth, fourBal.bal, fourBal.bal);
      const sixBal = monthBalance(sixMonth, fiveBal.bal, fiveBal.bal);
      const sevenBal = monthBalance(sevenMonth, sixBal.bal, sixBal.bal);
      const eightBal = monthBalance(eightMonth, sevenBal.bal, sevenBal.bal);
      const nineBal = monthBalance(nineMonth, eightBal.bal, eightBal.bal);
      const tenBal = monthBalance(tenMonth, nineBal.bal, nineBal.bal);
      const elevenBal = monthBalance(elevenMonth, tenBal.bal, tenBal.bal);
      const twelveBal = monthBalance(twelveMonth, elevenBal.bal, elevenBal.bal);
      const maxBalArrFirst = [
        oneBal.maxBal,
        twoBal.maxBal,
        threeBal.maxBal,
        fourBal.maxBal,
        fiveBal.maxBal,
        sixBal.maxBal,
      ];
      const maxBalArrDetailed = [
        oneBal.maxBal,
        twoBal.maxBal,
        threeBal.maxBal,
        fourBal.maxBal,
        fiveBal.maxBal,
        sixBal.maxBal,
        sevenBal.maxBal,
        eightBal.maxBal,
        nineBal.maxBal,
        tenBal.maxBal,
        elevenBal.maxBal,
        twelveBal.maxBal,
      ];
      const months = [
        "янв",
        "фев",
        "мар",
        "апр",
        "май",
        "июн",
        "июл",
        "авг",
        "сен",
        "окт",
        "ноя",
        "дек",
      ];
      const sixMonthArr = [
        months[getlastNumberMonth(oneStart.getMonth(), 5)],
        months[getlastNumberMonth(oneStart.getMonth(), 4)],
        months[getlastNumberMonth(oneStart.getMonth(), 3)],
        months[getlastNumberMonth(oneStart.getMonth(), 2)],
        months[getlastNumberMonth(oneStart.getMonth(), 1)],
        months[oneStart.getMonth()],
      ];
      const twelveMonthArr = [
        months[getlastNumberMonth(oneStart.getMonth(), 11)],
        months[getlastNumberMonth(oneStart.getMonth(), 10)],
        months[getlastNumberMonth(oneStart.getMonth(), 9)],
        months[getlastNumberMonth(oneStart.getMonth(), 8)],
        months[getlastNumberMonth(oneStart.getMonth(), 7)],
        months[getlastNumberMonth(oneStart.getMonth(), 6)],
        months[getlastNumberMonth(oneStart.getMonth(), 5)],
        months[getlastNumberMonth(oneStart.getMonth(), 4)],
        months[getlastNumberMonth(oneStart.getMonth(), 3)],
        months[getlastNumberMonth(oneStart.getMonth(), 2)],
        months[getlastNumberMonth(oneStart.getMonth(), 1)],
        months[oneStart.getMonth()],
      ];
      if (bool) {
        const accountDetail = createAccountDetaled();
        accountDetail.buttonBack.addEventListener("click", (e) => {
          e.preventDefault();
          createApp();
        });
        main.innerHTML = "";
        mount(main, accountDetail.section);

        accountDetail.button.addEventListener("click", (e) => {
          e.preventDefault();
          const accountRecipient = accountDetail.numberRecipient.value;
          const sumRecipient = accountDetail.sumRecipient.value;
          if (
            accountRecipient < 0 ||
            sumRecipient < 0 ||
            sumRecipient == "" ||
            accountRecipient == ""
          ) {
            accountDetail.errorMessage.textContent =
              "Неверно указан счет или сумма";
            return;
          }
          exchangeCurrency(
            account,
            accountRecipient,
            sumRecipient,
            accountApply
          ).then((res) => {
            console.log(res);
            if (res.error == "Invalid account to") {
              accountDetail.errorMessage.textContent =
                "Не указан счёт зачисления, или этого счёта не существует";
              return;
            } else if (res.error == "Invalid account from") {
              accountDetail.errorMessage.textContent =
                "Не указан адрес счёта списания, или этот счёт не принадлежит нам";
              return;
            } else if (res.error == "Invalid amount") {
              accountDetail.errorMessageSum.textContent =
                "Не указана сумма перевода, или она отрицательная";
              return;
            } else if (res.error == "Overdraft prevented") {
              accountDetail.errorMessageSum.textContent =
                "Мы попытались перевести больше денег, чем доступно на счёте списания";
              return;
            } else {
              const accountTransfer =
                JSON.parse(localStorage.getItem("recipient")) || [];
              for (let i = accountTransfer.length; i > 10; i--) {
                if (accountTransfer.length > 10) {
                  accountTransfer.shift();
                }
              }
              accountTransfer.push(accountDetail.numberRecipient.value);
              localStorage.setItem(
                "recipient",
                JSON.stringify(accountTransfer)
              );
              const option = el("option.account__lastNumber-recipient", {
                value: `${accountDetail.numberRecipient.value}`,
              });
              accountDetail.dataList.append(option);
              accountDetail.numberRecipient.value = "";
              accountDetail.sumRecipient.value = "";
              accountDetail.tbody.innerHTML = "";
              accountDetail.tbody.remove();
              const tbody = updateList(accountDetail.account);
              setChildren(accountDetail.table, [accountDetail.tr, tbody]);
            }
          });
        });

        foo(maxBalArrFirst, sixMonthArr, accountDetail.canvasChart);
        accountDetail.aChart.forEach((enter) => {
          enter.addEventListener("click", (ev) => {
            ev.preventDefault();
            createSpinner(main);
            setTimeout(() => createDetailetList(), 100);
          });
        });
      } else {
        createDetailetList();
      }
      function createDetailetList() {
        const params = new URLSearchParams(window.location.search);
        if (params.has("detailed") == false) {
          params.append("detailed", `history`);
          window.history.pushState(3, "", `?${params}`);
        }
        params.delete("detailed");
        const diagramDetailed = createDiagramDetailed(main);
        diagramDetailed.buttonBack.href = `${params}`;
        mount(main, diagramDetailed.section);
        foo(maxBalArrDetailed, twelveMonthArr, diagramDetailed.canvasChartOne);
        const arrDebet = [
          createArrBal(oneMonth).debet,
          createArrBal(twoMonth).debet,
          createArrBal(threeMonth).debet,
          createArrBal(fourMonth).debet,
          createArrBal(fiveMonth).debet,
          createArrBal(sixMonth).debet,
          createArrBal(sevenMonth).debet,
          createArrBal(eightMonth).debet,
          createArrBal(nineMonth).debet,
          createArrBal(tenMonth).debet,
          createArrBal(elevenMonth).debet,
          createArrBal(twelveMonth).debet,
        ];

        const arrCredet = [
          createArrBal(oneMonth).credet,
          createArrBal(twoMonth).credet,
          createArrBal(threeMonth).credet,
          createArrBal(fourMonth).credet,
          createArrBal(fiveMonth).credet,
          createArrBal(sixMonth).credet,
          createArrBal(sevenMonth).credet,
          createArrBal(eightMonth).credet,
          createArrBal(nineMonth).credet,
          createArrBal(tenMonth).credet,
          createArrBal(elevenMonth).credet,
          createArrBal(twelveMonth).credet,
        ];
        createDiagramRation(
          arrDebet,
          arrCredet,
          twelveMonthArr,
          diagramDetailed.canvasChartTwo
        );
        diagramDetailed.buttonBack.addEventListener("click", (ent) => {
          ent.preventDefault();
          const urlButton = new URLSearchParams(window.location.search);
          const account = urlButton.get("account");
          const accountApply = JSON.parse(localStorage.getItem("Login"));
          history.pushState(2, "", `?${params}`);

          createDiagram(
            buttons,
            account,
            accountApply[2],
            createDiagramList,
            true
          );
        });

        const tbody = diagramDetailed.tbody;
        diagramDetailed.table.append(tbody);
        const transAccount = res.payload.transactions || [];
        console.log(transAccount);
        if (transAccount.length > 0) {
          for (let i = transAccount.length - 1; i >= 0; i--) {
            const trTable = createLineTable(
              transAccount[i].from,
              transAccount[i].to,
              transAccount[i].amount,
              changeViewDate(transAccount[i].date)
            );
            tbody.append(trTable);
          }
          Paginator.init({
            tableID: "table-one",
            rows: 25,
            headers: 2,
            navRange: 5,
            navStyle: "default",
          });
        }
      }
    });
  }

  function createDiagramList(arr, arrMonth, chart, step) {
    const chartAreaBorder = {
      id: "chartAreaBorder",
      beforeDraw(chart, args, options) {
        const {
          ctx,
          chartArea: { left, top, width, height },
        } = chart;
        ctx.save();
        ctx.strokeStyle = options.borderColor;
        ctx.lineWidth = options.borderWidth;
        ctx.setLineDash(options.borderDash || []);
        ctx.lineDashOffset = options.borderDashOffset;
        ctx.strokeRect(left, top, width, height);
        ctx.restore();
      },
    };
    const maxBal = Math.round(Math.max.apply(null, arr));
    const ctx = chart.getContext("2d");
    ctx.canvas.style.maxWidth = "100%";
    ctx.canvas.style.maxHeight = "100%";
    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: arrMonth,
        datasets: [
          {
            label: "",
            data: arr.reverse(),
            backgroundColor: ["blue"],
            categoryPercentage: 1.0,
            barPercentage: 0.6,
          },
        ],
      },
      options: {
        plugins: {
          legend: false,
          chartAreaBorder: {
            borderColor: "#000",
            borderWidth: 1,
          },
        },
        maintainAspectRatio: true,
        scales: {
          x: {
            border: {
              color: "#000",
            },

            grid: {
              display: false,
            },
            ticks: {
              font: {
                family: "Work Sans",
                size: 20,
                weight: 700,
              },
              color: "#000",
            },
          },
          y: {
            position: "right",
            border: {
              color: "#000000",
            },
            min: 0,
            max: maxBal,
            ticks: {
              stepSize: maxBal,
              font: {
                family: "Work Sans",
                size: 20,
              },

              color: "#000",
            },

            grid: {
              display: false,
            },
          },
        },
      },
      plugins: [chartAreaBorder],
    });
  }

  function createDiagramRation(arrDeb, arrCred, arrMonth, chart) {
    console.log(arrCred, arrDeb, arrMonth, chart);
    const chartAreaBorder = {
      id: "chartAreaBorder",
      beforeDraw(chart, args, options) {
        const {
          ctx,
          chartArea: { left, top, width, height },
        } = chart;
        ctx.save();
        ctx.strokeStyle = options.borderColor;
        ctx.lineWidth = options.borderWidth;
        ctx.setLineDash(options.borderDash || []);
        ctx.lineDashOffset = options.borderDashOffset;
        ctx.strokeRect(left, top, width, height);
        ctx.restore();
      },
    };
    const maxDeb = Math.round(Math.max.apply(null, arrDeb));
    const maxCred = Math.round(Math.max.apply(null, arrCred));
    let maxBal = maxDeb > maxCred ? maxDeb : maxCred;
    const step = Math.round(maxBal / 2);
    const ctx = chart.getContext("2d");
    ctx.canvas.style.width = "100%";
    ctx.canvas.style.height = "100%";
    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: arrMonth,
        datasets: [
          {
            label: "",
            data: arrCred.reverse(),
            backgroundColor: ["red"],
            categoryPercentage: 1.0,
            barPercentage: 0.6,
            stack: "stack 0",
          },
          {
            label: "",
            data: arrDeb.reverse(),
            backgroundColor: ["green"],
            categoryPercentage: 1.0,
            barPercentage: 0.6,
            stack: "stack 0",
          },
        ],
      },

      options: {
        plugins: {
          legend: false,
          chartAreaBorder: {
            borderColor: "#000",
            borderWidth: 1,
          },
        },
        responsive: true,
        interaction: {
          intersect: false,
        },
        maintainAspectRatio: true,
        scales: {
          x: {
            border: {
              color: "#000",
            },
            stacked: true,
            grid: {
              display: false,
            },
            ticks: {
              font: {
                family: "Work Sans",
                size: 20,
                weight: 700,
              },
              color: "#000",
            },
          },
          y: {
            position: "right",
            border: {
              color: "#000000",
            },
            min: 0,
            max: maxBal,
            ticks: {
              stepSize: step,
              font: {
                family: "Work Sans",
                size: 20,
              },

              color: "#000",
            },
            stacked: true,
            grid: {
              display: false,
            },
          },
        },
      },
      plugins: [chartAreaBorder],
    });
  }

  function getlastNumberMonth(month, number) {
    if (month - number < 0) {
      return 12 + (month - number);
    } else {
      return month - number;
    }
  }
  function createSpinner(main) {
    const spinner = createLoader();
    setChildren(main, spinner);
    spinner.style.backgroundColor = "transparent";
  }
};

createApp();
