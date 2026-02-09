/**
 * Nate's Valentine Surprise - script.js
 */

// --- 1. Loading Screen Logic ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1000);
        }, 1500);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Core Elements
    const seal = document.getElementById('sealButton');
    const wrapper = document.getElementById('wrapper');
    const envelopePage = document.getElementById('envelope-page');
    const bouquetPage = document.getElementById('bouquet-page');
    const resetBtn = document.getElementById('resetBtn');
    
    // Audio
    const openSound = document.getElementById('openSound');
    const magicSound = document.getElementById('magicSound');
    const bgMusic = document.getElementById('bgMusic');
    const muteBtn = document.getElementById('muteBtn');

    // Modals
    const photoModal = document.getElementById('photo-modal');
    const letterModal = document.getElementById('letter-modal');
    const finalLetterBtn = document.getElementById('final-letter-btn');
    const popupImg = document.getElementById('popup-img');
    const modalText = document.getElementById('modal-text');
    const typewriterElement = document.getElementById('typewriter-text');

    // Tracking
    let clickedFlowers = new Set();
    const flowers = document.querySelectorAll('.interactive');
    const totalFlowers = flowers.length;

    const triggerVibration = (ms = 50) => {
        if (navigator.vibrate) navigator.vibrate(ms);
    };

    // --- Special Particle Effects ---
    const createParticle = (x, y, char = '✨', isHeart = false) => {
        const particle = document.createElement('div');
        particle.innerHTML = char;
        particle.className = 'heart-particle';
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '25000';
        particle.style.fontSize = isHeart ? '25px' : '20px';
        
        // Random trajectory for bursts
        const destinationX = (Math.random() - 0.5) * 300;
        const destinationY = (Math.random() - 0.5) * 300;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${destinationX}px, ${destinationY}px) scale(0)`, opacity: 0 }
        ], {
            duration: isHeart ? 1500 : 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            fill: 'forwards'
        });

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1500);
    };

    // --- Envelope Logic ---
    if (seal) {
        seal.addEventListener('click', (e) => {
            triggerVibration(100);
            for(let i=0; i<8; i++) createParticle(e.clientX, e.clientY);
            
            if (openSound) openSound.play();
            if (bgMusic) {
                bgMusic.volume = 0.6;
                bgMusic.play().catch(err => console.log("Music blocked:", err));
            }

            wrapper.classList.add('open');
            
            setTimeout(() => {
                envelopePage.style.opacity = "0";
                setTimeout(() => {
                    envelopePage.style.display = "none";
                    bouquetPage.classList.remove('hidden');
                    setTimeout(() => {
                        bouquetPage.style.opacity = "1";
                        if (magicSound) magicSound.play();
                    }, 50);
                }, 800);
            }, 2500);
        });
    }

    // --- Flower Logic ---
    flowers.forEach((flower, index) => {
        flower.addEventListener('click', (e) => {
            triggerVibration(40);
            
            // Effect: If it's the Orchid, create a larger heart burst and shake
            if (flower.classList.contains('orchid')) {
                for(let i=0; i<15; i++) createParticle(e.clientX, e.clientY, '💚', true);
                bouquetPage.animate([
                    { transform: 'translate(1px, 1px) rotate(0deg)' },
                    { transform: 'translate(-1px, -2px) rotate(-1deg)' },
                    { transform: 'translate(-3px, 0px) rotate(1deg)' },
                    { transform: 'translate(0px, 2px) rotate(0deg)' }
                ], { duration: 200, iterations: 2 });
            } else {
                for(let i=0; i<5; i++) createParticle(e.clientX, e.clientY);
            }

            clickedFlowers.add(index);
            
            // Set Modal Content
            if (popupImg) popupImg.src = flower.getAttribute('data-img');
            if (modalText) modalText.innerText = flower.getAttribute('data-note');
            
            // Show Modal
            if (photoModal) photoModal.classList.remove('modal-hidden');

            // Check progress
            if (clickedFlowers.size === totalFlowers) {
                setTimeout(() => {
                    if (finalLetterBtn) {
                        finalLetterBtn.classList.remove('hidden');
                        triggerVibration([50, 100, 50]);
                    }
                }, 800);
            }
        });
    });

    // --- Letter Typewriter Logic ---
    const message = "Happy Valentine's Day mga Vayet, lovelots heart heart";
    let isTyping = false;
    let charIndex = 0;

    function startTypewriter() {
        if (charIndex < message.length) {
            typewriterElement.innerHTML += message.charAt(charIndex);
            charIndex++;
            setTimeout(startTypewriter, 55);
        } else {
            const sig = document.querySelector('.signature');
            if(sig) sig.style.opacity = '1';
        }
    }

    if (finalLetterBtn) {
        finalLetterBtn.onclick = () => {
            if (letterModal) {
                letterModal.classList.add('letter-modal-show');
                triggerVibration(60);
                if (!isTyping) {
                    isTyping = true;
                    setTimeout(startTypewriter, 1000);
                }
            }
        };
    }

    // --- Modal Closing Logic ---
    const closeModals = () => {
        if (photoModal) photoModal.classList.add('modal-hidden');
        if (letterModal) letterModal.classList.remove('letter-modal-show');
    };

    document.querySelectorAll('.close-modal, .close-letter').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            closeModals();
        };
    });

    window.onclick = (e) => {
        if (e.target === photoModal || e.target === letterModal) closeModals();
    };

    // --- Counter Logic ---
    function updateCounter() {
        const anniversaryDate = new Date(2023, 9, 2, 0, 0); 
        const now = new Date();
        const diffInMs = now - anniversaryDate;
        
        const totalMinutes = Math.floor(diffInMs / (1000 * 60));
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);

        const years = Math.floor(totalDays / 365);
        const remainingDays = totalDays % 365;
        const remainingHours = totalHours % 24;
        const remainingMins = totalMinutes % 60;

        const counterElement = document.getElementById('days-value');
        if (counterElement) {
            let timeString = "";
            if (years > 0) timeString += `${years}y `;
            timeString += `${remainingDays}d ${remainingHours}h ${remainingMins}m`;
            counterElement.innerText = timeString + " Together";
        }
    }

    updateCounter();
    setInterval(updateCounter, 60000);

    // --- UI Controls ---
    if (muteBtn) {
        muteBtn.onclick = () => {
            if (bgMusic) {
                bgMusic.muted = !bgMusic.muted;
                muteBtn.innerText = bgMusic.muted ? "🔇" : "🔊";
            }
        };
    }

    if (resetBtn) {
        resetBtn.onclick = () => {
            bouquetPage.style.opacity = "0";
            setTimeout(() => location.reload(), 500);
        };
    }

    // --- Ambient Floating Particles ---
    setInterval(() => {
        const container = document.getElementById('heart-container');
        if (!container || !bouquetPage || bouquetPage.classList.contains('hidden')) return;
        
        const p = document.createElement('div');
        p.className = 'heart-particle';
        const items = ['💚', '🌿', '🍃', '🌱', '✨'];
        p.innerHTML = items[Math.floor(Math.random() * items.length)];
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = '-10%';
        p.style.fontSize = (Math.random() * 15 + 10) + 'px';
        p.style.opacity = Math.random();
        p.style.position = 'fixed';
        
        const fallDuration = (Math.random() * 3 + 4);
        p.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: p.style.opacity },
            { transform: `translateY(110vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: fallDuration * 1000,
            easing: 'linear'
        });

        container.appendChild(p);
        setTimeout(() => p.remove(), fallDuration * 1000);
    }, 450);
});