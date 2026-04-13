/**
 * BanG jack - 资源预加载管理器
 * @description 负责预加载游戏所需的各类资源（图片、音频），并提供可视化加载进度
 * @version 1.0
 */

class ResourcePreloader {
    constructor() {
        this.resources = {
            images: [],
            audio: []
        };
        this.loaded = {
            images: 0,
            audio: 0
        };
        this.total = {
            images: 0,
            audio: 0
        };
        this.callbacks = {
            progress: null,
            complete: null,
            error: null
        };
        this.errors = [];
    }

    /**
     * 设置回调函数
     * @param {Object} callbacks - 回调函数对象
     * @param {Function} callbacks.progress - 进度回调
     * @param {Function} callbacks.complete - 完成回调
     * @param {Function} callbacks.error - 错误回调
     */
    setCallbacks(callbacks) {
        if (callbacks.progress) this.callbacks.progress = callbacks.progress;
        if (callbacks.complete) this.callbacks.complete = callbacks.complete;
        if (callbacks.error) this.callbacks.error = callbacks.error;
    }

    /**
     * 添加图片资源
     * @param {string|string[]} paths - 图片路径或路径数组
     */
    addImages(paths) {
        const pathArray = Array.isArray(paths) ? paths : [paths];
        this.resources.images.push(...pathArray);
        this.total.images += pathArray.length;
    }

    /**
     * 添加音频资源
     * @param {string|string[]} paths - 音频路径或路径数组
     */
    addAudio(paths) {
        const pathArray = Array.isArray(paths) ? paths : [paths];
        this.resources.audio.push(...pathArray);
        this.total.audio += pathArray.length;
    }

    /**
     * 开始预加载所有资源
     */
    async start() {
        console.log('[Preloader] 开始预加载资源...');
        console.log(`[Preloader] 图片: ${this.total.images} 个, 音频: ${this.total.audio} 个`);

        const loadPromises = [];

        // 加载图片
        for (const path of this.resources.images) {
            loadPromises.push(this.loadImage(path));
        }

        // 加载音频
        for (const path of this.resources.audio) {
            loadPromises.push(this.loadAudio(path));
        }

        try {
            await Promise.all(loadPromises);
            console.log('[Preloader] 所有资源加载完成！');
            
            if (this.errors.length > 0) {
                console.warn('[Preloader] 部分资源加载失败:', this.errors);
            }

            if (this.callbacks.complete) {
                this.callbacks.complete();
            }
        } catch (error) {
            console.error('[Preloader] 预加载过程中发生错误:', error);
            if (this.callbacks.error) {
                this.callbacks.error(error);
            }
        }
    }

    /**
     * 加载单张图片
     * @param {string} path - 图片路径
     * @returns {Promise} 加载Promise
     */
    loadImage(path) {
        return new Promise((resolve) => {
            const img = new Image();
            
            img.onload = () => {
                this.loaded.images++;
                this.updateProgress();
                resolve({ type: 'image', path, status: 'success' });
            };

            img.onerror = () => {
                this.loaded.images++;
                this.errors.push({ type: 'image', path });
                this.updateProgress();
                resolve({ type: 'image', path, status: 'error' });
            };

            img.src = path;
        });
    }

    /**
     * 加载单个音频
     * @param {string} path - 音频路径
     * @returns {Promise} 加载Promise
     */
    loadAudio(path) {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.preload = 'auto';

            const handleLoad = () => {
                this.loaded.audio++;
                this.updateProgress();
                resolve({ type: 'audio', path, status: 'success' });
            };

            const handleError = () => {
                this.loaded.audio++;
                this.errors.push({ type: 'audio', path });
                this.updateProgress();
                resolve({ type: 'audio', path, status: 'error' });
            };

            audio.addEventListener('canplaythrough', handleLoad, { once: true });
            audio.addEventListener('error', handleError, { once: true });
            
            // 设置超时，避免长时间等待
            setTimeout(() => {
                if (audio.readyState < 2) {
                    handleLoad();
                }
            }, 10000);

            audio.src = path;
        });
    }

    /**
     * 更新加载进度
     */
    updateProgress() {
        const totalLoaded = this.loaded.images + this.loaded.audio;
        const totalResources = this.total.images + this.total.audio;
        const progress = totalResources > 0 ? (totalLoaded / totalResources) * 100 : 0;

        if (this.callbacks.progress) {
            this.callbacks.progress({
                progress,
                images: {
                    loaded: this.loaded.images,
                    total: this.total.images
                },
                audio: {
                    loaded: this.loaded.audio,
                    total: this.total.audio
                }
            });
        }
    }

    /**
     * 获取加载状态
     * @returns {Object} 加载状态
     */
    getStatus() {
        const totalLoaded = this.loaded.images + this.loaded.audio;
        const totalResources = this.total.images + this.total.audio;
        return {
            progress: totalResources > 0 ? (totalLoaded / totalResources) * 100 : 0,
            images: this.loaded.images,
            totalImages: this.total.images,
            audio: this.loaded.audio,
            totalAudio: this.total.audio,
            errors: this.errors
        };
    }
}

/**
 * 预加载界面控制器
 */
class PreloadUI {
    constructor(preloader) {
        this.preloader = preloader;
        this.container = null;
        this.progressBar = null;
        this.progressText = null;
        this.statusText = null;
        this.particles = [];
        this.isAnimating = false;
    }

    /**
     * 初始化预加载界面
     */
    init() {
        this.createUI();
        this.setupCallbacks();
        this.startParticles();
    }

    /**
     * 创建UI元素
     */
    createUI() {
        this.container = document.createElement('div');
        this.container.id = 'preloader-container';
        this.container.innerHTML = `
            <div class="preloader-content">
                <div class="preloader-logo">
                    <div class="logo-icon">🎸</div>
                </div>
                <h1 class="preloader-title">邦杰克!</h1>
                <p class="preloader-subtitle">资源加载中...</p>
                
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="progress-info">
                        <span class="progress-percent">0%</span>
                        <span class="progress-detail">准备中...</span>
                    </div>
                </div>

                <div class="loading-status">
                    <div class="status-item">
                        <span class="status-icon">🖼️</span>
                        <span class="status-text">图片: <span id="image-progress">0/0</span></span>
                    </div>
                    <div class="status-item">
                        <span class="status-icon">🎵</span>
                        <span class="status-text">音频: <span id="audio-progress">0/0</span></span>
                    </div>
                </div>

                <div class="loading-tips">
                    <div class="tip-icon">💡</div>
                    <div class="tip-text">正在为您准备精彩的游戏体验...</div>
                </div>

                <div class="preloader-particles" id="preloader-particles"></div>
            </div>
        `;

        document.body.appendChild(this.container);

        // 缓存DOM元素
        this.progressFill = this.container.querySelector('.progress-fill');
        this.progressPercent = this.container.querySelector('.progress-percent');
        this.progressDetail = this.container.querySelector('.progress-detail');
        this.imageProgress = this.container.querySelector('#image-progress');
        this.audioProgress = this.container.querySelector('#audio-progress');
        this.particlesContainer = this.container.querySelector('#preloader-particles');
    }

    /**
     * 设置回调函数
     */
    setupCallbacks() {
        this.preloader.setCallbacks({
            progress: (data) => this.onProgress(data),
            complete: () => this.onComplete(),
            error: (error) => this.onError(error)
        });
    }

    /**
     * 进度更新回调
     * @param {Object} data - 进度数据
     */
    onProgress(data) {
        // 更新进度条
        const percent = Math.round(data.progress);
        this.progressFill.style.width = `${percent}%`;
        this.progressPercent.textContent = `${percent}%`;

        // 更新详细状态
        this.imageProgress.textContent = `${data.images.loaded}/${data.images.total}`;
        this.audioProgress.textContent = `${data.audio.loaded}/${data.audio.total}`;

        // 动态提示文本
        const tips = [
            '加载精美卡牌...',
            '准备音效...',
            '邀请乐队成员...',
            '调整舞台灯光...',
            '调试乐器...'
        ];
        const tipIndex = Math.min(Math.floor(percent / 20), tips.length - 1);
        this.progressDetail.textContent = tips[tipIndex];
    }

    /**
     * 加载完成回调
     */
    onComplete() {
        this.progressDetail.textContent = '加载完成！';
        
        // 添加完成动画
        this.container.classList.add('complete');
        
        // 延迟隐藏预加载界面
        setTimeout(() => {
            this.hide();
        }, 800);
    }

    /**
     * 错误回调
     * @param {Error} error - 错误对象
     */
    onError(error) {
        console.error('[PreloadUI] 加载错误:', error);
        this.progressDetail.textContent = '部分资源加载失败，游戏仍可继续';
    }

    /**
     * 隐藏预加载界面
     */
    hide() {
        this.stopParticles();
        this.container.classList.add('hidden');
        
        setTimeout(() => {
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
            
            // 触发加载完成事件
            const event = new CustomEvent('preloadComplete');
            document.dispatchEvent(event);
        }, 500);
    }

    /**
     * 启动粒子动画
     */
    startParticles() {
        this.isAnimating = true;
        this.createParticles();
        this.animateParticles();
    }

    /**
     * 创建粒子
     */
    createParticles() {
        const particleCount = 50;
        const icons = ['🎵', '🎸', '🥁', '🎹', '🎤', '✨', '💫', '⭐', '🌟', '💖', '🎶', '🪕', '🎺', '🎻'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'preloader-particle';
            particle.textContent = icons[Math.floor(Math.random() * icons.length)];
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.bottom = `${Math.random() * 50}px`;
            particle.style.animationDelay = `${Math.random() * 8}s`;
            particle.style.opacity = '0';
            particle.style.fontSize = `${Math.random() * 20 + 16}px`;
            this.particlesContainer.appendChild(particle);
            
            // 存储粒子的初始状态
            particle.dataset.initialLeft = particle.style.left;
            this.particles.push(particle);
        }
    }

    /**
     * 动画粒子
     */
    animateParticles() {
        if (!this.isAnimating) return;

        this.particles.forEach((particle) => {
            if (Math.random() < 0.015) {
                const height = Math.random() * 250 + 100;
                const horizontal = (Math.random() - 0.5) * 200;
                const rotation = Math.random() * 720 - 360;
                const duration = Math.random() * 2000 + 3000;
                
                particle.style.opacity = Math.random() * 0.7 + 0.3;
                particle.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
                particle.style.transform = `translate(${horizontal}px, -${height}px) rotate(${rotation}deg) scale(${Math.random() * 0.5 + 0.5})`;
                
                setTimeout(() => {
                    particle.style.opacity = '0';
                    particle.style.transform = 'translateY(0) rotate(0deg) scale(1)';
                }, duration);
            }
        });

        requestAnimationFrame(() => this.animateParticles());
    }

    /**
     * 停止粒子动画
     */
    stopParticles() {
        this.isAnimating = false;
    }
}

// 导出到全局
window.ResourcePreloader = ResourcePreloader;
window.PreloadUI = PreloadUI;
