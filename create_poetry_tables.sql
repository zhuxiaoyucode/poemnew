-- 古诗词数据库表结构创建脚本
-- 根据古诗词.csv文件结构设计

-- 1. 朝代表
CREATE TABLE IF NOT EXISTS dynasties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    start_year INTEGER,
    end_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 诗人表
CREATE TABLE IF NOT EXISTS poets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dynasty_id INTEGER REFERENCES dynasties(id),
    description TEXT,
    lifespan VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, dynasty_id)
);

-- 3. 诗歌类型表
CREATE TABLE IF NOT EXISTS poem_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 诗歌表
CREATE TABLE IF NOT EXISTS poems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    poet_id INTEGER REFERENCES poets(id),
    dynasty_id INTEGER REFERENCES dynasties(id),
    type_id INTEGER REFERENCES poem_types(id),
    difficulty_level INTEGER DEFAULT 1,
    popularity INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入诗歌类型数据
INSERT INTO poem_types (name, description) VALUES
('思乡诗', '表达对故乡、亲人的思念之情'),
('山水诗', '描写自然山水风光'),
('记行诗', '记录旅行见闻和感受'),
('送别诗', '表达离别之情'),
('抒情诗', '抒发个人情感'),
('咏物诗', '通过描写事物表达情感'),
('爱国诗', '表达爱国情怀'),
('田园诗', '描写田园生活和自然风光'),
('怀古诗', '怀念历史人物或事件'),
('爱情诗', '表达爱情情感'),
('酬赠诗', '朋友间的赠答诗'),
('边塞诗', '描写边塞生活和战争'),
('叙事诗', '叙述故事或事件'),
('讽喻诗', '通过讽刺表达观点'),
('亲情诗', '表达亲情'),
('哲理诗', '蕴含人生哲理'),
('节日诗', '描写节日习俗和情感'),
('咏史怀古', '咏史怀古类诗歌')
ON CONFLICT (name) DO NOTHING;

-- 插入常见朝代数据
INSERT INTO dynasties (name, description, start_year, end_year) VALUES
('唐', '唐朝（618年—907年）', 618, 907),
('宋', '宋朝（960年—1279年）', 960, 1279),
('南唐', '南唐（937年—975年）', 937, 975),
('北朝', '北朝时期', 386, 581),
('五代', '五代十国时期', 907, 960)
ON CONFLICT (name) DO NOTHING;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_poems_poet_id ON poems(poet_id);
CREATE INDEX IF NOT EXISTS idx_poems_dynasty_id ON poems(dynasty_id);
CREATE INDEX IF NOT EXISTS idx_poems_type_id ON poems(type_id);
CREATE INDEX IF NOT EXISTS idx_poems_difficulty ON poems(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_poems_popularity ON poems(popularity);
CREATE INDEX IF NOT EXISTS idx_poets_dynasty_id ON poets(dynasty_id);
CREATE INDEX IF NOT EXISTS idx_poets_name ON poets(name);

-- 启用行级安全策略（RLS）
ALTER TABLE dynasties ENABLE ROW LEVEL SECURITY;
ALTER TABLE poets ENABLE ROW LEVEL SECURITY;
ALTER TABLE poem_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;

-- 创建允许所有操作的策略（根据实际需求调整）
CREATE POLICY "允许所有操作" ON dynasties FOR ALL USING (true);
CREATE POLICY "允许所有操作" ON poets FOR ALL USING (true);
CREATE POLICY "允许所有操作" ON poem_types FOR ALL USING (true);
CREATE POLICY "允许所有操作" ON poems FOR ALL USING (true);

-- 创建视图方便查询
CREATE OR REPLACE VIEW poetry_view AS
SELECT 
    p.id,
    p.title,
    p.content,
    p.difficulty_level,
    p.popularity,
    p.created_at,
    pt.name as poet_name,
    pt.description as poet_description,
    pt.lifespan,
    d.name as dynasty_name,
    d.start_year,
    d.end_year,
    pt2.name as poem_type,
    pt2.description as type_description
FROM poems p
JOIN poets pt ON p.poet_id = pt.id
JOIN dynasties d ON p.dynasty_id = d.id
JOIN poem_types pt2 ON p.type_id = pt2.id;

-- 注释表结构
COMMENT ON TABLE dynasties IS '朝代信息表';
COMMENT ON TABLE poets IS '诗人信息表';
COMMENT ON TABLE poem_types IS '诗歌类型表';
COMMENT ON TABLE poems IS '诗歌内容表';
COMMENT ON VIEW poetry_view IS '诗歌综合视图';

-- 显示创建结果
SELECT '表结构创建完成！' as message;
SELECT COUNT(*) as dynasty_count FROM dynasties;
SELECT COUNT(*) as poet_type_count FROM poem_types;