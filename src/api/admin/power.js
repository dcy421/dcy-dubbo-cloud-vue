import axios from '@/libs/api.request'

/**
 * 添加权限
 * @param power
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const addPower = (power) => {
  return axios.request({
    url: '/power/save',
    method: 'post',
    data: power
  })
}

/**
 * 修改权限
 * @param power
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const updatePower = (power) => {
  return axios.request({
    url: '/power/update',
    method: 'post',
    data: power
  })
}

/**
 * 删除权限
 * @param powerId
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const deletePowerById = (powerId) => {
  return axios.request({
    url: '/power/delete',
    method: 'post',
    params: {
      id: powerId
    }
  })
}

/**
 * 批量删除权限
 * @param powerIds
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const deleteBatchPowerById = (powerIds) => {
  return axios.request({
    url: '/power/deleteBatch',
    method: 'post',
    data: powerIds
  })
}

/**
 * 获取所有权限
 * @returns {*|AxiosPromise<any>|ClientRequest|void|ClientHttp2Stream}
 */
export const getPowerAllList = () => {
  return axios.request({
    url: '/power/all'
  })
};

/**
 * 保存授权模块
 * @param powerModuleDTO
 * @returns {*|AxiosPromise<any>|ClientRequest|void|ClientHttp2Stream}
 */
export const saveAuthModule = (powerModuleDTO) => {
  return axios.request({
    url: '/power/saveAuthModule',
    method: 'post',
    data: powerModuleDTO
  })
};

/**
 * 保存授权菜单
 * @param powerMenuDTO
 * @returns {*|AxiosPromise<any>|ClientRequest|void|ClientHttp2Stream}
 */
export const saveAuthMenu = (powerMenuDTO) => {
  return axios.request({
    url: '/power/saveAuthMenu',
    method: 'post',
    data: powerMenuDTO
  })
};
