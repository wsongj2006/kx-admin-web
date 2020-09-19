import axios from 'axios'

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

function getHost() {
  let localhostUrl = 'http://192.168.1.9:9290'
  let aliyunUrl = 'http://47.110.82.181:8992'
  return localhostUrl
}