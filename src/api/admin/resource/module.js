import axios from '_l/api.request'

/**
 * 添加模块
 * @param module
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const addResource = (module) => {
  return axios.request({
    url: '/admin-center/resources/save',
    method: 'post',
    data: module
  })
}

/**
 * 修改模块
 * @param module
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const updateResource = (module) => {
  return axios.request({
    url: '/admin-center/resources/update',
    method: 'post',
    data: module
  })
}

/**
 * 删除模块
 * @param moduleId
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const deleteResourceById = (moduleId) => {
  return axios.request({
    url: '/admin-center/resources/delete',
    method: 'post',
    params: {
      id: moduleId
    }
  })
}

/**
 * 批量删除模块
 * @param moduleIds
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const deleteBatchResourceById = (moduleIds) => {
  return axios.request({
    url: '/admin-center/resources/deleteBatch',
    method: 'post',
    data: moduleIds
  })
}

/**
 * 获取模块tree-table数据
 * @returns {*|AxiosPromise<any>|ClientRequest|void|ClientHttp2Stream}
 */
export const getResourceTreeTableList = () => {
  return axios.request({
    url: '/admin-center/resources/getResourceTreeTableList'
  })
}

/**
 * 获取tree列表数据
 * @returns {*|AxiosPromise<any>|ClientRequest|void|ClientHttp2Stream}
 */
export const getResourceTreeList = (roleId) => {
  return axios.request({
    url: '/admin-center/resources/getResourceTreeListByRoleId',
    params: {
      roleId: roleId
    }
  })
}
