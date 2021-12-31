<template>
  <div class="customComp">
    <div class="search-wrap">
      <searchComponent
        v-for="(item, index) in searchList"
        :key="index"
        :searchItem="item"
        :searchData="searchData"
        @handleChange="handleChange"
        @handleRebase="handleRebase"
        @handleSearch="handleSearch"
      ></searchComponent>
    </div>
  </div>
</template>
<script>
import searchComponent from './searchComponent.vue'

export default {
  name: 'CustomComp',
  components: {
    searchComponent
  },
  data() {
    return {
      searchData: {
        dimension: '时间'
      },
      searchList: {
        channel: {
          model: 'srcAppId', // 绑定的数据
          type: 'select', // 输入框类型
          label: '适用渠道：', // 搜索字段名称
          placeHolder: '请选择适用渠道', // 提示文案
          listData: [
            // 列表数据
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
        status: {
          model: 'status', // 绑定的数据
          type: 'select', // 输入框类型
          label: '状态：', // 搜索字段名称
          placeHolder: '请选择当前状态', // 提示文案
          listData: [
            // 列表数据
            {
              key: '全部',
              value: 0
            },
            {
              key: '正常',
              value: '2'
            },
            {
              key: '关闭',
              value: '1'
            }
          ]
        },
        userName: {
          model: 'userName',
          type: 'input',
          label: '用户名：',
          placeHolder: '请输入用户名'
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
            start: '开始时间',
            end: '结束时间'
          },
          valueFormat: 'yyyy-MM-ddTHH:mm:ssZ',
          defaultTime: ['12:00:00']
        },
        range: {
          model: {
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
          type: 'buttons'
        }
      }
    }
  },
  methods: {
    handleChange() {
      console.log(this.searchData)
    },
    handleRebase() {
      this.searchData = this.$options.data().searchData
    },
    handleSearch() {
      console.log(this.searchData)
    }
  }
}
</script>
<style lang="less" scoped>
.customComp {
  .search-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
  }
}
</style>
