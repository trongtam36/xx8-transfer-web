XX8 — BẢN HTML TỰ CHỨA (2026-11-03)

GÓI TRIỂN KHAI:
  index.html: HTML + CSS + JS trong một file, không tải app.js/styles.css cũ.
  assets/background.mp4, assets/logo.jpg: tài nguyên gốc.
  CNAME: tên miền gốc (giữ nguyên).

CÁCH COMMIT:
1. Sao lưu repository/commit hiện tại.
2. Trong GitHub, mở index.html ở đúng nhánh và thư mục đang phát hành trong Settings > Pages.
3. Thay thế index.html bằng file này (có thể dùng Add file > Upload files ở đúng thư mục).
4. Chỉ thêm assets/CNAME nếu các tệp hiện có bị thiếu; đừng xóa file khác không liên quan.
5. Commit và chờ GitHub Actions/Pages công bố thành công.
6. Trên tên miền, Ctrl+U, tìm XX8-SINGLE-HTML-20261103-A. Nếu không có, trang đang chạy HTML cũ hoặc nguồn triển khai/cache khác.
7. Mở DevTools Console gõ: window.__XX8_DIAGNOSTICS__()

Không thực hiện giao dịch chuyển điểm thật. 5 sao/6 sao là hai trạng thái kết quả mô phỏng.
Checkbox trên trang không phải Cloudflare Turnstile thật.
