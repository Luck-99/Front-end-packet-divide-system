'use strict'

const BaseService = require('./base_service')

class GitlabService extends BaseService {
  async getProjectCommits(projectID, since, until) {
    try {
      const {
        ctx,
        config: { GITLABAPI, GITLABTOKEN },
      } = this
      const res = await ctx.curl(
        `${GITLABAPI}/projects/${projectID}/repository/commits`,
        {
          method: 'GET',
          data: {
            private_token: GITLABTOKEN,
            ref_name: 'master', //默认分支
            since,
            until,
          },
          dataType: 'json',
        }
      )
      if (res.status === 200) {
        return this.success(res.data)
      } else {
        return this.failed(res?.data?.message ?? '获取失败')
      }
    } catch (error) {
      return this.failed(error.message)
    }
  }

  async getVersionCommits(packages) {
    try {
      const {
        service: { verdaccio },
      } = this
      const requests = []
      for (const item of packages) {
        requests.push(await verdaccio.getPackageInfo(item))
      }
      const packageVersionCommit = {}
      const res = await Promise.all(requests)
        .then((res) => {
          for (const pack of res) {
            if (this.isSuccess(pack)) {
              const data = this.getMsg(pack)
              const { versions, _id } = data
              const versionData = {}
              for (const [version, packageData] of Object.entries(versions)) {
                const { gitHead } = packageData
                versionData[version] = gitHead
              }
              packageVersionCommit[_id] = versionData
            }
          }
          return this.success(packageVersionCommit)
        })
        .catch((err) => {
          return this.failed(err)
        })
      return res
    } catch (error) {
      return this.failed(error.message)
    }
  }
}

module.exports = GitlabService
