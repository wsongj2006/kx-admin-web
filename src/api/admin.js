import axios from 'axios'
import request from '@/api/request'

export function getBuilding(params) {
  let url = getHost() + '/building?name='+params.name+'&customerId='+params.customerId+'&pageNum='+params.pageNum+'&counts='+params.counts
  return axios.get(
      url,
      {
        headers: {
          'token': localStorage.getItem("token")
        }
      }
  )
}

export function getSection(params) {
    let url = getHost() + '/section?name='+params.name+'&customerId='+params.customerId+'&buildingId='+params.buildingId+'&pageNum='+params.pageNum+'&counts='+params.counts
    return axios.get(
          url,
          {
            headers: {
              'token': localStorage.getItem("token")
            }
          }
      )
}

export function getDeviceStatus(params) {
  let url = getHost() + '/device/with_regular?name='+params.name+'&buildingId='+params.buildingId+'&sectionId='+params.sectionId+'&online='+params.online+'&pageNum='+params.pageNum+'&counts='+params.counts
  return axios.get(
      url,
      {
        headers: {
          'token': localStorage.getItem("token")
        }
      }
  )
}

export function getDeviceHistory(params) {
    let url = getHost() + '/regular?iotDeviceId='+params.iotDeviceId+'&startDate='+params.startDate+'&endDate='+params.endDate+'&pageNum='+params.pageNum + '&counts=' + params.counts
    return axios.get(
          url,
          {
            headers: {
              'token': localStorage.getItem("token")
            }
          }
    )
}

export function getImportedDevice(params) {
    let url = getHost() + '/device?name='+params.deviceName+'&code='+params.deviceCode+'&imei='+params.imei+'&sellStatus='+params.sellStatus+
        '&customerId='+params.customerId+'&buildingId='+params.buildingId+'&sectionId='+params.sectionId+'&pageNum='+params.pageNum+'&counts='+params.counts
    return axios.get(
        url,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function updateDevice(params) {
  let url = getHost() + '/device/' + params.id
  return axios.patch(
             url,
             params,
             {
               headers: {
                  'token': localStorage.getItem("token")
               }
             }
    )
}

export function getCustomer(params) {
    let url = getHost() + '/customer?name='+params.customerName+'&pageNum='+params.pageNum+'&counts='+params.counts
    return axios.get(
        url,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function patchImport(params) {
    let url = getHost() + '/device/list'
    return axios.post(
        url,
        params,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function patchBind(params) {
    let url = getHost() + '/device/binding/'+params.customerId+'/'+params.buildingId+'/'+params.sectionId
    return axios.patch(
            url,
            params.list,
            {
                headers: {
                    'token': localStorage.getItem("token")
                }
            }
    )
}

export function getCurrentUsage(params) {
  let url = getHost() + '/device/with_regular?name='+params.deviceName+'&customerId='+params.customerId+'&buildingId='+params.buildingId+'&sectionId='+params.sectionId+'&pageNum='+params.pageNum+'&counts='+params.counts
  return axios.get(
      url,
      {
        headers: {
          'token': localStorage.getItem("token")
        }
      }
  )
}

export function getPeriodUsage(params) {
    let url = getHost() + '/calculation/usage/periods?customerId='+params.customerId+'&startTime='+params.startTime+'&endTime=' + params.endTime +'&buildingId='+params.buildingId+'&sectionId='+params.sectionId+'&name='+params.deviceName+'&pageNum='+params.pageNum+'&counts='+params.counts
    return axios.get(
         url,
         {
           headers: {
             'token': localStorage.getItem("token")
           }
         }
    )
}

export function getTotalUsage(params) {
    let url = getHost() + '/calculation/usage/total?customerId='+params.customerId+'&startTime='+params.startTime+'&endTime=' + params.endTime +'&buildingId='+params.buildingId+'&sectionId='+params.sectionId+'&name='+params.deviceName+'&pageNum='+params.pageNum+'&counts='+params.counts
    return axios.get(
             url,
             {
               headers: {
                 'token': localStorage.getItem("token")
               }
             }
    )
}

export function getAccountList(params) {
    let url = getHost() + '/account?customerId='+params.customerId+'&userName='+params.accountName+'&pageNum='+params.pageNum+'&counts='+params.counts
    return axios.get(
        url,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function updateAccount(params) {
    let url = getHost() + '/account/'+params.id
    return axios.patch(
        url,
        params,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function resetPwd(params) {
    let url = getHost() + '/account/'+params.id+'/pwd/default'
    return axios.patch(
        url,
        params,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function addAccount(params) {
    let url = getHost() + '/account'
    return axios.post(
        url,
        params,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function addCustomer(params) {
    let url = getHost() + '/customer'
    return axios.post(
        url,
        params,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function updateCustomer(params) {
    let url = getHost() + '/customer/'+params.id
    return axios.put(
        url,
        params,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function addBuilding(params) {
    let url = getHost() + '/building'
    return axios.post(
        url,
        params,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function updateBuilding(params) {
    let url = getHost() + '/building/' + params.id
    return axios.put(
        url,
        params,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function addSection(params) {
    let url = getHost() + '/section'
    return axios.post(
        url,
        params,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function updateSection(params) {
    let url = getHost() + '/section/' + params.id
    return axios.put(
        url,
        params,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function updatePwd(params) {
    let url = getHost() + '/account/' + params.id+'/pwd'
    return axios.patch(
            url,
            params,
            {
                headers: {
                    'token': localStorage.getItem("token")
                }
            }
    )
}

export function getResource(params) {
    let url = getHost() + '/resource?resourceName='+params.resourceName+'&pageNum='+params.pageNum+'&counts='+params.counts
    return axios.get(
        url,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function saveResource(params) {
    let url = getHost() + '/resource'
    return axios.post(
        url,
        params,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function updateResource(params) {
    let url = getHost() + '/resource/'+params.id
    console.log(url)
    return axios.put(
        url,
        params,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function deleteResource(params) {
    let url = getHost() + '/resource/'+params.id
    return axios.delete(
        url,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function getRole(params) {
    let url = getHost() + '/role?roleName='+params.roleName+'&pageNum='+params.pageNum+'&counts='+params.counts
    return axios.get(
        url,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function saveRole(params) {
    let url = getHost() + '/role'
    return axios.post(
        url,
        params,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function updateRole(params) {
    let url = getHost() + '/role/'+params.id
    return axios.put(
        url,
        params,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function getAccountRole(params) {
    let url = getHost() + '/user_role?userId='+params.accountId+'&pageNum='+params.pageNum+'&counts='+params.counts
    return axios.get(
        url,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function saveAccountRole(params) {
    let url = getHost() + '/user_role'
    return axios.post(
        url,
        params,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function deleteAccountRole(params) {
    let url = getHost() + '/user_role/'+params.id
        return axios.delete(
            url,
            {
                headers: {
                    'token': localStorage.getItem("token")
                }
            }
        )
}

export function getRoleResource(params) {
    let url = getHost() + '/role_permission?roleId='+params.roleId+'&pageNum='+params.pageNum+'&counts='+params.counts
    return axios.get(
        url,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function saveRoleResource(params) {
    let url = getHost() + '/role_permission'
    return axios.post(
        url,
        params,
        {
            headers: {
                'token': localStorage.getItem("token")
            }
        }
    )
}

export function deleteRoleResource(params) {
    let url = getHost() + '/role_permission/'+params.id
        return axios.delete(
            url,
            {
                headers: {
                    'token': localStorage.getItem("token")
                }
            }
        )
}

export function login(params) {
    let url = getHost() + '/auth/login'
    return axios.post(url,params)
}

export function checkSession() {
    let url = getHost() + '/session'
    return axios.get(
            url,
            {
                headers: {
                    'token': localStorage.getItem("token")
                }
            }
    )
}

export function logout() {
    let params = {
        action: 'logout'
    }
    let url = getHost() + '/signout'
    return axios.put(
          url,
          params,
          {
              headers: {
                  'token': localStorage.getItem("token")
              }
          }
     )
}

export function checkAccountRole() {
    let url = getHost() + '/user_role/module'
    return axios.get(
            url,
            {
                headers: {
                    'token': localStorage.getItem("token")
                }
            }
    )
}

export function checkRolePermission() {
    let url = getHost() + '/role_permission/module'
    return axios.get(
            url,
            {
                headers: {
                    'token': localStorage.getItem("token")
                }
            }
    )
}

export function checkAccount() {
    let url = getHost() + '/account/module'
    return axios.get(
            url,
            {
                headers: {
                    'token': localStorage.getItem("token")
                }
            }
    )
}

export function checkAccessible(module) {
    let url = getHost() + '/'+module+'/module'
    return axios.get(
            url,
            {
                headers: {
                    'token': localStorage.getItem("token")
                }
            }
    )
}

function getHost() {
  let localhostUrl = 'http://192.168.1.9:9290'
  let aliyunUrl = 'http://47.110.82.181:8992'
  return localhostUrl
}