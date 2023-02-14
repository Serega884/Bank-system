export function getPassword(log, pass) {
  return fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login: log,
      password: pass,
    }),
  }).then((res) => res.json());
}

export function getAccounts(token) {
  return fetch("http://localhost:3000/accounts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
}

export function createNewAccount(token) {
  return fetch("http://localhost:3000/create-account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
}

export function getCurrencyAccounts(token) {
  return fetch("http://localhost:3000/currencies", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Basic ${token}`,
    },
  }).then((data) => data.json());
}

export function getAccount(id, token) {
  return fetch(`http://localhost:3000/account/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
}

export function exchangeCurrency(from, to, amount, token) {
  return fetch("http://localhost:3000/transfer-funds", {
    method: "POST",
    body: JSON.stringify({
      from,
      to,
      amount,
    }),
    headers: {
      "Content-Type": "application/json",
      authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
}

export function changeCurrency(from, to, amount, token) {
  return fetch("http://localhost:3000/currency-buy", {
    method: "POST",
    body: JSON.stringify({
      from,
      to,
      amount,
    }),
    headers: {
      "Content-Type": "application/json",
      authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
}
