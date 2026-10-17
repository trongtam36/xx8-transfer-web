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
const dialogConfirm = document.getElementById('dialogConfirm');
const closeSuccess = document.getElementById('closeSuccess');
const backgroundVideo = document.getElementById('backgroundVideo');
const resultBall = document.getElementById('resultBall');

// Điều khiển kết quả chỉ dùng khi chạy LOCAL.
// Bóng trắng 6 sao = thất bại; bóng trắng 5 sao = thành công.
const isLocalTest = ['localhost', '127.0.0.1', '::1', ''].includes(window.location.hostname);
let testModeSuccess = isLocalTest && localStorage.getItem('xx8_test_success') === '1';

// Tâm biểu tượng ngôi sao trong video gốc 1280x720.
// JavaScript quy đổi tọa độ này theo object-fit: cover nên quả bóng vẫn
// nằm đúng vị trí khi đổi độ phân giải/cửa sổ.
const STAR_X = 1160;
const STAR_Y = 600;
const STAR_COVER_NATIVE_SIZE = 62;

function updateBallState() {
  resultBall.classList.toggle('is-success', testModeSuccess);
  resultBall.setAttribute('aria-pressed', testModeSuccess ? 'true' : 'false');
  resultBall.setAttribute(
    'aria-label',
    testModeSuccess ? 'Quả bóng 5 sao: trạng thái thành công' : 'Quả bóng 6 sao: trạng thái thất bại'
  );
  resultBall.title = testModeSuccess ? '5 sao' : '6 sao';
}

function positionResultBall() {
  if (!backgroundVideo) return;

  const nativeW = backgroundVideo.videoWidth || 1280;
  const nativeH = backgroundVideo.videoHeight || 720;
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const scale = Math.max(viewportW / nativeW, viewportH / nativeH);
  const renderedW = nativeW * scale;
  const renderedH = nativeH * scale;
  const offsetX = (viewportW - renderedW) / 2;
  const offsetY = (viewportH - renderedH) / 2;

  const x = offsetX + STAR_X * scale;
  const y = offsetY + STAR_Y * scale;
  // Lớn hơn ngôi sao một khoảng để che kín hoàn toàn, nhưng không quá cồng kềnh.
  const size = Math.min(118, Math.max(76, STAR_COVER_NATIVE_SIZE * scale * 1.18));

  resultBall.style.left = `${x}px`;
  resultBall.style.top = `${y}px`;
  resultBall.style.width = `${size}px`;
  resultBall.style.height = `${size}px`;

  // Nếu tọa độ bị crop khỏi viewport ở màn hình dọc, ẩn quả bóng cùng biểu tượng.
  const margin = size * 0.6;
  resultBall.style.visibility = (x < -margin || x > viewportW + margin || y < -margin || y > viewportH + margin) ? 'hidden' : 'visible';
}

// Quả bóng luôn hiển thị trên cả localhost và GitHub Pages.
// Trên public nó chỉ là chi tiết giao diện; không dùng để điều khiển kết quả.
resultBall.hidden = false;
updateBallState();
positionResultBall();
backgroundVideo.addEventListener('loadedmetadata', positionResultBall);
window.addEventListener('resize', positionResultBall, { passive: true });

if (!isLocalTest) {
  resultBall.tabIndex = -1;
  resultBall.setAttribute('aria-hidden', 'true');
  resultBall.style.pointerEvents = 'none';
  resultBall.title = '';
}

resultBall.addEventListener('click', () => {
  if (!isLocalTest) return;
  testModeSuccess = !testModeSuccess;
  localStorage.setItem('xx8_test_success', testModeSuccess ? '1' : '0');
  updateBallState();
});

function showDialog({ title = 'Vui lòng kiểm tra lại', message, icon = '!' }) {
  dialogTitle.textContent = title;
  dialogMessage.textContent = message;
  dialogIcon.textContent = icon;
  dialogBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => dialogConfirm.focus());
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
    icon: '×'
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

  // Trên localhost: dùng công tắc TEST.
  // Khi triển khai thật, thay đoạn này bằng kết quả trả về từ API/backend.
  if (isLocalTest) {
    testModeSuccess ? showSuccess() : showFailure();
    return;
  }

  showDialog({
    title: 'CHƯA KẾT NỐI HỆ THỐNG',
    message: 'Bản public cần kết nối API/backend để xác định giao dịch thành công hay thất bại.'
  });
});

dialogConfirm.addEventListener('click', hideDialog);
closeSuccess.addEventListener('click', resetToForm);

dialogBackdrop.addEventListener('click', (event) => {
  if (event.target === dialogBackdrop) hideDialog();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !dialogBackdrop.hidden) hideDialog();
});
