function onload() {
    maketable();
}

function maketable() {
    //サーバー通信に置き換え
    stock_dict = JSON.parse(localStorage.getItem('stock'));
    const table = document.getElementById("table_m");
    const items = Object.keys(stock_dict).sort();
    tr_list = []
    let tr_count = 0;
    let item_count = 0;
    items.forEach(function (item) {
        const variations = Object.keys(stock_dict[item]["variation"]);
        let row_count_variation = 0;
        variations.forEach(function (variation) {
            const sizes = Object.keys(stock_dict[item]["variation"][variation]);
            sizes.forEach(function (size) {
                const tr = document.createElement("tr");
                const td_size = document.createElement("td");
                td_size.innerText = size;
                td_size.setAttribute("class", "cell_m" + (item_count % 2).toString());
                tr.appendChild(td_size);
                const td_stock = document.createElement("td");
                td_stock.innerText = stock_dict[item]["variation"][variation][size];
                td_stock.setAttribute("class", "cell_m" + (item_count % 2).toString());
                tr.appendChild(td_stock);
                tr_list.push(tr);
                tr_count += 1;
                row_count_variation += 1
            });
            const top_variation = tr_count - sizes.length;
            const td_variation = document.createElement("td");
            td_variation.innerText = variation;
            td_variation.setAttribute("rowspan", sizes.length);
            td_variation.setAttribute("class", "cell_m" + (item_count % 2).toString());
            tr_list[top_variation].prepend(td_variation);
        });
        const top_item = tr_count - row_count_variation;
        const td_item = document.createElement("td");
        td_item.innerText = item;
        td_item.setAttribute("rowspan", row_count_variation);
        td_item.setAttribute("class", "cell_m" + (item_count % 2).toString());
        tr_list[top_item].prepend(td_item);
        item_count += 1;
    });
    tr_list.forEach(function (tr) {
        table.appendChild(tr);
    });
}