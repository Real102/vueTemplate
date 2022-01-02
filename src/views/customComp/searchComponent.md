# 自定义搜索组件

## 前言

此组件基于 `element-ui`，目前封装了有以下五种常用的搜索类型，仅默认配置了常用的用法，其余功能可以自主修改组件内的逻辑，但请尽量不要修改本搜索组件

**布局说明**：

- 组件内部未初始化布局方案，皆以块状显示，建议可以使用 `flex` 布局，且左对齐的方案。
- 组件内预设了 `input`、`select` 等的宽度为 `200px`，`data-picker` 宽度为 `300px`。若有需求，可直接修改组件内的样式代码
- 组件内未对搜索条件名设置宽度，为自适应。

**其他说明**：

- 目前有 `select`（下拉选择框）、`input`（输入框）、`datePicker`（时间选择器）、`range`（取值区间）、`radioButton`（`button` 组）五种类型，以及 `buttons` 搜索按钮

## 使用

以下为相关配置使用说明

```html
<searchComponent
  v-for="(item, index) in searchList"
  :key="index"
  :searchItem="item"
  :searchData="searchData"
  @handleChange="handleChange"
  @handleRebase="handleRebase"
  @handleSearch="handleSearch"
></searchComponent>
```

- `searchList`：所有配置项内容
- `searchItem`：每一个子搜索条件包含的数据
- `handleChange`：搜索条件 `change` 事件
- `handleRebase`：点击重置按钮触发事件
- `handleSearch`：点击搜索按钮触发事件

```javascript
data() {
  return {
    searchList: {
      channel: {
        model: 'srcAppId', // 绑定的数据，即用于v-model的参数，必填
        type: 'select', // 输入框类型，即需要使用下拉选择框就输入select，必填
        showRule: true, // 通过computed返回一个值，条件显示时可用，选填
        label: '适用渠道：', // 搜索字段名称，必填
        placeHolder: '请选择适用渠道', // 提示文案，选填
        listData: [
          // 列表数据，不同类型不同字段，必填。
          // key、value键值对需一致
          {
            key: '全部',
            value: 0
          },
          {
            key: '5G消息',
            value: '2'
          },
          {
            key: '视频短信',
            value: '1'
          }
        ]
      },
      theme: {
        model: 'theme',
        type: 'input',
        label: '主题：',
        placeHolder: '请输入主题'
      },
      time: {
        model: 'time',
        type: 'datePicker',
        label: '生成时间：',
        placeHolder: {
          // 两个提示文案，可选填
          start: '开始时间',
          end: '结束时间'
        },
        valueFormat: 'yyyy-MM-ddTHH:mm:ssZ',  // element-ui配置项，选填
        defaultTime: ['12:00:00'] // element-ui配置项，选填
      },
      range: {
        model: {
          // 取值区间，需要设置两个值，必填
          start: 'startPrice',
          end: 'endPrice'
        },
        type: 'range',
        label: '价格区间：',
        placeHolder: {
          start: '请输入最低价格'
        }
      },
      dimension: {
        model: 'dimension',
        type: 'radioButton',
        label: '筛选维度：',
        showRule: true, // 通过computed返回一个值，如果不需要显示那么就取false
        list: ['时间', '链接', '内容']
      },
      others: {
        // 搜索和重置两个按钮，暂无单独控制的条件，必填
        type: 'buttons'
      }
    }
  }
}
```
