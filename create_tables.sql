-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- 创建用户活动表
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  poem_id VARCHAR(100) NOT NULL,
  activity_type VARCHAR(20) NOT NULL CHECK (activity_type IN ('view', 'like', 'favorite')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at);

-- 启用行级安全策略（RLS）
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许任何人注册（插入数据）
CREATE POLICY "允许任何人注册" ON users FOR INSERT WITH CHECK (true);

-- 创建策略：用户只能访问自己的数据
CREATE POLICY "用户只能访问自己的数据" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "用户只能更新自己的数据" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "用户只能删除自己的数据" ON users FOR DELETE USING (auth.uid() = id);

-- 创建策略：用户只能访问自己的活动
CREATE POLICY "用户只能访问自己的活动" ON user_activities FOR ALL USING (auth.uid() = user_id);