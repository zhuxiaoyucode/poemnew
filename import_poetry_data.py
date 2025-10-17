#!/usr/bin/env python3
# 古诗词数据导入脚本
# 将CSV文件中的数据导入到Supabase数据库

import csv
import os
import json
from datetime import datetime

# 加载.env文件
def load_env():
    """从.env文件加载环境变量"""
    env_path = '.env'
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()

# 加载环境变量
load_env()

# 配置信息
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# 兼容性处理：尝试导入requests，如果失败则使用urllib
try:
    import requests
    USE_REQUESTS = True
except ImportError:
    import urllib.request
    import urllib.parse
    USE_REQUESTS = False

# 配置信息
SUPABASE_URL = os.getenv('SUPABASE_URL', '您的Supabase项目URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', '您的Supabase API密钥')
CSV_FILE_PATH = '古诗词.csv'

def get_supabase_headers():
    """获取Supabase API请求头"""
    return {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation, resolution=merge-duplicates'
    }

def supabase_request(method, url, headers, data=None):
    """统一的Supabase请求函数，兼容requests和urllib"""
    if USE_REQUESTS:
        if method == 'GET':
            return requests.get(url, headers=headers, params=data)
        elif method == 'POST':
            return requests.post(url, headers=headers, json=data)
    else:
        # 使用urllib实现
        import urllib.request
        import json
        
        if method == 'GET':
            if data:
                from urllib.parse import urlencode
                url = f"{url}?{urlencode(data)}"
            req = urllib.request.Request(url, headers=headers, method='GET')
        elif method == 'POST':
            req = urllib.request.Request(url, headers=headers, method='POST')
            if data:
                req.data = json.dumps(data).encode('utf-8')
        
        try:
            response = urllib.request.urlopen(req)
            # 创建一个类似requests.Response的对象
            class SimpleResponse:
                def __init__(self, code, text):
                    self.status_code = code
                    self.text = text
                
                def json(self):
                    return json.loads(self.text)
            
            return SimpleResponse(response.getcode(), response.read().decode('utf-8'))
        except Exception as e:
            class ErrorResponse:
                def __init__(self, error):
                    self.status_code = 500
                    self.text = str(error)
            return ErrorResponse(e)

def get_or_create_dynasty(dynasty_name):
    """获取或创建朝代"""
    url = f"{SUPABASE_URL}/rest/v1/dynasties"
    headers = get_supabase_headers()
    
    # 先查询是否已存在
    params = {'name': f'eq.{dynasty_name}'}
    response = supabase_request('GET', url, headers, params)
    
    if response.status_code == 200 and response.json():
        return response.json()[0]['id']
    
    # 创建新朝代 - 简化数据，只包含必要字段
    dynasty_data = {
        'name': dynasty_name,
        'description': f'{dynasty_name}时期'
    }
    
    response = supabase_request('POST', url, headers, dynasty_data)
    if response.status_code == 201:
        return response.json()[0]['id']
    else:
        print(f"创建朝代失败: {dynasty_name}, 错误: {response.text}")
        # 直接返回现有朝代ID
        dynasty_map = {'唐': '1', '宋': '2', '南唐': '3', '北朝': '4', '明代': '5'}
        return dynasty_map.get(dynasty_name, '1')

def get_or_create_poet(poet_name, dynasty_id):
    """获取或创建诗人"""
    url = f"{SUPABASE_URL}/rest/v1/poets"
    headers = get_supabase_headers()
    
    # 先查询是否已存在
    params = {'name': f'eq.{poet_name}'}
    response = supabase_request('GET', url, headers, params)
    
    if response.status_code == 200 and response.json():
        return response.json()[0]['id']
    
    # 创建新诗人 - 简化数据，只包含必要字段
    poet_data = {
        'name': poet_name,
        'dynasty_id': dynasty_id,
        'description': f'著名诗人{poet_name}'
    }
    
    response = supabase_request('POST', url, headers, poet_data)
    if response.status_code == 201:
        return response.json()[0]['id']
    else:
        print(f"创建诗人失败: {poet_name}, 错误: {response.text}")
        # 直接返回现有诗人ID
        poet_map = {
            '李白': '1', '杜甫': '2', '苏轼': '3', '刘禹锡': '4', '柳宗元': '5',
            '孟浩然': '6', '王维': '7', '白居易': '8', '李绅': '9', '孟郊': '10',
            '王之涣': '11', '王昌龄': '12', '王勃': '13', '贺知章': '14',
            '韦应物': '15', '张继': '16', '韩翃': '17', '韩愈': '18', '李商隐': '19',
            '李煜': '20', '范仲淹': '21', '晏殊': '22', '柳永': '23', '李清照': '24',
            '陆游': '25', '文天祥': '26', '杨万里': '27', '范成大': '28', '林升': '29',
            '叶绍翁': '30', '王安石': '31', '辛弃疾': '32'
        }
        return poet_map.get(poet_name, '1')

def get_dynasty_start_year(dynasty_name):
    """根据朝代名称获取起始年份"""
    dynasty_years = {
        '唐': 618,
        '宋': 960,
        '南唐': 937,
        '北朝': 386,
        '五代': 907
    }
    return dynasty_years.get(dynasty_name, 0)

def get_dynasty_end_year(dynasty_name):
    """根据朝代名称获取结束年份"""
    dynasty_years = {
        '唐': 907,
        '宋': 1279,
        '南唐': 975,
        '北朝': 581,
        '五代': 960
    }
    return dynasty_years.get(dynasty_name, 0)

def get_poet_lifespan(poet_name):
    """根据诗人名称获取生卒年份（简化处理）"""
    poet_lifespans = {
        '李白': '701-762',
        '杜甫': '712-770',
        '苏轼': '1037-1101',
        '李清照': '1084-1155',
        '陆游': '1125-1210'
    }
    return poet_lifespans.get(poet_name, '未知')

def get_poem_type_id(poem_category):
    """根据诗歌分类获取类型ID"""
    type_mapping = {
        '思乡诗': 1,
        '山水诗': 2,
        '记行诗': 3,
        '送别诗': 4,
        '抒情诗': 5,
        '咏物诗': 6,
        '爱国诗': 7,
        '田园诗': 8,
        '怀古诗': 9,
        '爱情诗': 10,
        '酬赠诗': 11,
        '边塞诗': 12,
        '叙事诗': 13,
        '讽喻诗': 14,
        '亲情诗': 15,
        '哲理诗': 16,
        '节日诗': 17,
        '咏史怀古': 9
    }
    return type_mapping.get(poem_category, 5)  # 默认为抒情诗

def calculate_difficulty_level(content):
    """根据诗歌内容计算难度等级"""
    length = len(content)
    if length <= 20:
        return 1  # 简单
    elif length <= 50:
        return 2  # 中等
    else:
        return 3  # 困难

def import_poetry_data():
    """导入古诗词数据"""
    print("开始导入古诗词数据...")
    
    # 读取CSV文件
    with open(CSV_FILE_PATH, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        poems_data = list(reader)
    
    print(f"读取到 {len(poems_data)} 首诗歌数据")
    
    imported_count = 0
    error_count = 0
    
    for i, poem in enumerate(poems_data, 1):
        try:
            print(f"处理第 {i} 首诗歌: {poem['诗歌名称']}")
            
            # 处理朝代
            dynasty_name = poem['朝代']
            dynasty_id = get_or_create_dynasty(dynasty_name)
            if not dynasty_id:
                print(f"朝代处理失败: {dynasty_name}")
                error_count += 1
                continue
            
            # 处理诗人
            poet_name = poem['作者']
            poet_id = get_or_create_poet(poet_name, dynasty_id)
            if not poet_id:
                print(f"诗人处理失败: {poet_name}")
                error_count += 1
                continue
            
            # 准备诗歌数据
            poem_data = {
                'title': poem['诗歌名称'],
                'content': poem['诗歌正文'],
                'poet_id': poet_id,
                'dynasty_id': dynasty_id,
                'type_id': get_poem_type_id(poem['诗歌分类']),
                'difficulty_level': calculate_difficulty_level(poem['诗歌正文']),
                'popularity': 5,  # 默认流行度
                'created_at': datetime.now().isoformat()
            }
            
            # 插入诗歌数据
            url = f"{SUPABASE_URL}/rest/v1/poems"
            headers = get_supabase_headers()
            
            response = supabase_request('POST', url, headers, poem_data)
            if response.status_code == 201:
                imported_count += 1
                print(f"✓ 成功导入: {poem['诗歌名称']}")
            else:
                error_count += 1
                print(f"✗ 导入失败: {poem['诗歌名称']}, 错误: {response.text}")
                
        except Exception as e:
            error_count += 1
            print(f"✗ 处理异常: {poem['诗歌名称']}, 错误: {str(e)}")
    
    print(f"\n导入完成!")
    print(f"成功导入: {imported_count} 首")
    print(f"导入失败: {error_count} 首")
    print(f"总计处理: {len(poems_data)} 首")

if __name__ == "__main__":
    # 检查环境变量
    if not SUPABASE_URL:
        print("错误: 请设置 SUPABASE_URL 环境变量")
        print("请在 .env 文件中设置 SUPABASE_URL")
        exit(1)
    
    if not SUPABASE_KEY:
        print("错误: 请设置 SUPABASE_KEY 环境变量")
        print("请在 .env 文件中设置 SUPABASE_KEY")
        exit(1)
    
    print(f"Supabase URL: {SUPABASE_URL}")
    print(f"Supabase Key: {SUPABASE_KEY[:20]}...")
    print("开始导入数据...")
    
    import_poetry_data()