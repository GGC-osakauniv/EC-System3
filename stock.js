const url1 = "https://4z2mkmwx7j.execute-api.ap-northeast-1.amazonaws.com/0630-1";
const url2 = "https://9ck2x4wh63.execute-api.ap-northeast-1.amazonaws.com/0704-1";
let stock_dict = {};
let edit_bool = true;

function onload() {
    fetch(url1)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(function (data) {
            stock_dict = data.stock;
            maketable();
        })
        .catch(function (error) {
            // エラーハンドリングを行うコードをここに書く
            alert("在庫を取得できませんでした。");
            return;
        });


    var editSwitch = document.getElementById('editSwitch');
    var table = document.querySelector('table');

    editSwitch.addEventListener('change', function () {
        if (editSwitch.checked) {
            editable();
        } else {
            noneditable();
        }
    });
}

function maketable() {
    //サーバー通信に置き換え
    const table = document.getElementById("table_m");
    const names = Object.keys(stock_dict).sort();
    tr_list = []
    let tr_count = 0;
    let name_count = 0;
    names.forEach(function (name) {
        const variations = Object.keys(stock_dict[name]["variation"]);
        let row_count_variation = 0;
        variations.forEach(function (variation) {
            const sizes = Object.keys(stock_dict[name]["variation"][variation]);
            sizes.forEach(function (size) {
                const tr = document.createElement("tr");
                const td_size = document.createElement("td");
                td_size.innerText = size;
                td_size.style.textAlign = "center";
                td_size.setAttribute("class", "cell_m" + (name_count % 2).toString());
                tr.appendChild(td_size);
                const td_stock = document.createElement("td");
                td_stock.innerText = stock_dict[name]["variation"][variation][size];
                td_stock.style.textAlign = "center";
                td_stock.setAttribute("id", `${name}/${variation}/${size}`);
                td_stock.setAttribute("class", "cell_m" + (name_count % 2).toString());
                td_stock.setAttribute("name", "stock");
                tr.appendChild(td_stock);
                tr_list.push(tr);
                tr_count += 1;
                row_count_variation += 1
            });
            const top_variation = tr_count - sizes.length;
            const td_variation = document.createElement("td");
            td_variation.innerText = variation;
            td_variation.style.textAlign = "center";
            td_variation.setAttribute("rowspan", sizes.length);
            td_variation.setAttribute("class", "cell_m" + (name_count % 2).toString());
            tr_list[top_variation].prepend(td_variation);
        });
        const top_name = tr_count - row_count_variation;
        const td_price = document.createElement("td");
        td_price.innerText = stock_dict[name]["price"].toString() + "円";
        td_price.style.textAlign = "right";
        td_price.setAttribute("rowspan", row_count_variation);
        td_price.setAttribute("class", "cell_m" + (name_count % 2).toString());
        tr_list[top_name].prepend(td_price);
        const td_name = document.createElement("td");
        td_name.innerText = name;
        td_name.style.textAlign = "center";
        td_name.setAttribute("rowspan", row_count_variation);
        td_name.setAttribute("class", "cell_m" + (name_count % 2).toString());
        tr_list[top_name].prepend(td_name);
        name_count += 1;
    });
    tr_list.forEach(function (tr) {
        table.appendChild(tr);
    });
}

function editable() {

    elems_stock = document.getElementById("stock");
    elems_stock.forEach(function (elem_stock) {
        var elem_select = document.createElement("select");
        for (var i = 0; i <= 100; i++) {
            var optionElement = document.createElement('option');
            optionElement.value = i;
            optionElement.text = i;
            elem_select.appendChild(optionElement);
        }
        elem_select.value = elem_stock.innerText;  // 初期値を設定したい値に置き換えてください
        elem_stock.innerText = null;
        elem_select.getAttribute("class", "select");
        elem_stock.appendChild(elem_select);
    });
}
function noneditable() {
    elems_stock = document.getElementById("stock");
    elems_stock.forEach(function (elem_stock) {
        elem_select = elem_stock.getElementByTagName("select");
        elem_stock.innerText = elem_select.value;
        elem_select.remove();
    });
}

function save() {
    const elems_stock = document.getElementsByName("stock");
    elems_stock.forEach(function (elem_stock) {
        const address = elem_stock.getAttribute("id").split("/");
        console.log(address);
        stock_dict[address[0]]["variation"][address[1]][address[2]] = elem_stock.innerText;
    })
    console.log(stock_dict);

    fetch(url2, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Origin': window.location.origin
        },
        body: JSON.stringify(stock_dict)
    }).then(response => {
        response.json()
    }).then(data => {
        if (data["success"] == 1) {
            alert("正常に保存しました");
            window.location.reload();
        } else {
            console.log(JSON.stringify(data.message));
        }
    }).catch(error => {
        alert("通信エラーが発生しました\nやり直してください");
    });
}