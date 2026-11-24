// ===== ตั้งค่าร้าน (แก้ตรงนี้) =====
const PRICE = 200; // ราคาต่อขวด (ข้อมูลสมมติ)
const LINE_ID = "@yourshop"; // Line OA ของร้าน เช่น @honeyshop
// ==================================

let qty = 1;

const qtyEl = document.getElementById("qty");
const totalEl = document.getElementById("total");

document.getElementById("unit-price").textContent = PRICE.toLocaleString("th-TH");

function update() {
  qtyEl.textContent = qty;
  totalEl.textContent = (qty * PRICE).toLocaleString("th-TH");
}

document.getElementById("plus").addEventListener("click", () => {
  if (qty < 99) qty++;
  update();
});

document.getElementById("minus").addEventListener("click", () => {
  if (qty > 1) qty--;
  update();
});

document.getElementById("order-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  const message =
    `สั่งซื้อน้ำผึ้งป่า 700 ml\n` +
    `จำนวน: ${qty} ขวด\n` +
    `ยอดสินค้า: ${(qty * PRICE).toLocaleString("th-TH")} บาท (ยังไม่รวมค่าส่ง)\n\n` +
    `ชื่อ: ${name}\n` +
    `เบอร์โทร: ${phone}\n` +
    `ที่อยู่: ${address}`;

  // คัดลอกข้อความไว้ เผื่อ Line ไม่เติมข้อความให้
  if (navigator.clipboard) navigator.clipboard.writeText(message).catch(() => {});

  const url = `https://line.me/R/oaMessage/${encodeURIComponent(LINE_ID)}/?${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});

update();