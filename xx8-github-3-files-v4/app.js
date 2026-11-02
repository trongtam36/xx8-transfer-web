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
const demoModeStatus = document.getElementById('demoModeStatus');

// Trang này là bản mô phỏng: bật điều khiển quả bóng trên GitHub Pages
// và tên miền công khai, không yêu cầu thêm ?demo=1.
// Có thể dùng ?demo=0 để tắt điều khiển khi cần kiểm tra giao diện.
// 6 sao = mô phỏng thất bại; 5 sao = mô phỏng thành công.
// Không có giao dịch thực hay API/backend được gọi.
// Mặc định bật CHẾ ĐỘ MÔ PHỎNG trên GitHub Pages.
// Để khóa điều khiển mô phỏng khi kiểm tra: thêm ?demo=0.
// Đây không phải API xử lý chuyển điểm; không được dùng làm xác nhận giao dịch.
const BUILD = '20261103-clickfix4';
const params = new URLSearchParams(window.location.search);
const isDemoMode = params.get('demo') !== '0';
document.documentElement.classList.toggle('demo-mode', isDemoMode);

// Safari Private Mode, iframe, cấu hình privacy có thể chặn truy cập localStorage.
// Khi đó vẫn chạy bình thường; chỉ không lưu trạng thái qua lần tải lại.
let testModeSuccess = false;
if (isDemoMode) {
  try {
    testModeSuccess = window.localStorage.getItem('xx8_test_success') === '1';
  } catch (error) {
    console.warn('XX8: không truy cập được localStorage; sử dụng trạng thái tạm.', error);
  }
}
console.info(`[XX8] build ${BUILD}; demo=${isDemoMode}`);

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
  resultBall.title = testModeSuccess ? '5 sao · mô phỏng thành công' : '6 sao · mô phỏng thất bại';
  if (demoModeStatus) {
    demoModeStatus.textContent = isDemoMode
      ? (testModeSuccess ? '5 sao · Mô phỏng thành công · Bấm bóng để đổi' : '6 sao · Mô phỏng thất bại · Bấm bóng để đổi')
      : 'Chế độ mô phỏng đã tắt';
  }
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

  let x = offsetX + STAR_X * scale;
  let y = offsetY + STAR_Y * scale;
  // Che biểu tượng trên video ở màn hình đủ rộng.
  let size = Math.min(118, Math.max(76, STAR_COVER_NATIVE_SIZE * scale * 1.18));

  // Trên màn hình dọc, object-fit: cover cắt mất biểu tượng ở video gốc.
  // Thay vì ẩn nút, đặt nút vào góc dưới phải, vẫn bấm/tap được.
  const gutter = 14;
  const cropped = x - size / 2 < gutter || x + size / 2 > viewportW - gutter ||
                  y - size / 2 < gutter || y + size / 2 > viewportH - gutter;
  resultBall.classList.toggle('is-docked', cropped);
  if (cropped) {
    size = Math.min(size, 80, Math.max(52, viewportW / 4));
    x = viewportW - gutter - size / 2;
    y = viewportH - gutter - size / 2;
  }

  resultBall.style.left = `${x}px`;
  resultBall.style.top = `${y}px`;
  resultBall.style.width = `${size}px`;
  resultBall.style.height = `${size}px`;
  resultBall.style.visibility = 'visible';
}

// Quả bóng luôn có vị trí hợp lệ. Khi demo bật (mặc định), cho phép bấm đổi trạng thái.
resultBall.hidden = false;
updateBallState();
positionResultBall();
if (backgroundVideo) {
  backgroundVideo.addEventListener('loadedmetadata', positionResultBall);
}
window.addEventListener('resize', positionResultBall, { passive: true });
window.addEventListener('orientationchange', positionResultBall, { passive: true });
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', positionResultBall, { passive: true });
}

if (!isDemoMode) {
  resultBall.tabIndex = -1;
  resultBall.setAttribute('aria-hidden', 'true');
  resultBall.style.pointerEvents = 'none';
  resultBall.style.cursor = 'default';
  resultBall.title = '';
} else {
  resultBall.tabIndex = 0;
  resultBall.removeAttribute('aria-hidden');
  resultBall.style.pointerEvents = 'auto';
  resultBall.style.cursor = 'pointer';
  resultBall.style.zIndex = '16';
}

function toggleDemoBall(event) {
  if (!isDemoMode) return;
  event.preventDefault();
  event.stopPropagation();
  testModeSuccess = !testModeSuccess;
  try {
    window.localStorage.setItem('xx8_test_success', testModeSuccess ? '1' : '0');
  } catch (error) {
    console.warn('XX8: không lưu được trạng thái quả bóng.', error);
  }
  updateBallState();
}

// Button gốc đã tự sinh click cho Enter và Space.
// KHÔNG gắn thêm keydown, nếu không có thể toggle 2 lần.
resultBall.addEventListener('click', toggleDemoBall);

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
    message: 'Đây là kết quả thất bại trong chế độ mô phỏng. Không có giao dịch thực được thực hiện.',
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

  // Chỉ mô phỏng phản hồi: 5 sao = thành công, 6 sao = thất bại.
  // Không gửi yêu cầu đến bất kỳ hệ thống chuyển điểm nào.
  if (isDemoMode) {
    testModeSuccess ? showSuccess() : showFailure();
    return;
  }

  showDialog({
    title: 'CHƯA KẾT NỐI HỆ THỐNG',
    message: 'Đã tắt chế độ mô phỏng bằng ?demo=0. Trang chưa có API/backend để xử lý giao dịch thực.'
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
