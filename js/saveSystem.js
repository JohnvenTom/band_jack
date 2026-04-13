/**
 * BanG jack - 存档系统
 * @description 管理游戏存档和加载功能
 * @version 1.0
 */

class SaveSystem {
    /**
     * 构造函数
     * @param {Object} config - 游戏配置对象
     * @description 初始化存档系统
     */
    constructor(config) {
        this.config = config;
        this.storageKey = config.STORAGE.KEY;
        this.autoSaveInterval = config.STORAGE.AUTO_SAVE_INTERVAL;
        this.autoSaveTimer = null;
    }

    /**
     * 保存游戏数据
     * @param {Object} gameData - 游戏数据对象
     * @returns {boolean} 保存是否成功
     * @description 保存游戏进度到本地存储
     */
    save(gameData) {
        try {
            const saveData = {
                version: this.config.VERSION,
                timestamp: Date.now(),
                data: gameData
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            console.log('游戏已保存');
            return true;
        } catch (e) {
            console.error('保存失败:', e);
            return false;
        }
    }

    /**
     * 加载游戏数据
     * @returns {Object|null} 游戏数据或null
     * @description 从本地存储加载游戏进度
     */
    load() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) return null;
            
            const parsed = JSON.parse(savedData);
            
            if (parsed.version !== this.config.VERSION) {
                console.warn('存档版本不匹配，可能需要迁移');
            }
            
            return parsed.data;
        } catch (e) {
            console.error('加载失败:', e);
            return null;
        }
    }

    /**
     * 删除存档
     * @returns {boolean} 删除是否成功
     * @description 删除本地存储的游戏数据
     */
    delete() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('存档已删除');
            return true;
        } catch (e) {
            console.error('删除存档失败:', e);
            return false;
        }
    }

    /**
     * 检查是否有存档
     * @returns {boolean} 是否存在存档
     * @description 检查本地存储中是否有游戏存档
     */
    hasSave() {
        return localStorage.getItem(this.storageKey) !== null;
    }

    /**
     * 获取存档信息
     * @returns {Object|null} 存档信息
     * @description 获取存档的基本信息
     */
    getSaveInfo() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) return null;
            
            const parsed = JSON.parse(savedData);
            return {
                version: parsed.version,
                timestamp: parsed.timestamp,
                date: new Date(parsed.timestamp).toLocaleString()
            };
        } catch (e) {
            return null;
        }
    }

    /**
     * 启动自动保存
     * @param {Function} getDataFunc - 获取游戏数据的函数
     * @returns {void}
     * @description 启动自动保存定时器
     */
    startAutoSave(getDataFunc) {
        this.stopAutoSave();
        
        this.autoSaveTimer = setInterval(() => {
            const gameData = getDataFunc();
            if (gameData) {
                this.save(gameData);
            }
        }, this.autoSaveInterval);
        
        console.log('自动保存已启动');
    }

    /**
     * 停止自动保存
     * @returns {void}
     * @description 停止自动保存定时器
     */
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
            console.log('自动保存已停止');
        }
    }

    /**
     * 导出存档文件
     * @param {Object} gameData - 游戏数据
     * @returns {string} JSON字符串
     * @description 导出存档为JSON字符串
     */
    exportToFile(gameData) {
        const exportData = {
            game: this.config.GAME_NAME,
            version: this.config.VERSION,
            timestamp: Date.now(),
            data: gameData
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    /**
     * 导入存档文件
     * @param {string} jsonString - JSON字符串
     * @returns {Object|null} 游戏数据或null
     * @description 从JSON字符串导入存档
     */
    importFromFile(jsonString) {
        try {
            const importData = JSON.parse(jsonString);
            
            if (importData.game !== this.config.GAME_NAME) {
                throw new Error('存档文件不匹配');
            }
            
            return importData.data;
        } catch (e) {
            console.error('导入存档失败:', e);
            return null;
        }
    }

    /**
     * 清理过期存档
     * @param {number} maxAge - 最大保存天数
     * @returns {void}
     * @description 清理过期的存档数据
     */
    cleanOldSaves(maxAge = 30) {
        const saveInfo = this.getSaveInfo();
        if (!saveInfo) return;
        
        const age = Date.now() - saveInfo.timestamp;
        const maxAgeMs = maxAge * 24 * 60 * 60 * 1000;
        
        if (age > maxAgeMs) {
            this.delete();
            console.log('已清理过期存档');
        }
    }
}

window.SaveSystem = SaveSystem;
