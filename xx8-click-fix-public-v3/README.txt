XX8 Transfer - GitHub Pages / public click-fix v3 (DEMO ONLY)

Chuc nang:
  - Qua bong 6 sao: trang thai mo phong THAT BAI.
  - Cham / bam qua bong de doi sang 5 sao: trang thai mo phong THANH CONG.
  - Trang thai luu tren trinh duyet bang localStorage.
  - O dien thoai, neu video crop mat bieu tuong, qua bong ghim o goc duoi phai.
  - Chuc nang bat san tren website cong khai; khong can ?demo=1.
  - Co the them ?demo=0 de tat dieu khien khi kiem tra giao dien.

LUU Y: Day chi la mo phong. KHONG co API, backend, xac minh Cloudflare
hay giao dich chuyen diem that.

Cap nhat GitHub Pages:
  1. Giai nen ZIP nay va upload NOI DUNG ben trong vao root cua repo.
  2. Dam bao index.html, app.js, styles.css va thu muc assets nam cung cap.
  3. Commit; kiem tra Settings > Pages dang trỏ den branch / folder dung.
  4. Mo trang voi Ctrl+Shift+R (hoac tab an danh) de xoa cache cu.
  5. Neu trang van khong doi, kiem tra tab Network xem app.js?v=20261103-clickfix3
     co tai thanh cong (status 200) hay khong.

Thu local: python3 -m http.server 8080, sau do mo http://localhost:8080
