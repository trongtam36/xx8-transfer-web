# XX8 R2 — Bản triển khai chống trộn phiên bản (ngày 03/11/2026)

Mã nhận diện: `XX8-DEPLOY-20261103-R2`.

## Vấn đề đã xác định từ ảnh
Ảnh của người dùng có hộp thoại `CHƯA KẾT NỐI HỆ THỐNG`. Chuỗi này xuất hiện trong `app.js` của bản cũ và **không có** trong bản R1 hoặc R2. Vì vậy ảnh là bằng chứng rằng website đang thực thi logic JavaScript cũ. Không thể sửa lỗi đó chỉ bằng việc chỉnh vị trí quả bóng.

## Điều gì được giữ nguyên
- Giao diện sân vận động, form, logo và video của R1.
- Bấm bóng để chuyển 5 sao / 6 sao.
- Nhập dữ liệu, tích xác nhận, nhấn CHUYỂN ĐIỂM: 5 sao hiện kết quả thành công mô phỏng; 6 sao hiện kết quả thất bại mô phỏng.
- Kiểm tra dữ liệu form như trước. Không có API, không chuyển điểm thật hoặc xác minh Cloudflare thật.

## R2 khác R1 ở điểm nào
- index.html chỉ gọi `xx8-app-20261103-r2.js` và `xx8-style-20261103-r2.css`, là **tên tệp mới**, tránh cache URL app.js/styles.css cũ.
- Vẫn cung cấp app.js và styles.css cùng nội dung tương ứng để hỗ trợ thay thế các file đang có, nhưng bản R2 không sử dụng đường dẫn chung đó.
- Thêm cảnh báo ngay trên form nếu JavaScript R2 không tải được.
- Thêm `KIEM_TRA_TRIEN_KHAI_R2.html` để kiểm tra ba tệp trên chính tên miền.

## Cách commit (quan trọng)
1. Mở GitHub → repository `trongtam36/xx8-transfer-web` và **sao lưu/ghi lại commit hiện tại**.
2. Xem Settings → Pages: **Deploy from a branch** hoặc **GitHub Actions**. Với branch, phải biết rõ nhánh (vd. main) và thư mục (vd. /root hoặc /docs). Với Actions, phải xác minh nội dung workflow triển khai.
3. Giải nén ZIP này. Tải **các tệp bên trong thư mục giải nén** lên đúng thư mục xuất bản (index.html nằm cùng cấp với `xx8-app-20261103-r2.js` và `xx8-style-20261103-r2.css`). Không tải nguyên ZIP hoặc cả thư mục cha.
4. Commit các thay đổi và kiểm tra Actions/Pages cho đến khi quá trình triển khai hoàn tất. Nếu có Cloudflare, purge cache HTML (và / hoặc cache toàn site).
5. Mở `https://codexx8.live/KIEM_TRA_TRIEN_KHAI_R2.html`. Nếu trả 404 thì website chưa lấy đúng tập tin từ nhánh/thư mục bạn vừa commit, hoặc chưa triển khai xong. Nếu mở được, kiểm tra cả ba dòng đều là **ĐẠT**.
6. Chỉ khi 3 dòng đều ĐẠT mới mở `https://codexx8.live/?r2=20261103` và thử bấm quả bóng. Nhấn Ctrl+Shift+R hoặc dùng tab ẩn danh.
7. Nếu vẫn hiển thị thông báo cũ, mở Developer Tools → Network, tích Disable cache, tải lại. Kiểm tra yêu cầu tới `xx8-app-20261103-r2.js` có HTTP 200 và nội dung chứa `XX8-DEPLOY-20261103-R2`. Nếu nguồn HTML không chứa `XX8-DEPLOY-20261103-R2`, bạn vẫn chưa triển khai được index.html mới.

## Cảnh báo tránh sai
- Chỉ deploy **một** gói R2. Không trộn lẫn file V3–V6/R1.
- Dịch vụ tĩnh trên GitHub Pages không có backend xử lý chuyển điểm. Các thông báo thành công/thất bại là trạng thái mô phỏng theo 5/6 sao, không phải kết quả của giao dịch thật.
- Tên miền đang được kiểm tra bằng hướng dẫn, **chưa được xác minh trực tiếp bởi môi trường tạo gói** vì không truy cập được repository/website từ môi trường này.
