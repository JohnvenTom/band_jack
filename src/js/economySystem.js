/**
 * BanG jack - 经济系统
 * @description 管理筹码、下注、结算等经济相关功能
 * @version 1.0
 */

class EconomySystem {
    /**
     * 构造函数
     * @param {Object} config - 游戏配置对象
     * @description 初始化经济系统
     */
    constructor(config) {
        this.config = config;
        this.chips = config.GAME.INITIAL_CHIPS;
        this.currentBet = 0;
        this.betHistory = [];
        this.winCount = 0;
        this.loseCount = 0;
        this.drawCount = 0;
        this.blackjackCount = 0;
        this.totalWinnings = 0;
        this.totalLosses = 0;
    }

    /**
     * 下注
     * @param {number} amount - 下注金额
     * @returns {boolean} 是否下注成功
     * @description 执行下注操作
     */
    placeBet(amount) {
        if (amount < this.config.GAME.MIN_BET) {
            return { success: false, message: `最小下注金额为 ${this.config.GAME.MIN_BET}` };
        }
        
        if (amount > this.config.GAME.MAX_BET) {
            return { success: false, message: `最大下注金额为 ${this.config.GAME.MAX_BET}` };
        }
        
        if (amount > this.chips) {
            return { success: false, message: '筹码不足' };
        }
        
        this.currentBet = amount;
        this.chips -= amount;
        
        return { success: true, message: '下注成功', bet: amount };
    }

    /**
     * 加倍下注
     * @returns {Object} 操作结果
     * @description 执行加倍操作
     */
    doubleDown() {
        if (this.currentBet > this.chips) {
            return { success: false, message: '筹码不足以加倍' };
        }
        
        this.chips -= this.currentBet;
        this.currentBet *= 2;
        
        return { success: true, message: '加倍成功', bet: this.currentBet };
    }

    /**
     * 结算 - 胜利
     * @param {boolean} isBlackjack - 是否为Blackjack
     * @returns {Object} 结算结果
     * @description 处理胜利结算
     */
    win(isBlackjack = false) {
        const multiplier = isBlackjack ? 
            this.config.GAME.BLACKJACK_MULTIPLIER : 
            this.config.GAME.WIN_MULTIPLIER;
        
        const winnings = Math.floor(this.currentBet * multiplier);
        const netChange = winnings - this.currentBet;
        this.chips += winnings;
        
        this.winCount++;
        this.totalWinnings += netChange;
        
        if (isBlackjack) {
            this.blackjackCount++;
        }
        
        const result = {
            type: 'win',
            isBlackjack: isBlackjack,
            winnings: winnings,
            chipsChange: netChange,
            totalChips: this.chips,
            message: isBlackjack ? 'Bang jack! 获得额外奖励!' : '胜利!'
        };
        
        this.betHistory.push(result);
        this.currentBet = 0;
        
        return result;
    }

    /**
     * 结算 - 失败
     * @returns {Object} 结算结果
     * @description 处理失败结算
     */
    lose() {
        this.loseCount++;
        this.totalLosses += this.currentBet;
        
        const result = {
            type: 'lose',
            losses: this.currentBet,
            chipsChange: -this.currentBet,
            totalChips: this.chips,
            message: '失败... 失去了下注筹码'
        };
        
        this.betHistory.push(result);
        this.currentBet = 0;
        
        return result;
    }

    /**
     * 结算 - 平局
     * @returns {Object} 结算结果
     * @description 处理平局结算
     */
    draw() {
        this.chips += this.currentBet;
        this.drawCount++;
        
        const result = {
            type: 'draw',
            returned: this.currentBet,
            chipsChange: 0,
            totalChips: this.chips,
            message: '平局! 返还下注筹码'
        };
        
        this.betHistory.push(result);
        this.currentBet = 0;
        
        return result;
    }

    /**
     * 获取筹码数量
     * @returns {number} 当前筹码数量
     * @description 获取玩家当前筹码
     */
    getChips() {
        return this.chips;
    }

    /**
     * 获取当前下注
     * @returns {number} 当前下注金额
     * @description 获取当前回合下注金额
     */
    getCurrentBet() {
        return this.currentBet;
    }

    /**
     * 检查是否破产
     * @returns {boolean} 是否破产
     * @description 检查玩家是否还有筹码
     */
    isBankrupt() {
        return this.chips < this.config.GAME.MIN_BET;
    }

    /**
     * 获取统计数据
     * @returns {Object} 统计数据
     * @description 获取游戏统计数据
     */
    getStatistics() {
        return {
            chips: this.chips,
            wins: this.winCount,
            losses: this.loseCount,
            draws: this.drawCount,
            blackjacks: this.blackjackCount,
            totalWinnings: this.totalWinnings,
            totalLosses: this.totalLosses,
            winRate: this.winCount + this.loseCount > 0 ? 
                (this.winCount / (this.winCount + this.loseCount) * 100).toFixed(1) : 0
        };
    }

    /**
     * 重置经济系统
     * @param {boolean} keepChips - 是否保留筹码
     * @returns {void}
     * @description 重置经济系统状态
     */
    reset(keepChips = false) {
        if (!keepChips) {
            this.chips = this.config.GAME.INITIAL_CHIPS;
        }
        this.currentBet = 0;
        this.betHistory = [];
        this.winCount = 0;
        this.loseCount = 0;
        this.drawCount = 0;
        this.blackjackCount = 0;
        this.totalWinnings = 0;
        this.totalLosses = 0;
    }

    /**
     * 添加筹码
     * @param {number} amount - 筹码数量
     * @returns {void}
     * @description 增加玩家筹码
     */
    addChips(amount) {
        this.chips += amount;
    }

    /**
     * 获取筹码分布
     * @returns {Object} 筹码分布对象
     * @description 计算当前筹码的最优分布
     */
    getChipDistribution() {
        let remaining = this.chips;
        const distribution = {};
        
        const sortedValues = [...this.config.CHIP.VALUES].sort((a, b) => b - a);
        
        for (let value of sortedValues) {
            distribution[value] = Math.floor(remaining / value);
            remaining %= value;
        }
        
        return distribution;
    }

    /**
     * 创建筹码元素
     * @param {number} value - 筹码面值
     * @returns {HTMLElement} 筹码DOM元素
     * @description 创建单个筹码的DOM元素
     */
    createChipElement(value) {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.dataset.value = value;
        
        const color = this.config.CHIP.COLORS[value] || '#FFD166';
        chip.style.setProperty('--chip-color', color);
        
        const label = document.createElement('span');
        label.className = 'chip-label';
        label.textContent = value;
        chip.appendChild(label);
        
        return chip;
    }

    /**
     * 导出存档数据
     * @returns {Object} 存档数据
     * @description 导出经济系统存档数据
     */
    exportSaveData() {
        return {
            chips: this.chips,
            winCount: this.winCount,
            loseCount: this.loseCount,
            drawCount: this.drawCount,
            blackjackCount: this.blackjackCount,
            totalWinnings: this.totalWinnings,
            totalLosses: this.totalLosses
        };
    }

    /**
     * 导入存档数据
     * @param {Object} data - 存档数据
     * @returns {void}
     * @description 导入经济系统存档数据
     */
    importSaveData(data) {
        if (data) {
            this.chips = data.chips || this.config.GAME.INITIAL_CHIPS;
            this.winCount = data.winCount || 0;
            this.loseCount = data.loseCount || 0;
            this.drawCount = data.drawCount || 0;
            this.blackjackCount = data.blackjackCount || 0;
            this.totalWinnings = data.totalWinnings || 0;
            this.totalLosses = data.totalLosses || 0;
        }
    }
}

window.EconomySystem = EconomySystem;
