-- 古诗词数据库创建脚本
-- 这个脚本将创建一个完整的古诗词数据库结构

-- 1. 创建朝代表
CREATE TABLE IF NOT EXISTS dynasties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL, -- 朝代名称（如：唐代、宋代）
  start_year INTEGER, -- 开始年份
  end_year INTEGER, -- 结束年份
  description TEXT, -- 朝代简介
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建诗人表
CREATE TABLE IF NOT EXISTS poets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL, -- 诗人姓名
  courtesy_name VARCHAR(100), -- 字
  pseudonym VARCHAR(100), -- 号
  dynasty_id UUID REFERENCES dynasties(id), -- 所属朝代
  birth_year INTEGER, -- 出生年份
  death_year INTEGER, -- 去世年份
  birth_place VARCHAR(200), -- 出生地
  biography TEXT, -- 生平简介
  style_description TEXT, -- 风格描述
  image_url VARCHAR(500), -- 诗人画像URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建诗词表
CREATE TABLE IF NOT EXISTS poems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL, -- 诗词标题
  poet_id UUID REFERENCES poets(id) ON DELETE CASCADE, -- 诗人ID
  content TEXT NOT NULL, -- 诗词内容
  translation TEXT, -- 现代译文
  annotation TEXT, -- 注释
  appreciation TEXT, -- 赏析
  dynasty_id UUID REFERENCES dynasties(id), -- 所属朝代
  poem_type VARCHAR(50), -- 诗词类型（诗、词、曲等）
  sub_type VARCHAR(50), -- 子类型（五言绝句、七言律诗等）
  rhyme_scheme VARCHAR(100), -- 韵律格式
  line_count INTEGER, -- 行数
  character_count INTEGER, -- 字数
  difficulty_level VARCHAR(20) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')), -- 难度等级
  popularity_score INTEGER DEFAULT 0, -- 流行度评分
  is_featured BOOLEAN DEFAULT FALSE, -- 是否精选
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建标签表
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL, -- 标签名称
  category VARCHAR(50), -- 标签分类（主题、情感、季节等）
  description TEXT, -- 标签描述
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 创建诗词标签关联表
CREATE TABLE IF NOT EXISTS poem_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poem_id, tag_id) -- 防止重复关联
);

-- 6. 创建收藏表（扩展用户活动）
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, poem_id) -- 防止重复收藏
);

-- 7. 创建阅读历史表（扩展用户活动）
CREATE TABLE IF NOT EXISTS reading_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  read_count INTEGER DEFAULT 1, -- 阅读次数
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  content TEXT NOT NULL, -- 评论内容
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 评分（1-5星）
  is_approved BOOLEAN DEFAULT TRUE, -- 是否审核通过
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. 创建搜索索引表（用于全文搜索）
CREATE TABLE IF NOT EXISTS search_index (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  search_text TSVECTOR, -- 全文搜索向量
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poem_id) -- 确保每个诗词只有一个搜索索引
);

-- 创建索引以提高查询性能
-- 朝代表索引
CREATE INDEX IF NOT EXISTS idx_dynasties_name ON dynasties(name);
CREATE INDEX IF NOT EXISTS idx_dynasties_years ON dynasties(start_year, end_year);

-- 诗人表索引
CREATE INDEX IF NOT EXISTS idx_poets_name ON poets(name);
CREATE INDEX IF NOT EXISTS idx_poets_dynasty_id ON poets(dynasty_id);
CREATE INDEX IF NOT EXISTS idx_poets_birth_year ON poets(birth_year);

-- 诗词表索引
CREATE INDEX IF NOT EXISTS idx_poems_title ON poems(title);
CREATE INDEX IF NOT EXISTS idx_poems_poet_id ON poems(poet_id);
CREATE INDEX IF NOT EXISTS idx_poems_dynasty_id ON poems(dynasty_id);
CREATE INDEX IF NOT EXISTS idx_poems_type ON poems(poem_type);
CREATE INDEX IF NOT EXISTS idx_poems_difficulty ON poems(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_poems_popularity ON poems(popularity_score);
CREATE INDEX IF NOT EXISTS idx_poems_featured ON poems(is_featured) WHERE is_featured = TRUE;

-- 标签表索引
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);

-- 关联表索引
CREATE INDEX IF NOT EXISTS idx_poem_tags_poem_id ON poem_tags(poem_id);
CREATE INDEX IF NOT EXISTS idx_poem_tags_tag_id ON poem_tags(tag_id);

-- 用户相关表索引
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_poem_id ON favorites(poem_id);
CREATE INDEX IF NOT EXISTS idx_reading_history_user_id ON reading_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_history_poem_id ON reading_history(poem_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_poem_id ON comments(poem_id);

-- 全文搜索索引
CREATE INDEX IF NOT EXISTS idx_search_index_tsvector ON search_index USING GIN(search_text);

-- 启用行级安全策略（RLS）
ALTER TABLE dynasties ENABLE ROW LEVEL SECURITY;
ALTER TABLE poets ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE poem_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_index ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
-- 公共数据（朝代、诗人、诗词、标签）允许所有人查看
CREATE POLICY "allow_public_read_dynasties" ON dynasties FOR SELECT USING (true);
CREATE POLICY "allow_public_read_poets" ON poets FOR SELECT USING (true);
CREATE POLICY "allow_public_read_poems" ON poems FOR SELECT USING (true);
CREATE POLICY "allow_public_read_tags" ON tags FOR SELECT USING (true);
CREATE POLICY "allow_public_read_poem_tags" ON poem_tags FOR SELECT USING (true);

-- 用户个人数据策略
CREATE POLICY "allow_users_manage_favorites" ON favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "allow_users_manage_reading_history" ON reading_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "allow_users_manage_comments" ON comments FOR ALL USING (auth.uid() = user_id);

-- 管理员权限策略（需要额外配置管理员角色）
CREATE POLICY "allow_admin_manage_all" ON dynasties FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "allow_admin_manage_poets" ON poets FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "allow_admin_manage_poems" ON poems FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "allow_admin_manage_tags" ON tags FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 创建全文搜索函数
CREATE OR REPLACE FUNCTION update_search_index()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO search_index (poem_id, search_text)
  VALUES (
    NEW.id,
    to_tsvector('chinese', 
      COALESCE(NEW.title, '') || ' ' || 
      COALESCE(NEW.content, '') || ' ' ||
      COALESCE(NEW.translation, '') || ' ' ||
      COALESCE(NEW.annotation, '')
    )
  )
  ON CONFLICT (poem_id) DO UPDATE SET
    search_text = to_tsvector('chinese', 
      COALESCE(NEW.title, '') || ' ' || 
      COALESCE(NEW.content, '') || ' ' ||
      COALESCE(NEW.translation, '') || ' ' ||
      COALESCE(NEW.annotation, '')
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器，在诗词插入或更新时自动更新搜索索引
CREATE TRIGGER trigger_update_search_index
  AFTER INSERT OR UPDATE ON poems
  FOR EACH ROW
  EXECUTE FUNCTION update_search_index();

-- 插入示例数据（先检查表是否为空，避免重复插入）
DO $$ 
BEGIN
  -- 插入朝代数据（如果表为空）
  IF NOT EXISTS (SELECT 1 FROM dynasties) THEN
    INSERT INTO dynasties (name, start_year, end_year, description) VALUES
    ('唐代', 618, 907, '唐朝是中国历史上最强盛的朝代之一，诗歌创作达到巅峰'),
    ('宋代', 960, 1279, '宋朝文化繁荣，词作达到鼎盛时期'),
    ('元代', 1271, 1368, '元朝戏曲发展，散曲兴起'),
    ('明代', 1368, 1644, '明朝小说戏曲繁荣，诗歌承前启后'),
    ('清代', 1644, 1912, '清朝诗词创作丰富，有众多优秀诗人');
  END IF;

  -- 插入诗人数据（如果表为空）
  IF NOT EXISTS (SELECT 1 FROM poets) THEN
    INSERT INTO poets (name, courtesy_name, pseudonym, dynasty_id, birth_year, death_year, birth_place, biography, style_description) 
    SELECT 
      name, courtesy_name, pseudonym, 
      (SELECT id FROM dynasties WHERE name = dynasty_name),
      birth_year, death_year, birth_place, biography, style_description
    FROM (VALUES
      ('李白', '太白', '青莲居士', '唐代', 701, 762, '陇西成纪', '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"', '豪放飘逸，想象丰富，语言流转自然'),
      ('杜甫', '子美', '少陵野老', '唐代', 712, 770, '河南巩县', '唐代伟大的现实主义诗人，被尊为"诗圣"', '沉郁顿挫，语言精炼，格律严谨'),
      ('苏轼', '子瞻', '东坡居士', '宋代', 1037, 1101, '四川眉山', '北宋文学家、书画家，唐宋八大家之一', '豪放洒脱，题材广阔，清新豪健')
    ) AS t(name, courtesy_name, pseudonym, dynasty_name, birth_year, death_year, birth_place, biography, style_description);
  END IF;
END $$;

-- 创建视图方便查询
CREATE VIEW poem_details AS
SELECT 
  p.id,
  p.title,
  p.content,
  p.translation,
  p.annotation,
  p.appreciation,
  p.poem_type,
  p.sub_type,
  p.rhyme_scheme,
  p.line_count,
  p.character_count,
  p.difficulty_level,
  p.popularity_score,
  p.is_featured,
  pt.name as poet_name,
  pt.courtesy_name as poet_courtesy_name,
  pt.pseudonym as poet_pseudonym,
  d.name as dynasty_name,
  d.start_year as dynasty_start,
  d.end_year as dynasty_end
FROM poems p
LEFT JOIN poets pt ON p.poet_id = pt.id
LEFT JOIN dynasties d ON p.dynasty_id = d.id;

-- 注释表说明
COMMENT ON TABLE dynasties IS '存储中国历史朝代信息';
COMMENT ON TABLE poets IS '存储诗人基本信息';
COMMENT ON TABLE poems IS '存储古诗词内容及相关信息';
COMMENT ON TABLE tags IS '存储诗词标签分类';
COMMENT ON TABLE poem_tags IS '诗词与标签的关联表';
COMMENT ON TABLE favorites IS '用户收藏的诗词';
COMMENT ON TABLE reading_history IS '用户阅读历史记录';
COMMENT ON TABLE comments IS '用户对诗词的评论';
COMMENT ON TABLE search_index IS '全文搜索索引表';

COMMENT ON COLUMN poems.difficulty_level IS '诗词难度等级：easy-简单, medium-中等, hard-困难';
COMMENT ON COLUMN poems.popularity_score IS '诗词流行度评分，用于排序';
COMMENT ON COLUMN poems.is_featured IS '是否为精选诗词';

-- 完成提示
SELECT '古诗词数据库创建完成！' as message;