-- 修复RLS策略，允许匿名插入数据
-- 这个脚本将修改RLS策略，允许通过API密钥进行数据插入

-- 1. 禁用RLS策略（临时解决方案）
ALTER TABLE dynasties DISABLE ROW LEVEL SECURITY;
ALTER TABLE poets DISABLE ROW LEVEL SECURITY;
ALTER TABLE poems DISABLE ROW LEVEL SECURITY;
ALTER TABLE tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE poem_tags DISABLE ROW LEVEL SECURITY;

-- 2. 或者，创建允许服务角色插入的策略（推荐）
-- 先删除现有的插入策略
DROP POLICY IF EXISTS "allow_admin_manage_all" ON dynasties;
DROP POLICY IF EXISTS "allow_admin_manage_poets" ON poets;
DROP POLICY IF EXISTS "allow_admin_manage_poems" ON poems;
DROP POLICY IF EXISTS "allow_admin_manage_tags" ON tags;

-- 创建允许服务角色（通过API密钥）插入的策略
CREATE POLICY "allow_service_role_insert_dynasties" ON dynasties FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_service_role_insert_poets" ON poets FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_service_role_insert_poems" ON poems FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_service_role_insert_tags" ON tags FOR INSERT WITH CHECK (true);

-- 允许服务角色更新和删除
CREATE POLICY "allow_service_role_update_dynasties" ON dynasties FOR UPDATE USING (true);
CREATE POLICY "allow_service_role_update_poets" ON poets FOR UPDATE USING (true);
CREATE POLICY "allow_service_role_update_poems" ON poems FOR UPDATE USING (true);
CREATE POLICY "allow_service_role_update_tags" ON tags FOR UPDATE USING (true);

CREATE POLICY "allow_service_role_delete_dynasties" ON dynasties FOR DELETE USING (true);
CREATE POLICY "allow_service_role_delete_poets" ON poets FOR DELETE USING (true);
CREATE POLICY "allow_service_role_delete_poems" ON poems FOR DELETE USING (true);
CREATE POLICY "allow_service_role_delete_tags" ON tags FOR DELETE USING (true);

-- 3. 插入基础朝代数据（确保数据存在）
INSERT INTO dynasties (name, start_year, end_year, description) VALUES
('唐', 618, 907, '唐朝是中国历史上最强盛的朝代之一，诗歌创作达到巅峰'),
('宋', 960, 1279, '宋朝文化繁荣，词作达到鼎盛时期'),
('南唐', 937, 975, '五代十国时期的南唐，以词闻名'),
('北朝', 386, 581, '南北朝时期的北朝'),
('明代', 1368, 1644, '明朝小说戏曲繁荣，诗歌承前启后')
ON CONFLICT (name) DO UPDATE SET
  start_year = EXCLUDED.start_year,
  end_year = EXCLUDED.end_year,
  description = EXCLUDED.description;

-- 4. 插入基础诗人数据
-- 先添加popularity字段（如果不存在）
ALTER TABLE poets ADD COLUMN IF NOT EXISTS popularity INTEGER DEFAULT 5;

INSERT INTO poets (name, dynasty_id, biography, style_description, popularity) 
SELECT 
  name,
  (SELECT id FROM dynasties WHERE name = dynasty_name),
  biography,
  style_description,
  popularity
FROM (VALUES
  ('李白', '唐', '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"', '豪放飘逸，想象丰富，语言流转自然', 10),
  ('杜甫', '唐', '唐代伟大的现实主义诗人，被尊为"诗圣"', '沉郁顿挫，语言精炼，格律严谨', 9),
  ('苏轼', '宋', '北宋文学家、书画家，唐宋八大家之一', '豪放洒脱，题材广阔，清新豪健', 9),
  ('刘禹锡', '唐', '唐代文学家、哲学家，有"诗豪"之称', '雄浑爽朗，清新自然，富有哲理', 7),
  ('柳宗元', '唐', '唐代文学家、哲学家，唐宋八大家之一', '清新峻洁，含蓄深婉', 7),
  ('孟浩然', '唐', '唐代山水田园派诗人', '清淡自然，意境深远', 8),
  ('王维', '唐', '唐代诗人、画家，有"诗佛"之称', '诗中有画，画中有诗', 9),
  ('白居易', '唐', '唐代伟大的现实主义诗人', '语言通俗，平易近人', 8),
  ('李绅', '唐', '唐代诗人，新乐府运动的参与者', '关注民生，语言朴实', 6),
  ('孟郊', '唐', '唐代诗人，与贾岛并称"郊寒岛瘦"', '奇险瘦硬，情感真挚', 6),
  ('王之涣', '唐', '唐代边塞诗人', '气势磅礴，意境开阔', 7),
  ('王昌龄', '唐', '唐代边塞诗人，有"诗家夫子"之称', '雄浑豪放，深沉婉转', 8),
  ('王勃', '唐', '唐代诗人，初唐四杰之一', '清新俊逸，气势雄浑', 7),
  ('贺知章', '唐', '唐代诗人、书法家', '清新通俗，富有情趣', 6),
  ('韦应物', '唐', '唐代山水田园诗人', '淡雅高远，清新自然', 7),
  ('张继', '唐', '唐代诗人', '意境深远，语言精炼', 6),
  ('韩翃', '唐', '唐代诗人', '婉约清新，富有情致', 5),
  ('韩愈', '唐', '唐代文学家、哲学家，唐宋八大家之一', '雄奇豪放，气势磅礴', 8),
  ('李商隐', '唐', '唐代诗人，与杜牧合称"小李杜"', '含蓄婉转，辞藻华丽', 8),
  ('李煜', '南唐', '南唐后主，著名词人', '哀婉凄切，真挚动人', 9),
  ('范仲淹', '宋', '北宋政治家、文学家', '雄浑豪放，忧国忧民', 8),
  ('晏殊', '宋', '北宋词人', '婉约含蓄，语言凝练', 7),
  ('柳永', '宋', '北宋词人', '婉约细腻，通俗易懂', 8),
  ('李清照', '宋', '宋代女词人', '婉约清新，情感真挚', 9),
  ('陆游', '宋', '南宋诗人', '雄浑豪放，爱国热情', 8),
  ('文天祥', '宋', '南宋民族英雄、诗人', '慷慨激昂，正气凛然', 9),
  ('杨万里', '宋', '南宋诗人', '清新自然，幽默风趣', 7),
  ('范成大', '宋', '南宋诗人', '平易浅显，富有情趣', 6),
  ('林升', '宋', '南宋诗人', '讽刺辛辣，意境深远', 5),
  ('叶绍翁', '宋', '南宋诗人', '清新自然，富有理趣', 5),
  ('王安石', '宋', '北宋政治家、文学家，唐宋八大家之一', '雄健峭拔，理性深刻', 8),
  ('辛弃疾', '宋', '南宋词人', '豪放悲壮，雄浑大气', 9)
) AS t(name, dynasty_name, biography, style_description, popularity)
ON CONFLICT (name) DO UPDATE SET
  dynasty_id = EXCLUDED.dynasty_id,
  biography = EXCLUDED.biography,
  style_description = EXCLUDED.style_description,
  popularity = EXCLUDED.popularity;

SELECT 'RLS策略修复完成！基础数据已插入。' as message;