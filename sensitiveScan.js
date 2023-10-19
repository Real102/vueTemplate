const fs = require('node:fs')
const path = require('path')
const buildDir = 'dist' // 默认的打包文件夹名称
const suffixes = [
  '.7z',
  '.tar',
  '.gz',
  '.zip',
  '.rar',
  '.txt',
  '.bak',
  '.sql',
  '.pyc',
  '.swp',
  '.old',
  '~',
  '.DS_Store',
  '.sh',
  '.gitignore'
] // 需要删除的文件夹后缀，全量删除
const folders = ['.git', '.svn', '.idea', 'WEB-INF', '.hg', '.bzr'] // 需要删除的文件夹，全量删除

const scanFolder = (folderPath, cb) => {
  const tempFileList = []
  const tempFolderList = []
  fs.readdir(folderPath, (err, list) => {
    if (!err) {
      let i = 0
      ;(function iter() {
        const subPath = list[i++]
        if (!subPath) return cb(tempFileList, tempFolderList)
        const filePath = path.join(folderPath, subPath)
        fs.stat(filePath, (err, stat) => {
          if (!err) {
            if (stat.isDirectory()) {
              // 如果是文件夹，并且不属于需要删除的文件夹范畴内，继续扫描，否则直接删除
              if (folders.includes(subPath)) {
                tempFolderList.push(filePath)
                iter()
              } else {
                scanFolder(filePath, (tempFile, tempFolder) => {
                  tempFileList.push(...tempFile)
                  tempFolder.push(...tempFolder)
                  iter()
                })
              }
            } else {
              if (suffixes.includes(path.extname(filePath))) {
                tempFileList.push(filePath)
              }
              iter()
            }
          }
        })
      })()
    } else {
      console.log('扫描文件夹失败')
      cb(tempFileList, tempFolderList)
    }
  })
}

scanFolder(buildDir, (tempFileList, tempFolderList) => {
  console.log('-----------涉敏文件--------------')
  console.log(tempFileList)
  console.log('-----------涉敏文件夹------------')
  console.log(tempFolderList)
})
