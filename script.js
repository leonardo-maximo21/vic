// --- 1. CONFIGURAÇÕES PADRÃO E LOCALSTORAGE ---
const DEFAULT_CONFIG = {
    names: "Leo & Vic",
    spotifyId: "37i9dQZF1EJvfVUZT0ntp1", // Playlist padrão
    dateConhecemos: "Quando nos conhecemos",
    datePedido: "O pedido de namoro",
    letterText: `Querida Vic,

Desde o momento em que nossos caminhos se cruzaram, a minha vida ganhou uma nova cor. O seu sorriso ilumina qualquer dia cinzento, o seu carisma me encanta a cada segundo e o seu companheirismo me dá a certeza de que posso enfrentar qualquer coisa se estiver ao seu lado.

Gosto de absolutamente tudo em você: do seu jeito único de olhar, da sua risada, da sua força. Obrigado por ser minha parceira de jornada, minha melhor amiga e o meu amor.

Que o nosso 'nós' continue crescendo, cheio de momentos felizes e novas memórias para colecionar. Feliz Dia dos Namorados!

Com todo o meu amor,
Leo 💜`
};

let config = { ...DEFAULT_CONFIG };

// Carregar configurações do localStorage se existirem
function loadConfig() {
    const saved = localStorage.getItem('valentines_day_config');
    if (saved) {
        try {
            config = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
            // Se o ID carregado for o padrão antigo, forçar a atualização para o novo do casal
            if (config.spotifyId === "37i9dQZF1DX10zKzsJ2jva") {
                config.spotifyId = DEFAULT_CONFIG.spotifyId;
                localStorage.setItem('valentines_day_config', JSON.stringify(config));
            }
        } catch (e) {
            console.error("Erro ao carregar configurações", e);
        }
    }
    applyConfigUI();
}

// Aplicar valores da configuração na tela
function applyConfigUI() {
    // Títulos e nomes
    document.title = `Para o meu amor, ${config.names.split('&')[1]?.trim() || 'Vic'} 💜`;
    const headerNames = document.getElementById('header-names');
    if (headerNames) headerNames.textContent = config.names;

    // Datas da linha do tempo
    const dateConhEl = document.getElementById('date-conhecemos');
    const datePedEl = document.getElementById('date-pedido');
    if (dateConhEl) dateConhEl.textContent = config.dateConhecemos;
    if (datePedEl) datePedEl.textContent = config.datePedido;

    // Spotify Iframe
    const spotifyHolder = document.getElementById('spotify-iframe-holder');
    if (spotifyHolder) {
        let cleanId = config.spotifyId;
        // Se colar um link completo, extrair o ID da playlist
        if (cleanId.includes("playlist/")) {
            cleanId = cleanId.split("playlist/")[1].split("?")[0];
        } else if (cleanId.includes("spotify.com")) {
            // Outros tipos de links
            const parts = cleanId.split("/");
            cleanId = parts[parts.length - 1].split("?")[0];
        }
        spotifyHolder.innerHTML = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/${cleanId}?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    }

    // Preencher campos do formulário modal com os valores ativos
    document.getElementById('cfg-names').value = config.names;
    document.getElementById('cfg-spotify').value = config.spotifyId;
    document.getElementById('cfg-date-conhecemos').value = config.dateConhecemos;
    document.getElementById('cfg-date-pedido').value = config.datePedido;
    document.getElementById('cfg-letter').value = config.letterText;
}

// Salvar configurações
function saveConfig() {
    config.names = document.getElementById('cfg-names').value.trim() || DEFAULT_CONFIG.names;
    config.spotifyId = document.getElementById('cfg-spotify').value.trim() || DEFAULT_CONFIG.spotifyId;
    config.dateConhecemos = document.getElementById('cfg-date-conhecemos').value.trim() || DEFAULT_CONFIG.dateConhecemos;
    config.datePedido = document.getElementById('cfg-date-pedido').value.trim() || DEFAULT_CONFIG.datePedido;
    config.letterText = document.getElementById('cfg-letter').value || DEFAULT_CONFIG.letterText;

    localStorage.setItem('valentines_day_config', JSON.stringify(config));
    applyConfigUI();
    closeModal();
}

// --- 2. SISTEMA DE PARTÍCULAS (CANVAS) ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 15 + 5;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = Math.sin(Math.random() * 2) * 0.5;
        this.type = Math.random() > 0.4 ? 'heart' : 'star';
        // Tons de roxo, lavanda e rosa
        const hues = [270, 290, 310, 330];
        this.hue = hues[Math.floor(Math.random() * hues.length)];
        this.opacity = Math.random() * 0.5 + 0.2;
        this.rotSpeed = Math.random() * 0.02 - 0.01;
        this.rot = Math.random() * Math.PI;
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.rot += this.rotSpeed;

        if (this.y < -30) {
            this.y = canvas.height + 30;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `hsl(${this.hue}, 80%, 75%)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${this.hue}, 80%, 65%)`;

        if (this.type === 'heart') {
            // Desenhar coração
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size/2, -this.size/2, -this.size, -this.size/3, -this.size, 0);
            ctx.bezierCurveTo(-this.size, this.size/2, -this.size/3, this.size, 0, this.size*1.3);
            ctx.bezierCurveTo(this.size/3, this.size, this.size, this.size/2, this.size, 0);
            ctx.bezierCurveTo(this.size, -this.size/3, this.size/2, -this.size/2, 0, 0);
            ctx.closePath();
            ctx.fill();
        } else {
            // Desenhar estrela suave
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * this.size/2,
                           -Math.sin((18 + i * 72) * Math.PI / 180) * this.size/2);
                ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * this.size/4,
                           -Math.sin((54 + i * 72) * Math.PI / 180) * this.size/4);
            }
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }
}

// Inicializar partículas
function initParticles() {
    particles = [];
    const count = Math.min(window.innerWidth / 15, 60);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

// --- 3. CONFETES (FESTA DE ACERTOS DO QUIZ) ---
let confettis = [];
let animConfettiId = null;

class Confetti {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.hue = Math.random() * 360;
        this.opacity = 1;
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity -= 0.005;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `hsl(${this.hue}, 90%, 65%)`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
    }
}

function launchConfetti() {
    for (let i = 0; i < 150; i++) {
        confettis.push(new Confetti());
    }
    if (!animConfettiId) {
        animateConfetti();
    }
}

function animateConfetti() {
    if (confettis.length === 0) {
        animConfettiId = null;
        return;
    }
    confettis.forEach((c, idx) => {
        c.update();
        if (c.y > canvas.height || c.opacity <= 0) {
            confettis.splice(idx, 1);
        } else {
            c.draw();
        }
    });
    animConfettiId = requestAnimationFrame(animateConfetti);
}

// --- 4. TELA DE ENTRADA (LOCK SCREEN) ---
const lockScreen = document.getElementById('lock-screen');
const mainContent = document.getElementById('main-content');
const unlockBtn = document.getElementById('unlock-btn');

if (unlockBtn) {
    unlockBtn.addEventListener('click', () => {
        // Efeito de destravamento
        lockScreen.classList.add('fade-out');
        mainContent.classList.remove('hidden');
        setTimeout(() => {
            mainContent.classList.add('reveal');
            // Inicializar partículas após destravar
            initParticles();
            animateParticles();
        }, 100);
    });
}

// --- 5. SPOTIFY WIDGET ---
const minimizeSpotifyBtn = document.getElementById('minimize-spotify');
const spotifyWidget = document.getElementById('spotify-widget-container');

if (minimizeSpotifyBtn && spotifyWidget) {
    minimizeSpotifyBtn.addEventListener('click', () => {
        spotifyWidget.classList.toggle('minimized');
        if (spotifyWidget.classList.contains('minimized')) {
            minimizeSpotifyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M19 13H5v-2h14v2z" fill="currentColor"/></svg>`;
            minimizeSpotifyBtn.style.transform = "rotate(180deg)";
        } else {
            minimizeSpotifyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M19 13H5v-2h14v2z" fill="currentColor"/></svg>`;
            minimizeSpotifyBtn.style.transform = "rotate(0deg)";
        }
    });
}

// --- 6. INTERATIVIDADE DO QUIZ ---
const quizSteps = document.querySelectorAll('.quiz-question-step');
const progressFill = document.querySelector('.progress-fill');
let currentQuizStep = 1;

document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const isCorrect = this.getAttribute('data-correct') === 'true';
        const parentStep = this.closest('.quiz-question-step');
        
        // Bloquear novas respostas enquanto processa
        const buttons = parentStep.querySelectorAll('.quiz-opt-btn');
        buttons.forEach(b => b.disabled = true);

        if (isCorrect) {
            this.classList.add('correct');
            launchConfetti();
            
            setTimeout(() => {
                goToNextQuizStep();
            }, 1000);
        } else {
            this.classList.add('incorrect');
            // Feedback vibrar ou balançar (shake) se desejar
            setTimeout(() => {
                this.classList.remove('incorrect');
                buttons.forEach(b => b.disabled = false); // Habilitar novamente para tentar
            }, 800);
        }
    });
});

function goToNextQuizStep() {
    const activeStep = document.querySelector(`.quiz-question-step[data-step="${currentQuizStep}"]`);
    if (activeStep) {
        activeStep.classList.remove('active');
    }

    currentQuizStep++;
    const nextStep = document.querySelector(`.quiz-question-step[data-step="${currentQuizStep}"]`);
    
    if (nextStep) {
        nextStep.classList.add('active');
        // Atualizar barra de progresso (3 perguntas total)
        progressFill.style.width = `${(currentQuizStep - 1) * 33.3 + 33.3}%`;
    } else {
        // Fim do quiz -> Sucesso!
        const successStep = document.getElementById('quiz-success');
        if (successStep) {
            successStep.classList.add('active');
        }
        progressFill.style.width = "100%";
        unlockEnvelope();
    }
}

function unlockEnvelope() {
    const lockOverlay = document.getElementById('envelope-lock');
    if (lockOverlay) {
        lockOverlay.style.opacity = '0';
        setTimeout(() => {
            lockOverlay.classList.add('hidden');
        }, 500);
    }
}

// --- 7. CARTA DE AMOR (ENVELOPE E TYPEWRITER) ---
const envelope = document.getElementById('envelope');
const typewriterContainer = document.getElementById('typewriter-text');
let hasTyped = false;

if (envelope) {
    envelope.addEventListener('click', function() {
        // Só abre se o quiz foi concluído (se o lock overlay sumiu)
        const isLocked = !document.getElementById('envelope-lock').classList.contains('hidden');
        if (isLocked) {
            // Animando o aviso de bloqueio no quiz
            document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' });
            return;
        }

        if (!this.classList.contains('open')) {
            this.classList.add('open');
            // Exibir botão de expandir leitura se aplicável
            setTimeout(() => {
                const btnContainer = document.getElementById('readable-letter-btn-container');
                if (btnContainer) btnContainer.classList.remove('hidden');
            }, 1000);

            // Iniciar digitação da carta
            if (!hasTyped) {
                hasTyped = true;
                setTimeout(() => {
                    typeWriter(config.letterText, 0);
                }, 800);
            }
        }
    });
}

function typeWriter(text, i) {
    if (i < text.length) {
        // Lógica de rolagem automática para ler enquanto digita
        const paper = document.getElementById('letter-paper');
        const shouldScroll = paper.scrollHeight - paper.clientHeight <= paper.scrollTop + 30;
        
        typewriterContainer.innerHTML = text.substring(0, i + 1) + '<span class="typewriter-cursor">|</span>';
        
        if (shouldScroll) {
            paper.scrollTop = paper.scrollHeight;
        }

        setTimeout(() => {
            typeWriter(text, i + 1);
        }, 45); // Velocidade de digitação
    } else {
        // Remover cursor no final
        typewriterContainer.innerHTML = text;
    }
}

// Botão para ver a carta em tela cheia/legível
const openFullLetterBtn = document.getElementById('open-full-letter-btn');
if (openFullLetterBtn) {
    openFullLetterBtn.addEventListener('click', () => {
        // Criar modal simples para leitura confortável
        const readModal = document.createElement('div');
        readModal.className = 'modal-overlay show';
        readModal.innerHTML = `
            <div class="modal-content glass" style="max-width: 600px; padding: 2rem;">
                <div class="modal-header" style="padding: 0 0 1rem 0;">
                    <h4 class="serif-title">Carta de Amor</h4>
                    <button class="close-btn" id="close-read-btn">&times;</button>
                </div>
                <div class="modal-body" style="padding: 1.5rem 0 0 0; white-space: pre-line; line-height: 1.7; font-family: var(--font-serif); font-size: 1.15rem; color: #fff;">
                    ${config.letterText}
                </div>
            </div>
        `;
        document.body.appendChild(readModal);
        
        readModal.querySelector('#close-read-btn').addEventListener('click', () => {
            readModal.remove();
        });
        readModal.addEventListener('click', (e) => {
            if (e.target === readModal) readModal.remove();
        });
    });
}

// --- 8. MODAL DE CONFIGURAÇÃO SECRETA ---
const configBtn = document.getElementById('config-btn');
const configModal = document.getElementById('config-modal');
const closeConfigBtn = document.getElementById('close-config-btn');
const saveConfigBtn = document.getElementById('save-config-btn');

if (configBtn && configModal) {
    configBtn.addEventListener('click', () => {
        configModal.classList.remove('hidden');
        configModal.classList.add('show');
    });
}

function closeModal() {
    if (configModal) {
        configModal.classList.remove('show');
        configModal.classList.add('hidden');
    }
}

if (closeConfigBtn) closeConfigBtn.addEventListener('click', closeModal);
if (saveConfigBtn) saveConfigBtn.addEventListener('click', saveConfig);

// Fechar se clicar fora
if (configModal) {
    configModal.addEventListener('click', (e) => {
        if (e.target === configModal) closeModal();
    });
}

// --- 8.5. CARROSSEL DE FOTOS ---
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
    
    const slides = Array.from(track.children);
    const dots = Array.from(dotsContainer.children);
    let currentIndex = 0;
    let autoPlayTimer = null;

    function updateCarousel() {
        const amountToMove = -currentIndex * 100;
        track.style.transform = `translateX(${amountToMove}%)`;
        
        // Atualizar dots active state
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetTimer();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetTimer();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            resetTimer();
        });
    });

    // Auto rotação a cada 4 segundos
    function startTimer() {
        autoPlayTimer = setInterval(nextSlide, 4000);
    }

    function resetTimer() {
        clearInterval(autoPlayTimer);
        startTimer();
    }

    // Pausar auto rotação quando o mouse estiver em cima
    const container = document.querySelector('.carousel-container');
    if (container) {
        container.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
        container.addEventListener('mouseleave', startTimer);
    }

    startTimer();
}

// --- 9. INICIALIZAR SITE ---
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    initCarousel();
});
