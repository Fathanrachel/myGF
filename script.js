// === 1. KONTEN KHUSUS WANITA MANDIRI (Boss Lady / Miss Independent) ===

const polaroids = [
    { 
        foto: "assets/images/asya_portrait.png", 
        caption: "Miss Independent", 
        cerita: "Keliatannya aja tegas dan bisa ngelakuin semuanya sendiri, tapi kalau lagi tatap-tatapan gini, aslinya bikin aku gemes pengen manja-manjain terus!",
        sticker: "🎀"
    },
    { 
        foto: "assets/images/asya_ekspresi.jpg", 
        caption: "1001 Ekspresimu", 
        cerita: "Dari senyum manis, manyun, sampe ngambek yang katanya garang—percaya deh, semuanya malah bikin aku makin jatuh cinta. Gemes banget!",
        sticker: "🍦"
    },
    { 
        foto: "assets/images/asya_collage.jpg", 
        caption: "My Aesthetic Girl", 
        cerita: "Paling pintar merangkai hal jadi indah. Sama kayak kamu yang selalu berhasil bikin hari-hariku jadi lebih berwarna dan tertata rapi. Always shining!",
        sticker: "✨"
    },
    { 
        foto: "assets/images/asya_avatar.jpg", 
        caption: "My Boss Lady", 
        cerita: "Foto imut ini nangkep banget vibes kamu yang lucu tapi diam-diam pegang kendali hatiku. I'm so proud to be your partner, Boss Lady!",
        sticker: "💖"
    }
];

const reasons = [
    "Karena kamu pintar dan mandiri, tapi nggak gengsi buat butuh aku.",
    "Karena kamu punya visi ke depan yang bikin aku ikutan semangat kerja.",
    "Karena caramu ngeluh capek aja menurutku lucu banget.",
    "Karena kamu bisa jadi 'Boss Lady' sekaligus pacar yang paling manja."
];


// === 2. LOGIKA INTERAKSI & SISTEM SCRAPBOOK ===

const board = document.getElementById('board');
const instruction = document.getElementById('instruction');
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');

let highestZ = 10;
let isStarted = false;
let cardsList = [];
let isMobile = window.innerWidth < 768;
let musicInterval;

// RESPONSIF: Atur tinggi papan agar pas di HP maupun Laptop
function resizeBoard() {
    isMobile = window.innerWidth < 768;
    if (isMobile) {
        board.style.height = '180vh';
    } else {
        board.style.height = '100vh';
    }
}
window.addEventListener('resize', resizeBoard);
resizeBoard();

// ANIMASI: Toggle Pemutar Musik & Not Balok Melayang
let isPlaying = false;
let isFirstPlay = true;

musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.innerHTML = '🎵 Play BGM';
        musicBtn.style.background = '#FFF';
        musicBtn.style.color = '#E57373';
        musicBtn.classList.remove('playing');
        clearInterval(musicInterval); // Matikan not balok
    } else {
        // Lewati intro yang terlalu panjang pada saat pertama kali diputar
        if (isFirstPlay) {
            bgMusic.currentTime = 14; // Memulai dari detik ke-14 (pas vokal mau masuk)
            isFirstPlay = false;
        }
        
        bgMusic.play();
        musicBtn.innerHTML = '⏸ Pause BGM';
        musicBtn.style.background = '#E57373';
        musicBtn.style.color = '#FFF';
        musicBtn.classList.add('playing'); // Nyalakan pulse
        
        // Mulai memunculkan not balok terbang secara berkala
        musicInterval = setInterval(spawnMusicNote, 600);
    }
    isPlaying = !isPlaying;
});

function spawnMusicNote() {
    const note = document.createElement('div');
    note.className = 'music-note';
    note.innerText = ['🎵', '🎶'][Math.floor(Math.random() * 2)];
    
    // Posisi awal not balok dari tombol musik
    const rect = musicBtn.getBoundingClientRect();
    note.style.left = (rect.left + rect.width / 2 - 10) + 'px';
    note.style.top = (rect.top) + 'px';
    
    document.body.appendChild(note);
    
    setTimeout(() => note.remove(), 2000);
}

// ANIMASI: Efek Ledakan Hati (Confetti Hati & Bunga) saat kartu dibalik
function spawnHearts(x, y) {
    const emojis = ['❤️', '💖', '✨', '💕', '🌸', '🌷'];
    for (let i = 0; i < 6; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.left = (x + (Math.random() * 60 - 30)) + 'px';
        heart.style.top = (y + (Math.random() * 60 - 30)) + 'px';
        board.appendChild(heart);
        setTimeout(() => heart.remove(), 1500);
    }
}

// ANIMASI: Hujan Kelopak Bunga (Sakura)
function startPetals() {
    setInterval(() => {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.innerText = ['🌸', '💮', '🍃', '✨', '🌷'][Math.floor(Math.random() * 5)];
        
        // Mulai dari posisi X acak
        petal.style.left = Math.random() * 100 + 'vw';
        
        // Kecepatan jatuh acak antara 5 hingga 10 detik
        const duration = Math.random() * 5 + 5;
        petal.style.animation = `fall ${duration}s linear forwards`;
        
        document.body.appendChild(petal);
        
        // Hapus elemen setelah selesai jatuh agar memori tidak penuh
        setTimeout(() => petal.remove(), duration * 1000);
    }, 400); // Munculkan kelopak baru setiap 400 milidetik
}

// Fungsi Pencetak Komponen Kartu Polaroid
function createCard(options) {
    const card = document.createElement('div');
    card.className = `card ${options.extraClass || ''}`;
    
    const cardW = options.isCover ? (isMobile ? 250 : 320) : (isMobile ? 210 : 270);
    const cardH = options.isCover ? (isMobile ? 300 : 380) : (isMobile ? 260 : 330);
    
    const startX = (window.innerWidth - cardW) / 2;
    const startY = (window.innerHeight - cardH) / 2;
    
    card.style.left = `${startX}px`;
    card.style.top = `${startY}px`;
    card.style.zIndex = highestZ++;
    
    if (!options.isCover) {
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
    }
    
    const tapes = ['washi-tape', 'washi-tape green', 'washi-tape yellow', 'washi-tape blue'];
    const randomTape = tapes[Math.floor(Math.random() * tapes.length)];
    const washiHTML = options.noWashi ? '' : `<div class="${randomTape}"></div>`;
    
    const stickerHTML = options.sticker ? `<div class="sticker">${options.sticker}</div>` : '';
    
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                ${washiHTML}
                ${options.frontHTML}
                ${stickerHTML}
            </div>
            <div class="card-back">
                ${options.backHTML || ''}
            </div>
        </div>
    `;
    
    board.appendChild(card);
    makeDraggable(card, options);
    return card;
}

// Fitur Drag & Click 
function makeDraggable(el, options) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    let moved = false;
    
    el.addEventListener('pointerdown', (e) => {
        if (!isStarted && !options.isCover) return;
        
        isDragging = true;
        moved = false;
        
        highestZ++;
        el.style.zIndex = highestZ;
        
        // ANIMASI LIFT: Beri kelas 'grabbing' agar kartu membesar seolah diangkat
        el.classList.add('grabbing');
        
        startX = e.clientX;
        startY = e.clientY;
        
        el.style.transition = 'none';
        
        initialLeft = parseFloat(el.style.left) || 0;
        initialTop = parseFloat(el.style.top) || 0;
        
        el.setPointerCapture(e.pointerId);
    });

    el.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
        
        el.style.left = `${initialLeft + dx}px`;
        el.style.top = `${initialTop + dy}px`;
    });

    el.addEventListener('pointerup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        // Lepas kelas 'grabbing' agar kartu jatuh kembali
        el.classList.remove('grabbing');
        
        el.releasePointerCapture(e.pointerId);
        
        el.style.transition = 'left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s';
        
        if (!moved && !options.noFlip) {
            const inner = el.querySelector('.card-inner');
            inner.classList.toggle('flipped');
            
            spawnHearts(initialLeft + el.offsetWidth / 2, initialTop + el.offsetHeight / 2);
            
            if (options.isCover && !isStarted) {
                isStarted = true;
                instruction.style.opacity = '0';
                setTimeout(scatterCards, 500); 
                
                // Mulai hujan bunga yang romantis
                startPetals();
                
                // AUTOPLAY: Putar musik otomatis saat kartu pertama kali disentuh/dibuka
                if (!isPlaying) {
                    musicBtn.click();
                }
            }
        }
    });
}

// Hamburkan Kartu 
function scatterCards() {
    const w = window.innerWidth;
    const h = board.offsetHeight;

    cardsList.forEach((card, index) => {
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
        
        const cardW = card.offsetWidth;
        const cardH = card.offsetHeight;
        let randomX, randomY;
        
        if (isMobile) {
            const sectionHeight = (h - 200) / cardsList.length; 
            randomY = 100 + (index * sectionHeight) + (Math.random() * (sectionHeight - cardH));
            
            const padding = 20;
            randomX = padding + Math.random() * (w - cardW - padding * 2);
            
        } else {
            if (card.dataset.type === 'reason') {
                randomX = w - cardW - 80 + (Math.random() * 20 - 10);
                randomY = 80 + (Math.random() * 20 - 10);
            } else {
                randomX = 80 + Math.random() * (w - cardW - 300);
                randomY = 80 + Math.random() * (h - cardH - 160);
            }
        }
        
        const randomRot = (Math.random() * 30) - 15; 
        
        card.style.left = `${randomX}px`;
        card.style.top = `${randomY}px`;
        card.style.transform = `rotate(${randomRot}deg)`;
    });
}


// === 3. RENDER SEMUA KARTU ===

// A. Kartu Sampul 
createCard({
    isCover: true,
    extraClass: 'cover',
    frontHTML: `
        <p class="caption">Buat Asya</p>
        <p style="text-align:center; color:#E57373; font-weight:600; font-size:14px; margin-top:15px;">(Sentuh kartunya!)</p>
    `,
    backHTML: `
        <p class="story" style="font-size: clamp(28px, 6vw, 34px);">Walau kamu bisa lakuin semuanya sendiri...</p>
        <p class="story" style="font-size: clamp(20px, 4vw, 24px); margin-top:15px;">Biarin aku yang bahagiain kamu lewat hal kecil ini ya! ❤️</p>
    `
});

// B. Polaroid 
polaroids.forEach(p => {
    const card = createCard({
        sticker: p.sticker,
        frontHTML: `
            <div class="photo-frame"><img src="${p.foto}" alt="Memory"></div>
            <p class="caption">${p.caption}</p>
        `,
        backHTML: `<p class="story">${p.cerita}</p>`
    });
    card.dataset.type = 'polaroid';
    cardsList.push(card);
});

// C. Tumpukan Dek Kartu Alasan 
const shuffledReasons = [...reasons].sort(() => Math.random() - 0.5);
shuffledReasons.forEach((r, i) => {
    const card = createCard({
        noWashi: true, 
        frontHTML: `<p class="caption" style="font-size: clamp(34px, 8vw, 40px);">Alasan ${i + 1}</p>`,
        backHTML: `<p class="story" style="font-size: clamp(28px, 7vw, 34px);">${r}</p>`
    });
    card.dataset.type = 'reason';
    cardsList.push(card);
});
