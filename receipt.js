const url = "https://jtwtn4tdkd.execute-api.ap-northeast-1.amazonaws.com/0630-1";
const history_url = "history.html"
const key = "GGC/EC-system3/receipt"
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
            receipt_obj = data.receipt;
            localStorage.setItem(key, JSON.stringify(receipt_obj));
            maketable();
        })
        .catch(function (error) {
            // エラーハンドリングを行うコードをここに書く
            alert(error);
            return;
        });


}

function maketable() {
    const table = document.getElementById("table_m");
    tr_list = []
    let tr_count = 0;
    for (let i = receipt_obj.length - 1; i >= 0; i--) {
        const tr = document.createElement("tr");
        const td_time = document.createElement("td");
        const datetime = new Date(receipt_obj[i].time);
        const options = {
            timeZone: "Asia/Tokyo",
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        };
        const formatter = new Intl.DateTimeFormat("ja-JP", options);
        const formattedDateTime = formatter.format(datetime);
        var link = document.createElement('a');
        link.href = `${history_url}?num=${i}`;
        link.setAttribute("class", "item_link");
        link.textContent = formattedDateTime;
        td_time.appendChild(link);
        td_time.style.textAlign = "center";
        td_time.setAttribute("class", "cell_m" + (tr_count % 2).toString());
        tr.appendChild(td_time);
        const td_total = document.createElement("td");
        var link = document.createElement('a');
        link.href = `${history_url}?num=${i}`;
        link.setAttribute("class", "item_link");
        link.textContent = receipt_obj[i].total.toString() + "円";
        td_total.appendChild(link);
        td_total.style.textAlign = "center";
        td_total.setAttribute("class", "cell_m" + (tr_count % 2).toString());
        tr.appendChild(td_total)
        const td_num = document.createElement("td");
        var link = document.createElement('a');
        link.href = `${history_url}?num=${i}`;
        link.setAttribute("class", "item_link");
        link.textContent = receipt_obj[i].items.length;
        td_num.appendChild(link);
        td_num.style.textAlign = "center";
        td_num.setAttribute("class", "cell_m" + (tr_count % 2).toString());
        tr.appendChild(td_num);
        table.appendChild(tr);
    }
}
