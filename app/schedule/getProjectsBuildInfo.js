'use strict'
const Subscription = require('egg').Subscription

/**
 * 用于获取项目构建信息
 */
module.exports = {
  schedule: {
    interval: '1s', // 1 分钟间隔
    type: 'all', // 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    const {
      app,
      service: { file, jenkins },
    } = ctx
    const {
      config: { PROJECTENVSNAME, JENKINSJOBNAME },
    } = app
    const nsp = app.io.of('/')

    const data = await file.readFile(PROJECTENVSNAME)
    const tempData = JSON.parse(data)
    const envData = []
    const hasBuilding = tempData.findIndex((i) => i.building)
    if (hasBuilding > -1) {
      for (let index = 0; index < tempData.length; index++) {
        const env = tempData[index]
        const tempEnv = { ...env }
        const { building, id } = tempEnv
        if (building && id) {
          const res = await jenkins.getBuildInfo(JENKINSJOBNAME, id)
          if (res.code > 0) {
            tempEnv.building = res?.data?.building ?? tempEnv.building
          }
          if (!tempEnv.building) {
            nsp.emit('jenkinsFileDownLoad', tempEnv.description)
          }
        }
        envData.push(tempEnv)
      }
      file.writeFile(PROJECTENVSNAME, JSON.stringify(envData))
      nsp.emit('jenkinsAllJobs', JSON.stringify(envData))
    }
  },
}
