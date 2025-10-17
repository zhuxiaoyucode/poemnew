# 数据库设置指南

## 步骤1：创建数据库表

1. 登录 [Supabase控制台](https://supabase.com/dashboard)
2. 选择您的项目 `poemlook`（项目ID：dynfozkcsuxecyufogxl）
3. 进入左侧菜单的 **SQL编辑器**
4. 复制 `create_tables.sql` 文件中的内容
5. 点击 **运行** 执行SQL脚本

## 步骤2：验证表创建成功

执行以下SQL查询验证表是否创建成功：

```sql
-- 检查用户表
SELECT * FROM users LIMIT 1;

-- 检查用户活动表
SELECT * FROM user_activities LIMIT 1;
```

## 步骤3：测试功能

1. 启动应用：`npm run dev`
2. 访问注册页面创建新用户
3. 登录测试用户功能

## 表结构说明

### users 表

- `id`: 用户唯一标识 (UUID)
- `username`: 用户名 (唯一)
- `email`: 邮箱地址 (唯一)
- `password_hash`: 密码哈希值
- `preferences`: 用户偏好设置 (JSON)
- `created_at`: 创建时间
- `updated_at`: 更新时间
- `last_login_at`: 最后登录时间

### user_activities 表

- `id`: 活动记录ID (UUID)
- `user_id`: 关联用户ID
- `poem_id`: 诗词ID
- `activity_type`: 活动类型 (view/like/favorite)
- `created_at`: 创建时间

## 安全设置

表已启用行级安全策略(RLS)，确保用户只能访问自己的数据。

## 故障排除

如果遇到表不存在错误：

1. 确认SQL脚本已正确执行
2. 检查Supabase项目连接配置
3. 验证环境变量设置正确
