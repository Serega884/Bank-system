export function createArr(res, add, month) {
  const finish = new Date(add);
  const start = new Date(add);
  start.setMonth(start.getMonth() - month + 1);
  finish.setMonth(finish.getMonth() - month);
  console.log(start);
  console.log(finish);

  const dal = res.payload.transactions.filter((item) => {
    const itemTime = new Date(item.date);

    return itemTime < start && itemTime >= finish;
  });
  return dal;
}

export function createFirstArr(res, one) {
  const two = new Date();
  two.setDate(1);
  return res.payload.transactions.filter((item) => {
    const itemTime = new Date(item.date);
    return itemTime <= one && itemTime >= two;
  });
}

export function createArrBal(arr) {
  const debArr = [];
  const credArr = [];
  const param = new URLSearchParams(window.location.search);
  const account = param.get("account");
  arr.forEach((item) => {
    if (item.from == account) {
      credArr.push(item.amount);
    } else {
      debArr.push(item.amount);
    }
  });

  let debet = 0,
    credet = 0;
  if (debArr.length > 0) {
    debet = debArr.reduce((a, b) => a + b);
  }

  if (credArr.length > 0) {
    credet = credArr.reduce((a, b) => a + b);
  }

  debet = parseInt(debet.toFixed(2));
  credet = parseInt(credet.toFixed(2));
  return {
    debet,
    credet,
  };
}

export function monthBalance(month, bal, maxBal) {
  const params = new URLSearchParams(window.location.search);
  const account = params.get("account");
  for (let i = month.length - 1; i >= 0; i--) {
    if (month[i].from == `${account}`) {
      bal = bal + month[i].amount;
      if (maxBal < bal) {
        maxBal = bal;
      }
    } else {
      bal = bal - month[i].amount;
      if (maxBal < bal) {
        maxBal = bal;
      }
    }
  }
  return {
    maxBal,
    bal,
  };
}
