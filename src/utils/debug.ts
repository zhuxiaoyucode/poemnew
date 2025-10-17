import { supabase } from '@/services/supabase'

export const debugDatabase = async () => {
  console.log('=== 数据库调试信息 ===')

  try {
    // 1. 检查Supabase连接
    console.log('1. 检查Supabase连接...')
    const connectionResult = await supabase.from('users').select('count')

    if (connectionResult.error) {
      console.error('❌ 数据库连接失败:', connectionResult.error)
      console.log('💡 可能的原因:')
      console.log('   - 数据库表不存在')
      console.log('   - API密钥不正确')
      console.log('   - 项目URL错误')
      console.log('   - 网络连接问题')
    } else {
      console.log('✅ 数据库连接正常')
    }

    // 2. 检查表是否存在
    console.log('2. 检查表状态...')

    // 检查users表
    const usersCheck = await supabase.from('users').select('*')
    if (usersCheck.error) {
      console.log('❌ users表不存在或无法访问')
    } else {
      console.log('✅ users表存在')
    }

    // 检查user_activities表
    const activitiesCheck = await supabase.from('user_activities').select('*')
    if (activitiesCheck.error) {
      console.log('❌ user_activities表不存在或无法访问')
    } else {
      console.log('✅ user_activities表存在')
    }

    // 3. 提供解决方案
    console.log('3. 解决方案:')
    console.log('   - 请确保已在Supabase控制台执行了create_tables.sql脚本')
    console.log('   - 检查.env.local文件中的环境变量是否正确')
    console.log('   - 确认Supabase项目设置中的API设置')
  } catch (error) {
    console.error('调试过程中出错:', error)
  }
}

// 在浏览器控制台中运行: debugDatabase()
export default debugDatabase
