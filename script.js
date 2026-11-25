// ===== ตั้งค่าร้าน (แก้ตรงนี้) =====
const PRICE = 200; // ราคาต่อขวด (ข้อมูลสมมติ)
const LINE_ID = "@151usvbw"; // Line OA ของร้าน เช่น @honeyshop
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

// ===== สไลด์ภาพ =====
const slider = document.getElementById("slider");

if (slider) {
  const track = slider.querySelector(".slides");
  const slides = slider.querySelectorAll(".slide");
  const dotsBox = slider.querySelector(".dots");
  const INTERVAL = 5000; // เวลาค้างภาพก่อนเลื่อนอัตโนมัติ (5 วินาที)

  let index = 0;
  let timer = null;

  // สร้างจุดตามจำนวนภาพ
  dotsBox.innerHTML = ""; // เคลียร์จุดเก่าเผื่อโค้ดรันซ้ำ
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `ภาพที่ ${i + 1}`);
    dot.addEventListener("click", () => {
      goTo(i);
      start();
    });
    dotsBox.appendChild(dot);
  });
  const dots = dotsBox.querySelectorAll("button");

  function goTo(i) {
    index = (i + slides.length) % slides.length; // วนกลับต้น/ท้าย
    // ใช้ translate3d เพื่อให้การ์ดจอช่วยประมวลผล (ลื่นกว่า translateX)
    track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
    dots.forEach((d, k) => d.classList.toggle("active", k === index));
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function start() {
    stop(); // บังคับหยุดตัวเก่าก่อนเริ่มใหม่เสมอ ป้องกันอาการเด้งแย่งกันเลื่อน
    timer = setInterval(() => goTo(index + 1), INTERVAL);
  }

  slider.querySelector(".prev").addEventListener("click", () => {
    goTo(index - 1);
    start();
  });
  slider.querySelector(".next").addEventListener("click", () => {
    goTo(index + 1);
    start();
  });

  // ชี้เมาส์แล้วหยุดเลื่อน
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);

  // ปัดนิ้วบนมือถือ
  let startX = 0;
  slider.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      stop();
    },
    { passive: true }
  );
  slider.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) goTo(diff < 0 ? index + 1 : index - 1);
    start();
  });

  goTo(0);
  start();
}

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

  if (navigator.clipboard) navigator.clipboard.writeText(message).catch(() => {});

const url = `https://line.me/R/oaMessage/${LINE_ID}/?${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});

update();