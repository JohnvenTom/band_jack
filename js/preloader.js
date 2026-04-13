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
        this.hasTriggeredComplete = false;
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

                <button class="skip-button" id="skip-button">
                    <span class="skip-icon">▶️</span>
                    <span class="skip-text">跳过加载</span>
                </button>

                <div class="preloader-particles" id="preloader-particles"></div>
            </div>
            
            <!-- 迷你模式 -->
            <div class="preloader-mini" id="preloader-mini">
                <div class="mini-icon">🎸</div>
                <div class="mini-progress">
                    <div class="mini-progress-bar">
                        <div class="mini-progress-fill" id="mini-progress-fill"></div>
                    </div>
                    <span class="mini-percent" id="mini-percent">0%</span>
                </div>
                <button class="mini-close" id="mini-close">✕</button>
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
        this.skipButton = this.container.querySelector('#skip-button');
        this.miniContainer = this.container.querySelector('#preloader-mini');
        this.miniProgressFill = this.container.querySelector('#mini-progress-fill');
        this.miniPercent = this.container.querySelector('#mini-percent');
        this.miniClose = this.container.querySelector('#mini-close');
        
        // 绑定跳过按钮事件
        this.skipButton.addEventListener('click', () => this.onSkip());
        this.miniClose.addEventListener('click', () => this.hide());
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
        
        // 更新迷你进度条
        if (this.miniProgressFill) {
            this.miniProgressFill.style.width = `${percent}%`;
        }
        if (this.miniPercent) {
            this.miniPercent.textContent = `${percent}%`;
        }

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
     * 跳过加载
     */
    onSkip() {
        // 切换到迷你模式
        this.container.classList.add('mini-mode');
        this.stopParticles();
        
        // 触发加载完成事件，让游戏开始
        this.triggerCompleteEvent();
    }

    /**
     * 安全触发完成事件（只触发一次）
     */
    triggerCompleteEvent() {
        if (this.hasTriggeredComplete) return;
        
        this.hasTriggeredComplete = true;
        const event = new CustomEvent('preloadComplete');
        document.dispatchEvent(event);
    }

    /**
     * 加载完成回调
     */
    onComplete() {
        this.progressDetail.textContent = '加载完成！';
        
        // 如果还没有触发完成事件（用户没有跳过），则触发
        if (!this.hasTriggeredComplete) {
            this.triggerCompleteEvent();
        }
        
        // 如果已经在迷你模式，直接隐藏
        if (this.container.classList.contains('mini-mode')) {
            setTimeout(() => {
                this.hide();
            }, 1000);
        } else {
            // 否则显示完成动画后隐藏
            this.container.classList.add('complete');
            setTimeout(() => {
                this.hide();
            }, 800);
        }
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
            
            // 存储粒子的动画参数
            particle.dataset.x = Math.random() * 90 + 5; // 避免贴边
            particle.dataset.y = Math.random() * 50 + 20; // 从底部开始
            particle.dataset.vx = (Math.random() - 0.5) * 0.8;
            particle.dataset.vy = Math.random() * 1.2 + 0.8; // 向上飘的速度
            particle.dataset.rotation = Math.random() * 360;
            particle.dataset.rotationSpeed = (Math.random() - 0.5) * 3; // 更快的随机旋转
            particle.dataset.opacity = 0;
            particle.dataset.fadeSpeed = Math.random() * 0.004 + 0.002; // 更慢的淡入淡出
            particle.dataset.fadeState = 'in';
            particle.dataset.size = Math.random() * 20 + 16;
            particle.dataset.maxY = Math.random() * 200 + 400; // 随机的最大高度
            
            particle.style.left = `${particle.dataset.x}%`;
            particle.style.bottom = `${particle.dataset.y}px`;
            particle.style.opacity = '0';
            particle.style.fontSize = `${particle.dataset.size}px`;
            
            this.particlesContainer.appendChild(particle);
            this.particles.push(particle);
        }
    }

    /**
     * 动画粒子
     */
    animateParticles() {
        if (!this.isAnimating) return;

        this.particles.forEach((particle) => {
            let x = parseFloat(particle.dataset.x);
            let y = parseFloat(particle.dataset.y);
            let vx = parseFloat(particle.dataset.vx);
            let vy = parseFloat(particle.dataset.vy);
            let rotation = parseFloat(particle.dataset.rotation);
            let rotationSpeed = parseFloat(particle.dataset.rotationSpeed);
            let opacity = parseFloat(particle.dataset.opacity);
            let fadeSpeed = parseFloat(particle.dataset.fadeSpeed);
            let fadeState = particle.dataset.fadeState;
            let maxY = parseFloat(particle.dataset.maxY);
            
            // 更新位置
            x += vx;
            y += vy;
            rotation += rotationSpeed;
            
            // 边界检测和反弹
            if (x < 5) {
                x = 5;
                vx = -vx;
                particle.dataset.vx = vx;
            }
            if (x > 95) {
                x = 95;
                vx = -vx;
                particle.dataset.vx = vx;
            }
            
            // 淡入淡出逻辑
            if (fadeState === 'in') {
                opacity += fadeSpeed;
                if (opacity >= 0.9) {
                    opacity = 0.9;
                    fadeState = 'hold';
                    particle.dataset.holdTime = Math.random() * 200 + 100; // 随机保持时间
                }
            } else if (fadeState === 'hold') {
                let holdTime = parseFloat(particle.dataset.holdTime) || 0;
                holdTime--;
                particle.dataset.holdTime = holdTime;
                if (holdTime <= 0 || y > maxY) {
                    fadeState = 'out';
                }
            } else {
                opacity -= fadeSpeed;
                if (opacity <= 0) {
                    opacity = 0;
                    // 重置到起点
                    x = Math.random() * 90 + 5;
                    y = Math.random() * 50 + 20;
                    vy = Math.random() * 1.2 + 0.8;
                    vx = (Math.random() - 0.5) * 0.8;
                    rotationSpeed = (Math.random() - 0.5) * 3;
                    maxY = Math.random() * 200 + 400;
                    fadeState = 'in';
                    
                    particle.dataset.vx = vx;
                    particle.dataset.vy = vy;
                    particle.dataset.rotationSpeed = rotationSpeed;
                    particle.dataset.maxY = maxY;
                }
            }
            
            // 保存数据
            particle.dataset.x = x;
            particle.dataset.y = y;
            particle.dataset.rotation = rotation;
            particle.dataset.opacity = opacity;
            particle.dataset.fadeState = fadeState;
            
            // 应用样式
            particle.style.left = `${x}%`;
            particle.style.bottom = `${y}px`;
            particle.style.opacity = opacity;
            particle.style.transform = `rotate(${rotation}deg)`;
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

/**
 * 动态图片加载管理器
 * @description 用于在游戏运行时动态加载图片，避免预加载过多资源
 */
class DynamicImageLoader {
    constructor() {
        this.loadedImages = new Map();
        this.loadingPromises = new Map();
        this.basePath = './assets/art/cards/faces/Popin\'Party';
    }

    /**
     * 预加载单张图片
     * @param {string} filename - 图片文件名
     * @returns {Promise<HTMLImageElement>} 加载完成的图片对象
     */
    loadImage(filename) {
        // 如果已经加载过，直接返回
        if (this.loadedImages.has(filename)) {
            return Promise.resolve(this.loadedImages.get(filename));
        }

        // 如果正在加载，返回现有Promise
        if (this.loadingPromises.has(filename)) {
            return this.loadingPromises.get(filename);
        }

        // 创建新的加载Promise
        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            const fullPath = `${this.basePath}/${filename}`;

            img.onload = () => {
                this.loadedImages.set(filename, img);
                this.loadingPromises.delete(filename);
                resolve(img);
            };

            img.onerror = (error) => {
                this.loadingPromises.delete(filename);
                console.warn(`[DynamicImageLoader] 图片加载失败: ${fullPath}`);
                reject(error);
            };

            img.src = fullPath;
        });

        this.loadingPromises.set(filename, promise);
        return promise;
    }

    /**
     * 批量预加载图片
     * @param {string[]} filenames - 图片文件名数组
     * @returns {Promise<void>}
     */
    async loadImages(filenames) {
        const promises = filenames.map(filename => this.loadImage(filename));
        await Promise.allSettled(promises);
    }

    /**
     * 获取已加载的图片
     * @param {string} filename - 图片文件名
     * @returns {HTMLImageElement|null} 图片对象或null
     */
    getImage(filename) {
        return this.loadedImages.get(filename) || null;
    }

    /**
     * 检查图片是否已加载
     * @param {string} filename - 图片文件名
     * @returns {boolean}
     */
    isLoaded(filename) {
        return this.loadedImages.has(filename);
    }

    /**
     * 清除所有缓存
     */
    clearCache() {
        this.loadedImages.clear();
        this.loadingPromises.clear();
    }

    /**
     * 获取加载状态
     * @returns {Object} 状态信息
     */
    getStatus() {
        return {
            loaded: this.loadedImages.size,
            loading: this.loadingPromises.size
        };
    }
}

// 导出到全局
window.ResourcePreloader = ResourcePreloader;
window.PreloadUI = PreloadUI;
window.DynamicImageLoader = DynamicImageLoader;
window.dynamicImageLoader = new DynamicImageLoader();
