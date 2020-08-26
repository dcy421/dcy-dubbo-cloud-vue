import axios from '@/libs/api.request'

/**
 * 添加菜单
 * @param menu
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const addMenu = (menu) => {
  return axios.request({
    url: '/menu/save',
    method: 'post',
    data: menu
  })
}

/**
 * 修改菜单
 * @param menu
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const updateMenu = (menu) => {
  return axios.request({
    url: '/menu/update',
    method: 'post',
    data: menu
  })
}

/**
 * 删除菜单
 * @param menuId
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const deleteMenuById = (menuId) => {
  return axios.request({
    url: '/menu/delete',
    method: 'post',
    params: {
      id: menuId
    }
  })
}

/**
 * 批量删除菜单
 * @param menuIds
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const deleteBatchMenuById = (menuIds) => {
  return axios.request({
    url: '/menu/deleteBatch',
    method: 'post',
    data: menuIds
  })
}

/**
 * 获取模块tree-table数据
 * @returns {*|AxiosPromise<any>|ClientRequest|void|ClientHttp2Stream}
 */
export const getMenuTreeTableList = () => {
  return axios.request({
    url: '/menu/getMenuTreeTableList'
  })
}

/**
 * 获取tree列表数据
 * @returns {*|AxiosPromise<any>|ClientRequest|void|ClientHttp2Stream}
 */
export const getMenuTreeList = (powerId) => {
  return axios.request({
    url: '/menu/getMenuTreeListByPowerId',
    params: {
      powerId: powerId
    }
  })
}
