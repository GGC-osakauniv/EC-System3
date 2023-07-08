let key = "GGC/EC-system3/receipt";

document.addEventListener("DOMContentLoaded", function () {
    let url = new URL(window.location.href);
    let params = url.searchParams;
    let rawData = localStorage.getItem(key);
    let num = params.get('num');
    let receipt_obj = JSON.parse(rawData);
    let historyData = receipt_obj[parseInt(num)];

    const historyContainer = document.getElementById("history");

    // 時間のフォーマット変換
    const datetime = new Date(historyData.time);
    const formattedDatetime = datetime.toLocaleString("ja-JP", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

    // 合計金額の表示
    const formattedTotal = historyData.total.toLocaleString("ja-JP", { style: "currency", currency: "JPY" });

    // 履歴データの表示
    const historyHTML = `
      <p>購入日時: ${formattedDatetime}</p>
      <p>合計金額: ${formattedTotal}</p>
      <table class="table_m">
        <tr>
          <th class="cell_h">商品名</th>
          <th class="cell_h">バリエーション</th>
          <th class="cell_h">サイズ</th>
          <th class="cell_h">数量</th>
        </tr>
        ${historyData.items.map(item => `
          <tr>
            <td class="cell_m0">${item.name}</td>
            <td class="cell_m0">${item.variation}</td>
            <td class="cell_m0">${item.size}</td>
            <td class="cell_m0">${item.num}</td>
          </tr>
        `).join("")}
      </table>
    `;

    historyContainer.innerHTML = historyHTML;
});
