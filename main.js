let stock_dict = {};
let num_row = 0;

function onload() {
  init();
  make_tr();
}

function make_tr() {
  const table = document.getElementById("table");
  const tr = document.createElement("tr");
  const id_list = ["item", "variation", "size", "price", "num"];
  id_list.forEach(function (id) {
    const td = document.createElement("td");
    if (id != "price") {
      const select = document.createElement("select");
      const id_value = id + num_row.toString();
      select.setAttribute("id", id_value);
      select.setAttribute("class", "cell_select");
      td.appendChild(select);
      td.setAttribute("class", "cell_m" + (num_row%2).toString());
    } else {
      const span = document.createElement("span");
      const id_value = id + num_row.toString();
      span.setAttribute("id", id_value);
      span.setAttribute("class", "cell_span");
      td.appendChild(span);
      td.setAttribute("class", "cell_m" + (num_row%2).toString());
    }
    tr.appendChild(td);
  });
  table.appendChild(tr)
  num_row += 1;
  show_item(num_row - 1);
}

function show_item(i) {
  //サーバー通信に置き換え
  stock_dict = JSON.parse(localStorage.getItem('stock'));
  const items = Object.keys(stock_dict).sort();
  const select_item = document.getElementById('item' + i.toString());
  const select_variation = document.getElementById('variation' + num_row.toString());
  const select_size = document.getElementById('size' + i.toString());
  while (select_size.firstChild) {
    select_size.removeChild(select_size.firstChild);
  }
  const select_num = document.getElementById('num' + i.toString());
  while (select_num.firstChild) {
    select_num.removeChild(select_num.firstChild);
  }
  let option = document.createElement("option");
  select_item.appendChild(option);
  items.forEach(function (item) {
    let option = document.createElement("option");
    option.textContent = item;
    option.value = item;
    select_item.appendChild(option);
    show_variation(select_item, i);
  });
}

function show_variation(select_item, i) {
  select_item.addEventListener("change", function () {
    value_item = select_item.value;
    //価格表示
    const price = document.getElementById('price' + i.toString());
    price.textContent = stock_dict[value_item]["price"].toString() + "円";
    price.value = stock_dict[value_item]["price"].toString();
    //バリエーション表示
    const variations = Object.keys(stock_dict[value_item]["variation"]).sort();
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
    show_size(select_item, select_variation, i)
  })
}

function show_size(select_item, select_variation, i) {
  select_variation.addEventListener("change", function () {
    value_item = select_item.value;
    value_variation = select_variation.value;
    const sizes = Object.keys(stock_dict[value_item]["variation"][value_variation]).sort();
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
      let stock = stock_dict[value_item]["variation"][value_variation][size]
      option.textContent = size + "(残" + stock.toString() + ")";
      option.value = size;
      select_size.appendChild(option);
    });
    show_num(select_item, select_variation, select_size, i);
  });

}
function show_num(select_item, select_variation, select_size, i) {
  select_size.addEventListener("change", function () {
    value_item = select_item.value;
    value_variation = select_variation.value
    value_size = select_size.value;
    value_ = select_size.value;
    const num = stock_dict[value_item]["variation"][value_variation][value_size];
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
    show_total(select_num)
  });
}
function show_total(select_num) {
  select_num.addEventListener("change", function () {
    sum = 0;
    console.log("a");
    for (let i = 0; i < num_row; i++) {
      const cal_num = document.getElementById('num' + i.toString()).value;
      let cal_price = 0;
      console.log('num' + i.toString());
      console.log(cal_num);
      if (isPositiveInteger(cal_num)) {
        console.log("true");
        const item = document.getElementById('item' + i.toString()).value
        cal_price = stock_dict[item]["price"];
        console.log(item);
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
  alert("未実装");
  req_body = [];
  for (let i = 0; i < num_row; i++) {
    let req_row = {}
    req_row.num = document.getElementById('num' + i.toString()).value;
    if (Number(req_row.num) > 0) {
      req_row.item = document.getElementById('item' + i.toString()).value;
      req_row.variation = document.getElementById('variation' + i.toString()).value;
      req_row.size = document.getElementById('size' + i.toString()).value;
      req_body.push(req_row);
    } else {

    }
  }
  const success = api("/api/purchase", req_body);
}

function api(url, req_body) {
  stock_dict0 = JSON.parse(localStorage.getItem('stock'));
  if (url == "/api/purchase") {
    req_body.forEach(function (row) {
      if (stock_dict0[req_row.item]["variation"][req_row.variation][req_row.size] - req_row.num > 0) {
        stock_dict0[req_row.item]["variation"][req_row.variation][req_row.size] -= req_row.num;
      } else {
        console.log("SoldOut");
      }
    });
  }
}


function init() {
  alert("未実装");
  let stock_dict0 = {
    "Finnish": {
      "price": "2000",
      "variation": {
        "white": {
          "L": 1
        }
      }
    },
    "English": {
      "price": "2000",
      "variation": {
        "white": {
          "M": 0,
          " L": 1
        }
      }
    },
    "Bulgarian": {
      "price": "2000",
      "variation": {
        "white": {
          "M": 1,
          " L": 0
        }
      }
    },
    "Chinese": {
      "price": "2000",
      "variation": {
        "white": {
          "L": 1
        }
      }
    },
    "Korean": {
      "price": "2000",
      "variation": {
        "whjite": {
          "M": 0,
          "L": 0
        }
      }
    },
    "Italian": {
      "price": "2000",
      "variation": {
        "white": {
          "M": 0,
          "L": 0
        }
      }
    },
    "Japanese.Not": {
      "price": "2000",
      "variation": {
        "white": {
          "L": 1
        }
      }
    },
    "Japanese": {
      "price": "2000",
      "variation": {
        "white": {
          "L": 0
        }
      }
    },
    "Russian": {
      "price": "2000",
      "variation": {
        "white": {
          "M": 0,
          "L": 1
        }
      }
    },
    "French": {
      "price": "2000",
      "variation": {
        "white": {
          "M": 0,
          "L": 0
        }
      }
    },
    "Urdu": {
      "price": "2000",
      "variation": {
        "white": {
          "L": 0
        }
      }
    }
  }
  localStorage.setItem("stock", JSON.stringify(stock_dict0));
}
function isPositiveInteger(str) {
  return /^\d+$/.test(str) && parseInt(str) > 0;
}