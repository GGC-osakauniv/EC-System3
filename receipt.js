const url = "https://jtwtn4tdkd.execute-api.ap-northeast-1.amazonaws.com/0630-1";
let receipt_obj = [];

function onload() {
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(function (data) {
            console.log(data);
            receipt_obj = data.receipt;
            maketable();
        })
        .catch(function (error) {
            // エラーハンドリングを行うコードをここに書く
            alert(error);
            return;
        });


}

function maketable() {
    //サーバー通信に置き換え

    const table = document.getElementById("table_m");
    tr_list = []
    let tr_count = 0;
    receipt_obj.forEach(function (purchase) {
        const tr = document.createElement("tr");
        const td_time = document.createElement("td");
        td_time.innerText = purchase.time;
        td_time.style.textAlign = "center";
        td_time.setAttribute("class", "cell_m" + (tr_count % 2).toString());
        tr.appendChild(td_time);
        const td_total = document.createElement("td");
        td_total.innerText = purchase.total.toString() + "円";
        td_total.style.textAlign = "center";
        td_total.setAttribute("class", "cell_m" + (tr_count % 2).toString());
        tr.appendChild(td_total)
        const td_num = document.createElement("td");
        td_num.innerText = purchase.items.length;
        td_num.style.textAlign = "center";
        td_num.setAttribute("class", "cell_m" + (tr_count % 2).toString());
        tr.appendChild(td_num);
        table.appendChild(tr);

    });
}
