# 云雾图片生成器 🎨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

使用云雾 API（Gemini 3.1 Flash Image）进行 AI 图片创作。

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 🎨 文生图 | 文字描述生成图片 |
| 🖼️ 多种风格 | 11 种预设风格 |
| 📐 多种比例 | 14 种宽高比 |
| 📏 多种尺寸 | 0.5K ~ 4K |
| 💾 自动保存 | 支持自定义输出路径 |

## 🎨 示例展示

### 🎭 风格示例

<details>
<summary>📷 查看各风格效果（点击展开）</summary>

#### 默认风格
```
一只柴犬坐在草地上，阳光明媚
```
> 请添加示例图片

#### 动漫风格
```
一只柴犬坐在草地上，阳光明媚
--style anime
```
> 请添加示例图片

#### 写实风格
```
一只柴犬坐在草地上，阳光明媚
--style realistic
```
> 请添加示例图片

#### 水彩风格
```
一只柴犬坐在草地上，阳光明媚
--style watercolor
```
> 请添加示例图片

#### 3D 渲染
```
一只柴犬坐在草地上，阳光明媚
--style 3d
```
> 请添加示例图片

</details>

### 📐 比例示例

<details>
<summary>📐 查看不同比例效果（点击展开）</summary>

| 比例 | 用途 | 示例 |
|------|------|------|
| 1:1 | 社交媒体头像 | 正方形图片 |
| 16:9 | 视频封面 | 宽屏图片 |
| 9:16 | 手机壁纸/短视频 | 竖屏图片 |
| 4:3 | 传统摄影 | 经典比例 |
| 21:9 | 电影级 | 超宽屏 |

</details>

### 📏 尺寸对比

<details>
<summary>📐 查看不同尺寸效果（点击展开）</summary>

| 尺寸 | 分辨率范围 | 用途 |
|------|-----------|------|
| 0.5K | 512px | 快速预览 |
| 1K | 1024px | 社交媒体 |
| 2K | 2048px | 高质量输出 |
| 4K | 4096px | 专业印刷 |

</details>

## 🚀 快速开始

### 1. 注册云雾账号

👉 [点击注册云雾](https://yunwu.ai/register?aff=ltwW)

### 2. 获取 API Key

注册后在「控制台」获取 API Key

### 3. 配置

编辑 `config.json`，填入你的 API Key：

```json
{
  "apiKey": "你的API密钥"
}
```

### 4. 运行

```bash
# 基础用法
node image.js "一只柴犬在沙滩上奔跑"

# 指定风格
node image.js "一只柴犬在沙滩上奔跑" --style anime

# 指定比例和尺寸
node image.js "一只柴犬在沙滩上奔跑" --aspect 16:9 --size 2K

# 保存到指定路径
node image.js "一只柴犬在沙滩上奔跑" -o ./my-dog.png
```

## 🎭 风格选项

| 风格 | 参数 | 效果 |
|------|------|------|
| 默认 | `--style default` | 无额外风格修饰 |
| 动漫 | `--style anime` | 日式动画风格 |
| 写实 | `--style realistic` | 照片级真实 |
| 油画 | `--style oil-painting` | 经典油画风格 |
| 水彩 | `--style watercolor` | 水彩画风格 |
| 像素 | `--style pixel` | 8-bit 像素风格 |
| 3D | `--style 3d` | 3D 渲染风格 |
| 贴纸 | `--style sticker` | 贴纸设计风格 |
| Logo | `--style logo` | 极简 Logo 风格 |
| 素描 | `--style sketch` | 铅笔素描风格 |
| 赛博朋克 | `--style cyberpunk` | 未来科幻风格 |
| 奇幻 | `--style fantasy` | 奇幻艺术风格 |

## 📐 比例选项

```
1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9, 1:4, 1:8, 4:1, 8:1
```

## 📏 尺寸选项

```
0.5K, 1K, 2K, 4K
```

## 🔧 命令行参数

```bash
node image.js "提示词" [选项]

选项:
  --style <风格>      设置风格 (默认: default)
  --aspect <比例>     设置比例 (默认: 1:1)
  --size <尺寸>       设置尺寸 (默认: 1K)
  -o <文件名>         输出文件名
```

## 💡 云雾分组选择建议

选择「稳定分组」确保服务稳定性：

![分组选择建议](docs/group-selection.jpg)

## 📁 项目结构

```
yunwu-image-gen/
├── image.js        # 主程序
├── unified.js      # 统一入口（图片+视频）
├── config.json     # 配置文件
├── README.md       # 说明文档
└── docs/
    └── group-selection.jpg
```

## 🔗 相关链接

- [云雾官网](https://yunwu.ai)
- [注册云雾](https://yunwu.ai/register?aff=ltwW)
- [视频生成器](https://github.com/Albert0919/yunwu-video-gen)

## 📄 License

MIT License

---

*Powered by 云雾 AI + Gemini 3.1 Flash Image*