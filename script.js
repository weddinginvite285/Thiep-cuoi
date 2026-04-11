// ========== WEDDING INVITATION SCRIPT ==========
// Tuan & Trang's Wedding - 20/09/2025

// ========== CONFIG ==========
const WEDDING_DATE = new Date('2025-09-20T11:00:00+07:00');
let currentSlide = 0;
let totalSlides = 11;
let carouselInterval;
let musicPlaying = false;
// ========== WISHES (Google Sheets) ==========
const GAS_URL = 'https://script.google.com/macros/s/AKfycbytmXb2Nc6ODhRjVfK1oKktQjrgQfO5EhLxilfn1TQBQBSM8NLj77bsEUPAR2g1WQBj/exec';
let wishes = [];

// Tải lời chúc từ Google Sheets (silent=true: không hiện loading spinner)
function fetchWishesFromSheets(silent) {
    const container = document.getElementById('wish_list_container');
    if (!silent && container) {
        container.innerHTML = '<div style="text-align:center;padding:20px;font-family:Faustina,serif;color:#a07855;font-size:13px;">Đang tải lời chúc... 💫</div>';
    }
    fetch(GAS_URL)
        .then(function(r) { return r.json(); })
        .then(function(data) {
            wishes = Array.isArray(data) ? data.filter(function(w) { return w.name && w.content; }) : [];
            renderWishList();
        })
        .catch(function() {
            if (!silent) { wishes = []; renderWishList(); }
        });
}

// Gửi lời chúc lên Google Sheets
function postWishToSheets(wish) {
    fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify(wish),
        headers: { 'Content-Type': 'text/plain' }
    }).then(function() {
        fetchWishesFromSheets(true); // silent: không hiện loading
    }).catch(function() { /* ignore */ });
}


// ========== LOADING ==========
window.addEventListener('load', function () {
    setTimeout(function () {
        const loading = document.getElementById('loading_screen');
        if (loading) {
            loading.style.opacity = '0';
            loading.style.transition = 'opacity 0.5s';
            setTimeout(() => { loading.style.display = 'none'; }, 500);
        }
    }, 1500);
});

// ========== OPEN INVITATION ==========
function openInvitation() {
    const popup = document.getElementById('initial_popup');
    const card = document.getElementById('invitation_card');

    popup.style.opacity = '0';
    popup.style.transition = 'opacity 0.8s ease';

    setTimeout(function () {
        popup.style.display = 'none';
        card.style.display = 'block';
        card.style.opacity = '0';
        card.style.transition = 'opacity 0.8s ease';

        setTimeout(function () {
            card.style.opacity = '1';
        }, 50);

        // Start auto-carousel
        startCarousel();

        // Try auto-play music
        tryAutoPlayMusic();

        // Start countdown
        updateCountdown();
        setInterval(updateCountdown, 1000);

        // Load wishes from Google Sheets
        fetchWishesFromSheets();

    }, 800);
}

// ========== COUNTDOWN ==========
function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';

        const panel = document.querySelector('.inform-section');
        if (panel) {
            const msg = document.createElement('div');
            msg.style = 'font-family:Dancing Script,cursive; font-size:22px; color:#8f7748; text-align:center; margin-top:15px;';
            msg.textContent = '🎉 Hôm nay là ngày trọng đại! 🎉';
            panel.appendChild(msg);
        }
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// ========== CAROUSEL (track horizontal slide) ==========
let prevSlideIndex = 0;

function updateCarousel() {
    var track = document.getElementById('carousel-track');
    if (track) {
        track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
    }
    // Update dots
    document.querySelectorAll('#carousel-dots button').forEach(function(dot, idx) {
        dot.style.background = idx === currentSlide ? 'white' : 'rgba(255,255,255,0.7)';
        dot.style.transform   = idx === currentSlide ? 'scale(1.3)' : 'scale(1)';
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
    resetAutoplay();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
    resetAutoplay();
}

function goToSlide(n) {
    currentSlide = n;
    updateCarousel();
    resetAutoplay();
}

function startCarousel() {
    clearInterval(carouselInterval);
    carouselInterval = setInterval(function() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }, 4000);
}

function resetAutoplay() {
    clearInterval(carouselInterval);
    carouselInterval = setInterval(function() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }, 4000);
}

// ========== MUSIC ==========
function tryAutoPlayMusic() {
    const music = document.getElementById('bg_music');
    if (!music) return;

    // Try autoplay after user interaction
    const playPromise = music.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            musicPlaying = true;
            updateMusicIcon();
        }).catch(() => {
            // Autoplay blocked - user must click
            musicPlaying = false;
            updateMusicIcon();
        });
    }
}

function toggleMusic() {
    const music = document.getElementById('bg_music');
    if (!music) return;

    if (musicPlaying) {
        music.pause();
        musicPlaying = false;
    } else {
        music.play().then(() => { musicPlaying = true; updateMusicIcon(); });
    }
    updateMusicIcon();
}

function updateMusicIcon() {
    const icon = document.getElementById('music_icon');
    if (!icon) return;
    icon.textContent = musicPlaying ? '♫' : '♪';
    const player = document.getElementById('music_player');
    if (player) {
        player.style.opacity = musicPlaying ? '1' : '0.6';
    }
}

// ========== ATTENDANCE CONFIRMATION ==========
// Show guest count when user says yes
document.addEventListener('change', function (e) {
    if (e.target && e.target.name === 'attendance') {
        const guestCountSection = document.getElementById('guests_count_section');
        if (e.target.value === 'yes') {
            guestCountSection.style.display = 'block';
        } else {
            guestCountSection.style.display = 'none';
        }

        // Highlight selected option
        document.querySelectorAll('.option_border').forEach(el => {
            el.style.border = '1px solid #e8d5b0';
            el.style.backgroundColor = '';
        });
        const label = e.target.closest('label');
        if (label) {
            const border = label.querySelector('.option_border');
            if (border) {
                border.style.border = '2px solid #8f7748';
                border.style.backgroundColor = '#fdf8f0';
            }
        }
    }

    // Guest count button highlights
    if (e.target && e.target.name === 'guest_count') {
        document.querySelectorAll('.guest-count-btn').forEach(btn => {
            btn.style.background = '';
            btn.style.color = '#606060';
            btn.style.borderColor = '#e8d5b0';
        });
        const label = e.target.closest('label');
        if (label) {
            const btn = label.querySelector('.guest-count-btn');
            if (btn) {
                btn.style.background = '#8f7748';
                btn.style.color = 'white';
                btn.style.borderColor = '#8f7748';
            }
        }
    }
});

function submitConfirmation() {
    const name = document.getElementById('guest_name').value.trim();
    const attendance = document.querySelector('input[name="attendance"]:checked');
    const sideInput = document.querySelector('input[name="guest_side"]:checked');

    if (!name) {
        showToast('Vui lòng nhập tên của bạn! 😊');
        document.getElementById('guest_name').focus();
        return;
    }

    if (!attendance) {
        showToast('Vui lòng chọn có tham dự hay không! 💕');
        return;
    }

    // Disable nút, hiện đang gửi
    const btn = document.getElementById('btn_confirm');
    btn.textContent = '⏳ Đang gửi...';
    btn.disabled = true;

    const attending = attendance.value === 'yes';
    const side = sideInput ? (sideInput.value === 'groom' ? 'Nhà Trai' : 'Nhà Gái') : 'Chưa chọn';

    // Gửi lên Google Sheets
    fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({
            type: 'rsvp',
            name: name,
            side: side,
            attending: attending ? 'Có đến' : 'Không đến'
        }),
        headers: { 'Content-Type': 'text/plain' }
    }).catch(function() { /* ignore network error */ });

    // Hiện thông báo thành công
    setTimeout(function () {
        btn.style.display = 'none';
        document.getElementById('confirm_success').style.display = 'block';

        const msg = document.getElementById('confirm_success');
        if (!attending) {
            msg.innerHTML = `
                <div style="font-size:30px; margin-bottom:8px;">💌</div>
                <div style="font-family:Faustina, serif; font-size:14px; color:#8f7748; font-weight:600;">Cảm ơn bạn đã thông báo!</div>
                <div style="font-family:Faustina, serif; font-size:13px; color:#a08060; margin-top:5px;">Chúng tôi sẽ nhớ đến bạn trong ngày hôm đó 💕</div>
            `;
            msg.style.background = '#fdf8f0';
            msg.style.borderColor = '#e8d5b0';
        }

        showToast(attending ? '🎉 Cảm ơn bạn sẽ đến!' : '💌 Cảm ơn bạn đã thông báo!');
    }, 800);
}

// ========== WISH FORM ==========
function submitWish() {
    const name = document.getElementById('wish_name').value.trim();
    const content = document.getElementById('wish_content').value.trim();

    if (!name) {
        showToast('Vui lòng nhập tên của bạn! 😊');
        document.getElementById('wish_name').focus();
        return;
    }

    if (!content) {
        showToast('Vui lòng nhập lời chúc! 💕');
        document.getElementById('wish_content').focus();
        return;
    }

    const colors = ['#d4b896', '#c9a87c', '#b8956a', '#e8d5b0', '#a07855'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const now = new Date();
    const timeStr = now.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    const wish = { name, content, time: timeStr, color: randomColor };

    // Hiển thị ngay (optimistic UI)
    wishes.unshift(wish);
    renderWishList();
    document.getElementById('wish_name').value = '';
    document.getElementById('wish_content').value = '';
    showToast('💝 Lời chúc đang được gửi...');

    // Gửi lên Google Sheets (sẽ tải lại khi xong)
    postWishToSheets(wish);
}

function renderWishList() {
    const container = document.getElementById('wish_list_container');
    if (!container) return;

    if (wishes.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:30px 20px;font-family:Faustina,serif;color:#a07855;font-size:14px;line-height:1.8;">Chưa có lời chúc nào 🌸<br><span style="font-size:12px;color:#c0a880;">Hãy là người đầu tiên gửi lời chúc!</span></div>';
        return;
    }

    container.innerHTML = wishes.map(wish => `
        <div class="wish-list-item" style="padding:15px; border-bottom:1px solid #f0e8d0;">
            <div style="display:flex; align-items:flex-start; gap:10px;">
                <div style="width:36px; height:36px; border-radius:50%; background:${wish.color}; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:16px; color:white; font-weight:700;">
                    ${wish.name.charAt(0).toUpperCase()}
                </div>
                <div style="flex:1;">
                    <div style="font-family:Faustina, serif; font-weight:700; font-size:14px; color:#8f7748;">${escapeHtml(wish.name)}</div>
                    <div style="font-family:Faustina, serif; font-size:13px; color:#606060; margin-top:4px; line-height:1.6;">${escapeHtml(wish.content)}</div>
                    <div style="font-family:Faustina, serif; font-size:11px; color:#b0a090; margin-top:4px;">${wish.time}</div>
                </div>
            </div>
        </div>
    `).join('');

    // Scroll to top
    const wishDiv = document.getElementById('div_list_wish');
    if (wishDiv) wishDiv.scrollTop = 0;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

// ========== PHOTO UPLOAD ==========
function handlePhotoUpload(input) {
    const file = input.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('Vui lòng chọn file ảnh! 📸');
        return;
    }

    showToast('📸 Ảnh đã được chọn thành công!');

    // Preview
    const reader = new FileReader();
    reader.onload = function (e) {
        let previewSection = document.getElementById('photo_preview_section');
        if (!previewSection) {
            previewSection = document.createElement('div');
            previewSection.id = 'photo_preview_section';
            previewSection.className = 'photo-preview-section';
            previewSection.style.cssText = 'display:flex; flex-wrap:wrap; gap:10px; margin-top:15px;';
            input.closest('div').appendChild(previewSection);
        }

        const item = document.createElement('div');
        item.className = 'photo-preview-item';
        item.style.cssText = 'width:calc(33.33% - 7px); aspect-ratio:1; border-radius:8px; overflow:hidden; border:2px solid #e8d5b0;';
        item.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;" alt="Ảnh đã upload">`;
        previewSection.appendChild(item);
    };
    reader.readAsDataURL(file);
}

// ========== TOAST NOTIFICATION ==========
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========== SCROLL REVEAL ANIMATION ==========
function initScrollReveal() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// ========== SWIPE SUPPORT FOR CAROUSEL ==========
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    const carousel = document.getElementById('content-carousel');
    if (!carousel) return;

    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
        nextSlide();
    } else if (touchEndX - touchStartX > swipeThreshold) {
        prevSlide();
    }
}, { passive: true });

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', function () {
    renderWishList();
});
