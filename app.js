// 导入express模块
const express = require('express');
// 导入body-parser模块
const bodyParser = require('body-parser');
// 导入环境变量的模块
const dotenv = require('dotenv');
// 导入OpenAI的模块
const OpenAI = require('openai');

// 加载环境变量
dotenv.config();

const deepseek_api_key = process.env.DEEPSEEK_API_KEY;
const deepseek_api_base_url = process.env.DEEPSEEK_API_BASE_URL;

// 创建express实例
const app = express();

// 使用body-parser中间件
app.use(bodyParser.json());

// 创建OpenAI实例
const openai = new OpenAI({
    apiKey: deepseek_api_key,
    baseUrl: deepseek_api_base_url
});

// 创建路由(测试使用GET)
app.get('/', (req, res) =>{
    res.send('Hello World');
})

// 创建路由(测试使用POST)
app.post('/', (req, res) =>{
    res.send('Hello World');
})

// 使用OpenAI的路由


// 监听端口
app.listen(3000, () => {
    console.log('Server is running on port 3000');
})