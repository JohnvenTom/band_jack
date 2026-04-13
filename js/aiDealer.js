/**
 * BanG jack - AI庄家系统
 * @description 管理AI庄家的决策逻辑和行为
 * @version 1.0
 */

class AIDealer {
    /**
     * 构造函数
     * @param {Object} config - 游戏配置对象
     * @param {string} difficulty - 难度级别 (easy/normal/hard)
     * @description 初始化AI庄家
     */
    constructor(config, difficulty = 'normal') {
        this.config = config;
        this.difficulty = difficulty;
        this.aiConfig = config.AI[difficulty.toUpperCase()];
        this.hand = [];
        this.isThinking = false;
        this.members = ['香澄', '有咲', '纱绫', '多惠', '里美'];
        this.lastMemberIndex = -1;
        this.currentMember = this.getRandomMember();
    }

    /**
     * 设置难度
     * @param {string} difficulty - 难度级别
     * @returns {void}
     * @description 更改AI庄家难度
     */
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.aiConfig = this.config.AI[difficulty.toUpperCase()];
    }

    /**
     * 接收卡牌
     * @param {Object} card - 卡牌对象
     * @returns {void}
     * @description 将卡牌添加到庄家手牌
     */
    receiveCard(card) {
        this.hand.push(card);
    }

    /**
     * 获取手牌点数
     * @returns {number} 总点数
     * @description 计算当前手牌点数
     */
    getPoints() {
        let total = 0;
        let aces = 0;
        
        for (let card of this.hand) {
            total += card.point;
            if (card.isAce) aces++;
        }
        
        while (total > 21 && aces > 0) {
            total -= 10;
            aces--;
        }
        
        return total;
    }

    /**
     * 检查是否为软17
     * @returns {boolean} 是否为软17
     * @description 检查是否为软17（A+6）
     */
    isSoft17() {
        const points = this.getPoints();
        if (points !== 17) return false;
        
        let aceCount = 0;
        let nonAcePoints = 0;
        
        for (let card of this.hand) {
            if (card.isAce) {
                aceCount++;
            } else {
                nonAcePoints += card.point;
            }
        }
        
        return aceCount > 0 && nonAcePoints + aceCount * 11 === 17;
    }

    /**
     * 做出决策
     * @param {number} playerPoints - 玩家点数
     * @param {Function} callback - 决策回调函数
     * @returns {void}
     * @description AI庄家根据策略做出要牌或停牌决策
     */
    makeDecision(playerPoints, callback) {
        this.isThinking = true;
        
        setTimeout(() => {
            const decision = this.calculateDecision(playerPoints);
            this.isThinking = false;
            
            if (callback) {
                callback(decision);
            }
        }, this.aiConfig.DECISION_DELAY);
    }

    /**
     * 计算决策
     * @param {number} playerPoints - 玩家点数
     * @returns {string} 决策结果 ('hit' 或 'stand')
     * @description 根据难度策略计算决策
     */
    calculateDecision(playerPoints) {
        const points = this.getPoints();
        
        if (points < 17) {
            return 'hit';
        }
        
        if (points > 21) {
            return 'stand';
        }
        
        if (this.difficulty === 'easy') {
            return 'stand';
        }
        
        if (this.difficulty === 'normal') {
            return this.normalStrategy(points, playerPoints);
        }
        
        if (this.difficulty === 'hard') {
            return this.hardStrategy(points, playerPoints);
        }
        
        return 'stand';
    }

    /**
     * 普通难度策略
     * @param {number} points - 庄家点数
     * @param {number} playerPoints - 玩家点数
     * @returns {string} 决策结果
     * @description 普通难度的决策逻辑
     */
    normalStrategy(points, playerPoints) {
        if (this.isSoft17()) {
            if (Math.random() < this.aiConfig.HIT_PROBABILITY_SOFT_17) {
                return 'hit';
            }
        }
        
        if (points >= 17 && points < 19) {
            if (Math.random() < this.aiConfig.HIT_PROBABILITY_17_18) {
                return 'hit';
            }
        }
        
        return 'stand';
    }

    /**
     * 困难难度策略
     * @param {number} points - 庄家点数
     * @param {number} playerPoints - 玩家点数
     * @returns {string} 决策结果
     * @description 困难难度的决策逻辑
     */
    hardStrategy(points, playerPoints) {
        if (this.isSoft17()) {
            if (Math.random() < this.aiConfig.HIT_PROBABILITY_SOFT_17) {
                return 'hit';
            }
        }
        
        if (points >= 17 && points < 20) {
            if (playerPoints > points && playerPoints <= 21) {
                if (Math.random() < this.aiConfig.HIT_PROBABILITY_17_19) {
                    return 'hit';
                }
            }
        }
        
        if (points === 17 && playerPoints === 17) {
            if (Math.random() < 0.3) {
                return 'hit';
            }
        }
        
        return 'stand';
    }

    /**
     * 重置庄家手牌
     * @returns {void}
     * @description 清空庄家手牌
     */
    reset() {
        this.hand = [];
        this.isThinking = false;
        this.getRandomMember();
    }

    /**
     * 获取随机成员（相邻不重复）
     * @returns {string} 成员名字
     * @description 从Popin'Party成员中随机选择一个，确保相邻不重复
     */
    getRandomMember() {
        if (this.members.length <= 1) return this.members[0];
        
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.members.length);
        } while (newIndex === this.lastMemberIndex);
        
        this.lastMemberIndex = newIndex;
        this.currentMember = this.members[newIndex];
        return this.currentMember;
    }

    /**
     * 获取当前成员
     * @returns {string} 当前成员名字
     * @description 获取当前庄家成员
     */
    getCurrentMember() {
        return this.currentMember;
    }

    /**
     * 获取可见卡牌
     * @returns {Object} 第一张牌
     * @description 获取庄家明牌
     */
    getVisibleCard() {
        return this.hand.length > 0 ? this.hand[0] : null;
    }

    /**
     * 获取思考状态
     * @returns {boolean} 是否正在思考
     * @description 获取AI思考状态
     */
    getThinkingStatus() {
        return this.isThinking;
    }
}

window.AIDealer = AIDealer;
