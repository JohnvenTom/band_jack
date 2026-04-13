/**
 * BanG jack - 主入口文件
 * @description 游戏主入口，初始化游戏核心模块
 * @version 1.0
 */

(function() {
    'use strict';
    
    let game = null;
    let preloader = null;
    let preloadUI = null;
    
    /**
     * 初始化预加载系统
     */
    function initPreloader() {
        console.log('[Main] 初始化预加载系统...');
        
        preloader = new ResourcePreloader();
        preloadUI = new PreloadUI(preloader);
        
        // 收集需要预加载的资源
        collectResources();
        
        // 初始化UI
        preloadUI.init();
        
        // 开始预加载
        preloader.start();
    }
    
    /**
     * 收集所有需要预加载的资源
     */
    function collectResources() {
        console.log('[Main] 收集资源列表...');
        
        const basePath = './assets';
        
        // 1. 数字图片 (0-9, 星星)
        const numberImages = [];
        for (let i = 0; i <= 9; i++) {
            numberImages.push(`${basePath}/art/cards/numbers/${i}.png`);
        }
        numberImages.push(`${basePath}/art/cards/numbers/star.png`);
        numberImages.push(`${basePath}/art/cards/numbers/s_star.png`);
        numberImages.push(`${basePath}/art/cards/numbers/nor-star.png`);
        preloader.addImages(numberImages);
        
        // 3. Logo/Stamp 图片
        const stampImages = [];
        const stampIds = [
            '001001', '001002', '001003', '001004', '001005', 
            '001006', '001007', '001008', '001009', '001010',
            '001012', '001013', '001014', '001015', '001016',
            '001017', '001018', '001019', '001020',
            '002001', '002002', '002003', '002004', '002005',
            '002006', '002007', '002008', '002009', '002010',
            '002011', '002012',
            '003001', '003002', '003003', '003004', '003005',
            '003006', '003007', '003008', '003009', '003010',
            '003011', '003012',
            '004001', '004002', '004003', '004004', '004005',
            '004006', '004007', '004008', '004009', '004010',
            '004011', '004012', '004013',
            '005001', '005002', '005003', '005004', '005005',
            '005006', '005007', '005008', '005009', '005010',
            '005011', '005012', '005013', '005014', '005015', '005016'
        ];
        stampIds.forEach(id => {
            stampImages.push(`${basePath}/logo/stamp_${id}.png`);
        });
        preloader.addImages(stampImages);
        
        // 4. 音频文件 (关键音效)
        const audioFiles = [];
        
        // Bingo音效
        audioFiles.push(`${basePath}/audio/sfx/bingo/2021birthday_01.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bingo/2021birthday_02.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bingo/2021birthday_03.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bingo/2021birthday_04.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bingo/2021birthday_05.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bingo/SE_RESULT_SUCCESS.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bingo/SE_RHYTHM_FULLCOMBO.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bingo/SE_RESULT_HIGHSCORE.mp3`);
        
        // Win音效
        audioFiles.push(`${basePath}/audio/sfx/win/SE_FANFARE.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/SE_SHOCKING_SUCCESS.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/SE_ARISA_KY.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/SE_KASUMI_GT.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/SE_SAYA_DR.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/SE_TAE_GT.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/ksm/full_combo_001_01.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/ksm/full_combo_001_02.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/ksm/full_combo_001_03.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/shout/SE_AUDIENCE_BIG_SHORT.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/shout/SE_CHEER_BIG_2.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/shout/SE_CLAPS_MID_SHORT.mp3`);
        
        // Failed音效
        audioFiles.push(`${basePath}/audio/sfx/failed/SE_GUITAR_DROP.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/failed/SE_DRAM_ROLL.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/failed/SE_GUITER_SHARP.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/failed/SE_KASUMI_GT.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/failed/SE_RIMI_BA.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/failed/SE_WHISTLE.mp3`);
        
        // Bomb音效
        audioFiles.push(`${basePath}/audio/sfx/bomb/SE_QUIZ_CORRECT.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bomb/SE_QUIZ_MISS.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bomb/SE_MISSION_JINGLE.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bomb/SE_GUITAR_HIT_2.mp3`);
        
        // Short音效
        audioFiles.push(`${basePath}/audio/sfx/short/SE_GACHA_STAR_01.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/short/SE_HEART_FLY.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/short/SE_BOTTLE_CHEERS.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/short/SE_JUGGLING.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/short/SE_POPS_OUT.mp3`);
        
        // Logo目录下的音频
        audioFiles.push(`${basePath}/logo/stamp_001016.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_001017.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_001019.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_002011.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_002012.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_003009.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_003010.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_003011.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_004011.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_004012.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_005013.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_005014.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_005015.mp3`);
        
        preloader.addAudio(audioFiles);
        
        console.log('[Main] 资源收集完成！');
    }
    
    /**
     * 预加载完成后初始化游戏
     */
    function initGame() {
        console.log('[Main] 初始化游戏...');
        
        try {
            game = new GameController();
            game.init();
            
            window.game = game;
            
            console.log('[Main] 游戏启动完成！');
        } catch (error) {
            console.error('[Main] 游戏初始化失败:', error);
            showErrorMessage('游戏加载失败，请刷新页面重试');
        }
    }
    
    /**
     * DOM加载完成后开始预加载
     */
    document.addEventListener('DOMContentLoaded', function() {
        console.log('BanG jack - 游戏启动中...');
        
        // 监听预加载完成事件
        document.addEventListener('preloadComplete', function() {
            console.log('[Main] 预加载完成，开始初始化游戏...');
            initGame();
        });
        
        // 初始化预加载系统
        initPreloader();
    });
    
    /**
     * 显示错误消息
     * @param {string} message - 错误消息
     */
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(244, 67, 54, 0.9);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 18px;
            z-index: 9999;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
    }
    
    /**
     * 页面卸载前保存游戏
     */
    window.addEventListener('beforeunload', function() {
        if (game) {
            game.saveGame();
        }
    });
    
    /**
     * 处理页面可见性变化
     */
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && game) {
            game.saveGame();
        }
    });
})();
