let stock_dict = {};
let num_row = 0;
let url1 = "https://4z2mkmwx7j.execute-api.ap-northeast-1.amazonaws.com/0630-1"
let url2 = "https://guj4pafnoi.execute-api.ap-northeast-1.amazonaws.com/0630-1"

function load() {
  fetch(url1)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(function (data) {
      stock_dict = data.stock;
      make_tr();
    })
    .catch(function (error) {
      // エラーハンドリングを行うコードをここに書く
      alert("在庫を取得できませんでした。")
    });
}

function make_tr() {
  const table = document.getElementById("table");
  const tr = document.createElement("tr");
  const id_list = ["name", "variation", "size", "price", "num"];
  id_list.forEach(function (id) {
    const td = document.createElement("td");
    if (id != "price") {
      const select = document.createElement("select");
      const id_value = id + num_row.toString();
      select.setAttribute("id", id_value);
      select.setAttribute("class", "cell_select");
      td.appendChild(select);
      td.setAttribute("class", "cell_m" + (num_row % 2).toString());
    } else {
      const span = document.createElement("span");
      const id_value = id + num_row.toString();
      span.setAttribute("id", id_value);
      span.setAttribute("class", "cell_span");
      td.appendChild(span);
      td.setAttribute("class", "cell_m" + (num_row % 2).toString());
    }
    tr.appendChild(td);
  });
  table.appendChild(tr)
  num_row += 1;
  show_name(num_row - 1);
}

function show_name(i) {
  //サーバー通信に置き換え

  const names = Object.keys(stock_dict).sort();
  const select_name = document.getElementById('name' + i.toString());
  const select_variation = document.getElementById('variation' + i.toString());
  console.log("show_name")
  while (select_variation.firstChild) {
    select_variation.removeChild(select_variation.firstChild);
  }
  const select_size = document.getElementById('size' + i.toString());
  while (select_size.firstChild) {
    select_size.removeChild(select_size.firstChild);
  }
  const select_num = document.getElementById('num' + i.toString());
  while (select_num.firstChild) {
    select_num.removeChild(select_num.firstChild);
  }
  let option = document.createElement("option");
  select_name.appendChild(option);
  names.forEach(function (name) {
    let option = document.createElement("option");
    option.textContent = name;
    option.value = name;
    select_name.appendChild(option);
    show_variation(select_name, i);
  });
  select_name.focus()
}

function show_variation(select_name, i) {
  select_name.addEventListener("change", function () {
    value_name = select_name.value;
    //価格表示
    const price = document.getElementById('price' + i.toString());
    price.textContent = stock_dict[value_name]["price"].toString() + "円";
    price.value = stock_dict[value_name]["price"].toString();
    //バリエーション表示
    const variations = Object.keys(stock_dict[value_name]["variation"]).sort();
    const select_variation = document.getElementById('variation' + i.toString());
    while (select_variation.firstChild) {
      select_variation.removeChild(select_variation.firstChild);
    }
    const select_size = document.getElementById('size' + i.toString());
    while (select_size.firstChild) {
      select_size.removeChild(select_size.firstChild);
    }
    const select_num = document.getElementById('num' + i.toString());
    while (select_num.firstChild) {
      select_num.removeChild(select_num.firstChild);
    }
    let option = document.createElement("option");
    select_variation.appendChild(option);
    variations.forEach(function (variation) {
      let option = document.createElement("option");
      option.textContent = variation;
      option.value = variation;
      select_variation.appendChild(option);
    });
    select_variation.focus()
    show_size(select_name, select_variation, i)
  })
}

function show_size(select_name, select_variation, i) {
  select_variation.addEventListener("change", function () {
    value_name = select_name.value;
    value_variation = select_variation.value;
    const sizes = Object.keys(stock_dict[value_name]["variation"][value_variation]).sort();
    const select_size = document.getElementById('size' + i.toString());
    while (select_size.firstChild) {
      select_size.removeChild(select_size.firstChild);
    }
    const select_num = document.getElementById('num' + i.toString());
    while (select_num.firstChild) {
      select_num.removeChild(select_num.firstChild);
    }
    let option = document.createElement("option");
    select_size.appendChild(option);
    sizes.forEach(function (size) {
      let option = document.createElement("option");
      //在庫表示も追加
      let stock = stock_dict[value_name]["variation"][value_variation][size]
      option.textContent = size + "(残" + stock.toString() + ")";
      option.value = size;
      select_size.appendChild(option);
    });
    select_size.focus()
    show_num(select_name, select_variation, select_size, i);
  });

}

function show_num(select_name, select_variation, select_size, i) {
  select_size.addEventListener("change", function () {
    value_name = select_name.value;
    value_variation = select_variation.value
    value_size = select_size.value;
    value_ = select_size.value;
    const num = stock_dict[value_name]["variation"][value_variation][value_size];
    const select_num = document.getElementById('num' + i.toString());
    while (select_num.firstChild) {
      select_num.removeChild(select_num.firstChild);
    }
    for (let j = 0; j <= num; j++) {
      let option = document.createElement("option");
      option.textContent = j;
      option.value = j;
      select_num.appendChild(option);
    }
    select_num.focus()
    show_total(select_num)
  });
}

function show_total(select_num) {
  select_num.addEventListener("change", function () {
    sum = 0;
    for (let i = 0; i < num_row; i++) {
      const cal_num = document.getElementById('num' + i.toString()).value;
      let cal_price = 0;
      if (isPositiveInteger(cal_num)) {
        const name = document.getElementById('name' + i.toString()).value
        cal_price = stock_dict[name]["price"];
      } else {

      }
      sum += Number(cal_price) * Number(cal_num);
      const elem_sum = document.getElementById('sum');
      console.log(sum)
      elem_sum.innerText = "計 " + sum.toString() + "円";
    }
  });
}

function purchase() {
  console.log("purchase");
  var req_body = [];
  for (let i = 0; i < num_row; i++) {
    let req_row = {}
    req_row.num = document.getElementById('num' + i.toString()).value;
    if (Number(req_row.num) > 0) {
      req_row.name = document.getElementById('name' + i.toString()).value;
      req_row.variation = document.getElementById('variation' + i.toString()).value;
      req_row.size = document.getElementById('size' + i.toString()).value;
      req_body.push(req_row);
    } else { }
  }
  console.log(JSON.stringify(req_body))
  fetch(url2, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req_body)
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  }).then(data => {
    if (data.success == 1) {
      let sentence = "";
      sentence += `${data.receipt.total}円 ${data.receipt.time}\n`;
      items = data.receipt.items
      items.forEach(function (item) {
        sentence += `${item["name"]},${item["variation"]},${item["size"]},${item["num"]}`;
      })
      alert(sentence);
      window.location.reload();
    } else {
      console.log("a");
      console.log(JSON.stringify(data.message));
    }
  }).catch(error => {
    alert("通信エラーが発生しました\nやり直してください");
  });
}


function isPositiveInteger(str) {
  return /^\d+$/.test(str) && parseInt(str) > 0;
}