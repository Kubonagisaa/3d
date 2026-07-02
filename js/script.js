const canvas = document.getElementById("canvas-video");
const context = canvas.getContext("2d");
const steps = document.querySelectorAll(".overlay-step");
const dots = document.querySelectorAll(".hotbar-dot");
const menuLinks = document.querySelectorAll(".nav-link");
const preloader = document.getElementById("preloader");
const loaderPercentage = document.getElementById("loader-percentage");

const hamburger = document.querySelector(".hamburger");
const sidebar = document.getElementById("menu-sidebar");
const creditBtn = document.getElementById("credit-btn");
const profileBtn = document.getElementById("profile-btn");
const creditModal = document.getElementById("credit-modal");
const profileModal = document.getElementById("profile-modal");
const preorderBtn = document.querySelector(".btn-preorder");
const preorderModal = document.getElementById("preorder-modal");
const preorderForm = document.getElementById("preorder-form");

const frameCount = 100; 
const currentFrame = index => {
    const paddedIndex = String(index).padStart(3, '0');
    return `../frames/ezgif-frame-${paddedIndex}.jpg`;
};

const images = [];
let targetFrame = 1;
let actualFrame = 1;
const easing = 0.05; 

let currentActiveIndex = -1;
let activeTypingTimeouts = [];

function updateNavUnderline() {
    const activeLink = document.querySelector(".nav-link.active");
    const underline = document.querySelector(".nav-underline");
    if (activeLink && underline) {
        underline.style.left = `${activeLink.offsetLeft}px`;
        underline.style.width = `${activeLink.offsetWidth}px`;
    }
}

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
}

function renderImage(frameIndex) {
    const img = images[frameIndex - 1];
    if (!img || img.width === 0) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const imgRatio = img.width / img.height;
    const canvasRatio = window.innerWidth / window.innerHeight;
    let drawWidth, drawHeight, drawX, drawY;

    if (canvasRatio < 1) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        drawX = 0;
        drawY = (canvas.height - drawHeight) / 2;
    } else {
        if (imgRatio > canvasRatio) {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgRatio;
            drawX = (canvas.width - drawWidth) / 2;
            drawY = 0;
        } else {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            drawX = 0;
            drawY = (canvas.height - drawHeight) / 2;
        }
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
}

resizeCanvas();

let loadedImagesCount = 0;
for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
        loadedImagesCount++;
        const percentage = Math.round((loadedImagesCount / frameCount) * 100);
        loaderPercentage.textContent = `${percentage}%`;

        if (loadedImagesCount === frameCount) {
            preloader.classList.add("fade-out");
            renderImage(1);
            updateNavUnderline(); 
            requestAnimationFrame(loop);
        }
    };
    images.push(img);
}

const isMobile = window.innerWidth < 768;
const mobileMilestones = [1, 30, 55, 80, 95];
let currentMobileStep = 0;

hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    hamburger.classList.toggle("open");
    sidebar.classList.toggle("open");
});

creditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    hamburger.classList.remove("open");
    sidebar.classList.remove("open");
    creditModal.classList.add("open");
    
    const modalTitle = creditModal.querySelector(".modal-title");
    modalTitle.style.animation = 'none';
    void modalTitle.offsetWidth; 
    modalTitle.style.animation = 'cinematicHeaderReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards';
});

profileBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    hamburger.classList.remove("open");
    sidebar.classList.remove("open");
    profileModal.classList.add("open");
    
    const modalTitle = profileModal.querySelector(".modal-title");
    modalTitle.style.animation = 'none';
    void modalTitle.offsetWidth; 
    modalTitle.style.animation = 'cinematicHeaderReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards';
});

menuLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        
        link.classList.remove("bounce-active");
        void link.offsetWidth; 
        link.classList.add("bounce-active");
        
        link.addEventListener("animationend", () => {
            link.classList.remove("bounce-active");
        }, { once: true });

        hamburger.classList.remove("open");
        sidebar.classList.remove("open");

        const stepIndex = parseInt(link.getAttribute("data-step"));
        
        if (isMobile) {
            currentMobileStep = stepIndex;
            targetFrame = mobileMilestones[currentMobileStep];
        } else {
            const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
            const targetMilestoneFrame = mobileMilestones[stepIndex];
            const targetScroll = ((targetMilestoneFrame - 1) / (frameCount - 1)) * maxScrollTop;
            
            window.scrollTo({
                top: targetScroll,
                behavior: "smooth"
            });
        }
    });
});

preorderBtn.addEventListener("click", (e) => {
    e.preventDefault();
    preorderModal.classList.add("open");
    
    const modalTitle = preorderModal.querySelector(".modal-title");
    modalTitle.style.animation = 'none';
    void modalTitle.offsetWidth; 
    modalTitle.style.animation = 'cinematicHeaderReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards';
});

document.querySelectorAll(".close-modal").forEach(button => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetModal = button.closest(".modal");
        if (targetModal) {
            targetModal.classList.remove("open");
        }
    });
});

window.addEventListener("click", (e) => { 
    if (e.target === preorderModal) preorderModal.classList.remove("open");
    if (e.target === creditModal) creditModal.classList.remove("open");
    if (e.target === profileModal) profileModal.classList.remove("open");
    
    if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove("open");
        sidebar.classList.remove("open");
    }
});

preorderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thank you! Your pre-order request has been received.");
    preorderModal.classList.remove("open");
    preorderForm.reset();
});

if (isMobile) {
    targetFrame = mobileMilestones[0];
    window.addEventListener("click", (e) => {
        if (e.target.closest('.btn-preorder') || e.target.closest('.nav-link') || e.target.closest('.hamburger') || e.target.closest('.modal-content') || e.target.closest('.sidebar-drawer')) return;
        
        const halfWidth = window.innerWidth / 2;
        const clickX = e.clientX;

        if (clickX > halfWidth) {
            currentMobileStep = (currentMobileStep + 1) % mobileMilestones.length;
        } else {
            currentMobileStep = (currentMobileStep - 1 + mobileMilestones.length) % mobileMilestones.length;
        }
        
        targetFrame = mobileMilestones[currentMobileStep];
    });
} else {
    window.addEventListener("scroll", () => {
        const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
        let scrollFraction = window.scrollY / maxScrollTop;

        if (scrollFraction < 0) scrollFraction = 0;
        if (scrollFraction > 1) scrollFraction = 1;

        targetFrame = Math.floor(scrollFraction * (frameCount - 1)) + 1;
    });
}

function runTypeWriterEffect(element, text, speed = 12) {
    element.textContent = "";
    let characterIndex = 0;
    
    function startTyping() {
        if (characterIndex < text.length) {
            element.textContent += text.charAt(characterIndex);
            characterIndex++;
            const timeoutId = setTimeout(startTyping, speed);
            activeTypingTimeouts.push(timeoutId);
        }
    }
    startTyping();
}

function updateTextOverlay(frame) {
    let activeIndex = 0;

    if (frame >= 1 && frame <= 20) {
        activeIndex = 0; 
    } else if (frame > 20 && frame <= 45) {
        activeIndex = 1; 
    } else if (frame > 45 && frame <= 70) {
        activeIndex = 2; 
    } else if (frame > 70 && frame <= 88) {
        activeIndex = 3; 
    } else if (frame > 88 && frame <= 100) {
        activeIndex = 4; 
    }

    if (activeIndex !== currentActiveIndex) {
        currentActiveIndex = activeIndex;

        activeTypingTimeouts.forEach(id => clearTimeout(id));
        activeTypingTimeouts = [];

        steps.forEach((step, index) => {
            const pTags = step.querySelectorAll(".text-bottom p");
            
            if (index === activeIndex) {
                step.classList.add("active");
                pTags.forEach(pTag => {
                    const targetText = pTag.getAttribute("data-text");
                    if (targetText) {
                        runTypeWriterEffect(pTag, targetText, 10);
                    }
                });
            } else {
                step.classList.remove("active");
                pTags.forEach(pTag => {
                    if(pTag.getAttribute("data-text")) {
                        pTag.textContent = "";
                    }
                });
            }
        });

        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });

        menuLinks.forEach((link, index) => {
            if (index === activeIndex) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });

        updateNavUnderline();
    }
}

function loop() {
    actualFrame += (targetFrame - actualFrame) * easing;
    const currentRenderFrame = Math.round(actualFrame);
    
    renderImage(currentRenderFrame);
    updateTextOverlay(currentRenderFrame);
    
    requestAnimationFrame(loop);
}

window.addEventListener("resize", () => {
    resizeCanvas();
    renderImage(Math.round(actualFrame));
    updateNavUnderline();
});
