module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk' // 单独引用了完整的主题包时，把该行替换为 style: false
      },
      'element-ui'
    ]
  ]
}
