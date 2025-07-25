/*
ÖNEMLİ GÜVENLİK UYARISI:
API Anahtarını (API_KEY) doğrudan bu dosyada saklamak çok risklidir.
Bu, anahtarınızın herkes tarafından görülüp kötüye kullanılmasına neden olabilir.
Profesyonel bir projede bu anahtar, bir backend (sunucu) tarafında saklanmalı
ve istekler o sunucu üzerinden yapılmalıdır.
Bu kod sadece eğitim ve geliştirme amaçlıdır.
*/
const API_KEY = "AIzaSyBRYkQpIxpoIKKNWoCMMnmslSZHz3jzxvw"; // Lütfen bu anahtarı halka açık bir yerde paylaşmayın!
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// CezeriX Araç Bilgileri (AI Asistanına öğretilir)
const BILGILER = `
    Sen CezeriX firmasının yapay zekâ destekli satış asistanısın. Aşağıdaki araç modelleri ve özelliklerini öğren:

    1. CezeriX Seyyah (Hypercar) - 2500HP, 380 km/s, 350 km menzil, X Mode, F1 direksiyon, RGB iç ambiyans
    2. CezeriX Miran (Sedan) - 350HP, 3 silindir, 750 km menzil, X Mode
    3. CezeriX Nova (Hatchback) - 150HP, 600 km menzil, günlük kullanım, uygun fiyatlı, X Mode
    4. CezeriX Blade (Racing Motosiklet) - 1250cc, 220 km menzil, çift egzoz, keskin depo, X Mode
    5. CezeriX Glide (Scooter) - 150cc, 280 km menzil, USB girişi, kurye dostu, Blade tarzı LED far, X Mode
    6. CezeriX Aybar (SUV) - 700 km menzil, geniş iç hacim, arazi kabiliyeti
    7. CezeriX TrailGuard (Otonom Bisiklet) - 90 km menzil (tek şarjla), AirSafe, lidar, otonom sürüş, filtreleme, akıllı kask, E Mode

    X Mode: CezeriX araçlarında kısa süreliğine maksimum gücü aktifleştiren performans modudur.
    E Mode: TrailGuard'da bulunan enerji verimliliği odaklı elektrik destekli moddur.
`;

const MODELLER = [
    "CezeriX Seyyah (Hypercar)", "CezeriX Miran (Sedan)", "CezeriX Nova (Hatchback)",
    "CezeriX Blade (Racing Motosiklet)", "CezeriX Glide (Scooter)", "CezeriX Aybar (SUV)",
    "CezeriX TrailGuard (Otonom Bisiklet)"
];

const MODEL_DETAILS = {
    "CezeriX Seyyah (Hypercar)": "2500HP, 380 km/s, 350 km menzil, X Mode, F1 direksiyon, RGB iç ambiyans",
    "CezeriX Miran (Sedan)": "350HP, 3 silindir, 750 km menzil, X Mode",
    "CezeriX Nova (Hatchback)": "150HP, 600 km menzil, günlük kullanım, uygun fiyatlı, X Mode",
    "CezeriX Blade (Racing Motosiklet)": "1250cc, 220 km menzil, çift egzoz, keskin depo, X Mode",
    "CezeriX Glide (Scooter)": "150cc, 280 km menzil, USB girişi, kurye dostu, Blade tarzı LED far, X Mode",
    "CezeriX Aybar (SUV)": "700 km menzil, geniş iç hacim, arazi kabiliyeti",
    "CezeriX TrailGuard (Otonom Bisiklet)": "90 km menzil (tek şarjla), AirSafe, lidar, otonom sürüş, filtreleme, akıllı kask, E Mode"
};

const MODEL_PRICES = {
    "CezeriX Seyyah (Hypercar)": "30.000.000 TL (KDV hariç)",
    "CezeriX Nova (Hatchback)": "997.000 TL (KDV hariç)",
    "CezeriX Miran (Sedan)": "2.500.000 TL",
    "CezeriX Blade (Racing Motosiklet)": "956.000 TL",
    "CezeriX Glide (Scooter)": "250.000 TL",
    "CezeriX Aybar (SUV)": "2.750.000 TL",
    "CezeriX TrailGuard (Otonom Bisiklet)": "30.000 TL"
};

const INSTAGRAM_LINK = "https://www.instagram.com/cezerix.auto?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

// DOM Elementleri
const questionInput = document.getElementById('questionInput');
const sendQuestionBtn = document.getElementById('sendQuestionBtn');
const resultLabel = document.getElementById('resultLabel');
const instagramInfo = document.getElementById('instagramInfo');
const instagramLinkBottom = document.getElementById('instagramLinkBottom');
const siparisVerBtn = document.getElementById('siparisVerBtn');
const adSoyadInput = document.getElementById('adSoyad');
const tcKimlikNoInput = document.getElementById('tcKimlikNo');
const instagramKullaniciAdiInput = document.getElementById('instagramKullaniciAdi');
const telefonNumarasiInput = document.getElementById('telefonNumarasi');
const modelSecimiSelect = document.getElementById('modelSecimi');
const modelDetailsList = document.getElementById('modelDetailsList');

function loadModelData() {
    modelSecimiSelect.innerHTML = '';
    modelDetailsList.innerHTML = '';
    MODELLER.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSecimiSelect.appendChild(option);
        const listItem = document.createElement('li');
        listItem.className = "flex items-start";
        listItem.innerHTML = `
            <span class="text-teal-400 mr-2">•</span>
            <div>
                <strong class="text-white">${model}:</strong> ${MODEL_DETAILS[model]} - <span class="text-teal-300">${MODEL_PRICES[model]}</span>
            </div>
        `;
        modelDetailsList.appendChild(listItem);
    });
}

async function cevapGetir(soru) {
    resultLabel.textContent = "🤖 CezeriX AI: Cevap bekleniyor...";
    try {
        const chatHistory = [{ role: "user", parts: [{ text: BILGILER + "\n\n" + soru }] }];
        const payload = { contents: chatHistory };
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (result.candidates && result.candidates[0]?.content?.parts?.[0]) {
            const text = result.candidates[0].content.parts[0].text;
            resultLabel.textContent = `🤖 CezeriX AI: ${text}`;
        } else {
            resultLabel.textContent = "❌ Yapay zeka bağlantısı sağlanamadı veya yanıt yapısı beklenmedik.";
            console.error("API yanıt yapısı beklenmedik:", result);
        }
    } catch (e) {
        resultLabel.textContent = "❌ Yapay zeka bağlantısı sağlanamadı. İnternetinizi kontrol edin.";
        console.error("Gerçek hata:", e);
    }
}

async function siparisVer() {
    const ad = adSoyadInput.value.trim();
    const tcKimlikNo = tcKimlikNoInput.value.trim();
    const insta = instagramKullaniciAdiInput.value.trim();
    const tel = telefonNumarasiInput.value.trim();
    const model = modelSecimiSelect.value;

    if (!ad || !tcKimlikNo || !insta || !tel) {
        resultLabel.textContent = "⚠️ Lütfen tüm sipariş bilgilerini doldurun.";
        return;
    }
    if (!/^\d{11}$/.test(tcKimlikNo)) {
        resultLabel.textContent = "⚠️ TC Kimlik No 11 haneli rakamlardan oluşmalıdır.";
        return;
    }
    
    // SİPARİŞ SİMÜLASYONU
    const tahminiTeslimat = "2036 yılından itibaren";
    const randomOrderCode = Math.floor(1000 + Math.random() * 9000);
    resultLabel.textContent = `✅ Siparişiniz kaydedildi! Sipariş Kodu: ${randomOrderCode}. Tahmini Teslimat: ${tahminiTeslimat}`;
    
    // Formu temizle
    adSoyadInput.value = '';
    tcKimlikNoInput.value = '';
    instagramKullaniciAdiInput.value = '';
    telefonNumarasiInput.value = '';
    modelSecimiSelect.value = MODELLER[0];
}

function instayaGit() {
    window.open(INSTAGRAM_LINK, '_blank');
}

// Olay dinleyicileri
document.addEventListener('DOMContentLoaded', loadModelData);
sendQuestionBtn.addEventListener('click', () => {
    const soru = questionInput.value.trim();
    if (soru) {
        questionInput.value = '';
        cevapGetir(soru);
    }
});
questionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendQuestionBtn.click();
});
instagramInfo.addEventListener('click', instayaGit);
instagramLinkBottom.addEventListener('click', instayaGit);
siparisVerBtn.addEventListener('click', siparisVer);