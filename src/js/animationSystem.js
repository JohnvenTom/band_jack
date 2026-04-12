/**
 * BanG jack - 动画系统
 * @description 提供卡牌动画效果
 * @version 2.0
 */

class AnimationSystem {
    /**
     * 构造函数
     * @param {Object} config - 游戏配置对象
     * @description 初始化动画系统
     */
    constructor(config) {
        this.config = config;
        this.animationQueue = [];
        this.isAnimating = false;
        this.gsapLoaded = false;
        
        this.init();
    }

    /**
     * 初始化动画系统
     * @returns {void}
     * @description 检测GSAP并初始化
     */
    init() {
        if (typeof gsap !== 'undefined') {
            this.gsapLoaded = true;
            console.log('GSAP动画库已加载');
        } else {
            console.log('使用CSS动画');
        }
    }

    /**
     * 发牌动画
     * @param {HTMLElement} cardEl - 卡牌元素
     * @param {Object} options - 动画选项
     * @param {Function} callback - 回调函数
     * @returns {void}
     * @description 执行发牌动画，平滑流畅带有轻微3D效果
     */
    dealCard(cardEl, options = {}, callback) {
        const {
            startX = 0,
            startY = -200,
            duration = 500,
            delay = 0
        } = options;

        const cardRect = cardEl.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        
        const offsetX = startX - cardCenterX;
        const offsetY = startY - cardCenterY;

        cardEl.style.opacity = '0';
        cardEl.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.8) rotateY(180deg) rotateZ(15deg)`;
        cardEl.style.transformOrigin = 'center center';
        cardEl.style.willChange = 'transform, opacity';

        const startTime = performance.now() + delay;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            
            if (elapsed < 0) {
                requestAnimationFrame(animate);
                return;
            }
            
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = this.easeOutCubic(progress);
            const bounceProgress = this.easeOutBack(progress);
            
            const currentX = offsetX * (1 - easeProgress);
            const currentY = offsetY * (1 - bounceProgress);
            
            const rotateY = 180 * (1 - easeProgress);
            const rotateZ = 15 * (1 - easeProgress);
            const scale = 0.8 + 0.2 * easeProgress;
            
            cardEl.style.opacity = easeProgress.toString();
            cardEl.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale}) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                cardEl.style.opacity = '1';
                cardEl.style.transform = 'translate(0, 0)';
                cardEl.style.willChange = '';
                
                if (callback) callback();
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * 翻牌动画
     * @param {HTMLElement} cardEl - 卡牌元素
     * @param {Function} callback - 回调函数
     * @returns {void}
     * @description 平滑的3D翻转效果
     */
    flipCard(cardEl, callback) {
        const duration = 400;
        const startTime = performance.now();
        
        const innerEl = cardEl.querySelector('.card-inner');
        if (!innerEl) {
            cardEl.classList.toggle('face-down');
            if (callback) callback();
            return;
        }
        
        const isFaceDown = cardEl.classList.contains('face-down');
        const startRotate = isFaceDown ? 180 : 0;
        const endRotate = isFaceDown ? 360 : 180;
        
        innerEl.style.transition = 'none';
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = this.easeInOutCubic(progress);
            const rotateY = startRotate + (endRotate - startRotate) * easeProgress;
            
            innerEl.style.transform = `rotateY(${rotateY}deg)`;
            
            if (progress < 0.5) {
                cardEl.style.boxShadow = `0 0 ${20 * easeProgress}px rgba(255, 182, 193, ${easeProgress})`;
            } else {
                cardEl.style.boxShadow = `0 0 ${20 * (1 - easeProgress)}px rgba(255, 182, 193, ${1 - easeProgress})`;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                cardEl.classList.toggle('face-down');
                innerEl.style.transform = '';
                innerEl.style.transition = '';
                cardEl.style.boxShadow = '';
                
                if (callback) callback();
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * 缓动函数 - easeOutCubic
     * @param {number} t - 进度 (0-1)
     * @returns {number} 缓动后的进度
     * @description 三次缓出函数
     */
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    /**
     * 缓动函数 - easeInOutCubic
     * @param {number} t - 进度 (0-1)
     * @returns {number} 缓动后的进度
     * @description 三次缓入缓出函数
     */
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    /**
     * 缓动函数 - easeOutBack
     * @param {number} t - 进度 (0-1)
     * @returns {number} 缓动后的进度
     * @description 回弹缓出函数
     */
    easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    /**
     * 震动元素
     * @param {HTMLElement} element - 目标元素
     * @param {number} duration - 持续时间
     * @returns {void}
     * @description 使元素产生震动效果
     */
    shakeElement(element, duration) {
        const startTime = performance.now();
        const originalTransform = element.style.transform || '';
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                const shake = Math.sin(progress * Math.PI * 8) * (1 - progress) * 3;
                element.style.transform = `${originalTransform} translateX(${shake}px)`;
                requestAnimationFrame(animate);
            } else {
                element.style.transform = originalTransform;
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * 批量发牌动画
     * @param {Array} cards - 卡牌元素数组
     * @param {Object} options - 动画选项
     * @param {Function} callback - 回调函数
     * @returns {void}
     * @description 批量执行发牌动画，带有延迟效果
     */
    dealCards(cards, options = {}, callback) {
        let completed = 0;
        const total = cards.length;
        const staggerDelay = options.staggerDelay || 150;
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                this.dealCard(card, {
                    ...options,
                    delay: 0
                }, () => {
                    completed++;
                    if (completed === total && callback) {
                        callback();
                    }
                });
            }, index * staggerDelay);
        });
    }
}

window.AnimationSystem = AnimationSystem;
