# XX8 — Bản hoàn thiện đối chiếu 4 ảnh mẫu (R1)

## Chức năng
- Video nền sân vận động và logo gốc.
- Quả bóng màu trắng ở phía dưới bên phải; bấm bóng chuyển giữa 5 sao và 6 sao. Nút bóng không bị khóa trên website công khai, vẫn hiện khi màn hình dọc.
- Chọn 5 sao rồi gửi form hợp lệ: màn hình **CHUYỂN THÀNH CÔNG** (kết quả **mô phỏng**).
- Chọn 6 sao rồi gửi form hợp lệ: hộp thoại **THẤT BẠI** và dòng **Phát Sinh Giao Dịch Để Nhận CODE** (kết quả **mô phỏng**, không phải yêu cầu giao dịch).
- Giữ nguyên các điều kiện kiểm tra form gốc: nhập đủ 3 trường, hai tài khoản khác nhau, số điểm nguyên dương, ô xác nhận được tick.
- Bấm ĐÃ HIỂU để đóng thông báo hoặc ĐÓNG để về form. Trạng thái bóng được ghi nhớ nếu trình duyệt cho phép.

## Lưu ý minh bạch
Đây là **website mô phỏng giao diện**, không có kết nối backend, không chuyển điểm thật và không xác minh Cloudflare thực. Dòng chữ DEMO ở phần xác nhận và chú thích ở kết quả là bắt buộc để phân biệt giao diện mô phỏng với dịch vụ thực tế.

## Cách đưa lên GitHub Pages
1. Sao lưu nhánh/repository trước khi thay tệp.
2. Giải nén `xx8_COMMIT_READY_REFERENCE_R1.zip`. Tải **các tệp bên trong ZIP** (không tải nguyên thư mục cha) lên thư mục gốc `main` nếu Pages dùng `main/(root)`.
3. Chọn **Commit changes**. Kiểm tra **Settings > Pages** để chắc chắn đúng source. Nếu Pages dùng Actions, theo dõi Actions.
4. Mở `view-source:https://codexx8.live/`, tìm `XX8-SCREEN-REFERENCE-COMMIT-R1`. Nếu không có thì website đang tải bản khác/cache cũ.
5. Có thể kiểm tra file phiên bản mới theo `styles.css?v=20261103-screen-reference-r1`, `app.js?v=20261103-screen-reference-r1` trong tab Network.
6. Kiểm tra bằng tab ẩn danh; nếu dùng CDN thì xóa cache trang chủ.

## File
- `index.html`, `styles.css`, `app.js`: giao diện và logic.
- `assets/logo.jpg`, `assets/background.mp4`: tài nguyên cần có, không đổi.
- `CNAME`: giữ nguyên tên miền của dự án trước đó.

Chỉ tải ZIP này khi muốn thay đổi mô phỏng đã mô tả; không trộn file với các gói V3–V6.
