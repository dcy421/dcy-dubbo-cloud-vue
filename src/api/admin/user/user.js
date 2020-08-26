import axios from '_l/api.request'

/**
 * 登录
 * @param data
 * @returns {AxiosPromise}
 */
export const login = (data) => {
  return axios.request({
    url: '/auth-center/oauth/token',
    method: 'post',
    headers: {
      'Authorization': 'Basic ' + window.btoa('dcy_admin_client:123456')
    },
    params: {
      username: data.username.trim(),
      password: data.password,
      grant_type: 'password',
      scope: 'dcy_admin'
    }
  })
}

/**
 * 获取用户信息
 * @returns {AxiosPromise}
 */
export const getInfo = () => {
  return axios.request({
    url: '/auth-center/getUserInfo',
    method: 'get'
  })
}


/**
 * 添加用户
 * @param userInfo
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const addUserInfo = (userInfo) => {
  return axios.request({
    url: '/admin-center/user/save',
    method: 'post',
    data: userInfo
  })
}

/**
 * 修改用户
 * @param userInfo
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const updateUserInfo = (userInfo) => {
  return axios.request({
    url: '/admin-center/user/update',
    method: 'post',
    data: userInfo
  })
}

/**
 * 删除用户
 * @param userInfoId
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const deleteUserInfoById = (userInfoId) => {
  return axios.request({
    url: '/admin-center/user/delete',
    method: 'post',
    params: {
      id: userInfoId
    }
  })
}

/**
 * 批量删除用户
 * @param userInfoIds
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const deleteBatchUserInfoById = (userInfoIds) => {
  return axios.request({
    url: '/admin-center/user/deleteBatch',
    method: 'post',
    data: userInfoIds
  })
};

/**
 * 重置密码
 * @param userInfo
 * @returns {*|AxiosPromise<any>|ClientRequest|void|ClientHttp2Stream}
 */
export const resetPassword = (userInfo) => {
  return axios.request({
    url: '/admin-center/user/resetPassword',
    method: 'post',
    data: userInfo
  })
};

/**
 * 根据用户id查询已授权的角色列表
 * @param userId
 * @returns {*|AxiosPromise<any>|ClientRequest|void|ClientHttp2Stream}
 */
export const getAuthRoleListByUserId = (userId) => {
  return axios.request({
    url: '/admin-center/user/getAuthRoleListByUserId',
    params: {
      userId: userId
    }
  })
};

/**
 * 保存授权角色
 * @param userInfoRoleDTO
 * @returns {*|AxiosPromise<any>|ClientRequest|void|ClientHttp2Stream}
 */
export const saveAuthRole = (userInfoRoleDTO) => {
  return axios.request({
    url: '/admin-center/user/saveAuthRole',
    method: 'post',
    data: userInfoRoleDTO
  })
};

/**
 * 根据用户id查询已授权的用户组列表
 * @param userId
 * @returns {*|AxiosPromise<any>|ClientRequest|void|ClientHttp2Stream}
 */
export const getAuthGroupListByUserId = (userId) => {
  return axios.request({
    url: '/admin-center/user/getAuthGroupListByUserId',
    params: {
      userId: userId
    }
  })
};

/**
 * 保存授权用户组
 * @param userInfoGroupDTO
 * @returns {*|AxiosPromise<any>|ClientRequest|void|ClientHttp2Stream}
 */
export const saveAuthGroup = (userInfoGroupDTO) => {
  return axios.request({
    url: '/admin-center/user/saveAuthGroup',
    method: 'post',
    data: userInfoGroupDTO
  })
};

/**
 * 根据用户名获取用户信息
 * @param username 用户名
 * @returns {*|AxiosPromise<any>|ClientRequest|void|ClientHttp2Stream}
 */
export const getUserInfoByUsername = (username) => {
  return axios.request({
    url: '/admin-center/user/getUserInfoByUsername',
    params: {
      username: username
    }
  })
};
