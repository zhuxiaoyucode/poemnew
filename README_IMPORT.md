# 古诗词数据导入指南

## 前置要求

1. **Python 3.6+** 环境
2. **Supabase项目** 已创建并配置好数据库表
3. **Supabase API密钥** 和项目URL

## 配置步骤

### 1. 设置环境变量

创建 `.env` 文件或在命令行中设置环境变量：

```bash
# Windows PowerShell
$env:SUPABASE_URL="您的Supabase项目URL"
$env:SUPABASE_KEY="您的Supabase API密钥"

# 或者创建 .env 文件
SUPABASE_URL=您的Supabase项目URL
SUPABASE_KEY=您的Supabase API密钥
```

### 2. 获取Supabase配置信息

1. 登录 [Supabase控制台](https://supabase.com)
2. 进入您的项目
3. 在左侧菜单选择 **Settings > API**
4. 复制以下信息：
   - **Project URL** → 设置为 `SUPABASE_URL`
   - **anon public** → 设置为 `SUPABASE_KEY`

### 3. 安装依赖

```bash
pip install requests python-dotenv
```

## 运行导入脚本

### 方法1：使用环境变量文件

```bash
# 创建 .env 文件后运行
python import_poetry_data.py
```

### 方法2：直接设置环境变量

```bash
# Windows PowerShell
$env:SUPABASE_URL="https://your-project-ref.supabase.co"
$env:SUPABASE_KEY="your-anon-key"
python import_poetry_data.py

# Linux/Mac
export SUPABASE_URL="https://your-project-ref.supabase.co"
export SUPABASE_KEY="your-anon-key"
python import_poetry_data.py
```

## 导入过程说明

脚本将执行以下操作：

1. **读取CSV文件** - 解析 `古诗词.csv` 文件
2. **处理朝代数据** - 自动创建或获取朝代信息
3. **处理诗人数据** - 自动创建或获取诗人信息
4. **导入诗歌数据** - 将诗歌内容导入数据库

### 数据映射关系

| CSV字段  | 数据库表      | 处理方式       |
| -------- | ------------- | -------------- |
| 朝代     | dynasties     | 自动创建或获取 |
| 作者     | poets         | 自动创建或获取 |
| 诗歌名称 | poems.title   | 直接导入       |
| 诗歌正文 | poems.content | 直接导入       |
| 诗歌分类 | poems.type_id | 映射到类型ID   |

### 自动计算字段

- **难度等级**：根据诗歌长度自动计算（短诗=简单，中等长度=中等，长诗=困难）
- **流行度**：默认设置为5（中等流行度）
- **诗人朝代关系**：自动关联诗人与朝代

## 错误处理

如果导入过程中出现错误，脚本会：

1. 显示具体的错误信息
2. 继续处理后续数据
3. 在最后显示成功和失败的统计信息

## 验证导入结果

导入完成后，您可以通过以下方式验证数据：

1. **Supabase Table Editor**：在Supabase控制台中查看各表数据
2. **API查询**：使用Supabase REST API查询数据
3. **您的应用**：在诗词导航应用中查看导入的诗歌

## 常见问题

### Q: 导入失败，显示认证错误

A: 检查 `SUPABASE_KEY` 是否正确，确保使用 **anon public** 密钥

### Q: 朝代或诗人重复创建

A: 脚本会自动检测重复项，使用现有数据而非重复创建

### Q: 导入速度慢

A: 这是正常现象，脚本会逐条处理以确保数据完整性

### Q: 部分诗歌导入失败

A: 检查CSV文件格式，确保所有字段都有有效值

## 后续操作

导入完成后，您可以：

1. 在应用中测试诗词搜索功能
2. 添加更多诗词数据到CSV文件后重新运行脚本
3. 根据需要调整诗歌的分类或标签
