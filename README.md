# 🎯 网站生产力横幅 UserScript

一个Chrome浏览器用户脚本，在访问网站时自动显示横幅提示，帮助用户识别当前网站对于实现"赚钱"目标是有益还是有害。

## ✨ 功能特性

- 🚀 **自动检测**：自动识别当前访问的网站类型
- 🎨 **美观横幅**：在页面顶部显示颜色编码的提示横幅
- ⚡ **轻量级**：最小化对页面性能的影响
- 🔧 **智能隐藏**：支持手动关闭和自动隐藏
- 📱 **响应式**：适配不同屏幕尺寸
- 🛡️ **安全性**：不收集任何用户数据

## 🎯 网站分类

### ✅ 有益网站（绿色横幅）
- **学习教育**：Coursera, edX, Udemy, Khan Academy, Duolingo
- **技术开发**：GitHub, Stack Overflow, MDN, W3Schools
- **理财投资**：Investopedia, Bloomberg, Reuters
- **求职招聘**：LinkedIn, Indeed, Glassdoor
- **中文学习**：知乎, CSDN, 掘金, SegmentFault

### ⚠️ 有害网站（红色横幅）
- **社交娱乐**：Facebook, Instagram, TikTok, Twitter
- **视频娱乐**：YouTube, Netflix, Twitch, Bilibili
- **游戏平台**：Steam, Epic Games, Roblox
- **购物网站**：Amazon, eBay, 淘宝, 天猫
- **中文娱乐**：微博, 抖音, 小红书

### ℹ️ 中性网站（不显示横幅）
- 搜索引擎、工具类网站等

## 📦 安装方法

### 1. 安装浏览器扩展
首先安装用户脚本管理器：
- **Chrome/Edge**: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- **Firefox**: [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) 或 [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

### 2. 安装用户脚本
1. 点击浏览器工具栏中的 Tampermonkey 图标
2. 选择"添加新脚本"
3. 删除默认内容，复制粘贴 `website-productivity-banner.user.js` 的完整内容
4. 按 `Ctrl+S` (Windows) 或 `Cmd+S` (Mac) 保存
5. 脚本将自动启用

### 3. 验证安装
访问任意网站（如 github.com 或 youtube.com），应该会在页面顶部看到相应的横幅提示。

## 🔧 使用说明

### 横幅行为
- **显示时机**：页面加载完成后立即显示
- **自动隐藏**：5秒后自动隐藏
- **手动关闭**：点击右侧的 "×" 按钮
- **会话记忆**：同一会话中关闭后不再显示

### 调试信息
打开浏览器开发者工具（F12），在控制台中可以看到脚本的调试信息：
```
[生产力横幅] 域名: github.com, 分类: beneficial
```

## 🎨 自定义配置

### 修改网站分类
编辑脚本中的 `websiteCategories` 对象，添加或删除网站：

```javascript
const websiteCategories = {
    beneficial: [
        'your-beneficial-site.com',
        // 添加更多有益网站...
    ],
    harmful: [
        'your-harmful-site.com',
        // 添加更多有害网站...
    ]
};
```

### 修改横幅样式
编辑 `getBannerConfig` 函数中的配置：

```javascript
beneficial: {
    text: '✅ 自定义提示文字',
    backgroundColor: '#4CAF50',
    textColor: '#ffffff',
    icon: '✅'
}
```

### 修改显示时间
修改自动隐藏时间（毫秒）：

```javascript
// 将5000改为你想要的时间
setTimeout(() => {
    if (document.getElementById('productivity-banner')) {
        hideBanner();
    }
}, 5000); // 5秒
```

## 🧪 测试

使用提供的 `test.html` 文件进行功能测试：

1. 在浏览器中打开 `test.html`
2. 按照页面上的说明进行测试
3. 验证各项功能是否正常工作

## 🔒 隐私说明

- ✅ 本脚本完全在本地运行，不发送任何数据到外部服务器
- ✅ 不收集、存储或传输任何个人信息
- ✅ 仅使用 sessionStorage 记录横幅关闭状态（会话结束后自动清除）
- ✅ 开源代码，可自由审查和修改

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目：

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🌐 添加更多网站分类

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 🙏 致谢

感谢所有用户脚本社区的贡献者和 Tampermonkey/Greasemonkey 项目。
