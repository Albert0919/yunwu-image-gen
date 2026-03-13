#!/usr/bin/env node

/**
 * 云雾图片生成器 - 命令行工具
 * 用于调用 Gemini 3.1 Flash Image API 生成图片
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// 配置文件路径
const CONFIG_PATH = path.join(__dirname, 'config.json');
const OUTPUT_DIR = '/tmp/openclaw/yunwu-images';

// 加载配置
function loadConfig() {
  try {
    const data = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading config:', e.message);
    process.exit(1);
  }
}

// 保存配置
function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

// 将图片转为 base64
function imageToBase64(imagePath) {
  const data = fs.readFileSync(imagePath);
  const ext = path.extname(imagePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif'
  };
  const mimeType = mimeTypes[ext] || 'image/jpeg';
  return {
    mime_type: mimeType,
    data: data.toString('base64')
  };
}

// 调用云雾 API
async function generateImage(config, prompt, options = {}) {
  const {
    aspectRatio = config.defaultAspect,
    imageSize = config.defaultSize,
    style = config.defaultStyle,
    images = [] // 图片路径数组（用于图生图）
  } = options;

  // 构建提示词（添加风格）
  let finalPrompt = prompt;
  if (style !== 'default' && config.styles[style]) {
    finalPrompt = `${prompt}, ${config.styles[style]}`;
  }

  // 构建 parts
  const parts = [{ text: finalPrompt }];
  
  // 添加图片（如果有）
  for (const imgPath of images) {
    if (fs.existsSync(imgPath)) {
      const imageData = imageToBase64(imgPath);
      parts.push({ inline_data: imageData });
    }
  }

  // 构建请求体
  const requestBody = {
    contents: [{
      role: 'user',
      parts: parts
    }],
    generationConfig: {
      responseModalities: ['IMAGE'],
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: imageSize
      }
    }
  };

  return new Promise((resolve, reject) => {
    const url = `${config.apiEndpoint}?key=${config.apiKey}`;
    
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(requestBody));
    req.end();
  });
}

// 从响应中提取图片并保存
function extractAndSaveImage(response, outputName) {
  try {
    // 创建输出目录
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 查找图片数据
    const candidates = response.candidates || [];
    for (const candidate of candidates) {
      const parts = candidate.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          const imageData = Buffer.from(part.inlineData.data, 'base64');
          const mimeType = part.inlineData.mimeType || 'image/png';
          const ext = mimeType.split('/')[1] || 'png';
          const filename = `${outputName || Date.now()}.${ext}`;
          const outputPath = path.join(OUTPUT_DIR, filename);
          
          fs.writeFileSync(outputPath, imageData);
          return outputPath;
        }
      }
    }
    return null;
  } catch (e) {
    console.error('Error extracting image:', e);
    return null;
  }
}

// 命令行接口
async function main() {
  const args = process.argv.slice(2);
  const config = loadConfig();

  // 解析命令
  const command = args[0];

  switch (command) {
    case '--config':
    case '-c':
      // 显示当前配置
      console.log(JSON.stringify({
        aspect: config.defaultAspect,
        size: config.defaultSize,
        style: config.defaultStyle
      }, null, 2));
      break;

    case '--set-aspect':
      // 设置默认比例
      if (args[1] && config.aspects.includes(args[1])) {
        config.defaultAspect = args[1];
        saveConfig(config);
        console.log(`Default aspect ratio set to: ${args[1]}`);
      } else {
        console.error(`Invalid aspect ratio. Valid options: ${config.aspects.join(', ')}`);
      }
      break;

    case '--set-size':
      // 设置默认分辨率
      if (args[1] && config.sizes.includes(args[1])) {
        config.defaultSize = args[1];
        saveConfig(config);
        console.log(`Default image size set to: ${args[1]}`);
      } else {
        console.error(`Invalid size. Valid options: ${config.sizes.join(', ')}`);
      }
      break;

    case '--set-style':
      // 设置默认风格
      if (args[1] && config.styles[args[1]]) {
        config.defaultStyle = args[1];
        saveConfig(config);
        console.log(`Default style set to: ${args[1]}`);
      } else {
        console.error(`Invalid style. Valid options: ${Object.keys(config.styles).join(', ')}`);
      }
      break;

    case '--styles':
      // 列出所有风格
      console.log('Available styles:');
      Object.entries(config.styles).forEach(([name, desc]) => {
        console.log(`  ${name}: ${desc || '(default)'}`);
      });
      break;

    case '--help':
    case '-h':
      console.log(`
云雾图片生成器

用法:
  node generate.js "提示词" [选项]

选项:
  --aspect <比例>    设置图片比例 (默认: ${config.defaultAspect})
  --size <分辨率>    设置分辨率 (默认: ${config.defaultSize})
  --style <风格>     设置风格 (默认: ${config.defaultStyle})
  --images <路径>    输入图片路径（用于图生图，逗号分隔）
  -o <文件名>        输出文件名

配置命令:
  --config           显示当前配置
  --set-aspect <比例> 设置默认比例
  --set-size <分辨率> 设置默认分辨率
  --set-style <风格>  设置默认风格
  --styles           列出所有风格

示例:
  node generate.js "一只飞在天上的猪"
  node generate.js "赛博朋克城市" --aspect 9:16 --style cyberpunk
  node generate.js "改成油画风格" --images input.jpg
`);
      break;

    default:
      // 生成图片
      if (!command) {
        console.error('Please provide a prompt. Use --help for usage.');
        process.exit(1);
      }

      const options = {};
      let outputName = null;

      for (let i = 1; i < args.length; i++) {
        if (args[i] === '--aspect' && args[i + 1]) {
          options.aspectRatio = args[++i];
        } else if (args[i] === '--size' && args[i + 1]) {
          options.imageSize = args[++i];
        } else if (args[i] === '--style' && args[i + 1]) {
          options.style = args[++i];
        } else if (args[i] === '--images' && args[i + 1]) {
          options.images = args[++i].split(',').map(p => p.trim());
        } else if (args[i] === '-o' && args[i + 1]) {
          outputName = args[++i];
        }
      }

      console.log('Generating image...');
      console.log(`Prompt: ${command}`);
      console.log(`Aspect: ${options.aspectRatio || config.defaultAspect}`);
      console.log(`Size: ${options.imageSize || config.defaultSize}`);
      console.log(`Style: ${options.style || config.defaultStyle}`);

      try {
        const response = await generateImage(config, command, options);
        
        // 检查错误
        if (response.error) {
          console.error('API Error:', response.error.message || JSON.stringify(response.error));
          process.exit(1);
        }

        const outputPath = extractAndSaveImage(response, outputName);
        
        if (outputPath) {
          console.log(`\n✅ Image saved to: ${outputPath}`);
        } else {
          console.error('No image found in response');
          console.log('Response:', JSON.stringify(response, null, 2));
        }
      } catch (e) {
        console.error('Error:', e.message);
        process.exit(1);
      }
  }
}

main();