# 💒 Thiệp Cưới - Tuấn & Trang

## 📁 Cấu trúc thư mục

```
thiep-cuoi/
├── index.html          ← File chính (mở file này trên trình duyệt)
├── style.css           ← CSS styles
├── script.js           ← JavaScript
├── images/             ← Thư mục ảnh
│   ├── hero_bg.jpg     ← Ảnh nền trang đầu (tùy chọn)
│   └── ...             ← Các ảnh khác
└── music/              ← Thư mục nhạc
    └── wedding_song.mp3 ← Nhạc nền đám cưới (tùy chọn)
```

## 🖼️ Cách thêm ảnh

### Ảnh nền trang đầu (Hero)
- Đặt ảnh vào thư mục `images/` với tên `hero_bg.jpg`
- Khuyên dùng ảnh ngang (landscape), tối thiểu 1080x1920px

### Ảnh slideshow gallery
Mở file `index.html`, tìm phần `carousel-slides` và thay thế các `div` placeholder bằng thẻ `img`:

```html
<div class="carousel-slide" style="min-width:100%; height:100%;">
    <img src="images/anh1.jpg" alt="Ảnh 1" style="width:100%; height:100%; object-fit:cover;">
</div>
```

Thêm bao nhiêu slide tùy ý. Nhớ cập nhật biến `totalSlides` trong `script.js`:
```js
let totalSlides = 5; // Đổi thành số slide của bạn
```

Và thêm dot tương ứng trong HTML.

## 🎵 Cách thêm nhạc nền
- Đặt file nhạc vào thư mục `music/` với tên `wedding_song.mp3`
- Nhạc sẽ tự động phát khi khách mở thiệp (tùy thuộc vào trình duyệt)
- Có nút bật/tắt nhạc ở góc phải màn hình

## ✏️ Cách thay đổi thông tin

Mở file `index.html` và tìm các phần sau:

### Tên cô dâu chú rể
```html
<div style="...">Tuấn</div>
<div style="...">Trang</div>
```

### Ngày cưới
Trong `index.html`: `20 . 09 . 2025`
Trong `script.js`: `const WEDDING_DATE = new Date('2025-09-20T11:00:00+07:00');`

### Địa điểm
Tìm và thay thế `Crystal Palace`, `456 Đường XYZ...`

### Thông tin gia đình
Tìm `Ông: Nguyễn Văn A`, `Bà: Trần Thị B`...

### Thông tin ngân hàng / mã QR
- Thêm ảnh QR thực vào thư mục `images/` (vd: `qr_groom.png`)
- Thay thế phần QR placeholder bằng `<img src="images/qr_groom.png">`
- Cập nhật số tài khoản, tên chủ tài khoản

## 🌐 Cách mở thiệp
Chỉ cần mở file `index.html` bằng trình duyệt Chrome/Firefox/Edge.

Double-click vào file `index.html` hoặc kéo thả vào cửa sổ trình duyệt.

---
Made with ❤️ for Tuấn & Trang's Wedding 2025
