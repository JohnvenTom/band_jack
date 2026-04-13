/**
 * BanG jack - UI系统
 * @description 管理用户界面渲染和交互
 * @version 1.0
 */

class UISystem {
    /**
     * 构造函数
     * @param {Object} config - 游戏配置对象
     * @param {Object} cardSystem - 卡牌系统实例
     * @description 初始化UI系统
     */
    constructor(config, cardSystem, audioSystem) {
        this.config = config;
        this.cardSystem = cardSystem;
        this.audioSystem = audioSystem;
        this.animationSystem = null;
        this.elements = {};
        this.animations = [];
        this.isAnimating = false;
        this.lastStampIndex = -1;
        this.stamps = [
            './assets/logo/stamp_001001.png',
            './assets/logo/stamp_001002.png',
            './assets/logo/stamp_001003.png',
            './assets/logo/stamp_001004.png',
            './assets/logo/stamp_001005.png',
            './assets/logo/stamp_001006.png',
            './assets/logo/stamp_001007.png',
            './assets/logo/stamp_001008.png',
            './assets/logo/stamp_001009.png',
            './assets/logo/stamp_001010.png',
            './assets/logo/stamp_001012.png',
            './assets/logo/stamp_001013.png',
            './assets/logo/stamp_001014.png',
            './assets/logo/stamp_001015.png',
            './assets/logo/stamp_001016.png',
            './assets/logo/stamp_001017.png',
            './assets/logo/stamp_001018.png',
            './assets/logo/stamp_001019.png',
            './assets/logo/stamp_001020.png',
            './assets/logo/stamp_002001.png',
            './assets/logo/stamp_002002.png',
            './assets/logo/stamp_002003.png',
            './assets/logo/stamp_002004.png',
            './assets/logo/stamp_002005.png',
            './assets/logo/stamp_002006.png',
            './assets/logo/stamp_002007.png',
            './assets/logo/stamp_002008.png',
            './assets/logo/stamp_002009.png',
            './assets/logo/stamp_002010.png',
            './assets/logo/stamp_002011.png',
            './assets/logo/stamp_002012.png',
            './assets/logo/stamp_003001.png',
            './assets/logo/stamp_003002.png',
            './assets/logo/stamp_003003.png',
            './assets/logo/stamp_003004.png',
            './assets/logo/stamp_003005.png',
            './assets/logo/stamp_003006.png',
            './assets/logo/stamp_003007.png',
            './assets/logo/stamp_003008.png',
            './assets/logo/stamp_003009.png',
            './assets/logo/stamp_003010.png',
            './assets/logo/stamp_003011.png',
            './assets/logo/stamp_003012.png',
            './assets/logo/stamp_004001.png',
            './assets/logo/stamp_004002.png',
            './assets/logo/stamp_004003.png',
            './assets/logo/stamp_004004.png',
            './assets/logo/stamp_004005.png',
            './assets/logo/stamp_004006.png',
            './assets/logo/stamp_004007.png',
            './assets/logo/stamp_004008.png',
            './assets/logo/stamp_004009.png',
            './assets/logo/stamp_004010.png',
            './assets/logo/stamp_004011.png',
            './assets/logo/stamp_004012.png',
            './assets/logo/stamp_004013.png',
            './assets/logo/stamp_005001.png',
            './assets/logo/stamp_005002.png',
            './assets/logo/stamp_005003.png',
            './assets/logo/stamp_005004.png',
            './assets/logo/stamp_005005.png',
            './assets/logo/stamp_005006.png',
            './assets/logo/stamp_005007.png',
            './assets/logo/stamp_005008.png',
            './assets/logo/stamp_005009.png',
            './assets/logo/stamp_005010.png',
            './assets/logo/stamp_005011.png',
            './assets/logo/stamp_005012.png',
            './assets/logo/stamp_005013.png',
            './assets/logo/stamp_005014.png',
            './assets/logo/stamp_005016.png'
        ];
        this.stampAudios = {
            './assets/logo/stamp_001016.png': './assets/logo/stamp_001016.mp3',
            './assets/logo/stamp_001017.png': './assets/logo/stamp_001017.mp3',
            './assets/logo/stamp_001019.png': './assets/logo/stamp_001019.mp3',
            './assets/logo/stamp_002011.png': './assets/logo/stamp_002011.mp3',
            './assets/logo/stamp_002012.png': './assets/logo/stamp_002012.mp3',
            './assets/logo/stamp_003009.png': './assets/logo/stamp_003009.mp3',
            './assets/logo/stamp_003010.png': './assets/logo/stamp_003010.mp3',
            './assets/logo/stamp_003011.png': './assets/logo/stamp_003011.mp3',
            './assets/logo/stamp_004011.png': './assets/logo/stamp_004011.mp3',
            './assets/logo/stamp_004012.png': './assets/logo/stamp_004012.mp3',
            './assets/logo/stamp_005013.png': './assets/logo/stamp_005013.mp3',
            './assets/logo/stamp_005014.png': './assets/logo/stamp_005014.mp3'
        };
    }

    /**
     * 设置动画系统
     * @param {Object} animationSystem - 动画系统实例
     * @returns {void}
     * @description 注入动画系统依赖
     */
    setAnimationSystem(animationSystem) {
        this.animationSystem = animationSystem;
    }

    /**
     * 初始化UI
     * @returns {void}
     * @description 创建游戏主界面
     */
    init() {
        this.cacheElements();
        this.createGameLayout();
        this.bindEvents();
    }

    /**
     * 缓存DOM元素
     * @returns {void}
     * @description 缓存常用DOM元素引用
     */
    cacheElements() {
        this.elements = {
            app: document.getElementById('app'),
            gameContainer: null,
            dealerArea: null,
            playerArea: null,
            controlsArea: null,
            scoreboard: null,
            messageArea: null
        };
    }

    /**
     * 创建游戏布局
     * @returns {void}
     * @description 创建完整的游戏界面布局
     */
    createGameLayout() {
        this.elements.app.innerHTML = '';
        
        const gameContainer = document.createElement('div');
        gameContainer.className = 'game-container';
        
        gameContainer.appendChild(this.createScoreboard());
        gameContainer.appendChild(this.createDealerArea());
        gameContainer.appendChild(this.createPlayerArea());
        gameContainer.appendChild(this.createControlsArea());
        gameContainer.appendChild(this.createMessageArea());
        gameContainer.appendChild(this.createBetArea());
        
        this.elements.app.appendChild(gameContainer);
        this.elements.gameContainer = gameContainer;
    }

    /**
     * 创建计分板
     * @returns {HTMLElement} 计分板元素
     * @description 创建顶部计分板
     */
    createScoreboard() {
        const scoreboard = document.createElement('div');
        scoreboard.className = 'scoreboard';
        
        const chipsDisplay = document.createElement('div');
        chipsDisplay.className = 'chips-display';
        chipsDisplay.innerHTML = `
            <span class="label">筹码</span>
            <span class="value" id="chips-value">${this.config.GAME.INITIAL_CHIPS}</span>
        `;
        
        const statsDisplay = document.createElement('div');
        statsDisplay.className = 'stats-display';
        statsDisplay.innerHTML = `
            <div class="stat">
                <span class="stat-label">胜</span>
                <span class="stat-value" id="wins-value">0</span>
            </div>
            <div class="stat">
                <span class="stat-label">负</span>
                <span class="stat-value" id="losses-value">0</span>
            </div>
            <div class="stat">
                <span class="stat-label">平</span>
                <span class="stat-value" id="draws-value">0</span>
            </div>
        `;
        
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'settings-btn';
        settingsBtn.id = 'settings-btn';
        settingsBtn.innerHTML = '<i class="ph ph-gear" style="font-size: 20px;"></i>';
        settingsBtn.title = '设置';
        
        scoreboard.appendChild(chipsDisplay);
        scoreboard.appendChild(statsDisplay);
        scoreboard.appendChild(settingsBtn);
        
        this.elements.scoreboard = scoreboard;
        return scoreboard;
    }

    /**
     * 创建庄家区域
     * @returns {HTMLElement} 庄家区域元素
     * @description 创建庄家卡牌显示区域
     */
    createDealerArea() {
        const dealerArea = document.createElement('div');
        dealerArea.className = 'dealer-area';
        
        const label = document.createElement('div');
        label.className = 'area-label';
        label.id = 'dealer-name';
        label.textContent = '庄家';
        
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'cards-container';
        cardsContainer.id = 'dealer-cards';
        
        const pointsDisplay = document.createElement('div');
        pointsDisplay.className = 'points-display';
        pointsDisplay.id = 'dealer-points';
        pointsDisplay.textContent = '0';
        
        dealerArea.appendChild(label);
        dealerArea.appendChild(cardsContainer);
        dealerArea.appendChild(pointsDisplay);
        
        this.elements.dealerArea = dealerArea;
        return dealerArea;
    }

    /**
     * 创建玩家区域
     * @returns {HTMLElement} 玩家区域元素
     * @description 创建玩家卡牌显示区域
     */
    createPlayerArea() {
        const playerArea = document.createElement('div');
        playerArea.className = 'player-area';
        
        const label = document.createElement('div');
        label.className = 'area-label';
        label.textContent = '玩家';
        
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'cards-container';
        cardsContainer.id = 'player-cards';
        
        const pointsDisplay = document.createElement('div');
        pointsDisplay.className = 'points-display';
        pointsDisplay.id = 'player-points';
        pointsDisplay.textContent = '0';
        
        playerArea.appendChild(label);
        playerArea.appendChild(cardsContainer);
        playerArea.appendChild(pointsDisplay);
        
        this.elements.playerArea = playerArea;
        return playerArea;
    }

    /**
     * 创建控制区域
     * @returns {HTMLElement} 控制区域元素
     * @description 创建操作按钮区域
     */
    createControlsArea() {
        const controlsArea = document.createElement('div');
        controlsArea.className = 'controls-area';
        
        const buttons = [
            { id: 'btn-hit', text: '要牌', action: 'hit', color: this.config.COLORS.PRIMARY_1 },
            { id: 'btn-stand', text: '停牌', action: 'stand', color: this.config.COLORS.PRIMARY_2 },
            { id: 'btn-double', text: '加倍', action: 'double', color: this.config.COLORS.PRIMARY_3 },
            { id: 'btn-split', text: '分牌', action: 'split', color: this.config.COLORS.SECONDARY }
        ];
        
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'game-btn';
            button.id = btn.id;
            button.dataset.action = btn.action;
            button.textContent = btn.text;
            button.style.setProperty('--btn-color', btn.color);
            button.disabled = true;
            controlsArea.appendChild(button);
        });
        
        this.elements.controlsArea = controlsArea;
        return controlsArea;
    }

    /**
     * 创建下注区域
     * @returns {HTMLElement} 下注区域元素
     * @description 创建下注界面
     */
    createBetArea() {
        const betArea = document.createElement('div');
        betArea.className = 'bet-area';
        betArea.id = 'bet-area';
        
        const betDisplay = document.createElement('div');
        betDisplay.className = 'bet-display';
        betDisplay.innerHTML = `
            <span class="label">当前下注:</span>
            <span class="value" id="bet-value">0</span>
        `;
        
        const chipStack = document.createElement('div');
        chipStack.className = 'chip-stack';
        chipStack.id = 'chip-stack';
        
        const chipSelector = document.createElement('div');
        chipSelector.className = 'chip-selector';
        
        this.config.CHIP.VALUES.forEach(value => {
            const chip = document.createElement('div');
            chip.className = 'chip selectable';
            chip.dataset.value = value;
            chip.textContent = value;
            
            const color = this.config.CHIP.COLORS[value];
            chip.style.setProperty('--chip-color', color);
            
            chipSelector.appendChild(chip);
        });
        
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'game-btn confirm-btn';
        confirmBtn.id = 'btn-confirm-bet';
        confirmBtn.textContent = '确认下注';
        
        betArea.appendChild(betDisplay);
        betArea.appendChild(chipStack);
        betArea.appendChild(chipSelector);
        betArea.appendChild(confirmBtn);
        
        this.elements.betArea = betArea;
        this.elements.chipStack = chipStack;
        return betArea;
    }

    /**
     * 创建消息区域
     * @returns {HTMLElement} 消息区域元素
     * @description 创建游戏消息显示区域
     */
    createMessageArea() {
        const messageArea = document.createElement('div');
        messageArea.className = 'message-area';
        messageArea.id = 'message-area';
        
        const message = document.createElement('div');
        message.className = 'message';
        message.id = 'game-message';
        message.textContent = '请选择下注金额开始游戏';
        
        messageArea.appendChild(message);
        this.elements.messageArea = messageArea;
        return messageArea;
    }

    /**
     * 显示音量设置弹窗
     * @param {Object} currentVolumes - 当前音量设置
     * @param {Function} onVolumeChange - 音量变化回调
     * @param {boolean} kasumiWinSound - 香澄胜利音效开关
     * @param {Function} onKasumiWinSoundChange - 香澄胜利音效开关变化回调
     * @returns {void}
     * @description 显示音量设置界面
     */
    showVolumeSettings(currentVolumes, onVolumeChange, kasumiWinSound, onKasumiWinSoundChange) {
        const existingSettings = document.getElementById('volume-settings');
        if (existingSettings) return;

        const overlay = document.createElement('div');
        overlay.className = 'settings-overlay';
        overlay.id = 'volume-settings';

        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'settings-panel';
        settingsPanel.innerHTML = `
            <div class="settings-header">
                <h3><i class="ph ph-speaker-high" style="margin-right: 8px;"></i>音量设置</h3>
                <button class="settings-close" id="settings-close-btn">×</button>
            </div>
            <div class="settings-content">
                <div class="volume-item">
                    <label class="volume-label">背景音乐</label>
                    <div class="volume-control">
                        <input type="range" class="volume-slider" id="bgm-slider" 
                               min="0" max="100" value="${(typeof currentVolumes.bgm === 'number' ? currentVolumes.bgm : 0.5) * 100}">
                        <span class="volume-value" id="bgm-value">${Math.round((typeof currentVolumes.bgm === 'number' ? currentVolumes.bgm : 0.5) * 100)}%</span>
                    </div>
                </div>
                <div class="volume-item">
                    <label class="volume-label">音效</label>
                    <div class="volume-control">
                        <input type="range" class="volume-slider" id="sfx-slider" 
                               min="0" max="100" value="${(typeof currentVolumes.sfx === 'number' ? currentVolumes.sfx : 0.5) * 100}">
                        <span class="volume-value" id="sfx-value">${Math.round((typeof currentVolumes.sfx === 'number' ? currentVolumes.sfx : 0.5) * 100)}%</span>
                    </div>
                </div>
                <div class="volume-item">
                    <label class="volume-label">语音</label>
                    <div class="volume-control">
                        <input type="range" class="volume-slider" id="voice-slider" 
                               min="0" max="100" value="${(typeof currentVolumes.voice === 'number' ? currentVolumes.voice : 0.5) * 100}">
                        <span class="volume-value" id="voice-value">${Math.round((typeof currentVolumes.voice === 'number' ? currentVolumes.voice : 0.5) * 100)}%</span>
                    </div>
                </div>
                <div class="volume-item">
                    <label class="volume-label">表情包语音</label>
                    <div class="volume-control">
                        <input type="range" class="volume-slider" id="stamp-slider" 
                               min="0" max="100" value="${(typeof currentVolumes.stamp === 'number' ? currentVolumes.stamp : 0.5) * 100}">
                        <span class="volume-value" id="stamp-value">${Math.round((typeof currentVolumes.stamp === 'number' ? currentVolumes.stamp : 0.5) * 100)}%</span>
                    </div>
                </div>
                <div class="toggle-item">
                    <label class="toggle-label">香澄胜利音效</label>
                    <div class="toggle-control">
                        <div class="toggle-switch ${kasumiWinSound ? 'active' : ''}" id="kasumi-toggle">
                            <div class="toggle-thumb"></div>
                        </div>
                        <span class="toggle-value" id="kasumi-value">${kasumiWinSound ? '开启' : '关闭'}</span>
                    </div>
                </div>
            </div>
        `;

        overlay.appendChild(settingsPanel);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.classList.add('show');
            settingsPanel.classList.add('show');
        });

        const closeSettings = () => {
            overlay.classList.remove('show');
            settingsPanel.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        };

        document.getElementById('settings-close-btn').addEventListener('click', closeSettings);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSettings();
        });

        ['bgm', 'sfx', 'voice', 'stamp'].forEach(type => {
            const slider = document.getElementById(`${type}-slider`);
            const valueDisplay = document.getElementById(`${type}-value`);
            
            if (slider) {
                slider.addEventListener('input', (e) => {
                    const value = e.target.value / 100;
                    valueDisplay.textContent = `${e.target.value}%`;
                    if (onVolumeChange) {
                        onVolumeChange(type, value);
                    }
                });
            }
        });

        const kasumiToggle = document.getElementById('kasumi-toggle');
        const kasumiValue = document.getElementById('kasumi-value');
        if (kasumiToggle) {
            kasumiToggle.addEventListener('click', () => {
                const isActive = kasumiToggle.classList.toggle('active');
                kasumiValue.textContent = isActive ? '开启' : '关闭';
                if (onKasumiWinSoundChange) {
                    onKasumiWinSoundChange(isActive);
                }
            });
        }
    }

    /**
     * 绑定事件
     * @returns {void}
     * @description 绑定UI交互事件
     */
    bindEvents() {
        const chipSelector = document.querySelector('.chip-selector');
        if (chipSelector) {
            chipSelector.addEventListener('click', (e) => {
                if (e.target.classList.contains('chip')) {
                    this.handleChipSelect(e.target);
                }
            });
        }
        
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                const event = new CustomEvent('openSettings');
                document.dispatchEvent(event);
            });
        }
        
        document.addEventListener('click', (e) => {
            const isInteractive = e.target.closest('button, .game-btn, .chip, .card, .stacked-chip, .welcome-btn, .result-popup, .drawer-overlay, .message-toast, .controls-area, .chip-selector, .settings-btn, .settings-overlay');
            if (!isInteractive) {
                this.showRandomStamp(e.clientX, e.clientY);
            }
        });
    }

    /**
     * 获取随机stamp索引（相邻不重复）
     * @returns {number} 随机索引
     * @description 获取随机索引，确保不与上次相同
     */
    getRandomStampIndex() {
        if (this.stamps.length <= 1) return 0;
        
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.stamps.length);
        } while (newIndex === this.lastStampIndex);
        
        this.lastStampIndex = newIndex;
        return newIndex;
    }

    /**
     * 显示随机表情包
     * @param {number} x - 点击X坐标
     * @param {number} y - 点击Y坐标
     * @returns {void}
     * @description 在点击位置显示随机表情包
     */
    showRandomStamp(x, y) {
        const index = this.getRandomStampIndex();
        const stampPath = this.stamps[index];
        const stamp = document.createElement('div');
        stamp.className = 'click-stamp';
        stamp.innerHTML = `<img src="${stampPath}" alt="stamp">`;
        stamp.style.left = `${x}px`;
        stamp.style.top = `${y}px`;
        
        document.body.appendChild(stamp);
        
        if (this.audioSystem) {
            if (this.audioSystem.volumes.stamp > 0 && this.stampAudios[stampPath]) {
                const audio = new Audio(this.stampAudios[stampPath]);
                audio.volume = this.audioSystem.volumes.stamp;
                audio.play().catch(() => {});
            } else {
                const popSound = new Audio('./assets/audio/sfx/short/SE_POPS_OUT.mp3');
                popSound.volume = this.audioSystem.volumes.sfx;
                popSound.play().catch(() => {});
            }
        }
        
        setTimeout(() => {
            stamp.classList.add('fade-out');
            setTimeout(() => {
                stamp.remove();
            }, 500);
        }, 1500);
    }

    /**
     * 处理筹码选择
     * @param {HTMLElement} chipElement - 筹码元素
     * @returns {void}
     * @description 处理筹码选择事件
     */
    handleChipSelect(chipElement) {
        const value = parseInt(chipElement.dataset.value);
        
        if (chipElement.classList.contains('disabled')) {
            const event = new CustomEvent('chipDisabled', { detail: { value: value } });
            document.dispatchEvent(event);
            return;
        }
        
        this.addChipToStack(value);
        const event = new CustomEvent('chipSelected', { detail: { value: value } });
        document.dispatchEvent(event);
    }

    /**
     * 添加筹码到堆叠区
     * @param {number} value - 筹码面值
     * @returns {void}
     * @description 添加筹码动画到堆叠区域
     */
    addChipToStack(value) {
        const stack = document.getElementById('chip-stack');
        if (!stack) return;
        
        const chip = document.createElement('div');
        chip.className = 'stacked-chip';
        chip.textContent = value;
        chip.dataset.value = value;
        
        const color = this.config.CHIP.COLORS[value];
        chip.style.setProperty('--stack-chip-color', color);
        chip.style.setProperty('--stack-chip-color-dark', this.darkenColor(color, 20));
        
        const stackCount = stack.children.length;
        const maxVisible = 5;
        const offset = Math.min(stackCount, maxVisible - 1);
        
        chip.style.bottom = `${offset * 4}px`;
        chip.style.left = '50%';
        chip.style.transform = 'translateX(-50%)';
        chip.style.zIndex = stackCount + 1;
        
        if (stackCount >= maxVisible) {
            const oldestChip = stack.firstChild;
            if (oldestChip) {
                oldestChip.style.opacity = '0.3';
            }
        }
        
        chip.addEventListener('click', () => this.removeChipFromStack(chip, value));
        
        stack.appendChild(chip);
    }

    /**
     * 从堆叠区移除筹码
     * @param {HTMLElement} chipElement - 筹码元素
     * @param {number} value - 筹码面值
     * @returns {void}
     * @description 移除堆叠筹码并触发退回事件
     */
    removeChipFromStack(chipElement, value) {
        const stack = document.getElementById('chip-stack');
        if (!stack) return;
        
        chipElement.classList.add('removing');
        
        setTimeout(() => {
            chipElement.remove();
            
            const chips = stack.querySelectorAll('.stacked-chip');
            const maxVisible = 5;
            
            chips.forEach((chip, index) => {
                const offset = Math.min(index, maxVisible - 1);
                chip.style.bottom = `${offset * 4}px`;
                chip.style.zIndex = index + 1;
                chip.style.opacity = index < chips.length - maxVisible ? '0.3' : '1';
            });
            
            const event = new CustomEvent('chipRemoved', { detail: { value: value } });
            document.dispatchEvent(event);
        }, 300);
    }

    /**
     * 颜色变暗
     * @param {string} color - 原始颜色
     * @param {number} percent - 变暗百分比
     * @returns {string} 变暗后的颜色
     * @description 将颜色变暗指定百分比
     */
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max((num >> 16) - amt, 0);
        const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
        const B = Math.max((num & 0x0000FF) - amt, 0);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }

    /**
     * 清空筹码堆叠
     * @returns {void}
     * @description 清空堆叠区域的筹码
     */
    clearChipStack() {
        const stack = document.getElementById('chip-stack');
        if (stack) {
            stack.innerHTML = '';
        }
    }

    /**
     * 显示解除下注限制抽屉
     * @param {Function} onConfirm - 确认回调
     * @returns {void}
     * @description 显示解除下注限制的抽屉弹窗
     */
    showBetLimitDrawer(onConfirm) {
        const existingDrawer = document.getElementById('bet-limit-drawer');
        if (existingDrawer) return;
        
        const betArea = document.getElementById('bet-area');
        if (!betArea) return;
        
        betArea.style.position = 'relative';
        
        const overlay = document.createElement('div');
        overlay.className = 'drawer-overlay drawer-in-bet';
        overlay.id = 'bet-limit-drawer';
        
        const drawer = document.createElement('div');
        drawer.className = 'drawer drawer-bet';
        drawer.innerHTML = `
            <div class="drawer-header">
                <h3>🎰 解除下注限制</h3>
                <button class="drawer-close" id="drawer-close-btn">×</button>
            </div>
            <div class="drawer-content">
                <p class="drawer-message">当前已达到最大下注限制 (500 筹码)</p>
                <p class="drawer-hint">是否解除限制？<br><small>（仅本次有效）</small></p>
                <div class="drawer-warning">
                    <span class="warning-icon">⚠️</span>
                    <span>高风险警告：下注金额越大，输赢波动越大！</span>
                </div>
            </div>
            <div class="drawer-actions">
                <button class="game-btn drawer-btn-cancel" id="drawer-cancel-btn">取消</button>
                <button class="game-btn drawer-btn-confirm" id="drawer-confirm-btn">确认解除</button>
            </div>
        `;
        
        overlay.appendChild(drawer);
        betArea.appendChild(overlay);
        
        requestAnimationFrame(() => {
            overlay.classList.add('show');
            drawer.classList.add('show');
        });
        
        const closeDrawer = () => {
            overlay.classList.remove('show');
            drawer.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        };
        
        document.getElementById('drawer-close-btn').addEventListener('click', closeDrawer);
        document.getElementById('drawer-cancel-btn').addEventListener('click', closeDrawer);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeDrawer();
        });
        
        document.getElementById('drawer-confirm-btn').addEventListener('click', () => {
            closeDrawer();
            if (onConfirm) onConfirm();
        });
    }

    /**
     * 更新筹码显示
     * @param {number} chips - 筹码数量
     * @returns {void}
     * @description 更新计分板筹码显示
     */
    updateChipsDisplay(chips) {
        const chipsValue = document.getElementById('chips-value');
        if (chipsValue) {
            chipsValue.textContent = chips;
            this.animateValue(chipsValue);
        }
    }

    /**
     * 更新下注显示
     * @param {number} bet - 下注金额
     * @returns {void}
     * @description 更新下注金额显示
     */
    updateBetDisplay(bet) {
        const betValue = document.getElementById('bet-value');
        if (betValue) {
            betValue.textContent = bet;
        }
    }

    /**
     * 更新点数显示
     * @param {string} target - 目标 (player/dealer)
     * @param {number} points - 点数
     * @returns {void}
     * @description 更新玩家或庄家点数显示
     */
    updatePointsDisplay(target, points) {
        const pointsEl = document.getElementById(`${target}-points`);
        if (pointsEl) {
            pointsEl.textContent = points;
            
            if (points > 21) {
                pointsEl.classList.add('bust');
            } else if (points === 21) {
                pointsEl.classList.add('blackjack');
            } else {
                pointsEl.classList.remove('bust', 'blackjack');
            }
        }
    }

    /**
     * 更新统计数据
     * @param {Object} stats - 统计数据对象
     * @returns {void}
     * @description 更新胜负统计显示
     */
    updateStatsDisplay(stats) {
        const winsEl = document.getElementById('wins-value');
        const lossesEl = document.getElementById('losses-value');
        const drawsEl = document.getElementById('draws-value');
        
        if (winsEl) winsEl.textContent = stats.wins;
        if (lossesEl) lossesEl.textContent = stats.losses;
        if (drawsEl) drawsEl.textContent = stats.draws;
    }

    /**
     * 显示消息
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型 (info/success/danger/warning)
     * @returns {void}
     * @description 显示游戏消息
     */
    showMessage(message, type = 'info') {
        const messageEl = document.getElementById('game-message');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `message ${type}`;
            this.animateValue(messageEl);
        }
    }

    /**
     * 添加卡牌到区域
     * @param {Object} card - 卡牌对象
     * @param {string} target - 目标区域 (player/dealer)
     * @param {boolean} faceDown - 是否正面朝下
     * @param {Function} callback - 回调函数
     * @returns {void}
     * @description 添加卡牌到指定区域并播放动画
     */
    addCardToArea(card, target, faceDown = false, callback) {
        const container = document.getElementById(`${target}-cards`);
        if (!container) return;
        
        const existingCards = container.querySelectorAll('.card:not(.entering):not(.dealing)');
        existingCards.forEach(existingCard => {
            existingCard.classList.add('shifting');
            setTimeout(() => {
                existingCard.classList.remove('shifting');
            }, 350);
        });
        
        const cardEl = this.cardSystem.createCardElement(card, faceDown);
        cardEl.style.opacity = '0';
        cardEl.classList.add('entering');
        container.appendChild(cardEl);
        
        if (this.animationSystem) {
            requestAnimationFrame(() => {
                const options = {
                    startX: window.innerWidth / 2,
                    startY: -150,
                    duration: this.config.ANIMATION.DEAL_DURATION
                };
                
                this.animationSystem.dealCard(cardEl, options, () => {
                    cardEl.classList.remove('entering');
                    if (callback) callback();
                });
            });
        } else {
            cardEl.style.opacity = '0';
            cardEl.style.transform = 'translateY(-100px) rotate(180deg)';
            
            requestAnimationFrame(() => {
                cardEl.style.transition = `all ${this.config.CARD.ANIMATION_DURATION}ms ease-out`;
                cardEl.style.opacity = '1';
                cardEl.style.transform = 'translateY(0) rotate(0)';
                
                setTimeout(() => {
                    cardEl.classList.remove('entering');
                    if (callback) {
                        callback();
                    }
                }, this.config.CARD.ANIMATION_DURATION);
            });
        }
    }

    /**
     * 翻转卡牌
     * @param {number} index - 卡牌索引
     * @param {string} target - 目标区域
     * @param {Function} callback - 回调函数
     * @returns {void}
     * @description 翻转指定卡牌
     */
    flipCard(index, target, callback) {
        const container = document.getElementById(`${target}-cards`);
        if (!container) return;
        
        const cards = container.querySelectorAll('.card');
        if (cards[index]) {
            if (this.animationSystem) {
                this.animationSystem.flipCard(cards[index], callback);
            } else {
                cards[index].classList.toggle('face-down');
                if (callback) {
                    setTimeout(callback, this.config.CARD.FLIP_DURATION);
                }
            }
        }
    }

    /**
     * 清空卡牌区域
     * @param {string} target - 目标区域
     * @returns {void}
     * @description 清空指定区域的卡牌
     */
    clearCardsArea(target) {
        const container = document.getElementById(`${target}-cards`);
        if (container) {
            container.innerHTML = '';
        }
        
        this.updatePointsDisplay(target, 0);
    }

    /**
     * 设置按钮状态
     * @param {Object} states - 按钮状态对象
     * @returns {void}
     * @description 设置各按钮的启用/禁用状态
     */
    setButtonStates(states) {
        Object.keys(states).forEach(action => {
            const btn = document.querySelector(`[data-action="${action}"]`);
            if (btn) {
                btn.disabled = !states[action];
            }
        });
    }

    /**
     * 显示下注区域
     * @returns {void}
     * @description 显示下注界面并折叠游戏区域
     */
    showBetArea() {
        const betArea = document.getElementById('bet-area');
        const gameContainer = document.querySelector('.game-container');
        if (betArea) {
            betArea.classList.remove('hidden');
        }
        if (gameContainer) {
            gameContainer.classList.add('betting-phase');
        }
        this.setButtonStates({ hit: false, stand: false, double: false, split: false });
    }

    /**
     * 隐藏下注区域
     * @returns {void}
     * @description 隐藏下注界面并展开游戏区域
     */
    hideBetArea() {
        const betArea = document.getElementById('bet-area');
        const gameContainer = document.querySelector('.game-container');
        if (betArea) {
            betArea.classList.add('hidden');
        }
        if (gameContainer) {
            gameContainer.classList.remove('betting-phase');
        }
        this.clearChipStack();
    }

    /**
     * 显示结算弹窗
     * @param {Object} result - 结算结果
     * @param {Function} callback - 回调函数
     * @returns {void}
     * @description 显示游戏结算弹窗
     */
    showResultPopup(result, callback) {
        const popup = document.createElement('div');
        popup.className = `result-popup ${result.type}`;
        
        if (result.type === 'win' || result.type === 'blackjack') {
            this.createConfetti(popup);
        }
        
        const content = document.createElement('div');
        content.className = 'result-content';
        
        const title = document.createElement('h2');
        title.className = 'result-title';
        if (result.isBlackjack) {
            title.innerHTML = 'BANG JACK!';
        } else if (result.type === 'win') {
            title.innerHTML = '<i class="ph ph-trophy" style="margin-right: 8px;"></i>胜利! <i class="ph ph-trophy" style="margin-left: 8px;"></i>';
        } else if (result.type === 'lose') {
            title.textContent = '失败...';
        } else {
            title.textContent = '平局';
        }
        
        const message = document.createElement('p');
        message.className = 'result-message';
        message.textContent = result.message;
        
        const chipsInfo = document.createElement('div');
        chipsInfo.className = 'result-chips';
        
        if (result.chipsChange !== undefined) {
            const changeValue = result.chipsChange;
            const isPositive = changeValue > 0;
            const changeText = isPositive ? `+${changeValue}` : `${changeValue}`;
            const changeClass = isPositive ? 'chips-win' : 'chips-lose';
            
            chipsInfo.innerHTML = `
                <span class="${changeClass}">${changeText} 筹码</span>
            `;
        } else {
            chipsInfo.innerHTML = `
                <span>筹码无变化</span>
            `;
        }
        
        const continueBtn = document.createElement('button');
        continueBtn.className = 'game-btn';
        continueBtn.textContent = '继续游戏';
        continueBtn.addEventListener('click', () => {
            popup.remove();
            if (callback) callback();
        });
        
        content.appendChild(title);
        content.appendChild(message);
        content.appendChild(chipsInfo);
        content.appendChild(continueBtn);
        popup.appendChild(content);
        
        document.body.appendChild(popup);
    }

    /**
     * 创建彩带效果
     * @param {HTMLElement} container - 容器元素
     * @returns {void}
     * @description 为胜利弹窗创建彩带动画
     */
    createConfetti(container) {
        const colors = ['pink', 'lavender', 'mint', 'peach', 'sky'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const left = Math.random() * 100;
            const animationDelay = Math.random() * 2;
            const animationDuration = 2 + Math.random() * 2;
            
            confetti.style.left = `${left}%`;
            confetti.style.animationDelay = `${animationDelay}s`;
            confetti.style.animationDuration = `${animationDuration}s`;
            confetti.style.width = `${5 + Math.random() * 10}px`;
            confetti.style.height = `${5 + Math.random() * 10}px`;
            
            container.appendChild(confetti);
        }
    }

    /**
     * 数值动画
     * @param {HTMLElement} element - 目标元素
     * @returns {void}
     * @description 播放数值变化动画
     */
    animateValue(element) {
        element.classList.add('animate');
        setTimeout(() => {
            element.classList.remove('animate');
        }, 300);
    }

    /**
     * 显示思考动画
     * @returns {void}
     * @description 显示庄家思考动画
     */
    showThinkingAnimation() {
        const dealerArea = this.elements.dealerArea;
        if (dealerArea) {
            dealerArea.classList.add('thinking');
        }
    }

    /**
     * 隐藏思考动画
     * @returns {void}
     * @description 隐藏庄家思考动画
     */
    hideThinkingAnimation() {
        const dealerArea = this.elements.dealerArea;
        if (dealerArea) {
            dealerArea.classList.remove('thinking');
        }
    }

    /**
     * 显示爆牌效果
     * @param {string} target - 目标区域
     * @returns {void}
     * @description 显示爆牌特效
     */
    showBustEffect(target) {
        const container = document.getElementById(`${target}-cards`);
        if (container) {
            container.classList.add('bust-effect');
            setTimeout(() => {
                container.classList.remove('bust-effect');
            }, 1000);
        }
    }

    /**
     * 显示胜利特效
     * @returns {void}
     * @description 显示胜利粒子特效
     */
    showVictoryEffect() {
        const particles = document.createElement('div');
        particles.className = 'victory-particles';
        
        for (let i = 0; i < this.config.ANIMATION.PARTICLE_COUNT; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            particles.appendChild(particle);
        }
        
        document.body.appendChild(particles);
        
        setTimeout(() => {
            particles.remove();
        }, 3000);
    }

    /**
     * 更新筹码选择器状态
     * @param {number} availableChips - 可用筹码
     * @param {number} currentBet - 当前下注金额
     * @param {number} maxBet - 最大下注限制
     * @returns {void}
     * @description 根据可用筹码更新选择器状态
     */
    updateChipSelectorState(availableChips, currentBet = 0, maxBet = 500) {
        const chips = document.querySelectorAll('.chip-selector .chip');
        const remainingBet = maxBet - currentBet;
        const remainingChips = availableChips - currentBet;
        
        chips.forEach(chip => {
            const value = parseInt(chip.dataset.value);
            const canBet = value <= remainingBet && value <= remainingChips;
            chip.classList.toggle('disabled', !canBet);
        });
    }

    /**
     * 创建分牌区域
     * @param {number} count - 分牌数量
     * @returns {void}
     * @description 创建分牌显示区域
     */
    createSplitAreas(count) {
        const playerArea = document.querySelector('.player-area');
        if (!playerArea) return;
        
        playerArea.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const splitArea = document.createElement('div');
            splitArea.className = 'split-area';
            splitArea.id = `split-area-${i}`;
            
            const label = document.createElement('div');
            label.className = 'split-label';
            label.textContent = `第${i + 1}组`;
            
            const cardsContainer = document.createElement('div');
            cardsContainer.className = 'cards-container split-cards';
            cardsContainer.id = `split-cards-${i}`;
            
            const pointsDisplay = document.createElement('div');
            pointsDisplay.className = 'points-display split-points';
            pointsDisplay.id = `split-points-${i}`;
            pointsDisplay.textContent = '0';
            
            splitArea.appendChild(label);
            splitArea.appendChild(cardsContainer);
            splitArea.appendChild(pointsDisplay);
            
            playerArea.appendChild(splitArea);
        }
    }

    /**
     * 高亮分牌区域
     * @param {number} index - 区域索引
     * @returns {void}
     * @description 高亮当前活动的分牌区域
     */
    highlightSplitArea(index) {
        document.querySelectorAll('.split-area').forEach((area, i) => {
            area.classList.toggle('active', i === index);
        });
    }

    /**
     * 清空分牌区域
     * @param {number} index - 区域索引
     * @returns {void}
     * @description 清空指定分牌区域的卡牌
     */
    clearSplitArea(index) {
        const container = document.getElementById(`split-cards-${index}`);
        if (container) {
            container.innerHTML = '';
        }
        this.updateSplitPointsDisplay(index, 0);
    }

    /**
     * 添加卡牌到分牌区域
     * @param {Object} card - 卡牌对象
     * @param {number} splitIndex - 分牌索引
     * @param {boolean} faceDown - 是否正面朝下
     * @param {Function} callback - 回调函数
     * @returns {void}
     * @description 添加卡牌到指定分牌区域
     */
    addCardToSplitArea(card, splitIndex, faceDown, callback) {
        const container = document.getElementById(`split-cards-${splitIndex}`);
        if (!container) return;
        
        const existingCards = container.querySelectorAll('.card:not(.entering):not(.dealing)');
        existingCards.forEach(existingCard => {
            existingCard.classList.add('shifting');
            setTimeout(() => {
                existingCard.classList.remove('shifting');
            }, 350);
        });
        
        const cardEl = this.cardSystem.createCardElement(card, faceDown);
        cardEl.style.opacity = '0';
        cardEl.classList.add('entering');
        container.appendChild(cardEl);
        
        if (this.animationSystem) {
            requestAnimationFrame(() => {
                const options = {
                    startX: window.innerWidth / 2,
                    startY: -150,
                    duration: this.config.ANIMATION.DEAL_DURATION
                };
                
                this.animationSystem.dealCard(cardEl, options, () => {
                    cardEl.classList.remove('entering');
                    if (callback) callback();
                });
            });
        } else {
            cardEl.style.transform = 'translateY(-50px) rotate(90deg)';
            
            requestAnimationFrame(() => {
                cardEl.style.transition = `all ${this.config.CARD.ANIMATION_DURATION}ms ease-out`;
                cardEl.style.opacity = '1';
                cardEl.style.transform = 'translateY(0) rotate(0)';
                
                setTimeout(() => {
                    cardEl.classList.remove('entering');
                    if (callback) {
                        callback();
                    }
                }, this.config.CARD.ANIMATION_DURATION);
            });
        }
    }

    /**
     * 更新分牌点数显示
     * @param {number} index - 区域索引
     * @param {number} points - 点数
     * @returns {void}
     * @description 更新指定分牌区域的点数显示
     */
    updateSplitPointsDisplay(index, points) {
        const pointsEl = document.getElementById(`split-points-${index}`);
        if (pointsEl) {
            pointsEl.textContent = points;
            
            if (points > 21) {
                pointsEl.classList.add('bust');
            } else if (points === 21) {
                pointsEl.classList.add('blackjack');
            } else {
                pointsEl.classList.remove('bust', 'blackjack');
            }
        }
    }

    /**
     * 移除分牌区域
     * @returns {void}
     * @description 移除所有分牌区域并恢复原始玩家区域
     */
    removeSplitAreas() {
        const playerArea = document.querySelector('.player-area');
        if (!playerArea) return;
        
        playerArea.innerHTML = '';
        
        const label = document.createElement('div');
        label.className = 'area-label';
        label.textContent = '玩家';
        
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'cards-container';
        cardsContainer.id = 'player-cards';
        
        const pointsDisplay = document.createElement('div');
        pointsDisplay.className = 'points-display';
        pointsDisplay.id = 'player-points';
        pointsDisplay.textContent = '0';
        
        playerArea.appendChild(label);
        playerArea.appendChild(cardsContainer);
        playerArea.appendChild(pointsDisplay);
    }

    /**
     * 显示分牌结果弹窗
     * @param {Array} results - 分牌结果数组
     * @param {string} finalResult - 最终结果
     * @param {number} netWin - 净赢筹码
     * @param {Function} callback - 回调函数
     * @returns {void}
     * @description 显示分牌结果弹窗
     */
    showSplitResultPopup(results, finalResult, netWin, callback) {
        const popup = document.createElement('div');
        popup.className = `result-popup ${finalResult}`;
        
        let resultsHTML = results.map(r => {
            const resultClass = r.result === 'win' ? 'success' : r.result === 'lose' ? 'danger' : 'warning';
            const resultText = r.result === 'win' ? '胜利' : r.result === 'lose' ? '失败' : '平局';
            return `<p class="split-result-item ${resultClass}">第${r.index}组: ${r.points}点 - ${resultText}</p>`;
        }).join('');
        
        const changeClass = netWin > 0 ? 'chips-win' : netWin < 0 ? 'chips-lose' : '';
        const changeText = netWin > 0 ? `+${netWin}` : netWin < 0 ? `${netWin}` : '0';
        
        const content = document.createElement('div');
        content.className = 'result-content';
        content.innerHTML = `
            <h2 class="result-title">${finalResult === 'win' ? '分牌胜利!' : finalResult === 'lose' ? '分牌失败...' : '分牌平局'}</h2>
            <div class="split-results">${resultsHTML}</div>
            <div class="result-chips">
                <span class="${changeClass}">${changeText} 筹码</span>
            </div>
        `;
        
        const continueBtn = document.createElement('button');
        continueBtn.className = 'game-btn';
        continueBtn.textContent = '继续游戏';
        continueBtn.addEventListener('click', () => {
            popup.remove();
            if (callback) callback();
        });
        
        content.appendChild(continueBtn);
        popup.appendChild(content);
        
        document.body.appendChild(popup);
    }
}

window.UISystem = UISystem;
