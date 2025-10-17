#!/usr/bin/env python3
# Supabase配置获取助手

print("=" * 50)
print("Supabase配置获取指南")
print("=" * 50)

print("\n📋 请按照以下步骤获取Supabase配置：")

print("\n1️⃣ 登录Supabase控制台")
print("   访问: https://supabase.com")
print("   使用您的账户登录")

print("\n2️⃣ 进入您的项目")
print("   选择您创建的诗词导航项目")

print("\n3️⃣ 获取配置信息")
print("   点击左侧菜单 → Settings → API")
print("   在 'Configuration' 部分找到:")
print("   - Project URL")
print("   在 'Project API keys' 部分找到:")
print("   - anon public key")

print("\n4️⃣ 创建配置文件")
print("   复制 .env.example 文件为 .env")
print("   将获取的URL和密钥填入对应位置")

print("\n5️⃣ 运行导入脚本")
print("   python import_poetry_data.py")

print("\n💡 提示:")
print("   - 确保数据库表已创建 (执行 create_poetry_database.sql)")
print("   - 使用 anon public key (不是 service_role key)")
print("   - URL格式: https://your-project-ref.supabase.co")

print("\n" + "=" * 50)