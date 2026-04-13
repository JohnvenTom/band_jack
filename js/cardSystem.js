/**
 * BanG jack - 卡牌系统
 * @description 管理卡牌创建、渲染、动画等核心功能
 * @version 1.0
 */

class CardSystem {
    /**
     * 构造函数
     * @param {Object} config - 游戏配置对象
     * @description 初始化卡牌系统
     */
    constructor(config) {
        this.config = config;
        this.deck = [];
        this.usedCards = [];
        this.characterCards = [];
        this.loadedImages = new Map();
        this.init();
    }

    /**
     * 初始化卡牌系统
     * @returns {void}
     * @description 加载卡牌资源并创建牌组
     */
    init() {
        this.loadCharacterCards();
        this.createDeck();
    }

    /**
     * 加载角色卡牌配置
     * @returns {void}
     * @description 根据Popin'Party角色配置卡牌
     */
    loadCharacterCards() {
        const characters = [
            { name: '户山香澄', value: 'A', point: 11 },
            { name: '花园多惠', value: 'K', point: 10 },
            { name: '牛込里美', value: 'Q', point: 10 },
            { name: '山吹沙绫', value: 'J', point: 10 },
            { name: '市谷有咲', value: '10', point: 10 }
        ];
        
        this.characterCards = characters;
    }

    /**
     * 创建标准52张牌组
     * @returns {Array} 牌组数组
     * @description 生成完整的黑杰克牌组
     */
    createDeck() {
        this.deck = [];
        const suits = ['guitar', 'bass', 'drums', 'keyboard'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        for (let suit of suits) {
            for (let value of values) {
                const card = {
                    suit: suit,
                    value: value,
                    point: this.getCardPoint(value),
                    isAce: value === 'A',
                    isFaceCard: ['J', 'Q', 'K'].includes(value),
                    character: this.getCharacterForCard(value),
                    id: `${suit}_${value}_${Date.now()}_${Math.random()}`
                };
                this.deck.push(card);
            }
        }
        
        this.shuffleDeck();
        return this.deck;
    }

    /**
     * 获取卡牌点数
     * @param {string} value - 卡牌面值
     * @returns {number} 卡牌点数
     * @description 根据卡牌面值计算点数
     */
    getCardPoint(value) {
        if (value === 'A') return 11;
        if (['J', 'Q', 'K'].includes(value)) return 10;
        return parseInt(value);
    }

    /**
     * 获取卡牌对应角色
     * @param {string} value - 卡牌面值
     * @returns {Object} 角色信息
     * @description 根据卡牌面值获取对应角色，所有卡牌都有角色图片
     */
    getCharacterForCard(value) {
        const mapping = {
            'A': { name: '户山香澄', role: 'vocalist' },
            'K': { name: '花园多惠', role: 'guitar' },
            'Q': { name: '牛込里美', role: 'bass' },
            'J': { name: '山吹沙绫', role: 'drums' },
            '10': { name: '市谷有咲', role: 'keyboard' },
            '9': { name: '户山香澄', role: 'vocalist' },
            '8': { name: '花园多惠', role: 'guitar' },
            '7': { name: '牛込里美', role: 'bass' },
            '6': { name: '山吹沙绫', role: 'drums' },
            '5': { name: '市谷有咲', role: 'keyboard' },
            '4': { name: '户山香澄', role: 'vocalist' },
            '3': { name: '花园多惠', role: 'guitar' },
            '2': { name: '牛込里美', role: 'bass' }
        };
        return mapping[value] || { name: '户山香澄', role: 'vocalist' };
    }

    /**
     * 洗牌
     * @returns {void}
     * @description 使用Fisher-Yates算法随机打乱牌组
     */
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    /**
     * 发一张牌
     * @returns {Object|null} 卡牌对象
     * @description 从牌组顶部抽取一张牌
     */
    dealCard() {
        if (this.deck.length === 0) {
            this.createDeck();
        }
        return this.deck.pop();
    }

    /**
     * 计算手牌总点数
     * @param {Array} cards - 卡牌数组
     * @returns {number} 总点数
     * @description 计算手牌点数，自动处理A牌的1/11点转换
     */
    calculatePoints(cards) {
        let total = 0;
        let aces = 0;
        
        for (let card of cards) {
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
     * 检查是否为Blackjack
     * @param {Array} cards - 卡牌数组
     * @returns {boolean} 是否为Blackjack
     * @description 检查是否为21点（A+10点牌）
     */
    isBlackjack(cards) {
        if (cards.length !== 2) return false;
        const hasAce = cards.some(c => c.isAce);
        const hasTenValue = cards.some(c => c.point === 10);
        return hasAce && hasTenValue;
    }

    /**
     * 检查是否爆牌
     * @param {Array} cards - 卡牌数组
     * @returns {boolean} 是否爆牌
     * @description 检查点数是否超过21
     */
    isBust(cards) {
        return this.calculatePoints(cards) > 21;
    }

    /**
     * 获取角色卡牌图片路径
     * @param {string} characterName - 角色名称
     * @returns {string} 图片路径
     * @description 获取角色卡牌的随机图片路径
     */
    getCharacterImagePath(characterName) {
        const availableCards = this.getAvailableCharacterCards(characterName);
        if (availableCards.length === 0) {
            console.warn(`No cards found for character: ${characterName}`);
            return null;
        }
        const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
        const path = `${this.config.PATHS.FACES}Popin%27Party/${randomCard}`;
        console.log(`Character image path: ${path}`);
        return path;
    }

    /**
     * 获取可用角色卡牌列表
     * @param {string} characterName - 角色名称
     * @returns {Array} 可用卡牌文件名列表
     * @description 获取指定角色的所有可用卡牌图片
     */
    getAvailableCharacterCards(characterName) {
        const allCards = [
            '户山香澄_101_ca.png', '户山香澄_1023_ca.png', '户山香澄_1045_ca.png',
            '户山香澄_1097_ca.png', '户山香澄_1113_ca.png', '户山香澄_1163_ca.png',
            '户山香澄_1222_ca.png', '户山香澄_1280_ca.png', '户山香澄_1348_ca.png',
            '户山香澄_1544_ca.png', '户山香澄_1703_ca.png', '户山香澄_2002_ca.png',
            '户山香澄_3_ca.png', '户山香澄_4_ca.png', '户山香澄_277_ca.png',
            '户山香澄_333_ca.png', '户山香澄_402_ca.png', '户山香澄_425_ca.png',
            '户山香澄_444_ca.png', '户山香澄_457_ca.png', '户山香澄_492_ca.png',
            '户山香澄_556_ca.png', '户山香澄_577_ca.png', '户山香澄_614_ca.png',
            '户山香澄_686_ca.png', '户山香澄_717_ca.png', '户山香澄_725_ca.png',
            '户山香澄_774_ca.png', '户山香澄_795_ca.png', '户山香澄_832_ca.png',
            '户山香澄_939_ca.png', '户山香澄_976_ca.png',
            '花园多惠_1019_ca.png', '花园多惠_1110_ca.png', '花园多惠_1131_ca.png',
            '花园多惠_1167_ca.png', '花园多惠_1239_ca.png', '花园多惠_1317_ca.png',
            '花园多惠_1351_ca.png', '花园多惠_1488_ca.png', '花园多惠_1546_ca.png',
            '花园多惠_1623_ca.png', '花园多惠_1726_ca.png', '花园多惠_2001_ca.png',
            '花园多惠_118_ca.png', '花园多惠_133_ca.png', '花园多惠_172_ca.png',
            '花园多惠_262_ca.png', '花园多惠_334_ca.png', '花园多惠_427_ca.png',
            '花园多惠_430_ca.png', '花园多惠_474_ca.png', '花园多惠_490_ca.png',
            '花园多惠_581_ca.png',
            '牛込里美_1057_ca.png', '牛込里美_1103_ca.png', '牛込里美_1109_ca.png',
            '牛込里美_1165_ca.png', '牛込里美_1240_ca.png', '牛込里美_1283_ca.png',
            '牛込里美_1347_ca.png', '牛込里美_1542_ca.png', '牛込里美_1624_ca.png',
            '牛込里美_1674_ca.png', '牛込里美_1767_ca.png', '牛込里美_2055_ca.png',
            '牛込里美_11_ca.png', '牛込里美_116_ca.png', '牛込里美_12_ca.png',
            '牛込里美_141_ca.png', '牛込里美_288_ca.png', '牛込里美_337_ca.png',
            '牛込里美_426_ca.png', '牛込里美_494_ca.png', '牛込里美_515_ca.png',
            '牛込里美_552_ca.png', '牛込里美_615_ca.png', '牛込里美_713_ca.png',
            '牛込里美_720_ca.png', '牛込里美_747_ca.png', '牛込里美_772_ca.png',
            '牛込里美_790_ca.png', '牛込里美_833_ca.png', '牛込里美_917_ca.png',
            '牛込里美_978_ca.png',
            '山吹沙绫_1056_ca.png', '山吹沙绫_1141_ca.png', '山吹沙绫_1166_ca.png',
            '山吹沙绫_1241_ca.png', '山吹沙绫_1279_ca.png', '山吹沙绫_1349_ca.png',
            '山吹沙绫_1489_ca.png', '山吹沙绫_1540_ca.png', '山吹沙绫_1673_ca.png',
            '山吹沙绫_1729_ca.png', '山吹沙绫_2000_ca.png', '山吹沙绫_2053_ca.png',
            '山吹沙绫_117_ca.png', '山吹沙绫_143_ca.png', '山吹沙绫_15_ca.png',
            '山吹沙绫_16_ca.png', '山吹沙绫_171_ca.png', '山吹沙绫_286_ca.png',
            '山吹沙绫_335_ca.png', '山吹沙绫_429_ca.png', '山吹沙绫_459_ca.png',
            '山吹沙绫_491_ca.png', '山吹沙绫_553_ca.png', '山吹沙绫_599_ca.png',
            '山吹沙绫_616_ca.png', '山吹沙绫_691_ca.png', '山吹沙绫_722_ca.png',
            '山吹沙绫_745_ca.png', '山吹沙绫_771_ca.png', '山吹沙绫_834_ca.png',
            '山吹沙绫_868_ca.png', '山吹沙绫_972_ca.png', '山吹沙绫_979_ca.png',
            '市谷有咲_102_ca.png', '市谷有咲_1058_ca.png', '市谷有咲_1092_ca.png',
            '市谷有咲_1111_ca.png', '市谷有咲_1164_ca.png', '市谷有咲_1242_ca.png',
            '市谷有咲_1281_ca.png', '市谷有咲_1320_ca.png', '市谷有咲_1363_ca.png',
            '市谷有咲_1492_ca.png', '市谷有咲_1543_ca.png', '市谷有咲_1675_ca.png',
            '市谷有咲_1725_ca.png', '市谷有咲_2004_ca.png', '市谷有咲_2052_ca.png',
            '市谷有咲_19_ca.png', '市谷有咲_20_ca.png', '市谷有咲_132_ca.png',
            '市谷有咲_173_ca.png', '市谷有咲_287_ca.png', '市谷有咲_373_ca.png',
            '市谷有咲_428_ca.png', '市谷有咲_461_ca.png', '市谷有咲_472_ca.png',
            '市谷有咲_522_ca.png', '市谷有咲_554_ca.png', '市谷有咲_618_ca.png',
            '市谷有咲_666_ca.png', '市谷有咲_688_ca.png', '市谷有咲_718_ca.png',
            '市谷有咲_770_ca.png', '市谷有咲_826_ca.png', '市谷有咲_829_ca.png',
            '市谷有咲_853_ca.png', '市谷有咲_977_ca.png'
        ];
        
        return allCards.filter(card => card.startsWith(characterName));
    }

    /**
     * 创建卡牌DOM元素
     * @param {Object} card - 卡牌对象
     * @param {boolean} faceDown - 是否正面朝下
     * @returns {HTMLElement} 卡牌DOM元素
     * @description 创建完整的卡牌HTML元素
     */
    createCardElement(card, faceDown = false) {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.dataset.cardId = card.id;
        cardEl.dataset.value = card.value;
        cardEl.dataset.suit = card.suit;
        
        if (faceDown) {
            cardEl.classList.add('face-down');
        }
        
        const innerEl = document.createElement('div');
        innerEl.className = 'card-inner';
        
        const frontEl = this.createCardFront(card);
        const backEl = this.createCardBack();
        
        innerEl.appendChild(frontEl);
        innerEl.appendChild(backEl);
        cardEl.appendChild(innerEl);
        
        return cardEl;
    }

    /**
     * 创建卡牌正面
     * @param {Object} card - 卡牌对象
     * @returns {HTMLElement} 卡牌正面元素
     * @description 创建卡牌正面DOM元素
     */
    createCardFront(card) {
        const frontEl = document.createElement('div');
        frontEl.className = 'card-front';
        
        const frameEl = document.createElement('div');
        frameEl.className = 'card-frame';
        
        const characterEl = document.createElement('div');
        characterEl.className = 'card-character';
        
        if (card.character) {
            const imgPath = this.getCharacterImagePath(card.character.name);
            if (imgPath) {
                const img = document.createElement('img');
                img.src = imgPath;
                img.alt = card.character.name;
                img.className = 'character-image';
                img.onerror = function() {
                    this.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'card-number-display';
                    fallback.textContent = card.value;
                    this.parentNode.appendChild(fallback);
                };
                characterEl.appendChild(img);
            } else {
                const numberDisplay = document.createElement('div');
                numberDisplay.className = 'card-number-display';
                numberDisplay.textContent = card.value;
                characterEl.appendChild(numberDisplay);
            }
        } else {
            const numberDisplay = document.createElement('div');
            numberDisplay.className = 'card-number-display';
            numberDisplay.textContent = card.value;
            characterEl.appendChild(numberDisplay);
        }
        
        frameEl.appendChild(characterEl);
        
        const starsEl = this.createStarsElement(card.point);
        frameEl.appendChild(starsEl);
        
        frontEl.appendChild(frameEl);
        return frontEl;
    }

    /**
     * 创建星星元素
     * @param {number} point - 卡牌点数
     * @returns {HTMLElement} 星星容器元素
     * @description 创建左下角的星星显示
     */
    createStarsElement(point) {
        const starsEl = document.createElement('div');
        starsEl.className = 'card-stars';
        
        const fullStars = Math.floor(point / 2);
        const halfStar = point % 2;
        
        for (let i = 0; i < fullStars; i++) {
            const star = document.createElement('img');
            star.src = `${this.config.PATHS.NUMBERS}star.png`;
            star.className = 'star full-star';
            starsEl.appendChild(star);
        }
        
        if (halfStar) {
            const star = document.createElement('img');
            star.src = `${this.config.PATHS.NUMBERS}nor-star.png`;
            star.className = 'star half-star';
            starsEl.appendChild(star);
        }
        
        return starsEl;
    }

    /**
     * 创建卡牌背面
     * @returns {HTMLElement} 卡牌背面元素
     * @description 创建卡牌背面DOM元素
     */
    createCardBack() {
        const backEl = document.createElement('div');
        backEl.className = 'card-back';
        
        const patternEl = document.createElement('div');
        patternEl.className = 'card-back-pattern';
        backEl.appendChild(patternEl);
        
        return backEl;
    }

    /**
     * 翻转卡牌
     * @param {HTMLElement} cardEl - 卡牌元素
     * @param {Function} callback - 回调函数
     * @returns {void}
     * @description 执行卡牌翻转动画
     */
    flipCard(cardEl, callback) {
        cardEl.classList.toggle('face-down');
        
        if (callback) {
            setTimeout(callback, this.config.CARD.FLIP_DURATION);
        }
    }

    /**
     * 重置牌组
     * @returns {void}
     * @description 重置并重新洗牌
     */
    resetDeck() {
        this.deck = [];
        this.usedCards = [];
        this.createDeck();
    }
}

window.CardSystem = CardSystem;
