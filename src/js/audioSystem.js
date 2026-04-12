/**
 * BanG jack - 音效系统
 * @description 管理游戏音效和背景音乐
 * @version 2.0
 */

class AudioSystem {
    /**
     * 构造函数
     * @param {Object} config - 游戏配置对象
     * @description 初始化音效系统
     */
    constructor(config) {
        this.config = config;
        this.audioContext = null;
        this.sounds = new Map();
        this.bgm = null;
        this.isMuted = false;
        this.volumes = {
            bgm: config.AUDIO.BGM_VOLUME,
            sfx: config.AUDIO.SFX_VOLUME,
            voice: config.AUDIO.VOICE_VOLUME
        };
        this.initialized = false;
        
        this.lastPlayedIndex = {
            win: -1,
            winShout: -1,
            failed: -1,
            ksm: -1
        };
        
        this.soundPaths = {
            win: [
                '../assets/audio/sfx/win/SE_ARISA_KY.mp3',
                '../assets/audio/sfx/win/SE_FANFARE.mp3',
                '../assets/audio/sfx/win/SE_KAORU_RADIO.mp3',
                '../assets/audio/sfx/win/SE_KASUMI_GT.mp3',
                '../assets/audio/sfx/win/SE_KEYBOARD_02.mp3',
                '../assets/audio/sfx/win/SE_SAYA_DR.mp3',
                '../assets/audio/sfx/win/SE_SAYO_GUITAR1.mp3',
                '../assets/audio/sfx/win/SE_SHOCKING_SUCCESS.mp3',
                '../assets/audio/sfx/win/SE_STRUM_GUITAR.mp3',
                '../assets/audio/sfx/win/SE_STRUM_KY.mp3',
                '../assets/audio/sfx/win/SE_TAE_GT.mp3'
            ],
            winShout: [
                '../assets/audio/sfx/win/shout/SE_AUDIENCE_BIG_SHORT.mp3',
                '../assets/audio/sfx/win/shout/SE_CHEER_BIG_2.mp3',
                '../assets/audio/sfx/win/shout/SE_CHEER_BIG_WOMAN.mp3',
                '../assets/audio/sfx/win/shout/SE_CLAPS_MID_SHORT.mp3',
                '../assets/audio/sfx/win/shout/SE_CLAPS_SML_CHEER_FAR.mp3',
                '../assets/audio/sfx/win/shout/SE_GAYA_WOMEN_2.mp3',
                '../assets/audio/sfx/win/shout/SE_LAUFH_WOMEN.mp3',
                '../assets/audio/sfx/win/shout/SE_RHYTHM_CLEAR_VO.mp3',
                '../assets/audio/sfx/win/shout/SE_SHOUT.mp3'
            ],
            ksm: [
                '../assets/audio/sfx/win/ksm/full_combo_001_01.mp3',
                '../assets/audio/sfx/win/ksm/full_combo_001_02.mp3',
                '../assets/audio/sfx/win/ksm/full_combo_001_03.mp3'
            ],
            failed: [
                '../assets/audio/sfx/failed/SE_19_6_46_AYAECHO.mp3',
                '../assets/audio/sfx/failed/SE_31_4_21_AKOECHO.mp3',
                '../assets/audio/sfx/failed/SE_DRAM_ROLL.mp3',
                '../assets/audio/sfx/failed/SE_GUITAR_DROP.mp3',
                '../assets/audio/sfx/failed/SE_GUITER_SHARP.mp3',
                '../assets/audio/sfx/failed/SE_KASUMI_GT.mp3',
                '../assets/audio/sfx/failed/SE_KIRAKIRABOSHI.mp3',
                '../assets/audio/sfx/failed/SE_LIVE_BEYOND_OUTOLO.mp3',
                '../assets/audio/sfx/failed/SE_MINSTREL_SKILL.mp3',
                '../assets/audio/sfx/failed/SE_MOKA_GUITAR2.mp3',
                '../assets/audio/sfx/failed/SE_PIANO_PRACTICE_LAST.mp3',
                '../assets/audio/sfx/failed/SE_PIANO_RANDOM.mp3',
                '../assets/audio/sfx/failed/SE_RIMI_BA.mp3',
                '../assets/audio/sfx/failed/SE_SCHOOL_BELL_SHORT.mp3',
                '../assets/audio/sfx/failed/SE_SING_BELL.mp3',
                '../assets/audio/sfx/failed/SE_SOFARA.mp3',
                '../assets/audio/sfx/failed/SE_TELOP.mp3',
                '../assets/audio/sfx/failed/SE_TOASTER.mp3',
                '../assets/audio/sfx/failed/SE_UKULELE.mp3',
                '../assets/audio/sfx/failed/SE_VIOLIN_SHORT.mp3',
                '../assets/audio/sfx/failed/SE_WHISTLE.mp3'
            ],
            blackjack: '../assets/audio/sfx/bingo/SE_RHYTHM_FULLCOMBO.mp3',
            double: '../assets/audio/sfx/bingo/SE_AREA_ITEM_INSTALLATION.mp3',
            chip: '../assets/audio/sfx/short/SE_BOTTLE_CHEERS.mp3',
            hit: '../assets/audio/sfx/bingo/2021birthday_01.mp3',
            bust: '../assets/audio/sfx/bomb/SE_GUITAR_HIT_2.mp3',
            deal: '../assets/audio/sfx/short/SE_JUGGLING.mp3',
            flip: '../assets/audio/sfx/short/SE_POPS_OUT.mp3',
            stand: '../assets/audio/sfx/short/SE_HEART_FLY.mp3'
        };
        
        this.audioCache = new Map();
    }

    /**
     * 初始化音效系统
     * @returns {void}
     * @description 初始化Web Audio API
     */
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            console.log('音效系统初始化成功');
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
            this.initialized = false;
        }
    }

    /**
     * 获取随机索引（相邻不重复）
     * @param {Array} array - 数组
     * @param {string} type - 类型标识
     * @returns {number} 随机索引
     * @description 获取随机索引，确保不与上次相同
     */
    getRandomIndex(array, type) {
        if (array.length <= 1) return 0;
        
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * array.length);
        } while (newIndex === this.lastPlayedIndex[type]);
        
        this.lastPlayedIndex[type] = newIndex;
        return newIndex;
    }

    /**
     * 播放音频文件
     * @param {string} path - 音频文件路径
     * @returns {void}
     * @description 播放指定音频文件
     */
    playAudioFile(path) {
        if (!this.initialized || this.isMuted) {
            console.log('音效系统未初始化或已静音');
            return;
        }
        
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        let audio = this.audioCache.get(path);
        if (!audio) {
            audio = new Audio(path);
            audio.volume = this.volumes.sfx;
            this.audioCache.set(path, audio);
            console.log('加载音频:', path);
        }
        
        audio.currentTime = 0;
        audio.volume = this.volumes.sfx;
        audio.play().catch(e => {
            console.warn('音频播放失败:', path, e);
        });
    }

    /**
     * 播放音效
     * @param {string} name - 音效名称
     * @returns {void}
     * @description 播放指定音效
     */
    play(name) {
        console.log('尝试播放音效:', name, '初始化:', this.initialized, '静音:', this.isMuted);
        
        if (!this.initialized || this.isMuted) return;
        
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        switch (name) {
            case 'win':
                this.playWinSound();
                break;
            case 'lose':
            case 'draw':
                this.playFailedSound();
                break;
            case 'blackjack':
                this.playAudioFile(this.soundPaths.blackjack);
                break;
            case 'double':
                this.playAudioFile(this.soundPaths.double);
                break;
            case 'chip':
                this.playAudioFile(this.soundPaths.chip);
                break;
            case 'hit':
                this.playAudioFile(this.soundPaths.hit);
                break;
            case 'bust':
                this.playAudioFile(this.soundPaths.bust);
                break;
            case 'stand':
                this.playAudioFile(this.soundPaths.stand);
                break;
            case 'deal':
                this.playAudioFile(this.soundPaths.deal);
                break;
            case 'flip':
                this.playAudioFile(this.soundPaths.flip);
                break;
            default:
                console.warn('未知音效:', name);
        }
    }

    /**
     * 播放胜利音效
     * @returns {void}
     * @description 播放胜利音效和欢呼音效
     */
    playWinSound() {
        const winIndex = this.getRandomIndex(this.soundPaths.win, 'win');
        const shoutIndex = this.getRandomIndex(this.soundPaths.winShout, 'winShout');
        const ksmIndex = this.getRandomIndex(this.soundPaths.ksm, 'ksm');
        
        console.log('播放胜利音效:', this.soundPaths.win[winIndex]);
        this.playAudioFile(this.soundPaths.win[winIndex]);
        
        setTimeout(() => {
            console.log('播放欢呼音效:', this.soundPaths.winShout[shoutIndex]);
            this.playAudioFile(this.soundPaths.winShout[shoutIndex]);
            
            setTimeout(() => {
                console.log('播放KSM音效:', this.soundPaths.ksm[ksmIndex]);
                this.playAudioFile(this.soundPaths.ksm[ksmIndex]);
            }, 300);
        }, 100);
    }

    /**
     * 播放失败音效
     * @returns {void}
     * @description 播放失败/平局音效
     */
    playFailedSound() {
        const index = this.getRandomIndex(this.soundPaths.failed, 'failed');
        console.log('播放失败音效:', this.soundPaths.failed[index]);
        this.playAudioFile(this.soundPaths.failed[index]);
    }

    /**
     * 播放按钮音效
     * @param {string} action - 按钮动作
     * @returns {void}
     * @description 播放按钮点击音效
     */
    playButtonSound(action) {
        const soundMap = {
            'hit': 'hit',
            'stand': 'stand',
            'double': 'double',
            'split': 'hit'
        };
        
        const soundName = soundMap[action] || 'chip';
        this.play(soundName);
    }

    /**
     * 播放结果音效
     * @param {string} result - 结果类型
     * @param {boolean} isBlackjack - 是否为Blackjack
     * @returns {void}
     * @description 播放游戏结果音效
     */
    playResultSound(result, isBlackjack = false) {
        if (isBlackjack) {
            this.play('blackjack');
        } else {
            this.play(result);
        }
    }

    /**
     * 设置音量
     * @param {string} type - 音量类型 (bgm/sfx/voice)
     * @param {number} value - 音量值 (0-1)
     * @returns {void}
     * @description 设置指定类型音量
     */
    setVolume(type, value) {
        this.volumes[type] = Math.max(0, Math.min(1, value));
        
        this.audioCache.forEach(audio => {
            audio.volume = this.volumes.sfx;
        });
    }

    /**
     * 静音
     * @returns {void}
     * @description 切换静音状态
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.audioCache.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        }
        
        return this.isMuted;
    }

    /**
     * 恢复音频上下文
     * @returns {void}
     * @description 恢复被暂停的音频上下文
     */
    resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    /**
     * 导出设置
     * @returns {Object} 音频设置
     * @description 导出音频系统设置
     */
    exportSettings() {
        return {
            isMuted: this.isMuted,
            volumes: { ...this.volumes }
        };
    }

    /**
     * 导入设置
     * @param {Object} settings - 音频设置
     * @returns {void}
     * @description 导入音频系统设置
     */
    importSettings(settings) {
        if (settings) {
            this.isMuted = settings.isMuted || false;
            if (settings.volumes) {
                this.volumes = { ...this.volumes, ...settings.volumes };
            }
        }
    }
}

window.AudioSystem = AudioSystem;
