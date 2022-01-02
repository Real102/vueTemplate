# vsCode 插件

vsCode 作为前端开发神器，得益于它的丰富的插件市场，一个良好的开发环境也少不了编辑器相关的配置，以下便是我们团队推荐的 vsCode 插件配置(无其它编辑器插件推荐，建议使用 vsCode 进行开发)，总体分为`必装`和`选装`两个部分；

## 必装插件

必装插件是一些`代码风格`相关的插件，为了确保团队代码风格的一致，这些插件应该是每个开发人员必须安装的；

### ESlint、Prettier - Code formatter

ESlint：

语法检查工具，当`js`语句违反团队配置的语法规则的时候，该插件以弹窗的形式提供`js`语句具体规则错误提示，如下图，

![img](.\img\eslint.png)

Prettier - Code formatter:

代码格式器，ESlint 的好搭档，使用 ESlint 进行语法检查，然后 prettier 进行代码格式化(建议编辑器内设置`Prettier`为默认格式化工具以及设置`format on save`)；

### EditorConfig for VS Code

通过项目中配置`.editorconfig`文件来实现对编辑器工作区的一些行为限制，可以在编辑器中键入`F1`打开 vsCode 运行台，输入`Generate .editorconfig`来生成默认的配置文件，

```bash
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

[*]
# 缩进风格使用空格代替tab
indent_style = space
# 每次缩进大小为两个空格
indent_size = 2
# 换行符风格
end_of_line = lf
# 文件字符集为utf-8
charset = utf-8
# 去除尾部空格
trim_trailing_whitespace = false
#最后一行插入空行
insert_final_newline = false
```

这些配置项会覆盖掉编辑器相关的默认行为，并不与`ESlint`、`Prettier`产生冲突，`editorconfig`支持大部分编辑器，是多编辑器配置项统一的一种解决方案，当然，在 vsCode 当中也是可以设置`.vscode`目录下的`setting.json`来达到覆盖工作区编辑器配置的目的；

### Vetur

大概从事`vue`技术栈开发的都不会不认识这个官方推荐的插件吧，必装！！！

## 选装

### 别名路径跳转

进行开发工作的时候，项目中常常会为特殊路径配置别名，如`src`目录配置为`@`或`~@`之类的，这样简写路径确实挺方便的，但实际上，这个简写的路径只能是被`打包构建工具`所识别而已(像 VueCli、vite 之类的)，编辑器是不认可的，为项目中的`jsconfig.json`配置别名可以让编辑器识别到这类路径别名，使得编辑器支持`Ctrl + 点击`文件路径实现文件跳转，除此之外，就是通过安装该插件来实现支持(如原项目没`jsconfig.json`则需要配置，该插件是直接安装即可，更简便)；

### DotENV

`.env`文件语法高亮插件

### Error Lens

报错信息行内实时显示，

![error_lens.png](.\img\error_lens.png)

### Git Graph

`git log`图形化界面，

![git graph](.\img\git_graph.png)

### Git History

`git log`图形化界面，以及单文件`git commit`记录追溯，

![git_history.png](.\img\git_history.png)

### GitLens — Git supercharged

代码行`git`记录显示，`GitLens`提供一个行尾阴影提示信息，提示该行代码的作者信息、最新更改时间、commit，鼠标悬浮到提示信息上，会出现具体信息的弹窗，

![git_lens.png](.\img\git_lens.png)

### Visual Studio Code Commitizen Support

项目中，关于 git commit message 的规范并没有进行约定，尽量以 Angular 规范为主，所以项目中并没有配置`commitizen`来限制提交信息的格式，vsCode 提供该插件，支持用户快速的创建符合规范的提交信息，

![commitizen](.\img\commitizen.png)

### Import Cost

npm 包容积大小提示，

![import_cost.png](.\img\import_cost.png)

### npm 和 npm Intellisense

这里把`npm`插件和`npm Intellisense`插件合在一起说，这两个插件提供的能力是 npm 包感知和路径补全能力，

![npm](.\img\npm.png)

### Todo Tree

检索工作区文件的`TODO`备注，并生成具体的`TODO`目录，

![todo_tree.png](.\img\todo_tree.png)
