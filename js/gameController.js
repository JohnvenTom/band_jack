/**
 * BanG jack - 游戏主控制器
 * @description 整合所有游戏系统，管理游戏流程
 * @version 1.0
 */

class GameController {
    /**
     * 构造函数
     * @description 初始化游戏控制器
     */
    constructor() {
        this.config = CONFIG;
        this.gameState = 'idle';
        this.playerHand = [];
        this.dealerHand = [];
        this.currentBet = 0;
        this.difficulty = 'normal';
        this.isFirstGame = true;
        this.betLimitUnlocked = false;
        
        this.splitHands = [];
        this.currentSplitIndex = 0;
        this.isSplitMode = false;
        this.splitResults = [];
        
        this.cardSystem = null;
        this.aiDealer = null;
        this.economySystem = null;
        this.uiSystem = null;
        this.audioSystem = null;
        this.saveSystem = null;
        this.animationSystem = null;
    }

    /**
     * 初始化游戏
     * @returns {void}
     * @description 初始化所有子系统并开始游戏
     */
    init() {
        console.log(`${this.config.GAME_NAME} - 游戏初始化中...`);
        
        this.cardSystem = new CardSystem(this.config);
        this.aiDealer = new AIDealer(this.config, this.difficulty);
        this.economySystem = new EconomySystem(this.config);
        this.animationSystem = new AnimationSystem(this.config);
        this.audioSystem = new AudioSystem(this.config);
        this.uiSystem = new UISystem(this.config, this.cardSystem, this.audioSystem);
        this.uiSystem.setAnimationSystem(this.animationSystem);
        this.saveSystem = new SaveSystem(this.config);
        
        this.uiSystem.init();
        this.audioSystem.init();
        
        this.updateDealerName();
        
        this.loadGame();
        this.bindEvents();
        this.startAutoSave();
        
        this.uiSystem.updateChipsDisplay(this.economySystem.getChips());
        this.uiSystem.updateStatsDisplay(this.economySystem.getStatistics());
        
        this.showWelcome();
        
        console.log('游戏初始化完成！');
    }

    /**
     * 绑定事件
     * @returns {void}
     * @description 绑定所有游戏事件
     */
    bindEvents() {
        document.addEventListener('chipSelected', (e) => {
            this.handleChipSelection(e.detail.value);
        });
        
        document.addEventListener('chipRemoved', (e) => {
            this.handleChipRemoval(e.detail.value);
        });
        
        document.addEventListener('chipDisabled', (e) => {
            this.handleChipDisabled(e.detail.value);
        });
        
        document.addEventListener('chipLimitReached', () => {
            this.handleChipLimitReached();
        });
        
        document.getElementById('btn-confirm-bet')?.addEventListener('click', () => {
            this.confirmBet();
        });
        
        document.querySelectorAll('.game-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleAction(action);
            });
        });
        
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        document.addEventListener('click', () => {
            this.audioSystem.resumeContext();
        }, { once: true });

        document.addEventListener('openSettings', () => {
            this.openVolumeSettings();
        });
    }

    /**
     * 打开音量设置
     * @returns {void}
     * @description 显示音量设置弹窗
     */
    openVolumeSettings() {
        const currentVolumes = {
            bgm: this.audioSystem.volumes.bgm,
            sfx: this.audioSystem.volumes.sfx,
            voice: this.audioSystem.volumes.voice,
            stamp: this.audioSystem.volumes.stamp
        };

        this.uiSystem.showVolumeSettings(
            currentVolumes, 
            (type, value) => {
                this.handleVolumeChange(type, value);
            },
            this.audioSystem.kasumiWinSound,
            (enabled) => {
                this.handleKasumiWinSoundChange(enabled);
            }
        );
    }

    /**
     * 处理音量变化
     * @param {string} type - 音量类型 (bgm/sfx/voice)
     * @param {number} value - 音量值 (0-1)
     * @returns {void}
     * @description 更新音量设置并保存
     */
    handleVolumeChange(type, value) {
        this.audioSystem.setVolume(type, value);
        this.saveGame();
    }

    /**
     * 处理香澄胜利音效开关变化
     * @param {boolean} enabled - 是否启用
     * @returns {void}
     * @description 更新香澄胜利音效设置并保存
     */
    handleKasumiWinSoundChange(enabled) {
        this.audioSystem.setKasumiWinSound(enabled);
        this.saveGame();
    }

    /**
     * 处理筹码选择
     * @param {number} value - 筹码面值
     * @returns {void}
     * @description 处理玩家选择筹码
     */
    handleChipSelection(value) {
        if (this.gameState !== 'betting') return;
        
        const newBet = this.currentBet + value;
        const maxBet = this.betLimitUnlocked ? 
            this.economySystem.getChips() : 
            Math.min(this.config.GAME.MAX_BET, this.economySystem.getChips());
        
        if (newBet <= maxBet) {
            this.currentBet = newBet;
            this.uiSystem.updateBetDisplay(this.currentBet);
            this.uiSystem.updateChipSelectorState(
                this.economySystem.getChips(), 
                this.currentBet, 
                this.betLimitUnlocked ? this.economySystem.getChips() : this.config.GAME.MAX_BET
            );
            this.audioSystem.play('chip');
        }
    }

    /**
     * 处理禁用筹码点击
     * @param {number} value - 筹码面值
     * @returns {void}
     * @description 区分筹码不足和达到下注限制两种情况
     */
    handleChipDisabled(value) {
        if (this.gameState !== 'betting') return;
        
        const availableChips = this.economySystem.getChips();
        const remainingChips = availableChips - this.currentBet;
        const maxBet = this.betLimitUnlocked ? availableChips : this.config.GAME.MAX_BET;
        const remainingBet = maxBet - this.currentBet;
        
        if (remainingChips < value) {
            this.uiSystem.showMessage('筹码不足', 'warning');
        } else if (remainingBet < value && !this.betLimitUnlocked) {
            this.handleChipLimitReached();
        }
    }

    /**
     * 处理筹码限制触发
     * @returns {void}
     * @description 当用户尝试超过下注限制时显示解除限制抽屉
     */
    handleChipLimitReached() {
        if (this.gameState !== 'betting') return;
        if (this.betLimitUnlocked) return;
        
        this.uiSystem.showBetLimitDrawer(() => {
            this.betLimitUnlocked = true;
            this.uiSystem.updateChipSelectorState(
                this.economySystem.getChips(), 
                this.currentBet, 
                this.economySystem.getChips()
            );
            this.uiSystem.showMessage('下注限制已解除（仅本次有效）', 'info');
        });
    }

    /**
     * 处理筹码退回
     * @param {number} value - 筹码面值
     * @returns {void}
     * @description 处理玩家从堆叠区退回筹码
     */
    handleChipRemoval(value) {
        if (this.gameState !== 'betting') return;
        
        this.currentBet = Math.max(0, this.currentBet - value);
        this.uiSystem.updateBetDisplay(this.currentBet);
        this.uiSystem.updateChipSelectorState(
            this.economySystem.getChips(), 
            this.currentBet, 
            this.betLimitUnlocked ? this.economySystem.getChips() : this.config.GAME.MAX_BET
        );
        this.audioSystem.play('chip');
    }

    /**
     * 确认下注
     * @returns {void}
     * @description 确认下注并开始游戏
     */
    confirmBet() {
        if (this.currentBet < this.config.GAME.MIN_BET) {
            this.uiSystem.showMessage(`最小下注金额为 ${this.config.GAME.MIN_BET}`, 'warning');
            return;
        }
        
        const result = this.economySystem.placeBet(this.currentBet);
        
        if (result.success) {
            this.uiSystem.updateChipsDisplay(this.economySystem.getChips());
            this.uiSystem.hideBetArea();
            this.startGame();
        } else {
            this.uiSystem.showMessage(result.message, 'danger');
        }
    }

    /**
     * 开始游戏
     * @returns {void}
     * @description 开始新一局游戏
     */
    startGame() {
        this.gameState = 'playing';
        this.playerHand = [];
        this.dealerHand = [];
        
        this.uiSystem.clearCardsArea('player');
        this.uiSystem.clearCardsArea('dealer');
        this.uiSystem.showMessage('游戏开始！', 'info');
        
        this.dealInitialCards();
    }

    /**
     * 发初始牌
     * @returns {void}
     * @description 发两张牌给玩家和庄家
     */
    dealInitialCards() {
        const dealDelay = this.config.CARD.ANIMATION_DURATION;
        
        setTimeout(() => {
            const card1 = this.cardSystem.dealCard();
            this.playerHand.push(card1);
            this.uiSystem.addCardToArea(card1, 'player', false, () => {
                this.updatePlayerPoints();
            });
            this.audioSystem.play('deal');
        }, dealDelay * 0);
        
        setTimeout(() => {
            const card2 = this.cardSystem.dealCard();
            this.dealerHand.push(card2);
            this.aiDealer.receiveCard(card2);
            this.uiSystem.addCardToArea(card2, 'dealer', false, () => {
                this.updateDealerPoints(true);
            });
            this.audioSystem.play('deal');
        }, dealDelay * 1);
        
        setTimeout(() => {
            const card3 = this.cardSystem.dealCard();
            this.playerHand.push(card3);
            this.uiSystem.addCardToArea(card3, 'player', false, () => {
                this.updatePlayerPoints();
            });
            this.audioSystem.play('deal');
        }, dealDelay * 2);
        
        setTimeout(() => {
            const card4 = this.cardSystem.dealCard();
            this.dealerHand.push(card4);
            this.aiDealer.receiveCard(card4);
            this.uiSystem.addCardToArea(card4, 'dealer', true, () => {
                this.updateDealerPoints(true);
                this.checkInitialBlackjack();
            });
            this.audioSystem.play('deal');
        }, dealDelay * 3);
    }

    /**
     * 检查初始Blackjack
     * @returns {void}
     * @description 检查是否开局即为Blackjack
     */
    checkInitialBlackjack() {
        const playerBJ = this.cardSystem.isBlackjack(this.playerHand);
        const dealerBJ = this.cardSystem.isBlackjack(this.dealerHand);
        
        if (playerBJ || dealerBJ) {
            this.uiSystem.flipCard(1, 'dealer', () => {
                this.updateDealerPoints(false);
                
                if (playerBJ && dealerBJ) {
                    this.endGame('draw');
                } else if (playerBJ) {
                    this.endGame('blackjack');
                } else {
                    this.endGame('lose');
                }
            });
        } else {
            this.enablePlayerActions();
        }
    }

    /**
     * 启用玩家操作
     * @returns {void}
     * @description 启用玩家的操作按钮
     */
    enablePlayerActions() {
        const canDouble = this.playerHand.length === 2 && 
            this.economySystem.getChips() >= this.currentBet;
        const canSplit = this.playerHand.length === 2 && 
            this.playerHand[0].value === this.playerHand[1].value &&
            this.economySystem.getChips() >= this.currentBet &&
            !this.isSplitMode;
        
        this.uiSystem.setButtonStates({
            hit: true,
            stand: true,
            double: canDouble,
            split: canSplit
        });
        
        this.uiSystem.showMessage('请选择操作', 'info');
    }

    /**
     * 处理玩家操作
     * @param {string} action - 操作类型
     * @returns {void}
     * @description 处理玩家的游戏操作
     */
    handleAction(action) {
        if (this.gameState !== 'playing') return;
        
        this.audioSystem.playButtonSound(action);
        
        if (this.isSplitMode) {
            switch (action) {
                case 'hit':
                    this.splitHit();
                    break;
                case 'stand':
                    this.splitStand();
                    break;
                case 'double':
                    this.splitDouble();
                    break;
            }
        } else {
            switch (action) {
                case 'hit':
                    this.playerHit();
                    break;
                case 'stand':
                    this.playerStand();
                    break;
                case 'double':
                    this.playerDouble();
                    break;
                case 'split':
                    this.playerSplit();
                    break;
            }
        }
    }

    /**
     * 玩家要牌
     * @returns {void}
     * @description 玩家请求新牌
     */
    playerHit() {
        this.uiSystem.setButtonStates({ hit: false, stand: false, double: false, split: false });
        
        const card = this.cardSystem.dealCard();
        this.playerHand.push(card);
        
        this.uiSystem.addCardToArea(card, 'player', false, () => {
            this.updatePlayerPoints();
            
            if (this.cardSystem.isBust(this.playerHand)) {
                this.uiSystem.showBustEffect('player');
                this.uiSystem.showMessage('爆牌！', 'danger');
                this.audioSystem.play('bust');
                setTimeout(() => {
                    this.endGame('lose');
                }, 1000);
            } else {
                this.uiSystem.setButtonStates({ hit: true, stand: true, double: false, split: false });
            }
        });
        
        this.audioSystem.play('deal');
    }

    /**
     * 玩家停牌
     * @returns {void}
     * @description 玩家结束回合
     */
    playerStand() {
        this.uiSystem.setButtonStates({ hit: false, stand: false, double: false, split: false });
        this.uiSystem.showMessage(`${this.aiDealer.getCurrentMember()}回合...`, 'info');
        
        this.dealerTurn();
    }

    /**
     * 玩家加倍
     * @returns {void}
     * @description 玩家加倍下注
     */
    playerDouble() {
        const result = this.economySystem.doubleDown();
        
        if (result.success) {
            this.currentBet = result.bet;
            this.uiSystem.updateChipsDisplay(this.economySystem.getChips());
            this.uiSystem.updateBetDisplay(this.currentBet);
            this.uiSystem.showMessage('加倍成功！', 'info');
            
            const card = this.cardSystem.dealCard();
            this.playerHand.push(card);
            
            this.uiSystem.addCardToArea(card, 'player', false, () => {
                this.updatePlayerPoints();
                
                if (this.cardSystem.isBust(this.playerHand)) {
                    this.uiSystem.showBustEffect('player');
                    this.uiSystem.showMessage('爆牌！', 'danger');
                    this.audioSystem.play('bust');
                    setTimeout(() => {
                        this.endGame('lose');
                    }, 1000);
                } else {
                    this.playerStand();
                }
            });
            
            this.audioSystem.play('deal');
        } else {
            this.uiSystem.showMessage(result.message, 'warning');
        }
    }

    /**
     * 玩家分牌
     * @returns {void}
     * @description 玩家分牌操作
     */
    playerSplit() {
        if (this.economySystem.getChips() < this.currentBet) {
            this.uiSystem.showMessage('筹码不足以分牌', 'warning');
            return;
        }
        
        this.economySystem.chips -= this.currentBet;
        this.uiSystem.updateChipsDisplay(this.economySystem.getChips());
        
        this.isSplitMode = true;
        this.splitHands = [[this.playerHand[0]], [this.playerHand[1]]];
        this.currentSplitIndex = 0;
        this.splitResults = [];
        
        this.uiSystem.showMessage('分牌成功！开始第一组手牌', 'info');
        this.uiSystem.clearCardsArea('player');
        this.uiSystem.createSplitAreas(2);
        
        this.playerHand = this.splitHands[0];
        this.playSplitHand(0);
    }

    /**
     * 开始分牌后的手牌游戏
     * @param {number} index - 手牌索引
     * @returns {void}
     * @description 开始指定分牌手牌的游戏
     */
    playSplitHand(index) {
        this.currentSplitIndex = index;
        this.playerHand = this.splitHands[index];
        
        this.uiSystem.highlightSplitArea(index);
        this.uiSystem.clearSplitArea(index);
        
        const card = this.playerHand[0];
        this.uiSystem.addCardToSplitArea(card, index, false, () => {
            this.updateSplitPoints(index);
            
            const newCard = this.cardSystem.dealCard();
            this.playerHand.push(newCard);
            this.uiSystem.addCardToSplitArea(newCard, index, false, () => {
                this.updateSplitPoints(index);
                
                if (this.cardSystem.isBust(this.playerHand)) {
                    this.uiSystem.showBustEffect(`split-${index}`);
                    this.uiSystem.showMessage(`第${index + 1}组爆牌！`, 'danger');
                    this.audioSystem.play('bust');
                    this.splitResults[index] = 'bust';
                    setTimeout(() => {
                        this.nextSplitHand();
                    }, 1000);
                } else {
                    this.enableSplitActions(index);
                }
            });
            this.audioSystem.play('deal');
        });
        this.audioSystem.play('deal');
    }

    /**
     * 启用分牌后的操作按钮
     * @param {number} index - 手牌索引
     * @returns {void}
     * @description 启用分牌后的操作按钮
     */
    enableSplitActions(index) {
        const canDouble = this.playerHand.length === 2 && 
            this.economySystem.getChips() >= this.currentBet;
        
        this.uiSystem.setButtonStates({
            hit: true,
            stand: true,
            double: canDouble,
            split: false
        });
        
        this.uiSystem.showMessage(`第${index + 1}组手牌，请选择操作`, 'info');
    }

    /**
     * 分牌后要牌
     * @returns {void}
     * @description 分牌后要牌操作
     */
    splitHit() {
        this.uiSystem.setButtonStates({ hit: false, stand: false, double: false, split: false });
        
        const card = this.cardSystem.dealCard();
        this.playerHand.push(card);
        this.splitHands[this.currentSplitIndex] = this.playerHand;
        
        this.uiSystem.addCardToSplitArea(card, this.currentSplitIndex, false, () => {
            this.updateSplitPoints(this.currentSplitIndex);
            
            if (this.cardSystem.isBust(this.playerHand)) {
                this.uiSystem.showBustEffect(`split-${this.currentSplitIndex}`);
                this.uiSystem.showMessage(`第${this.currentSplitIndex + 1}组爆牌！`, 'danger');
                this.audioSystem.play('bust');
                this.splitResults[this.currentSplitIndex] = 'bust';
                setTimeout(() => {
                    this.nextSplitHand();
                }, 1000);
            } else {
                this.enableSplitActions(this.currentSplitIndex);
            }
        });
        
        this.audioSystem.play('deal');
    }

    /**
     * 分牌后停牌
     * @returns {void}
     * @description 分牌后停牌操作
     */
    splitStand() {
        this.splitResults[this.currentSplitIndex] = 'stand';
        this.nextSplitHand();
    }

    /**
     * 分牌后加倍
     * @returns {void}
     * @description 分牌后加倍操作
     */
    splitDouble() {
        if (this.economySystem.getChips() < this.currentBet) {
            this.uiSystem.showMessage('筹码不足以加倍', 'warning');
            this.enableSplitActions(this.currentSplitIndex);
            return;
        }
        
        this.economySystem.chips -= this.currentBet;
        this.uiSystem.updateChipsDisplay(this.economySystem.getChips());
        
        const card = this.cardSystem.dealCard();
        this.playerHand.push(card);
        this.splitHands[this.currentSplitIndex] = this.playerHand;
        
        this.uiSystem.addCardToSplitArea(card, this.currentSplitIndex, false, () => {
            this.updateSplitPoints(this.currentSplitIndex);
            
            if (this.cardSystem.isBust(this.playerHand)) {
                this.uiSystem.showBustEffect(`split-${this.currentSplitIndex}`);
                this.uiSystem.showMessage(`第${this.currentSplitIndex + 1}组爆牌！`, 'danger');
                this.audioSystem.play('bust');
                this.splitResults[this.currentSplitIndex] = 'bust';
            } else {
                this.splitResults[this.currentSplitIndex] = 'double';
            }
            
            setTimeout(() => {
                this.nextSplitHand();
            }, 1000);
        });
        
        this.audioSystem.play('deal');
    }

    /**
     * 进入下一组分牌手牌
     * @returns {void}
     * @description 进入下一组分牌手牌或结束
     */
    nextSplitHand() {
        this.currentSplitIndex++;
        
        if (this.currentSplitIndex < this.splitHands.length) {
            this.uiSystem.setButtonStates({ hit: false, stand: false, double: false, split: false });
            this.uiSystem.showMessage(`开始第${this.currentSplitIndex + 1}组手牌`, 'info');
            setTimeout(() => {
                this.playSplitHand(this.currentSplitIndex);
            }, 500);
        } else {
            this.dealerTurnForSplit();
        }
    }

    /**
     * 分牌后的庄家回合
     * @returns {void}
     * @description 分牌后的庄家回合
     */
    dealerTurnForSplit() {
        this.uiSystem.setButtonStates({ hit: false, stand: false, double: false, split: false });
        this.uiSystem.showMessage(`${this.aiDealer.getCurrentMember()}回合...`, 'info');
        
        this.uiSystem.flipCard(1, 'dealer', () => {
            this.updateDealerPoints(false);
            this.audioSystem.play('flip');
            
            setTimeout(() => {
                this.dealerPlayForSplit();
            }, 500);
        });
    }

    /**
     * 分牌后庄家行动
     * @returns {void}
     * @description 分牌后庄家根据AI策略行动
     */
    dealerPlayForSplit() {
        const maxPlayerPoints = Math.max(...this.splitHands.map(hand => {
            const points = this.cardSystem.calculatePoints(hand);
            return points > 21 ? 0 : points;
        }));
        
        this.aiDealer.makeDecision(maxPlayerPoints, (decision) => {
            if (decision === 'hit') {
                this.dealerHitForSplit();
            } else {
                this.determineSplitWinner();
            }
        });
        
        this.uiSystem.showThinkingAnimation();
    }

    /**
     * 分牌后庄家要牌
     * @returns {void}
     * @description 分牌后庄家请求新牌
     */
    dealerHitForSplit() {
        const card = this.cardSystem.dealCard();
        this.dealerHand.push(card);
        this.aiDealer.receiveCard(card);
        
        this.uiSystem.addCardToArea(card, 'dealer', false, () => {
            this.updateDealerPoints(false);
            this.audioSystem.play('deal');
            
            if (this.cardSystem.isBust(this.dealerHand)) {
                this.uiSystem.showBustEffect('dealer');
                this.uiSystem.showMessage(`${this.aiDealer.getCurrentMember()}爆牌！`, 'success');
                this.uiSystem.hideThinkingAnimation();
                setTimeout(() => {
                    this.determineSplitWinner();
                }, 1000);
            } else {
                setTimeout(() => {
                    this.dealerPlayForSplit();
                }, 500);
            }
        });
    }

    /**
     * 判定分牌胜负
     * @returns {void}
     * @description 判定分牌后的胜负
     */
    determineSplitWinner() {
        this.uiSystem.hideThinkingAnimation();
        
        const dealerPoints = this.cardSystem.calculatePoints(this.dealerHand);
        const dealerBust = dealerPoints > 21;
        
        let totalWin = 0;
        let totalLose = 0;
        let results = [];
        
        this.splitHands.forEach((hand, index) => {
            const playerPoints = this.cardSystem.calculatePoints(hand);
            const playerBust = playerPoints > 21;
            
            let result;
            if (playerBust) {
                result = 'lose';
                totalLose += this.currentBet;
            } else if (dealerBust || playerPoints > dealerPoints) {
                result = 'win';
                totalWin += this.currentBet;
            } else if (playerPoints < dealerPoints) {
                result = 'lose';
                totalLose += this.currentBet;
            } else {
                result = 'draw';
            }
            
            results.push({
                index: index + 1,
                points: playerPoints,
                result: result
            });
        });
        
        let finalResult;
        let netWin = totalWin - totalLose;
        
        if (totalWin > totalLose) {
            this.economySystem.chips += totalWin * 2 + (this.currentBet * this.splitHands.length - totalLose);
            finalResult = 'win';
        } else if (totalWin < totalLose) {
            finalResult = 'lose';
        } else {
            this.economySystem.chips += this.currentBet * this.splitHands.length;
            finalResult = 'draw';
        }
        
        this.economySystem.winCount += totalWin > 0 ? 1 : 0;
        this.economySystem.loseCount += totalLose > 0 && totalWin === 0 ? 1 : 0;
        
        this.uiSystem.updateChipsDisplay(this.economySystem.getChips());
        this.uiSystem.updateStatsDisplay(this.economySystem.getStatistics());
        
        let resultMessage = '分牌结果:\n';
        results.forEach(r => {
            resultMessage += `第${r.index}组: ${r.points}点 - ${r.result === 'win' ? '胜利' : r.result === 'lose' ? '失败' : '平局'}\n`;
        });
        
        this.audioSystem.playResultSound(finalResult);
        
        if (finalResult === 'win') {
            this.uiSystem.showVictoryEffect();
        }
        
        setTimeout(() => {
            this.uiSystem.showSplitResultPopup(results, finalResult, netWin, () => {
                this.endSplitGame();
            });
        }, 500);
    }

    /**
     * 结束分牌游戏
     * @returns {void}
     * @description 结束分牌游戏并重置状态
     */
    endSplitGame() {
        this.isSplitMode = false;
        this.splitHands = [];
        this.currentSplitIndex = 0;
        this.splitResults = [];
        
        this.saveGame();
        this.isFirstGame = false;
        
        this.uiSystem.removeSplitAreas();
        this.prepareNewRound();
    }

    /**
     * 更新分牌点数显示
     * @param {number} index - 手牌索引
     * @returns {void}
     * @description 更新分牌点数显示
     */
    updateSplitPoints(index) {
        const points = this.cardSystem.calculatePoints(this.splitHands[index]);
        this.uiSystem.updateSplitPointsDisplay(index, points);
    }

    /**
     * 庄家回合
     * @returns {void}
     * @description 开始庄家回合
     */
    dealerTurn() {
        this.uiSystem.flipCard(1, 'dealer', () => {
            this.updateDealerPoints(false);
            this.audioSystem.play('flip');
            
            setTimeout(() => {
                this.dealerPlay();
            }, 500);
        });
    }

    /**
     * 庄家行动
     * @returns {void}
     * @description 庄家根据AI策略行动
     */
    dealerPlay() {
        const playerPoints = this.cardSystem.calculatePoints(this.playerHand);
        
        this.aiDealer.makeDecision(playerPoints, (decision) => {
            if (decision === 'hit') {
                this.dealerHit();
            } else {
                this.determineWinner();
            }
        });
        
        this.uiSystem.showThinkingAnimation();
    }

    /**
     * 庄家要牌
     * @returns {void}
     * @description 庄家请求新牌
     */
    dealerHit() {
        const card = this.cardSystem.dealCard();
        this.dealerHand.push(card);
        this.aiDealer.receiveCard(card);
        
        this.uiSystem.addCardToArea(card, 'dealer', false, () => {
            this.updateDealerPoints(false);
            this.audioSystem.play('deal');
            
            if (this.cardSystem.isBust(this.dealerHand)) {
                this.uiSystem.showBustEffect('dealer');
                this.uiSystem.showMessage(`${this.aiDealer.getCurrentMember()}爆牌！`, 'success');
                this.uiSystem.hideThinkingAnimation();
                setTimeout(() => {
                    this.endGame('win');
                }, 1000);
            } else {
                setTimeout(() => {
                    this.dealerPlay();
                }, 500);
            }
        });
    }

    /**
     * 判定胜负
     * @returns {void}
     * @description 比较点数判定胜负
     */
    determineWinner() {
        this.uiSystem.hideThinkingAnimation();
        
        const playerPoints = this.cardSystem.calculatePoints(this.playerHand);
        const dealerPoints = this.cardSystem.calculatePoints(this.dealerHand);
        
        if (playerPoints > dealerPoints) {
            this.endGame('win');
        } else if (playerPoints < dealerPoints) {
            this.endGame('lose');
        } else {
            this.endGame('draw');
        }
    }

    /**
     * 结束游戏
     * @param {string} result - 游戏结果
     * @returns {void}
     * @description 处理游戏结束
     */
    endGame(result) {
        this.gameState = 'ended';
        
        let settleResult;
        let isBlackjack = false;
        
        switch (result) {
            case 'blackjack':
                isBlackjack = true;
                settleResult = this.economySystem.win(true);
                break;
            case 'win':
                settleResult = this.economySystem.win(false);
                break;
            case 'lose':
                settleResult = this.economySystem.lose();
                break;
            case 'draw':
                settleResult = this.economySystem.draw();
                break;
        }
        
        this.audioSystem.playResultSound(result, isBlackjack);
        
        if (result === 'win' || result === 'blackjack') {
            this.uiSystem.showVictoryEffect();
        }
        
        this.uiSystem.updateChipsDisplay(this.economySystem.getChips());
        this.uiSystem.updateStatsDisplay(this.economySystem.getStatistics());
        
        setTimeout(() => {
            this.uiSystem.showResultPopup(settleResult, () => {
                this.prepareNewRound();
            });
        }, 500);
        
        this.saveGame();
        this.isFirstGame = false;
    }

    /**
     * 准备新一轮
     * @returns {void}
     * @description 重置游戏状态准备新一轮
     */
    prepareNewRound() {
        this.currentBet = 0;
        this.betLimitUnlocked = false;
        this.playerHand = [];
        this.dealerHand = [];
        this.aiDealer.reset();
        this.updateDealerName();
        
        this.uiSystem.updateBetDisplay(0);
        this.uiSystem.clearCardsArea('player');
        this.uiSystem.clearCardsArea('dealer');
        this.uiSystem.clearChipStack();
        
        if (this.economySystem.isBankrupt()) {
            this.handleBankruptcy();
        } else {
            this.gameState = 'betting';
            this.uiSystem.showBetArea();
            this.uiSystem.updateChipSelectorState(
                this.economySystem.getChips(), 
                0, 
                this.config.GAME.MAX_BET
            );
            this.uiSystem.showMessage('请选择下注金额', 'info');
        }
    }

    /**
     * 处理破产
     * @returns {void}
     * @description 处理玩家筹码耗尽
     */
    handleBankruptcy() {
        this.uiSystem.showMessage('筹码已用完！', 'danger');
        
        const popup = document.createElement('div');
        popup.className = 'result-popup lose';
        
        const content = document.createElement('div');
        content.className = 'result-content';
        content.innerHTML = `
            <h2>游戏结束</h2>
            <p>你的筹码已用完！</p>
            <p>是否重新开始？</p>
        `;
        
        const restartBtn = document.createElement('button');
        restartBtn.className = 'game-btn';
        restartBtn.textContent = '重新开始';
        restartBtn.addEventListener('click', () => {
            popup.remove();
            this.restartGame();
        });
        
        content.appendChild(restartBtn);
        popup.appendChild(content);
        document.body.appendChild(popup);
    }

    /**
     * 重新开始游戏
     * @returns {void}
     * @description 重置所有游戏数据
     */
    restartGame() {
        this.economySystem.reset(false);
        this.cardSystem.resetDeck();
        this.saveGame();
        
        this.uiSystem.updateChipsDisplay(this.economySystem.getChips());
        this.uiSystem.updateStatsDisplay(this.economySystem.getStatistics());
        
        this.prepareNewRound();
    }

    /**
     * 更新玩家点数
     * @returns {void}
     * @description 更新玩家点数显示
     */
    updatePlayerPoints() {
        const points = this.cardSystem.calculatePoints(this.playerHand);
        this.uiSystem.updatePointsDisplay('player', points);
    }

    /**
     * 更新庄家点数
     * @param {boolean} hideSecond - 是否隐藏第二张牌点数
     * @returns {void}
     * @description 更新庄家点数显示
     */
    updateDealerPoints(hideSecond) {
        if (hideSecond && this.dealerHand.length >= 2) {
            const firstCard = this.dealerHand[0];
            this.uiSystem.updatePointsDisplay('dealer', firstCard.point);
        } else {
            const points = this.cardSystem.calculatePoints(this.dealerHand);
            this.uiSystem.updatePointsDisplay('dealer', points);
        }
    }

    /**
     * 处理键盘输入
     * @param {KeyboardEvent} e - 键盘事件
     * @returns {void}
     * @description 处理键盘快捷键
     */
    handleKeyPress(e) {
        if (this.gameState !== 'playing') return;
        
        switch (e.key.toLowerCase()) {
            case 'h':
                this.handleAction('hit');
                break;
            case 's':
                this.handleAction('stand');
                break;
            case 'd':
                this.handleAction('double');
                break;
        }
    }

    /**
     * 获取随机Logo
     * @returns {string} Logo图片路径
     * @description 从预设的Logo列表中随机选择一个
     */
    getRandomLogo() {
        const logos = [
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
        return logos[Math.floor(Math.random() * logos.length)];
    }

    /**
     * 显示欢迎界面
     * @returns {void}
     * @description 显示游戏欢迎界面
     */
    showWelcome() {
        const welcome = document.createElement('div');
        welcome.className = 'welcome-overlay';
        welcome.innerHTML = `
            <div class="welcome-decorations">
                <span class="welcome-decoration"><i class="ph ph-music-notes"></i></span>
                <span class="welcome-decoration"><i class="ph ph-guitar"></i></span>
                <span class="welcome-decoration"><i class="ph ph-piano-keys"></i></span>
                <span class="welcome-decoration"><i class="ph ph-microphone-stage"></i></span>
                <span class="welcome-decoration"><i class="ph ph-drum"></i></span>
                <span class="welcome-decoration"><i class="ph ph-sparkle"></i></span>
            </div>
            <div class="welcome-content">
                <div class="welcome-logo"><img src="${this.getRandomLogo()}" alt="Logo"></div>
                <h1 class="welcome-title">${this.config.GAME_NAME}</h1>
                <p class="welcome-subtitle">与Popin'Party一起玩21点！</p>
                
                <div class="welcome-features">
                    <div class="welcome-feature">
                        <div class="welcome-feature-icon"><i class="ph ph-target"></i></div>
                        <div class="welcome-feature-text">
                            <h4>目标goat</h4>
                            <p>让手牌点数接近21点，但小心不能超过了!</p>
                        </div>
                    </div>
                    <div class="welcome-feature">
                        <div class="welcome-feature-icon"><i class="ph ph-star"></i></div>
                        <div class="welcome-feature-text">
                            <h4>特殊奖励</h4>
                            <p>A+10/J/Q/K 可获得 2.5 倍奖励</p>
                        </div>
                    </div>
                    <div class="welcome-feature">
                        <div class="welcome-feature-icon"><i class="ph ph-palette"></i></div>
                        <div class="welcome-feature-text">
                            <h4>超多卡面</h4>
                            <p>邦邦卡牌封面设计</p>
                        </div>
                    </div>
                </div>
                
                <div class="welcome-buttons">
                    <button class="welcome-btn welcome-btn-primary" id="welcome-start">开始游戏</button>
                    <button class="welcome-btn welcome-btn-secondary" id="welcome-tutorial">查看教程</button>
                </div>
                
                <p class="welcome-footer">按 H 要牌 | S 停牌 | D 加倍</p>
            </div>
        `;
        
        document.body.appendChild(welcome);
        
        document.getElementById('welcome-start').addEventListener('click', () => {
            welcome.remove();
            this.gameState = 'betting';
            this.uiSystem.showBetArea();
            this.uiSystem.updateChipSelectorState(
                this.economySystem.getChips(), 
                0, 
                this.config.GAME.MAX_BET
            );
            if (!this.isFirstGame) {
                this.isFirstGame = false;
                this.saveGame();
            }
        });
        
        document.getElementById('welcome-tutorial').addEventListener('click', () => {
            welcome.remove();
            this.showTutorial();
        });
    }

    /**
     * 显示新手引导
     * @returns {void}
     * @description 显示游戏教程
     */
    showTutorial() {
        const tutorial = document.createElement('div');
        tutorial.className = 'tutorial-overlay';
        tutorial.innerHTML = `
            <div class="tutorial-content">
                <h2>游戏教程</h2>
                <div class="tutorial-steps">
                    <div class="tutorial-step">
                        <h3><i class="ph ph-target" style="margin-right: 8px;"></i>游戏目标</h3>
                        <p>让手牌点数尽可能接近21点，但不能超过！</p>
                    </div>
                    <div class="tutorial-step">
                        <h3><i class="ph ph-cards" style="margin-right: 8px;"></i>卡牌点数</h3>
                        <p>A = 1或11点 | 2-10 = 牌面值 | J/Q/K = 10点</p>
                    </div>
                    <div class="tutorial-step">
                        <h3><i class="ph ph-game-controller" style="margin-right: 8px;"></i>操作说明</h3>
                        <p><strong>要牌(H)</strong> - 获得一张新牌</p>
                        <p><strong>停牌(S)</strong> - 结束回合</p>
                        <p><strong>加倍(D)</strong> - 双倍下注，仅得一张牌</p>
                    </div>
                    <div class="tutorial-step">
                        <h3><i class="ph ph-star" style="margin-right: 8px;"></i>特殊奖励</h3>
                        <p>Blackjack (A + 10点牌) = 2.5倍奖励！</p>
                    </div>
                </div>
                <button class="game-btn" id="tutorial-close">开始游戏</button>
            </div>
        `;
        
        document.body.appendChild(tutorial);
        
        document.getElementById('tutorial-close').addEventListener('click', () => {
            tutorial.remove();
            this.gameState = 'betting';
            this.uiSystem.showBetArea();
            this.uiSystem.updateChipSelectorState(
                this.economySystem.getChips(), 
                0, 
                this.config.GAME.MAX_BET
            );
            this.isFirstGame = false;
            this.saveGame();
        });
    }

    /**
     * 保存游戏
     * @returns {void}
     * @description 保存游戏进度
     */
    saveGame() {
        const gameData = {
            economy: this.economySystem.exportSaveData(),
            audio: this.audioSystem.exportSettings(),
            difficulty: this.difficulty,
            isFirstGame: this.isFirstGame
        };
        
        this.saveSystem.save(gameData);
    }

    /**
     * 更新庄家名称
     * @returns {void}
     * @description 更新UI上的庄家名称显示
     */
    updateDealerName() {
        const dealerName = this.aiDealer.getCurrentMember();
        const nameElement = document.getElementById('dealer-name');
        if (nameElement) {
            nameElement.textContent = dealerName;
        }
    }

    /**
     * 加载游戏
     * @returns {void}
     * @description 加载游戏进度
     */
    loadGame() {
        const gameData = this.saveSystem.load();
        
        if (gameData) {
            this.economySystem.importSaveData(gameData.economy);
            this.audioSystem.importSettings(gameData.audio);
            this.difficulty = gameData.difficulty || 'normal';
            this.isFirstGame = gameData.isFirstGame !== false;
            
            console.log('游戏存档已加载');
        }
        
        this.gameState = 'betting';
    }

    /**
     * 启动自动保存
     * @returns {void}
     * @description 启动自动保存功能
     */
    startAutoSave() {
        this.saveSystem.startAutoSave(() => {
            return {
                economy: this.economySystem.exportSaveData(),
                audio: this.audioSystem.exportSettings(),
                difficulty: this.difficulty,
                isFirstGame: this.isFirstGame
            };
        });
    }

    /**
     * 设置难度
     * @param {string} difficulty - 难度级别
     * @returns {void}
     * @description 更改游戏难度
     */
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.aiDealer.setDifficulty(difficulty);
        this.saveGame();
    }
}

window.GameController = GameController;
