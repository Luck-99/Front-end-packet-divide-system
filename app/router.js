'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const counter = app.middleware.counter()
  const { router, controller, io } = app
  router.get('/', controller.home.index)

  router.get('/xz', controller.home.xz)
  router.get('/testGetUser', controller.home.testGetUser)

  router.get('/user', counter, controller.user.index)
  // router.get('/getUsers', controller.user.getUsers);
  router.get('/getUser', controller.user.getUser)
  router.get('/getUser2/:name/:age', controller.user.getUser2)
  router.post('/addUser', controller.user.addUser)
  router.get('/addCookie', controller.user.addCookie)
  router.get('/delCookie', controller.user.delCookie)
  router.get('/editCookie', controller.user.editCookie)
  router.get('/showCookie', controller.user.showCookie)

  router.get('/addUser', controller.userManage.addUser)
  router.get('/delUser', controller.userManage.delUser)
  router.get('/updateUser', controller.userManage.updateUser)
  router.get('/getUsers', controller.userManage.getUsers)

  router.post('/login', controller.user.login)
  router.get('/jenkins/getAllJobs', controller.jenkins.getAllJobs)
  router.get('/jenkins/buildJob', controller.jenkins.buildJob)
  router.get(
    '/jenkins/buildWithParameters',
    controller.jenkins.buildWithParameters
  )
  router.get('/jenkins/getBuildInfo', controller.jenkins.getBuildInfo)
  router.get('/jenkins/getLastBuildInfo', controller.jenkins.getLastBuildInfo)
  router.get('/jenkins/getQueue', controller.jenkins.getQueue)
  router.get('/jenkins/getJobInfo', controller.jenkins.getJobInfo)
  router.get('/jenkins/downloadFile', controller.jenkins.downloadFile)

  router.get('/verdaccio/getAllPackages', controller.verdaccio.getAllPackages)
  router.get('/verdaccio/getPackageInfo', controller.verdaccio.getPackageInfo)

  router.get('/file/readFile', controller.file.readFile)
  router.post('/file/writeFile', controller.file.writeFile)

  io.of('/').route('chat', io.controller.chat)
}
