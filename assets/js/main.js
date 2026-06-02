document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================================================
    // 1. NAVIGATION ACTIVE CLASS SWITCHER
    // ==========================================================================
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(item => {
        item.addEventListener("click", function () {
            document.querySelector(".nav-item.active")?.classList.remove("active");
            this.classList.add("active");
        });
    });

    // ==========================================================================
    // 2. HERO SCROLL ARROW CLICK TRIGGER
    // ==========================================================================
    const scrollArrow = document.querySelector(".scroll-arrow");
    const aboutSection = document.querySelector("#about");

    if (scrollArrow && aboutSection) {
        scrollArrow.addEventListener("click", function () {
            aboutSection.scrollIntoView({ behavior: "smooth" });
        });
        scrollArrow.style.cursor = "pointer";
    }

    // ==========================================================================
    // 3. SKILLS PROGRESS BAR ANIMATION LOGIC
    // ==========================================================================
    const progressFills = document.querySelectorAll('.progress-bar-fill');

    const observerOptions = {
        root: null,
        threshold: 0.15
    };

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.getAttribute('data-progress');
                bar.style.width = targetWidth;
                observer.unobserve(bar);
            }
        });
    }, observerOptions);

    progressFills.forEach(fill => {
        skillsObserver.observe(fill);
    });

    // ==========================================================================
    // 4. GITHUB DYNAMIC LANGUAGES INJECTOR
    // ==========================================================================
    const githubUser = "kaungthantzaw28527";
    const projectCards = document.querySelectorAll(".project-card-box");

    async function fetchProjectLanguages(repoName) {
        try {
            const response = await fetch(`https://api.github.com/repos/${githubUser}/${repoName}/languages`);
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error(`Error loading languages for ${repoName}:`, error);
            return null;
        }
    }

    async function injectLiveProjectLanguages() {
        for (const card of projectCards) {
            const repoName = card.getAttribute("data-repo");
            const langContainer = card.querySelector(".project-languages-container");
            
            if (!repoName || !langContainer) continue;

            const languagesData = await fetchProjectLanguages(repoName);

            if (languagesData && Object.keys(languagesData).length > 0) {
                langContainer.innerHTML = "";

                const repoTotalBytes = Object.values(languagesData).reduce((a, b) => a + b, 0);

                for (const [lang, bytes] of Object.entries(languagesData)) {
                    const percentage = ((bytes / repoTotalBytes) * 100).toFixed(0);
                    
                    if (percentage < 1) continue; 

                    const langItemHtml = `
                        <div class="proj-lang-item">
                            <div class="proj-lang-info">
                                <span class="proj-lang-name">${lang.toUpperCase()}</span>
                                <span class="proj-lang-pct">${percentage}%</span>
                            </div>
                            <div class="proj-progress-bg">
                                <div class="proj-progress-fill" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    `;
                    
                    langContainer.insertAdjacentHTML("beforeend", langItemHtml);
                }
            } else {
                langContainer.innerHTML = `<span class="loading-text" style="color: #444;">No dynamic tags found</span>`;
            }
        }
    }

    // GitHub Languages Injector ကို စတင် Run စေခြင်း
    injectLiveProjectLanguages();

});