let key = "GGC/EC-System3/stock"

// バリエーションの配列
let variations = [];

// サイズの配列
let sizes = [];

let stock_dict = {};

// 初期化時にテーブルを生成
window.onload = function () {
    let url = new URL(window.location.href);
    let params = url.searchParams;
    let rawData = localStorage.getItem(key);
    let item = params.get('item');
    stock_dict = JSON.parse(rawData);
    console.log(stock_dict);
    variations = Object.keys(stock_dict[item]["variation"]);
    sizes = Object.keys(stock_dict[item]["variation"][variations[0]]);
    generateItemInput();
    generatePriceInput();
    generateVariationTable();
    generateSizeTable();
}

function generateItemInput() {
    let input = document.getElementById("item");
    input.value = item;
    input.name = item;
    input.addEventListener("change", function () {
        if (stock_dict[input.value]) {
            alert("すでに存在しています.");
            input.value = input.name;
        } else if (stock_dict[input.name]) {
            stock_dict[input.value] = stock_dict[input.name];
            delete stock_dict[input.name];
            input.name = input.value;
        }
        else {
            stock_dict[item]["variation"][input.value] = {}
            sizes.forEach(function (size) {
                stock_dict[input.value]["variation"] = 0;
                stock_dict[input.value]["price"] = 0;
            })
            input.name = input.value;
        }
    })
};
function generatePriceInput() {
    let input = document.getElementById("price");
    input.value = stock_dict[item]["price"];
    input.addEventListener("input", function () {
        try {
            stock_dict[item]["price"] = parseInt(item.value);
        } catch {
            alert("整数で入力してください");
        }
    })
}




// バリエーションのテーブルを生成
function generateVariationTable() {
    var table = document.getElementById("variation-table");

    for (var i = 0; i < variations.length; i++) {
        var row = table.insertRow();
        var cell1 = row.insertCell();
        var cell2 = row.insertCell();

        var input = document.createElement("input");
        input.type = "text";
        input.value = variations[i];
        input.name = variations[i];
        input.addEventListener("change", function () {
            if (stock_dict[item]["variation"][input.value]) {
                alert("すでに存在しています.");
                input.value = input.name;
            } else if (stock_dict[item]["variation"][input.name]) {
                stock_dict[item]["variation"][input.value] = stock_dict[item]["variation"][input.name];
                delete stock_dict[item]["variation"][input.name];
                input.name = input.value;
                variations = Object.keys(stock_dict[item]["variation"]);
            }
            else {
                stock_dict[item]["variation"][input.value] = {}
                sizes.forEach(function (size) {
                    stock_dict[item]["variation"][input.value][size] = 0;
                })
                input.name = input.value;
                variations = Object.keys(stock_dict[item]["variation"]);
            }
        });
        cell1.appendChild(input);

        var button = document.createElement("button");
        button.className = "delete-btn";
        button.textContent = "削除";
        button.onclick = function () {
            deleteRow_vari(this);
        };
        cell2.appendChild(button);
    }
}

// サイズのテーブルを生成
function generateSizeTable() {
    var table = document.getElementById("size-table");

    for (var i = 0; i < sizes.length; i++) {
        var row = table.insertRow();
        var cell1 = row.insertCell();
        var cell2 = row.insertCell();

        var input = document.createElement("input");
        input.type = "text";
        input.value = sizes[i];
        input.name = sizes[i];
        input.addEventListener("change", function () {
            if (stock_dict[item]["variation"][variations[0]][input.value]) {
                alert("すでに存在しています.");
                input.value = input.name;
            } else if (stock_dict[item]["variation"][variations[0]][input.name]) {
                variations.forEach(function (variation) {
                    stock_dict[item]["variation"][variation][input.value] = stock_dict[item]["variation"][variation][input.name];
                    delete stock_dict[item]["variation"][variation][input.name];
                });
                input.name = input.value;
                sizes = Object.keys(stock_dict[item]["variation"][variations[0]]);
            } else {
                variations.forEach(function (variation) {
                    stock_dict[item]["variation"][variation][input.value] = 0;
                });
                input.name = input.value;
                sizes = Object.keys(stock_dict[item]["variation"][variations[0]]);
            }
        });
        cell1.appendChild(input);

        var button = document.createElement("button");
        button.className = "delete-btn";
        button.textContent = "削除";
        button.setAttribute("class", "delete-btn")
        button.onclick = function () {
            deleteRow_size(this);
        };
        cell2.appendChild(button);
    }
}

// 行の削除
function deleteRow_vari(button, variation) {
    const tdElement = button.parentElement.previousElementSibling;
    const inputElement = tdElement.querySelector("input");
    const nameValue = inputElement.getAttribute("name");
    delete stock_dict[item]["variation"][nameValue];
    variations = Object.keys(stock_dict[item]["variation"]);
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function deleteRow_size(button, size) {
    const tdElement = button.parentElement.previousElementSibling;
    const inputElement = tdElement.querySelector("input");
    const nameValue = inputElement.getAttribute("name");
    variations.forEach(function (variation) {
        delete stock_dict[item]["variation"][variation][nameValue];
    })
    sizes = Object.keys(stock_dict[item]["variation"][variations[0]]);
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

// バリエーション行の追加
function addVariation() {
    var table = document.getElementById("variation-table");
    var row = table.insertRow();
    var cell1 = row.insertCell();
    var cell2 = row.insertCell();

    var input = document.createElement("input");
    input.type = "text";
    input.value = "";
    input.name = "";
    input.addEventListener("change", function () {
        if (stock_dict[item]["variation"][input.value]) {
            alert("すでに存在しています.");
            input.value = input.name;
        } else if (stock_dict[item]["variation"][input.name]) {
            stock_dict[item]["variation"][input.value] = stock_dict[item]["variation"][input.name];
            delete stock_dict[item]["variation"][input.name];
            input.name = input.value;
            variations = Object.keys(stock_dict[item]["variation"]);
        }
        else {
            stock_dict[item]["variation"][input.value] = {}
            sizes.forEach(function (size) {
                stock_dict[item]["variation"][input.value][size] = 0;
            })
            input.name = input.value;
            variations = Object.keys(stock_dict[item]["variation"]);
        }
    });
    cell1.appendChild(input);

    var button = document.createElement("button");
    button.className = "delete-btn";
    button.textContent = "削除";
    button.onclick = function () {
        deleteRow_size(this, sizes[i]);
    };
    cell2.appendChild(button);
}

// サイズ行の追加
function addSize() {
    var table = document.getElementById("size-table");
    var row = table.insertRow();
    var cell1 = row.insertCell();
    var cell2 = row.insertCell();

    var input = document.createElement("input");
    input.type = "text";
    input.value = "";
    input.name = "";
    input.addEventListener("change", function () {
        if (stock_dict[item]["variation"][variations[0]][input.value]) {
            alert("すでに存在しています.");
            input.value = input.name;
        } else if (stock_dict[item]["variation"][variations[0]][input.name]) {
            variations.forEach(function (variation) {
                stock_dict[item]["variation"][variation][input.value] = stock_dict[item]["variation"][variation][input.name];
                delete stock_dict[item]["variation"][variation][input.name];
            });
            input.name = input.value;
            sizes = Object.keys(stock_dict[item]["variation"][variations[0]]);
        } else {
            variations.forEach(function (variation) {
                stock_dict[item]["variation"][variation][input.value] = 0;
            });
            input.name = input.value;
            sizes = Object.keys(stock_dict[item]["variation"][variations[0]]);
        }
    });
    cell1.appendChild(input);

    var button = document.createElement("button");
    button.className = "delete-btn";
    button.textContent = "削除";
    button.onclick = function () {
        deleteRow(this);
    };
    cell2.appendChild(button);
}

function deleteItem(button) {
    const result = confirm("このアイテムを削除しますか?");
    if (result) {
        // 「はい」が選択された場合の処理
        const inputElement = document.getElementById("item");
        const nameValue = inputElement.getAttribute("name");
        delete stock_dict[nameValue];
    } else {
        // 「いいえ」が選択された場合の処理
    }
}

// 全てのテキストエリアの値を取得
function save() {
    // ローカルストレージにオブジェクトを保存する関数
    localStorage.setItem(key, JSON.stringify(stock_dict));
    // 指定したリンクにパラメータを追加して移動する関数
    const link = "./stock.html";
    const url = new URL(link, window.location.href);
    url.searchParams.append("get", "0");
    window.location.href = url.href;
}

