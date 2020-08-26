import axios from '_l/api.request'

/**
 * 添加字典
 * @param dict
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const addDict = (dict) => {
  return axios.request({
    url: '/admin-center/dict/save',
    method: 'post',
    data: dict
  })
}

/**
 * 修改字典
 * @param dict
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const updateDict = (dict) => {
  return axios.request({
    url: '/admin-center/dict/update',
    method: 'post',
    data: dict
  })
}

/**
 * 删除字典
 * @param dictId
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const deleteDictById = (dictId) => {
  return axios.request({
    url: '/admin-center/dict/delete',
    method: 'post',
    params: {
      id: dictId
    }
  })
}

/**
 * 批量删除字典
 * @param dictIds
 * @returns {ClientHttp2Stream | * | AxiosPromise<any> | ClientRequest | void}
 */
export const deleteBatchDictById = (dictIds) => {
  return axios.request({
    url: '/admin-center/dict/deleteBatch',
    method: 'post',
    data: dictIds
  })
}


/**
 * 获取模块tree-table数据
 * @returns {*|AxiosPromise<any>|ClientRequest|void|ClientHttp2Stream}
 */
export const getDictTreeTableList = () => {
  return axios.request({
    url: '/admin-center/dict/getDictTreeTableList'
  })
}
