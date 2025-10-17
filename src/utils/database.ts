import { supabase } from '@/services/supabase'

export const createTables = async () => {
  try {
    // 创建用户表
    const { error: usersError } = await supabase.rpc('create_users_table')

    if (usersError && !usersError.message.includes('already exists')) {
      console.error('创建用户表失败:', usersError)
      return false
    }

    // 创建用户活动表
    const { error: activitiesError } = await supabase.rpc('create_activities_table')

    if (activitiesError && !activitiesError.message.includes('already exists')) {
      console.error('创建活动表失败:', activitiesError)
      return false
    }

    console.log('数据库表创建成功')
    return true
  } catch (error) {
    console.error('创建数据库表时出错:', error)
    return false
  }
}

// 由于Supabase的REST API不支持直接执行DDL，我们需要通过SQL编辑器或迁移来创建表
// 这里提供一个替代方案：检查表是否存在，如果不存在则提示用户手动创建

export const checkTablesExist = async () => {
  try {
    // 检查用户表是否存在
    const usersResult = await supabase.from('users').select('count')
    const usersError = usersResult.error

    // 检查活动表是否存在
    const activitiesResult = await supabase.from('user_activities').select('count')
    const activitiesError = activitiesResult.error

    return {
      usersExist: !usersError,
      activitiesExist: !activitiesError,
    }
  } catch (error) {
    console.error('检查表存在时出错:', error)
    return {
      usersExist: false,
      activitiesExist: false,
    }
  }
}
