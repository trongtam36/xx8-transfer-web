// XX8-DEPLOY-20261103-R2
// Mô phỏng giao diện tĩnh, không có API hay xử lý chuyển điểm thật.
// Quả bóng 5 sao => giao diện thành công, 6 sao => hộp thoại thất bại.
'use strict';
const form = document.getElementById('transferForm');
const formView = document.getElementById('formView');
const successView = document.getElementById('successView');
const sourceAccount = document.getElementById('sourceAccount');
const targetAccount = document.getElementById('targetAccount');
const points = document.getElementById('points');
const humanCheck = document.getElementById('humanCheck');
const dialogBackdrop = document.getElementById('dialogBackdrop');
const dialogTitle = document.getElementById('dialogTitle');
const dialogMessage = document.getElementById('dialogMessage');
const dialogIcon = document.getElementById('dialogIcon');
const dialogDisclaimer = document.getElementById('dialogDisclaimer');
const dialogConfirm = document.getElementById('dialogConfirm');
const closeSuccess = document.getElementById('closeSuccess');
const backgroundVideo = document.getElementById('backgroundVideo');
const resultBall = document.getElementById('resultBall');

const STORAGE_KEY = 'xx8_test_success';
let testModeSuccess = false; // Mặc định: 6 sao, thất bại.
try {
  testModeSuccess = window.localStorage.getItem(STORAGE_KEY) === '1';
} catch (_) {
  // Không có quyền truy cập bộ nhớ (ví dụ một số tab ẩn danh).
}

function updateBallState() {
  resultBall.classList.toggle('is-success', testModeSuccess);
  resultBall.setAttribute('aria-pressed', String(testModeSuccess));
  resultBall.setAttribute('aria-label', testModeSuccess
    ? 'Quả bóng 5 sao. Nhấn để đổi sang 6 sao (thất bại mô phỏng)'
    : 'Quả bóng 6 sao. Nhấn để đổi sang 5 sao (thành công mô phỏng)');
  resultBall.title = testModeSuccess ? '5 sao' : '6 sao';
}

// Tọa độ vị trí quả bóng trong video 1280 x 720; object-fit: cover.
// Trên màn hình nhỏ, luôn đưa bóng vào góc an toàn, không bao giờ ẩn nó.
const STAR_X = 1160;
const STAR_Y = 588;
const STAR_SIZE = 62;
function positionResultBall() {
  const viewportW = document.documentElement.clientWidth || window.innerWidth;
  const viewportH = window.innerHeight;
  const nativeW = (backgroundVideo && backgroundVideo.videoWidth) || 1280;
  const nativeH = (backgroundVideo && backgroundVideo.videoHeight) || 720;
  const scale = Math.max(viewportW / nativeW, viewportH / nativeH);
  const x = (viewportW - nativeW * scale) / 2 + STAR_X * scale;
  const y = (viewportH - nativeH * scale) / 2 + STAR_Y * scale;
  const maxSize = Math.min(98, Math.max(66, Math.min(viewportW, viewportH) * 0.24));
  const size = Math.min(maxSize, Math.max(72, STAR_SIZE * scale * 1.18));
  const pad = 12;
  let finalX = x, finalY = y;
  if (!Number.isFinite(x) || !Number.isFinite(y)
    || x - size / 2 < pad || x + size / 2 > viewportW - pad
    || y - size / 2 < pad || y + size / 2 > viewportH - pad) {
    finalX = viewportW - size / 2 - pad;
    finalY = viewportH - size / 2 - pad;
  }
  finalX = Math.max(size / 2 + 3, Math.min(viewportW - size / 2 - 3, finalX));
  finalY = Math.max(size / 2 + 3, Math.min(viewportH - size / 2 - 3, finalY));
  resultBall.style.left = `${finalX}px`;
  resultBall.style.top = `${finalY}px`;
  resultBall.style.width = `${size}px`;
  resultBall.style.height = `${size}px`;
}

// Button luôn nhận bấm trên trang công khai, kể cả không có ?demo=1.
resultBall.hidden = false;
resultBall.disabled = false;
resultBall.tabIndex = 0;
updateBallState();
positionResultBall();
if (backgroundVideo) backgroundVideo.addEventListener('loadedmetadata', positionResultBall);
window.addEventListener('resize', positionResultBall, { passive: true });
window.addEventListener('orientationchange', positionResultBall, { passive: true });
resultBall.addEventListener('click', () => {
  testModeSuccess = !testModeSuccess;
  try { window.localStorage.setItem(STORAGE_KEY, testModeSuccess ? '1' : '0'); } catch (_) {}
  updateBallState();
});
// Không bắt thêm keydown: thẻ <button> hỗ trợ chuột, chạm, Enter và Space sẵn.

function showDialog({ title = 'Vui lòng kiểm tra lại', message, icon = '!', simulation = false }) {
  dialogTitle.textContent = title;
  dialogMessage.textContent = message;
  dialogIcon.textContent = icon;
  dialogDisclaimer.hidden = !simulation;
  dialogBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  window.requestAnimationFrame(() => dialogConfirm.focus());
}
function hideDialog() {
  dialogBackdrop.hidden = true;
  document.body.style.overflow = '';
}
function formatDate(date) {
  const pad = (v) => String(v).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}
function showSuccess() {
  document.getElementById('resultSource').textContent = sourceAccount.value.trim();
  document.getElementById('resultTarget').textContent = targetAccount.value.trim();
  document.getElementById('resultPoints').textContent = Number(points.value).toLocaleString('vi-VN');
  document.getElementById('successDate').textContent = formatDate(new Date());
  formView.hidden = true;
  formView.classList.remove('view-active');
  successView.hidden = false;
  successView.classList.add('view-active');
}
function showFailure() {
  showDialog({
    title: 'THẤT BẠI',
    message: 'Phát Sinh Giao Dịch Để Nhận CODE',
    icon: '×',
    simulation: true
  });
}
function resetToForm() {
  form.reset();
  successView.hidden = true;
  successView.classList.remove('view-active');
  formView.hidden = false;
  formView.classList.add('view-active');
  sourceAccount.focus();
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const source = sourceAccount.value.trim();
  const target = targetAccount.value.trim();
  const pointValue = Number(points.value);
  // Điều kiện kiểm tra form gốc - giữ nguyên.
  if (!source || !target || !points.value) {
    showDialog({ message: 'Vui lòng nhập đầy đủ tài khoản nguồn, tài khoản đến và số điểm chuyển.' });
    return;
  }
  if (source === target) {
    showDialog({ message: 'Tài khoản nguồn và tài khoản đến phải khác nhau.' });
    return;
  }
  if (!Number.isFinite(pointValue) || pointValue <= 0 || !Number.isInteger(pointValue)) {
    showDialog({ message: 'Số điểm chuyển phải là số nguyên lớn hơn 0.' });
    return;
  }
  if (!humanCheck.checked) {
    showDialog({ message: 'Vui lòng xác nhận bạn là người dùng trước khi chuyển điểm.' });
    return;
  }
  if (testModeSuccess) showSuccess(); else showFailure();
});
dialogConfirm.addEventListener('click', hideDialog);
closeSuccess.addEventListener('click', resetToForm);
dialogBackdrop.addEventListener('click', (event) => {
  if (event.target === dialogBackdrop) hideDialog();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !dialogBackdrop.hidden) hideDialog();
});

// Phiên bản công khai, dùng để xác nhận đúng JavaScript mới.
window.__XX8_BUILD__ = 'XX8-DEPLOY-20261103-R2';
