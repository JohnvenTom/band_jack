# BanG jack

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Web-orange.svg)

**一款以《BanG Dream!》Popin'Party乐队为主题的21点纸牌游戏**

[在线演示](#) | [功能特性](#-功能特性) | [快速开始](#-快速开始) | [使用指南](#-使用指南)

</div>

---

## 📋 目录

- [项目概述](#-项目概述)
- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [快速开始](#-快速开始)
- [安装与配置](#-安装与配置)
- [使用指南](#-使用指南)
- [项目结构](#-项目结构)
- [API文档](#-api文档)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)
- [联系方式](#-联系方式)

---

## 🎯 项目概述

**BanG jack** 是一款将经典21点纸牌游戏与《BanG Dream!》中 Popin'Party 乐队完美结合的网页游戏。游戏采用温暖的音乐节主题配色，使用乐队成员（香澄、有咲、纱绫、多惠、里美）的精美卡牌，配合丰富的音效系统，为玩家带来沉浸式的游戏体验。

### 核心亮点

- 🎨 **精美视觉设计**：温暖色调渐变背景，柔和粉彩UI，流畅动画效果
- 🎭 **角色主题卡牌**：Popin'Party五位成员的专属卡牌
- 🎵 **丰富音效系统**：多种音效随机播放，胜利特效，点击彩蛋
- 🎮 **经典游戏玩法**：完整实现21点规则，支持加倍、分牌等操作
- 📱 **响应式设计**：完美适配桌面端和移动端，支持横竖屏切换
- 💾 **自动存档系统**：游戏进度自动保存，随时继续游戏

---

## ✨ 功能特性

### 🎮 游戏玩法

#### 经典21点规则
- **目标**：让手牌点数尽可能接近21点，但不能超过
- **A牌特殊规则**：A可算作1点或11点，系统自动选择最优值
- **Blackjack奖励**：初始两张牌达到21点（A+10点牌），获得1.5倍奖励

#### 操作选项
| 操作 | 快捷键 | 说明 |
|------|--------|------|
| 要牌 | `H` | 获得一张新牌 |
| 停牌 | `S` | 结束回合，轮到庄家 |
| 加倍 | `D` | 双倍下注，获得最后一张牌后停牌 |

#### 下注系统
- **筹码面值**：10、50、100、500
- **下注限制**：默认最大下注500，可解锁限制
- **筹码堆叠**：可视化堆叠动画，支持点击退回

### 🎨 视觉系统

#### 主题设计
- **背景**：从深橙红到热粉红的对角线渐变
- **配色**：柔和粉彩色系（粉色、薰衣草、薄荷绿、蜜桃色）
- **动画**：卡牌翻转、筹码堆叠、胜利彩带等流畅动画

#### 角色系统
- **庄家随机选择**：每局从Popin'Party成员中随机选择一位作为庄家
- **相邻不重复**：确保连续游戏不会出现相同庄家
- **动态显示**：庄家回合和爆牌时显示对应成员名字

### 🎵 音效系统

#### 音效类型
| 类型 | 说明 |
|------|------|
| 胜利音效 | 11种随机音效 + 9种欢呼音效 + 3种KSM音效 |
| 失败音效 | 21种随机音效 |
| Blackjack | 特殊庆祝音效 |
| 发牌/翻牌 | 短促清脆音效 |
| 爆牌 | 警示音效 |
| 点击彩蛋 | 随机角色语音 |

#### 音效特性
- 随机选择，相邻不重复
- 可调节音量
- 自动预加载优化

### 📱 响应式设计

#### 屏幕适配
- **竖屏模式**：大尺寸卡牌，优化触摸操作
- **横屏模式**：紧凑布局，点数显示在卡牌左侧
- **下注阶段**：游戏区域折叠，仅显示庄家和玩家名字

---

## 🛠️ 技术栈

### 前端技术

| 技术 | 版本 | 用途 |
|------|------|------|
| HTML5 | - | 语义化结构 |
| CSS3 | - | 样式、动画、Flexbox布局 |
| JavaScript | ES6+ | 游戏逻辑、模块化设计 |

### 核心库

- **无外部依赖**：纯原生JavaScript实现，无需安装任何框架或库

### 开发工具

- **代码规范**：ES6+语法，模块化设计
- **注释规范**：JSDoc风格注释
- **版本控制**：Git

---

## 🚀 快速开始

### 在线游玩

访问 [在线演示](https://johnventom.github.io/band_jack/) 立即开始游戏。

### 本地运行

1. **克隆仓库**
   ```bash
   git clone https://github.com/JohnvenTom/bang-jack.git
   cd bang-jack
   ```

2. **启动本地服务器**
   
   使用任意HTTP服务器，例如：
   
   ```bash
   # 使用Python 3
   python -m http.server 8000
   
   # 使用Node.js的http-server
   npx http-server -p 8000
   
   # 使用PHP
   php -S localhost:8000
   ```

3. **访问游戏**
   
   打开浏览器访问 `http://localhost:8000/src/`

---

## 📦 安装与配置

### 系统要求

- **浏览器**：支持ES6+的现代浏览器
  - Chrome 60+
  - Firefox 55+
  - Safari 11+
  - Edge 79+
- **分辨率**：最低320x480，推荐1920x1080

### 配置文件

游戏配置位于 `src/js/config.js`，可自定义以下参数：

```javascript
const CONFIG = {
    GAME_NAME: 'BanG jack',
    VERSION: '2.0.0',
    
    GAME: {
        INITIAL_CHIPS: 1000,      // 初始筹码
        MAX_BET: 500,             // 最大下注
        MIN_BET: 10,              // 最小下注
        BLACKJACK_MULTIPLIER: 1.5 // Blackjack奖励倍数
    },
    
    CARD: {
        WIDTH: 120,               // 卡牌宽度
        HEIGHT: 180,              // 卡牌高度
        FLIP_DURATION: 400        // 翻牌动画时长(ms)
    },
    
    CHIP: {
        VALUES: [10, 50, 100, 500] // 筹码面值
    }
};
```

### 音效配置

音效文件位于 `assets/audio/sfx/` 目录，可在 `src/js/audioSystem.js` 中自定义音效路径：

```javascript
this.soundPaths = {
    win: [/* 胜利音效数组 */],
    failed: [/* 失败音效数组 */],
    blackjack: 'path/to/blackjack.mp3',
    // ... 其他音效
};
```

---

## 📖 使用指南

### 游戏流程

#### 1. 欢迎界面
- 显示游戏名称和随机角色表情包
- 点击"开始游戏"进入下注阶段

#### 2. 下注阶段
- 点击筹码进行下注
- 点击堆叠的筹码可退回
- 点击"确认下注"开始游戏

#### 3. 游戏阶段
- 初始发牌：玩家2张（明牌），庄家2张（1张暗牌）
- 选择操作：要牌、停牌、加倍
- 点数超过21即爆牌，游戏结束

#### 4. 结算阶段
- 庄家翻牌并按规则要牌
- 比较点数决定胜负
- 显示本局获得/损失的筹码

### 特殊功能

#### 点击彩蛋
- 点击游戏背景空白处
- 随机显示角色表情包
- 部分表情包会播放角色语音

#### 解锁下注限制
- 达到最大下注后继续点击筹码
- 弹出抽屉确认解锁
- 本局有效，下局重置

---

## 📁 项目结构

```
band_jack/
├── assets/                      # 资源文件
│   ├── art/                     # 美术资源
│   │   └── cards/               # 卡牌图片
│   │       ├── back/            # 卡牌背面
│   │       └── faces/           # 卡牌正面
│   │           └── Popin'Party/ # 角色卡牌
│   ├── audio/                   # 音频资源
│   │   └── sfx/                 # 音效
│   │       ├── win/             # 胜利音效
│   │       │   ├── ksm/         # KSM音效
│   │       │   └── shout/       # 欢呼音效
│   │       ├── failed/          # 失败音效
│   │       ├── bingo/           # 特殊音效
│   │       ├── bomb/            # 爆牌音效
│   │       └── short/           # 短音效
│   └── logo/                    # 角色表情包
├── src/                         # 源代码
│   ├── css/
│   │   └── style.css            # 样式文件
│   ├── js/
│   │   ├── gameController.js    # 游戏主控制器
│   │   ├── cardSystem.js        # 卡牌系统
│   │   ├── aiDealer.js          # AI庄家系统
│   │   ├── economySystem.js     # 经济系统
│   │   ├── uiSystem.js          # UI系统
│   │   ├── animationSystem.js   # 动画系统
│   │   ├── audioSystem.js       # 音效系统
│   │   ├── saveSystem.js        # 存档系统
│   │   ├── config.js            # 配置文件
│   │   └── main.js              # 入口文件
│   └── index.html               # HTML入口
└── README.md                    # 项目文档
```

---

## 📚 API文档

### GameController

游戏主控制器，负责协调各个子系统。

#### 构造函数

```javascript
const game = new GameController();
```

#### 主要方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `init()` | - | `void` | 初始化游戏 |
| `startNewRound()` | - | `void` | 开始新一轮游戏 |
| `handleAction(action)` | `string` | `void` | 处理玩家操作 |
| `endGame(result)` | `string` | `void` | 结束游戏 |
| `saveGame()` | - | `void` | 保存游戏进度 |

### CardSystem

卡牌系统，负责卡牌生成和点数计算。

#### 主要方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `createDeck()` | - | `Array` | 创建一副牌 |
| `shuffleDeck(deck)` | `Array` | `Array` | 洗牌 |
| `dealCard()` | - | `Object` | 发一张牌 |
| `calculatePoints(cards)` | `Array` | `number` | 计算手牌点数 |
| `isBust(cards)` | `Array` | `boolean` | 检查是否爆牌 |
| `isBlackjack(cards)` | `Array` | `boolean` | 检查是否Blackjack |

### AIDealer

AI庄家系统，控制庄家行为。

#### 主要方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `reset()` | - | `void` | 重置庄家状态 |
| `shouldHit(playerPoints)` | `number` | `boolean` | 判断是否要牌 |
| `getCurrentMember()` | - | `string` | 获取当前庄家成员 |
| `getRandomMember()` | - | `string` | 随机选择庄家成员 |

### EconomySystem

经济系统，管理筹码和下注。

#### 主要方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `getChips()` | - | `number` | 获取当前筹码 |
| `placeBet(amount)` | `number` | `boolean` | 下注 |
| `win(bet, isBlackjack)` | `number, boolean` | `Object` | 胜利结算 |
| `lose(bet)` | `number` | `Object` | 失败结算 |

### AudioSystem

音效系统，管理游戏音效。

#### 主要方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `init()` | - | `void` | 初始化音效系统 |
| `play(soundName)` | `string` | `void` | 播放音效 |
| `playResultSound(result, isBlackjack)` | `string, boolean` | `void` | 播放结果音效 |
| `setVolume(volume)` | `number` | `void` | 设置音量 |

### UISystem

UI系统，管理界面显示。

#### 主要方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `init()` | - | `void` | 初始化UI |
| `addCardToArea(card, area, faceDown, callback)` | `Object, string, boolean, Function` | `void` | 添加卡牌到区域 |
| `flipCard(index, area, callback)` | `number, string, Function` | `void` | 翻牌 |
| `showMessage(text, type)` | `string, string` | `void` | 显示消息 |
| `showResultPopup(result)` | `Object` | `void` | 显示结果弹窗 |

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. **Fork 项目**
   ```bash
   git clone https://github.com/JohnvenTom/bang-jack.git
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **提交更改**
   ```bash
   git commit -m 'Add some feature'
   ```

4. **推送到分支**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **提交 Pull Request**

### 代码规范

- 使用ES6+语法
- 遵循JSDoc注释规范
- 保持代码简洁清晰
- 添加必要的注释

### 报告问题

如果发现Bug或有功能建议，请：
1. 检查是否已有相关Issue
2. 创建新Issue，详细描述问题或建议
3. 提供复现步骤（如果是Bug）

---

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

```
MIT License

Copyright (c) 2024 BanG jack

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 联系方式

- **项目主页**：[GitHub Repository](https://github.com/JohnvenTom/bang-jack)
- **问题反馈**：[Issues](https://github.com/JohnvenTom/bang-jack/issues)
- **邮箱**：3040791779@qq.com

---

## 🙏 致谢

- **BanG Dream!** 和 **BestDori** - 提供灵感和角色素材
- 所有贡献者和测试者

---

<div align="center">

**Made with ❤️ for BanG Dream! fans**

⭐ 如果这个项目对你有帮助，请给一个Star！⭐

</div>
