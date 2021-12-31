/**
 * @author wolfBerry
 * @email 906368017@qq.com
 * @create date 2021-07-19 09:45:41
 * @modify date 2021-07-19 09:49:30
 * @desc 使用fontmin压缩字体文件大小方案：1为压缩指定文字，2为压缩指定路径下的所有文件内的文字。
 * @need 需要全局安装fontmin
 */

// const Fontmin = require('fontmin')
// const fontmin = new Fontmin()
//   .src('./src/assets/font/SourceHanSansCN-Regular.ttf')
//   .dest('./src/assets/font/fontmin/')
//   .use(
//     Fontmin.glyph({
//       text:
//         '里的src制定了输入字体文件路径（必须是ttf文件），然后dest是输出路径，use(Fontmin.glyph({text, hinting}))会生成一个只包含text字符的字体文件子集，hinting指定所生成的ttf文件是否包含控制值表、字体程序区之类的信息（用于保留完整的TrueType轮廓描述信息）。接下来最后一个use(Fontmin.ttf2woff({deflate: true}))用来将上一步生成的ttf文件转化为woff，进一步压缩大小。',
//       hinting: false,
//     }),
//   )
//   .use(
//     Fontmin.ttf2woff({
//       deflate: true,
//     }),
//   )
// fontmin.run(err => {
//   if (err) {
//     throw err
//   }
// })

const fs = require('fs')
const Fontmin = require('fontmin')
let set = new Set()

// get all possible characters
const scanFolder = (dir, done) => {
  let results = []
  fs.readdir(dir, (err, list) => {
    if (err) {
      return done(err)
    }
    let i = 0
    ;(function iter() {
      let file = list[i++]
      if (!file) {
        return done(null, results)
      }
      file = dir + '/' + file
      fs.stat(file, (err, stat) => {
        if (!err) {
          if (stat && stat.isDirectory()) {
            scanFolder(file, (error, res) => {
              if (!error) {
                results = results.concat(res)
                iter()
              }
            })
          } else {
            results.push(file)
            iter()
          }
        }
      })
    })()
  })
}

// get all possible characters
const generateFinalHTML = finalString => {
  // TODO: 需要修改指定的字体文件、目标存放路径
  const fontmin = new Fontmin()
    .src('./src/assets/font/SourceHanSansCN-Regular.ttf')
    .dest('./src/assets/font/fontmin/')
    .use(
      Fontmin.glyph({
        text: finalString,
        hinting: false
      })
    )

  fontmin.run(err => {
    if (err) {
      throw err
    }
  })
}

// get all possible characters
// TODO: 选择指定的路径，这里是src
scanFolder('src', (n, results) => {
  results.forEach(file => {
    const result = fs.readFileSync(file, 'utf8')
    const currentSet = new Set(result)
    set = new Set([...set, ...currentSet])
  })
  generateFinalHTML(Array.from(set).join(''))
})
