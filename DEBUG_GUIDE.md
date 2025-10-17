# 注册功能调试指南

## 当前问题

注册功能显示失败，需要诊断具体原因。

## 快速诊断步骤

### 1. 检查浏览器控制台错误

打开浏览器开发者工具(F12)，查看Console标签页是否有错误信息。

### 2. 运行调试脚本

在浏览器控制台中执行以下命令：

```javascript
// 导入调试函数
import('./src/utils/debug.ts').then((module) => {
  module.debugDatabase()
})
```

### 3. 检查环境变量

确认 `.env.local` 文件中的配置正确：

```
VITE_SUPABASE_URL=https://dynfozkcsuxecyufogxl.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. 检查数据库表

**最重要的一步**：在Supabase控制台中创建表

1. 访问 [Supabase控制台](https://supabase.com/dashboard)
2. 选择项目 `poemlook`
3. 进入 **SQL编辑器**
4. 复制 `create_tables.sql` 文件内容
5. 点击 **运行** 执行SQL脚本

### 5. 验证表创建成功

执行以下SQL查询验证：

```sql
-- 检查表是否存在
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users', 'user_activities');
```

## 常见问题及解决方案

### ❌ 错误：表不存在

**症状**：控制台显示"relation does not exist"
**解决**：执行 `create_tables.sql` 脚本

### ❌ 错误：认证失败

**症状**：控制台显示"Authentication failed"
**解决**：检查API密钥和环境变量

### ❌ 错误：网络连接问题

**症状**：请求超时或无法连接
**解决**：检查网络连接和项目URL

## 测试注册功能

表创建成功后，尝试以下测试：

1. 访问注册页面：http://localhost:5173/register
2. 填写测试数据：
   - 用户名：testuser
   - 邮箱：test@example.com
   - 密码：123456
   - 确认密码：123456
3. 点击注册按钮

如果注册成功，用户数据将保存到Supabase数据库的users表中。

## 获取帮助

如果以上步骤无法解决问题，请提供：

1. 浏览器控制台的完整错误信息
2. 调试脚本的输出结果
3. 具体的错误症状描述
