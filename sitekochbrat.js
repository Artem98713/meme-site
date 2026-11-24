
const memes = [
    {
        title: "Это фиаско, братан",
        image: "https://avatars.mds.yandex.net/i?id=b2f48a39900d2ce45d956b475dd04b056eb49d1c-5213143-images-thumbs&n=13",
        description: "Пёс Стив из Пятигорска падает в ручей, а хозяин произносит фразу, ставшую мемом на все случаи провала."
    },
    {
        title: "Distracted Boyfriend",
        image: "https://i.kym-cdn.com/photos/images/original/001/287/555/106.jpg",
        description: "Парень оборачивается на прохожую, пока его девушка смотрит с осуждением. Классика про смену приоритетов."
    },
    {
        title: "This is fine",
        image: "https://i.kym-cdn.com/photos/images/original/000/962/640/658.png",
        description: "Собака в горящей комнате спокойно пьёт кофе и уверяет, что всё в порядке. Сарказм про принятие безнадёги."
    },
    {
        title: "Doge",
        image: "https://i.kym-cdn.com/photos/images/original/000/581/296/c09.jpg",
        description: "Сиба-ину Кабосу с надписями «such wow» и «very doge». Один из первых мемов, покоривших интернет в 2013-м."
    },
    {
        title: "Success Kid",
        image: "https://i.kym-cdn.com/photos/images/original/000/260/393/a37.jpg",
        description: "Малыш сжимает кулачок с песком на пляже. Символ маленькой, но настоящей победы."
    },
    {
        title: "Grumpy Cat",
        image: "https://i.kym-cdn.com/photos/images/original/000/406/282/2b8.jpg",
        description: "Кошка Тардар Соус с вечно недовольным лицом. Королева сарказма и разочарования."
    }
];


// ============================================================
// 2. РЕНДЕР КАРТОЧЕК
// ============================================================
const grid = document.querySelector('.memes-grid');

memes.forEach(meme => {
    const card = document.createElement('article');
    card.className = 'meme-card';
    card.setAttribute('data-animate', 'false');
    card.innerHTML = `
        <img src="${meme.image}" alt="${meme.title}" loading="lazy" />
        <h3>${meme.title}</h3>
        <p class="meme-desc">${meme.description}</p>
        <button class="share-btn" aria-label="Поделиться мемом">
            <i class="fas fa-share-alt"></i>
        </button>
    `;
    grid.appendChild(card);
});

// ============================================================
// 3. ТЕМА
// ============================================================
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'light';

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-theme', isDark);
    themeToggle.innerHTML = isDark
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', theme);
}

applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const next = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
    applyTheme(next);
});

// ============================================================
// 4. МОДАЛЬНОЕ ОКНО
// ============================================================
const modal      = document.getElementById('modal');
const modalImg   = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDesc  = document.getElementById('modal-desc');
const closeBtn   = document.getElementById('modal-close');

function openModal(src, title, desc) {
    modalImg.src = src;
    modalImg.alt = title;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});

// Делегирование кликов по карточкам (созданы динамически)
grid.addEventListener('click', e => {
    const card = e.target.closest('.meme-card');
    if (!card) return;

    const img   = card.querySelector('img');
    const title = card.querySelector('h3').textContent;
    const desc  = card.querySelector('.meme-desc').textContent;

    if (e.target.closest('.share-btn')) {
        // Поделиться
        if (navigator.share) {
            navigator.share({ title, text: desc, url: img.src }).catch(() => {});
        } else {
            navigator.clipboard?.writeText(img.src);
            alert(`Ссылка на мем "${title}" скопирована!`);
        }
        return;
    }

    openModal(img.src, title, desc);
});

// ============================================================
// 5. ПЛАВНАЯ ПРОКРУТКА + АКТИВНОЕ МЕНЮ
// ============================================================
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 200) {
            current = section.id;
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
});

// ============================================================
// 6. КНОПКА «НАВЕРХ»
// ============================================================
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 300);
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// 7. АНИМАЦИЯ ПРИ СКРОЛЛЕ
// ============================================================
const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            animObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate="false"]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    animObserver.observe(el);
});

const smileBtn = document.getElementById('smile-btn');
const toast    = document.getElementById('toast');

let smileTimeout;
let toastTimeout;

smileBtn.addEventListener('click', () => {
    // Меняем эмодзи и запускаем анимацию
    smileBtn.classList.add('smiling');
    smileBtn.textContent = '😄';

    clearTimeout(smileTimeout);
    clearTimeout(toastTimeout);

    // Показываем уведомление
    toast.classList.add('show');

    // Возвращаем смайлик в исходное состояние
    smileTimeout = setTimeout(() => {
        smileBtn.classList.remove('smiling');
        smileBtn.textContent = '🙂';
    }, 800);

    // Прячем уведомление через 4 секунды
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
});