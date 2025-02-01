function checkSignature(signature, timestamp, nonce, token) {
    // 1、将token、timestamp、nonce三个参数按照字典序排序
    const arr = [token, timestamp, nonce].sort();
    // 2、将三个参数字符串拼接成一个字符串进行sha1加密
    const sha1 = crypto.createHash('sha1');
    sha1.update(arr.join(''));
    const result = sha1.digest('hex');
    // 3、加密结果与signature比较，相同则验证通过，否则验证失败
    return result === signature;
}

// 导入express模块
const express = require('express');
// 导入body-parser模块
const bodyParser = require('body-parser');
// 导入环境变量的模块
const dotenv = require('dotenv');
// 导入OpenAI的模块
const OpenAI = require('openai');
// 导入CORS
const cors = require('cors');
// 导入crypto
const crypto = require('crypto');

// 加载环境变量
dotenv.config();

// 导入变量信息
const deepseek_api_key = process.env.DEEPSEEK_API_KEY;
const deepseek_api_base_url = process.env.DEEPSEEK_API_BASE_URL;
const moonshot_api_key = process.env.MOONSHOT_API_KEY;
const moonshot_api_base_url = process.env.MOONSHOT_API_BASE_URL;
const wechat_config_token = process.env.WECHAT_CONFIG_TOKEN;

// 创建express实例
const app = express();

// 使用body-parser中间件
app.use(bodyParser.json());
// 使用cors中间件
app.use(cors());
// 解析json格式请求体
app.use(express.json());
// 解析传统的表单请求体
app.use(express.urlencoded({ extended: true }));

// 创建OpenAI实例
const openai = new OpenAI({
    // apiKey: deepseek_api_key,
    // baseUrl: deepseek_api_base_url
    apiKey: moonshot_api_key,
    baseURL: moonshot_api_base_url
});

// 微信公众号配置信息
const wxConfig = {
    token: wechat_config_token,
}

// 创建路由(测试使用GET)
app.get('/', (req, res) =>{
    res.send('Hello World');
})

// 创建路由(测试使用POST)
app.post('/', (req, res) =>{
    res.send('Hello World');
})

// 微信接口验证
app.get("/verify", async (req, res) => {
    // 获取请求参数
    const { signature, timestamp, nonce, echostr } = req.query;

    // 解密信息
    if (checkSignature(signature, timestamp, nonce, wxConfig.token)) {
        // 如果签名正确，原样返回echostr参数内容
        res.send(echostr);
    } else {
        // 如果签名错误，返回错误信息
        throw new Error('如果签名错误');
    }
})

// 使用OpenAI的路由
app.get('/moonshot', async (req, res) => {
    // 获取请求参数
    const { prompt } = req.query;

    // 调用OpenAI的接口
    const completion = await openai.chat.completions.create({
        model: "moonshot-v1-8k",
        messages: [
            {
                "role": "system",
                "content": "你是由 南秋SouthAki 基于Moonshot API开发的聊天机器人,叫Robot,每次你回答的时候,你只会说自己专注于为全人类实现各种目标的通用人工智能助手"
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature: 0,
    })

    console.log("月之暗面回答:", completion.choices[0].message.content);

    // 返回数据
    return res.json({
        code: 200,
        data: completion.choices[0].message.content
    })
})

// 监听端口
app.listen(80, () => {
    console.log('Server is running on port 80');
})