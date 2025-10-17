#!/usr/bin/env python3
# Supabase连接测试脚本

import os
import sys

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

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')

print("🔍 Supabase连接测试")
print("=" * 50)
print(f"URL: {SUPABASE_URL}")
print(f"Key: {SUPABASE_KEY[:20]}...")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ 环境变量未设置")
    sys.exit(1)

# 测试连接
try:
    import urllib.request
    import json
    
    # 测试基础连接
    url = f"{SUPABASE_URL}/rest/v1/"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}'
    }
    
    req = urllib.request.Request(url, headers=headers, method='GET')
    response = urllib.request.urlopen(req)
    print("✅ 基础连接成功")
    
    # 测试dynasties表
    url = f"{SUPABASE_URL}/rest/v1/dynasties"
    req = urllib.request.Request(url, headers=headers, method='GET')
    
    try:
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        print("✅ dynasties表访问成功")
        print(f"   表中有 {len(data)} 条记录")
    except Exception as e:
        print(f"❌ dynasties表访问失败: {e}")
        
    # 测试poets表
    url = f"{SUPABASE_URL}/rest/v1/poets"
    req = urllib.request.Request(url, headers=headers, method='GET')
    
    try:
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        print("✅ poets表访问成功")
        print(f"   表中有 {len(data)} 条记录")
    except Exception as e:
        print(f"❌ poets表访问失败: {e}")
        
    # 测试poems表
    url = f"{SUPABASE_URL}/rest/v1/poems"
    req = urllib.request.Request(url, headers=headers, method='GET')
    
    try:
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        print("✅ poems表访问成功")
        print(f"   表中有 {len(data)} 条记录")
    except Exception as e:
        print(f"❌ poems表访问失败: {e}")
        
except Exception as e:
    print(f"❌ 连接测试失败: {e}")

print("=" * 50)
print("💡 建议:")
print("1. 检查Supabase项目中的表是否已创建")
print("2. 检查RLS（行级安全）策略设置")
print("3. 确认API密钥是否正确")