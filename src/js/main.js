/**
 * BanG jack - 主入口文件
 * @description 游戏主入口，初始化游戏核心模块
 * @version 1.0
 */

(function() {
    'use strict';
    
    let game = null;
    
    /**
     * DOM加载完成后初始化游戏
     */
    document.addEventListener('DOMContentLoaded', function() {
        console.log('BanG jack - 游戏启动中...');
        
        try {
            game = new GameController();
            game.init();
            
            window.game = game;
            
            console.log('游戏启动完成！');
        } catch (error) {
            console.error('游戏初始化失败:', error);
            showErrorMessage('游戏加载失败，请刷新页面重试');
        }
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
