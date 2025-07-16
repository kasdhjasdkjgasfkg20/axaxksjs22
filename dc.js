window.addEventListener("DOMContentLoaded", function () {
  let selectedBet = null;
  let selectedAmount = null;
  let androidApps = [];
  let iosApps = [];
  let countdownInterval;
  let leftPage = false;

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      leftPage = true; // Người dùng đã rời khỏi tab → có thể là mở app
    }
  });

  // const bankDeepLinks = {
  //   ABBANK: "https://dl.vietqr.io/pay?app=abb",
  //   ACB: "https://dl.vietqr.io/pay?app=acb",
  //   AGRIBANK: "https://dl.vietqr.io/pay?app=vba",
  //   BAOVIET: "https://dl.vietqr.io/pay?app=bvb",
  //   BIDV: "https://dl.vietqr.io/pay?app=bidv",
  //   CAKE: "https://dl.vietqr.io/pay?app=cake",
  //   COOPBANK: "https://dl.vietqr.io/pay?app=coopbank",
  //   EXIMBANK: "https://dl.vietqr.io/pay?app=eib",
  //   HDBANK: "https://dl.vietqr.io/pay?app=hdb",
  //   KIENLONG: "https://dl.vietqr.io/pay?app=klb",
  //   LPB: "https://dl.vietqr.io/pay?app=lpb",
  //   MB: "https://dl.vietqr.io/pay?app=mb",
  //   MYVIB: "https://dl.vietqr.io/pay?app=vib",
  //   MYVIB2: "https://dl.vietqr.io/pay?app=vib-2",
  //   NAMA: "https://dl.vietqr.io/pay?app=nab",
  //   NCB: "https://dl.vietqr.io/pay?app=ncb",
  //   OCB: "https://dl.vietqr.io/pay?app=ocb",
  //   OCEANBANK: "https://dl.vietqr.io/pay?app=oceanbank",
  //   PBVN: "https://dl.vietqr.io/pay?app=pbvn",
  //   PVCB: "https://dl.vietqr.io/pay?app=pvcb",
  //   SCB: "https://dl.vietqr.io/pay?app=scb",
  //   SGB: "https://dl.vietqr.io/pay?app=sgicb",
  //   SEABANK: "https://dl.vietqr.io/pay?app=seab",
  //   SHB: "https://dl.vietqr.io/pay?app=shb",
  //   SHINHAN: "https://dl.vietqr.io/pay?app=shbvn",
  //   TECHCOMBANK: "https://dl.vietqr.io/pay?app=tcb",
  //   TIMO: "https://dl.vietqr.io/pay?app=timo",
  //   TPB: "https://dl.vietqr.io/pay?app=tpb",
  //   VAB: "https://dl.vietqr.io/pay?app=vab",
  //   VCB: "https://dl.vietqr.io/pay?app=vcb",
  //   VTB: "https://dl.vietqr.io/pay?app=icb",
  //   VIETBANK: "https://dl.vietqr.io/pay?app=vietbank",
  //   VPB: "https://dl.vietqr.io/pay?app=vpb",
  //   WOORI: "https://dl.vietqr.io/pay?app=wvn",
  // };
  function formatMoney(amount) {
    return new Intl.NumberFormat("vi-VN").format(amount);
  }
  function showNotification(message, iconClass = "fa-check-circle") {
    const notification = document.getElementById("notification");
    const iconEl = notification.querySelector(".notification-icon");
    const textEl = notification.querySelector(".notification-text");
    iconEl.innerHTML = `<i class="fas ${iconClass}" style="color: #141ed2;"></i>`;
    textEl.textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }
  function updatePlaceBetButton() {
    const btn = document.getElementById("placeBetBtn");
    const isValid =
      selectedBet && selectedAmount >= 20000 && selectedAmount <= 10000000;
    btn.disabled = !isValid;
    if (isValid) {
      btn.innerHTML = `<span>ĐẶT CƯỢC</span>`;
    } else {
      btn.innerHTML = `<span>ĐẶT CƯỢC</span>`;
    }
  }
  function updateLimitInfo() {
    const infoBox = document.getElementById("limitInfo");
    if (!infoBox) return;
    const icon = infoBox.querySelector("i");
    const text = infoBox.querySelector("span");
    if (selectedBet && selectedAmount >= 20000) {
      const betText = selectedBet === "even" ? "Chẵn" : "Lẻ";
      icon.className = "fas fa-check-circle text-success";
      text.textContent = `Sẵn sàng cược: ${betText} ${formatMoney(
        selectedAmount
      )}`;
    } else {
      icon.className = "fas fa-info-circle text-primary";
      text.textContent =
        "Vui lòng chọn cửa cược và nhập số tiền để bắt đầu chơi";
    }
  }

  // Tải danh sách app từ API vietqr.io
  fetch("https://api.vietqr.io/v2/android-app-deeplinks")
    .then((res) => res.json())
    .then((data) => (androidApps = data.apps));

  fetch("https://api.vietqr.io/v2/ios-app-deeplinks")
    .then((res) => res.json())
    .then((data) => (iosApps = data.apps));

  document.querySelectorAll(".bet-option").forEach((option) => {
    option.addEventListener("click", function () {
      const allOptions = document.querySelectorAll(".bet-option");
      allOptions.forEach((o) => {
        o.classList.remove("selected", "faded");
      });
      this.classList.add("selected");
      selectedBet = this.dataset.bet;
      allOptions.forEach((o) => {
        if (!o.classList.contains("selected")) {
          o.classList.add("faded");
        }
      });
      const betType = this.dataset.bet === "even" ? "CHẴN" : "LẺ";
      showNotification(`Đã chọn cược ${betType}`, "fa-coins");
      updatePlaceBetButton();
      updateLimitInfo();
    });
  });
  document.querySelectorAll(".quick-amount").forEach((amount) => {
    amount.addEventListener("click", function () {
      const value = parseInt(this.dataset.amount);
      document.getElementById("betAmount").value = formatMoney(value);
      document
        .querySelectorAll(".quick-amount")
        .forEach((a) => a.classList.remove("selected"));
      this.classList.add("selected");
      selectedAmount = value;
      showNotification(`Đã chọn ${formatMoney(value)} VND`, "fa-coins");
      updatePlaceBetButton();
      updateLimitInfo();
    });
  });
  document.getElementById("betAmount").addEventListener("input", function () {
    const value = this.value.replace(/[^0-9]/g, "");
    if (value) {
      selectedAmount = parseInt(value);
      this.value = formatMoney(selectedAmount);
    } else {
      selectedAmount = null;
      this.value = "";
    }
    document
      .querySelectorAll(".quick-amount")
      .forEach((a) => a.classList.remove("selected"));
    updatePlaceBetButton();
    updateLimitInfo();
  });
  function showQRModal(amount, betType) {
    const userBank = localStorage.getItem("selectedBankAppId") || "mb";
    const accountNumber =
      localStorage.getItem("accountNumber") || "36364625625";
    const accountName = localStorage.getItem("accountName") || "BUI HAI TRONG";
    const userInputAccount =
      localStorage.getItem("userAccountNumber") || "0000000000";
    const bankCode = userBank;
    const note = `${userInputAccount} ${betType === "even" ? "C" : "L"}`;
    const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(
      note
    )}&accountName=${encodeURIComponent(accountName)}`;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      const canvas = document.getElementById("qrCanvas");
      const ctx = canvas.getContext("2d");
      const cropX = 50,
        cropY = 75,
        cropWidth = img.width - 100,
        cropHeight = img.height - 150;
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
      document.getElementById("qrModal").style.display = "flex";
      startCountdown(600);
      document.getElementById("qrNote").textContent = note;
      document.getElementById("qrAmount").textContent =
        formatMoney(amount) + " VND";
    };
    img.src = qrUrl;
  }
  function closeQRModal() {
    document.getElementById("qrModal").style.display = "none";
    clearInterval(countdownInterval);
    selectedBet = null;
    selectedAmount = null;
    document.querySelectorAll(".bet-option").forEach((option) => {
      option.classList.remove("selected", "faded");
    });
    document.querySelectorAll(".quick-amount").forEach((btn) => {
      btn.classList.remove("selected");
    });
    const amountInput = document.getElementById("betAmount");
    if (amountInput) amountInput.value = "";
    updateLimitInfo();
    updatePlaceBetButton();
  }
  function downloadQR() {
    const canvas = document.getElementById("qrCanvas");
    const link = document.createElement("a");
    link.download = "mbmmo_store.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }
  function openBankApp() {
    const selectedBankAppId = localStorage.getItem("selectedBankAppId");
    if (!selectedBankAppId) {
      Swal.fire({
        icon: "error",
        title: "Không có thông tin ngân hàng",
        text: "Vui lòng quay lại và chọn ngân hàng trước khi đặt cược.",
      });
      return;
    }
    const bankLink = getBankDeepLink(selectedBankAppId);
    if (!bankLink) {
      Swal.fire({
        icon: "error",
        title: "Không tìm thấy link mở app",
        text: "Ứng dụng ngân hàng bạn chọn không được hỗ trợ.",
      });
      return;
    }
    window.location.href = bankLink;

    setTimeout(() => {
      if (leftPage) {
        // Người dùng đã rời tab → có thể mở app thành công
        downloadQR();
      } else {
        // Không rời tab → mở app thất bại → hiển thị cảnh báo
        Swal.fire({
          title: "Ứng dụng chưa được cài đặt",
          html: `
        <p>Không thể mở ứng dụng <b>${selectedBankAppId.toUpperCase()}</b>.</p>
        <p>Vui lòng cài đặt ứng dụng hoặc quét mã QR.</p>
        <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <a href="https://play.google.com/store/search?q=${selectedBankAppId}&c=apps" target="_blank" style="
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 16px;
                border-radius: 8px;
                background-color: #34a853;
                color: white;
                text-decoration: none;
                font-weight: bold;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: background-color 0.2s ease;
            " onmouseover="this.style.backgroundColor='#2c8e45'" onmouseout="this.style.backgroundColor='#34a853'">
                <i class="fab fa-google-play"></i> Android
            </a>
            <a href="https://apps.apple.com/vn/search?term=${selectedBankAppId}" target="_blank" style="
                display: flex;
                align-items: center;
                gap: 8px; 
                padding: 10px 16px;
                border-radius: 8px;
                background-color: #007aff;
                color: white;
                text-decoration: none;
                font-weight: bold;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: background-color 0.2s ease;
            " onmouseover="this.style.backgroundColor='#0062cc'" onmouseout="this.style.backgroundColor='#007aff'">
                <i class="fab fa-apple"></i> iOS
            </a>
        </div>
      `,
          icon: "warning",
          confirmButtonText: "Đã hiểu",
          showCancelButton: false,
          backdrop: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    }, 1000);
  }
  function startCountdown(seconds) {
    const countdown = document.getElementById("countdown");
    const qrCanvas = document.getElementById("qrCanvas");
    const qrButtons = document.querySelector(".qr-btn-row");
    const copyableInfos = document.querySelectorAll(".copyable-info");
    let remaining = seconds;
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      countdown.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
      if (--remaining < 0) {
        clearInterval(countdownInterval);
        countdown.textContent = "Đã hết hạn";
        qrCanvas.style.display = "none";
        copyableInfos.forEach((info) => {
          info.style.display = "none";
        });
        const expiredMessage = document.createElement("div");
        expiredMessage.innerHTML = `
                <div style="color:red; font-weight:bold; margin:20px 0; text-align:center; background:#ffeeee; border-radius:8px;">
                    Mã đã hết hiệu lực. Vui lòng đặt cược lại!
                </div>
            `;
        document.querySelector(".qr-img-container").innerHTML = "";
        document.querySelector(".qr-img-container").appendChild(expiredMessage);
        const buttons = document.querySelectorAll(".qr-btn");
        buttons.forEach((btn) => {
          if (!btn.classList.contains("qr-close-btn")) {
            btn.style.display = "none";
          }
        });
        document.querySelector(".qr-modal-content h3").style.display = "none";
        document.querySelector(".qr-countdown").style.display = "none";
      }
    }, 1000);
  }
  document.getElementById("placeBetBtn").addEventListener("click", function () {
    if (!this.disabled) {
      const betType = selectedBet === "even" ? "CHẴN" : "LẺ";
      showNotification("Đang tạo mã QR thanh toán...", "fa-qrcode");
      showQRModal(selectedAmount, selectedBet);
    }
  });
  function copyToClipboard(text, element) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        element.classList.add("copied");
        setTimeout(() => {
          element.classList.remove("copied");
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  }
  document
    .getElementById("copyAccountNumber")
    .addEventListener("click", function () {
      const text = document.getElementById("qrAccountNumber").textContent;
      copyToClipboard(text, this);
    });
  document
    .getElementById("copyAccountName")
    .addEventListener("click", function () {
      const text = document.getElementById("qrAccountName").textContent;
      copyToClipboard(text, this);
    });
  document.getElementById("copyAmount").addEventListener("click", function () {
    const text = document
      .getElementById("qrAmount")
      .textContent.replace(" VND", "");
    copyToClipboard(text, this);
  });
  document.getElementById("copyNote").addEventListener("click", function () {
    const text = document.getElementById("qrNote").textContent;
    copyToClipboard(text, this);
  });
  window.openBankApp = openBankApp;
  window.closeQRModal = closeQRModal;

  function getBankDeepLink(appId) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const apps = isIOS ? iosApps : androidApps;
    const app = apps.find(
      (app) => app.appId.toLowerCase() === appId.toLowerCase()
    );
    return app?.deeplink || null;
  }
});
function dimQRModal() {
  const modal = document.getElementById("qrModal");
  modal.style.opacity = "0.3";
  modal.style.pointerEvents = "none";
}
function restoreQRModal() {
  const modal = document.getElementById("qrModal");
  modal.style.opacity = "1";
  modal.style.pointerEvents = "auto";
}
