/**
 * BanG jack - 游戏配置文件
 * @description 包含游戏所有可配置参数和常量
 * @version 2.0
 */

const CONFIG = {
    GAME_NAME: 'BanG jack',
    VERSION: '2.0.0',
    
    COLORS: {
        PRIMARY_1: '#FFB6C1',
        PRIMARY_2: '#DCD0FF',
        PRIMARY_3: '#B0E0E6',
        SECONDARY: '#FFD89B',
        NEUTRAL: '#FFF8F0',
        SUCCESS: '#7EC8A3',
        DANGER: '#F5A5A5',
        WARNING: '#FFD89B',
        PINK_SOFT: '#FFB6C1',
        PINK_LIGHT: '#FFD1DC',
        LAVENDER: '#E6E6FA',
        LAVENDER_SOFT: '#DCD0FF',
        MINT: '#B8E8D1',
        PEACH: '#FFDAB9',
        SKY: '#B0E0E6',
        CREAM: '#FFF8F0'
    },
    
    CARD: {
        WIDTH: 120,
        HEIGHT: 180,
        BORDER_RADIUS: 16,
        BORDER_WIDTH: 2,
        ANIMATION_DURATION: 500,
        FLIP_DURATION: 400
    },
    
    CHIP: {
        DIAMETER: 50,
        VALUES: [10, 50, 100, 500],
        COLORS: {
            10: '#FFDAB9',
            50: '#FFB6C1',
            100: '#DCD0FF',
            500: '#B0E0E6'
        }
    },
    
    GAME: {
        INITIAL_CHIPS: 1000,
        MIN_BET: 10,
        MAX_BET: 500,
        BLACKJACK_MULTIPLIER: 2.5,
        WIN_MULTIPLIER: 2,
        DEALER_STAND_VALUE: 17
    },
    
    AI: {
        EASY: {
            NAME: '简单',
            DECISION_DELAY: 1500,
            HIT_PROBABILITY_17_18: 0,
            HIT_PROBABILITY_SOFT_17: 0
        },
        NORMAL: {
            NAME: '普通',
            DECISION_DELAY: 1000,
            HIT_PROBABILITY_17_18: 0.3,
            HIT_PROBABILITY_SOFT_17: 0.5
        },
        HARD: {
            NAME: '困难',
            DECISION_DELAY: 800,
            HIT_PROBABILITY_17_19: 0.6,
            HIT_PROBABILITY_SOFT_17: 0.8
        }
    },
    
    CHARACTERS: {
        '户山香澄': { band: 'Poppin\'Party', role: 'vocalist', value: 'A' },
        '花园多惠': { band: 'Poppin\'Party', role: 'guitar', value: 'K' },
        '牛込里美': { band: 'Poppin\'Party', role: 'bass', value: 'Q' },
        '山吹沙绫': { band: 'Poppin\'Party', role: 'drums', value: 'J' },
        '市谷有咲': { band: 'Poppin\'Party', role: 'keyboard', value: '10' }
    },
    
    PATHS: {
        CARDS: '../assets/art/cards/',
        FACES: '../assets/art/cards/faces/',
        NUMBERS: '../assets/art/cards/numbers/',
        UI: '../assets/art/ui/',
        AUDIO: '../assets/audio/',
        FONTS: '../assets/fonts/'
    },
    
    AUDIO: {
        ENABLED: true,
        BGM_VOLUME: 0.5,
        SFX_VOLUME: 0.7,
        VOICE_VOLUME: 0.8
    },
    
    STORAGE: {
        KEY: 'bangdream_blackjack_save',
        AUTO_SAVE_INTERVAL: 30000
    },
    
    ANIMATION: {
        DEAL_DURATION: 500,
        FLIP_DURATION: 400,
        DEAL_TRAJECTORY_CURVATURE: 0.2,
        DEAL_ROTATION: 180,
        DEAL_BOUNCE_HEIGHT: 5,
        CHIP_BOUNCE_HEIGHT: 10,
        CHIP_FALL_DURATION: 400,
        PARTICLE_COUNT: 50,
        PARTICLE_SPEED: 6,
        STAGGER_DELAY: 150,
        ENABLE_PARTICLES: true,
        ENABLE_GLOW: true
    }
};

Object.freeze(CONFIG);
