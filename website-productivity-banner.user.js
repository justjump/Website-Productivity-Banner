// ==UserScript==
// @name         网站生产力横幅提示
// @name:en      Website Productivity Banner
// @description  在网站顶部显示横幅，提示当前网站对于"赚钱"目标是有益还是有害
// @description:en Display a banner at the top of websites indicating whether the current site is beneficial or harmful for making money goals
// @version      1.0.0
// @author       justjump
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @namespace    https://github.com/justjump/Website-Productivity-Banner
// @homepage     https://github.com/justjump/Website-Productivity-Banner
// @supportURL   https://github.com/justjump/Website-Productivity-Banner/issues
// @updateURL    https://raw.githubusercontent.com/justjump/Website-Productivity-Banner/main/website-productivity-banner.user.js
// @downloadURL  https://raw.githubusercontent.com/justjump/Website-Productivity-Banner/main/website-productivity-banner.user.js
// ==/UserScript==

(function() {
    'use strict';

    // 活动时间跟踪变量
    let activityTracker = {
        startTime: Date.now(),
        lastActivityTime: Date.now(),
        totalActiveTime: 0,
        isPageVisible: true,
        updateInterval: null
    };

    // 网站分类数据库
    const websiteCategories = {
        beneficial: [
            // 学习教育
            'coursera.org', 'edx.org', 'udemy.com', 'khanacademy.org', 'duolingo.com',
            'codecademy.com', 'freecodecamp.org', 'pluralsight.com', 'lynda.com',
            
            // 技术开发
            'github.com', 'stackoverflow.com', 'developer.mozilla.org', 'w3schools.com',
            'docs.microsoft.com', 'nodejs.org', 'reactjs.org', 'vuejs.org',
            
            // 理财投资
            'investopedia.com', 'morningstar.com', 'bloomberg.com', 'marketwatch.com',
            'fool.com', 'seekingalpha.com', 'finance.yahoo.com',
            
            // 新闻资讯（财经类）
            'reuters.com', 'economist.com', 'wsj.com', 'ft.com',
            
            // 中文学习网站
            'zhihu.com', 'csdn.net', 'juejin.cn', 'segmentfault.com',
            'infoq.cn', 'oschina.net', 'runoob.com', 'liaoxuefeng.com',
            
            // 求职招聘
            'linkedin.com', 'indeed.com', 'glassdoor.com', 'monster.com',
            'zhaopin.com', 'liepin.com', 'boss.com', 'lagou.com'
        ],
        
        harmful: [
            // 社交娱乐
            'facebook.com', 'instagram.com', 'tiktok.com', 'twitter.com',
            'snapchat.com', 'pinterest.com', 'reddit.com',
            
            // 视频娱乐
            'youtube.com', 'netflix.com', 'twitch.tv', 'hulu.com',
            'bilibili.com', 'iqiyi.com', 'youku.com', 'v.qq.com',
            
            // 游戏
            'steam.com', 'epicgames.com', 'roblox.com', 'minecraft.net',
            'ea.com', 'ubisoft.com', 'blizzard.com',
            
            // 购物（非必需品）
            'amazon.com', 'ebay.com', 'etsy.com', 'wish.com',
            'taobao.com', 'tmall.com', 'jd.com', 'pinduoduo.com',
            
            // 中文娱乐
            'weibo.com', 'douyin.com', 'xiaohongshu.com', 'kuaishou.com',
            'tieba.baidu.com', 'douban.com'
        ]
    };
    
    // 活动时间跟踪函数
    function initActivityTracker() {
        // 记录用户活动
        function recordActivity() {
            activityTracker.lastActivityTime = Date.now();
        }

        // 监听用户活动事件
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        activityEvents.forEach(event => {
            document.addEventListener(event, recordActivity, true);
        });

        // 监听页面可见性变化
        document.addEventListener('visibilitychange', function() {
            activityTracker.isPageVisible = !document.hidden;
            if (activityTracker.isPageVisible) {
                activityTracker.lastActivityTime = Date.now();
            }
        });

        // 开始更新活动时间显示
        startActivityTimeUpdate();
    }

    // 计算活动时间
    function calculateActiveTime() {
        const now = Date.now();
        const timeSinceLastActivity = now - activityTracker.lastActivityTime;

        // 如果页面不可见或超过30秒没有活动，不计算时间
        if (!activityTracker.isPageVisible || timeSinceLastActivity > 30000) {
            return activityTracker.totalActiveTime;
        }

        return activityTracker.totalActiveTime + timeSinceLastActivity;
    }

    // 格式化时间显示
    function formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}小时${minutes % 60}分钟`;
        } else if (minutes > 0) {
            return `${minutes}分钟${seconds % 60}秒`;
        } else {
            return `${seconds}秒`;
        }
    }

    // 更新活动时间显示
    function updateActivityTimeDisplay() {
        const timeDisplay = document.getElementById('activity-time');
        if (timeDisplay) {
            const activeTime = calculateActiveTime();
            timeDisplay.textContent = `活动时间: ${formatTime(activeTime)}`;
        }
    }

    // 开始活动时间更新
    function startActivityTimeUpdate() {
        if (activityTracker.updateInterval) {
            clearInterval(activityTracker.updateInterval);
        }

        activityTracker.updateInterval = setInterval(() => {
            updateActivityTimeDisplay();
            // 每5秒更新一次总活动时间
            const now = Date.now();
            const timeSinceLastActivity = now - activityTracker.lastActivityTime;
            if (activityTracker.isPageVisible && timeSinceLastActivity <= 30000) {
                activityTracker.totalActiveTime = calculateActiveTime();
                activityTracker.lastActivityTime = now;
            }
        }, 1000);
    }

    // 停止活动时间更新
    function stopActivityTimeUpdate() {
        if (activityTracker.updateInterval) {
            clearInterval(activityTracker.updateInterval);
            activityTracker.updateInterval = null;
        }
    }

    // 获取当前网站域名
    function getCurrentDomain() {
        return window.location.hostname.toLowerCase();
    }
    
    // 检查域名是否匹配分类
    function matchesDomain(domain, categoryDomains) {
        return categoryDomains.some(catDomain => {
            // 精确匹配或子域名匹配
            return domain === catDomain || domain.endsWith('.' + catDomain);
        });
    }
    
    // 分类网站
    function categorizeWebsite(domain) {
        if (matchesDomain(domain, websiteCategories.beneficial)) {
            return 'beneficial';
        } else if (matchesDomain(domain, websiteCategories.harmful)) {
            return 'harmful';
        } else {
            return 'neutral';
        }
    }
    
    // 获取横幅配置
    function getBannerConfig(category) {
        const configs = {
            beneficial: {
                text: '✅ 有益网站 - 这个网站有助于实现赚钱目标！',
                backgroundColor: '#4CAF50',
                textColor: '#ffffff',
                icon: '✅'
            },
            harmful: {
                text: '⚠️ 有害网站 - 这个网站可能浪费您的时间！',
                backgroundColor: '#F44336',
                textColor: '#ffffff',
                icon: '⚠️'
            },
            neutral: {
                text: 'ℹ️ 中性网站 - 请合理使用时间',
                backgroundColor: '#2196F3',
                textColor: '#ffffff',
                icon: 'ℹ️'
            }
        };
        
        return configs[category];
    }
    
    // 创建横幅样式
    function createBannerStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #productivity-banner {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 50px;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                font-weight: 600;
                box-shadow: 0 2px 15px rgba(0,0,0,0.15);
                transform: translateY(-100%);
                transition: transform 0.3s ease-in-out;
                border-bottom: 2px solid rgba(255,255,255,0.2);
            }

            #productivity-banner .banner-content {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                position: relative;
                padding: 0 60px;
            }

            #productivity-banner .banner-text {
                text-align: center;
                flex: 1;
            }

            #productivity-banner .time-display {
                font-size: 12px;
                opacity: 0.9;
                margin-left: 10px;
                background: rgba(255,255,255,0.1);
                padding: 2px 8px;
                border-radius: 10px;
            }
            
            #productivity-banner.show {
                transform: translateY(0);
            }
            
            #productivity-banner .close-btn {
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                color: inherit;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            #productivity-banner .close-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                border-color: rgba(255, 255, 255, 0.5);
                transform: scale(1.1);
            }

            #productivity-banner .close-btn:active {
                transform: scale(0.95);
            }
            
            /* 为页面内容添加顶部边距，避免被横幅遮挡 */
            body.has-productivity-banner {
                margin-top: 50px !important;
            }
        `;
        
        document.head.appendChild(style);
    }

    // 创建横幅元素
    function createBanner(config) {
        const banner = document.createElement('div');
        banner.id = 'productivity-banner';
        banner.style.backgroundColor = config.backgroundColor;
        banner.style.color = config.textColor;

        banner.innerHTML = `
            <div class="banner-content">
                <div class="banner-text">
                    ${config.text}
                    <span class="time-display" id="activity-time">活动时间: 0秒</span>
                </div>
            </div>
            <button class="close-btn" title="关闭横幅" aria-label="关闭横幅">×</button>
        `;

        return banner;
    }

    // 显示横幅
    function showBanner(category) {
        // 检查是否已经显示过横幅
        if (document.getElementById('productivity-banner')) {
            return;
        }

        const config = getBannerConfig(category);
        const banner = createBanner(config);

        // 添加关闭按钮事件
        const closeBtn = banner.querySelector('.close-btn');
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            hideBanner(true); // 标记为用户主动关闭
        });

        // 添加到页面
        document.body.appendChild(banner);
        document.body.classList.add('has-productivity-banner');

        // 延迟显示动画
        setTimeout(() => {
            banner.classList.add('show');
            // 滚动到页面顶部，确保用户能看到横幅
            scrollToTop();
        }, 100);
    }

    // 平滑滚动到页面顶部
    function scrollToTop() {
        // 检查当前滚动位置，如果已经在顶部附近就不滚动
        if (window.pageYOffset <= 100) {
            return;
        }

        // 使用平滑滚动
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // 隐藏横幅
    function hideBanner(userClosed = false) {
        const banner = document.getElementById('productivity-banner');
        if (banner) {
            // 停止活动时间更新
            stopActivityTimeUpdate();

            // 如果是用户主动关闭，记录这个行为
            if (userClosed) {
                recordBannerClosed();
            }

            banner.classList.remove('show');
            setTimeout(() => {
                if (banner.parentNode) {
                    banner.parentNode.removeChild(banner);
                }
                document.body.classList.remove('has-productivity-banner');
            }, 300);
        }
    }

    // 检查是否应该跳过显示横幅
    function shouldSkipBanner() {
        // 跳过iframe
        if (window !== window.top) {
            return true;
        }

        // 跳过本地文件
        if (window.location.protocol === 'file:') {
            return true;
        }

        // 跳过扩展页面
        if (window.location.protocol === 'chrome-extension:' ||
            window.location.protocol === 'moz-extension:') {
            return true;
        }

        // 检查用户是否已经关闭过横幅（使用sessionStorage）
        const sessionKey = 'productivity-banner-closed-' + getCurrentDomain();
        if (sessionStorage.getItem(sessionKey)) {
            return true;
        }

        return false;
    }

    // 记录用户关闭横幅的行为
    function recordBannerClosed() {
        const sessionKey = 'productivity-banner-closed-' + getCurrentDomain();
        sessionStorage.setItem(sessionKey, 'true');
    }

    // 主函数
    function init() {
        try {
            // 检查是否应该跳过
            if (shouldSkipBanner()) {
                return;
            }

            // 创建样式
            createBannerStyles();

            // 获取当前域名并分类
            const domain = getCurrentDomain();
            const category = categorizeWebsite(domain);

            // 只对有益和有害网站显示横幅，中性网站不显示
            if (category !== 'neutral') {
                showBanner(category);
                // 初始化活动时间跟踪
                initActivityTracker();
            }

            // 调试信息（可在控制台查看）
            console.log(`[生产力横幅] 域名: ${domain}, 分类: ${category}`);

        } catch (error) {
            console.error('[生产力横幅] 初始化错误:', error);
        }
    }

    // 等待页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
