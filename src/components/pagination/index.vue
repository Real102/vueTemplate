<!--
@author wolfBerry
@email 906368017@qq.com
@create date 2021-09-06 09:29:49
@modify date 2021-09-14 09:44:07
@desc 分页器插件
-->
<template>
  <div class="pagination">
    <el-pagination
      background
      :current-page="paginationData.currentPage"
      :page-size="paginationData.pageSize"
      :total="paginationData.total"
      layout="prev, pager, next"
      prev-text="< 上一页"
      next-text="下一页 >"
      v-on="$listeners"
    ></el-pagination>
    <div>
      <span>每页</span>
      <el-select v-model="paginationData.pageSize" size="small" @change="handleSizeChange">
        <el-option
          v-for="(item, index) in pageSizeList"
          :key="index"
          :value="item"
          :label="item"
        ></el-option>
      </el-select>
      <span>条</span>
    </div>
    <div>
      <span>共{{ totalPage }}页/{{ paginationData.total }}条</span>
    </div>
    <div>
      <span>跳至</span>
      <el-input v-model="targetPageSize" size="small" class="pageSizeInput"></el-input>
      <span>页</span>
      <el-button size="small" plain @click="handleDrump">跳转</el-button>
    </div>
  </div>
</template>
<script>
/**
 * 插件目的：由于外链平台的分页器与饿了么组件UI有些差别，就在饿了么的基础上二次封装了分页器。
 * 此分页器插件会有较强的业务性，使用时需要根据业务需求调整。如非强制要求，请直接使用饿了么组件
 * ! 使用规则：
 * 1. 相关事件与原饿了么插件一致：@current-change、@size-change
 * 2. 传入的值目前只支持total和currentPage，即总条数和当前页数
 * 3. 具体相关配置请直接在插件内调整（全局性）
 * ! 使用方法：
 * 请查看 vue-template 项目下的 home 页面
 *
 * TODO: 需要在setting.js手动设置每页条数的下拉选择框
 */
import { GLOBAL_PAGESIZE } from '@/setting.js'
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      require: true,
      type: Number
    },
    total: {
      required: true,
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      targetPageSize: undefined,
      paginationData: {
        pageSize: 10,
        currentPage: 1,
        total: 12
      }
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.paginationData.total / this.paginationData.pageSize)
    },
    pageSizeList() {
      return GLOBAL_PAGESIZE
    }
  },
  watch: {
    total: {
      handler: function () {
        this.paginationData.total = this.total
      },
      immediate: true
    },
    currentPage: {
      handler: function () {
        this.paginationData.currentPage = this.currentPage
      },
      immediate: true
    }
  },
  methods: {
    handleDrump() {
      const count = Math.ceil(this.paginationData.total / this.paginationData.pageSize)
      if (parseInt(this.targetPageSize) === this.paginationData.currentPage) {
        this.$message.info(`您已在第${this.targetPageSize}页`)
      } else if (this.targetPageSize > 0 && this.targetPageSize <= count) {
        this.paginationData.currentPage = parseInt(this.targetPageSize)
        this.$emit('current-change', this.paginationData.currentPage)
      } else {
        this.targetPageSize = undefined
        this.$message.error('请输入合法的页码')
      }
    },
    handleSizeChange() {
      // 每页显示条数变化触发事件，触发后currentPage应该置1
      this.$emit('size-change', this.paginationData.pageSize)
    }
  }
}
</script>
<style lang="less">
.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  & > div {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
  .el-select {
    width: 70px;
    margin: 0 5px;
  }
  .pageSizeInput {
    width: 44px;
    margin: 0 5px;
  }
  .el-button {
    margin: 0 0 0 5px;
    font-size: 14px;
    color: #323233;
    padding: 0;
    width: 56px;
    height: 32px;
    line-height: 32px;
    font-weight: 400 !important;
  }
  .btn-prev,
  .btn-next {
    width: 68px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #dcdee0;
    border-radius: 2px;
    border-radius: 2px;
  }
  .el-pagination.is-background {
    .el-pager {
      .number {
        background-color: #ffffff;
        height: 32px;
        line-height: 32px;
      }
      .active {
        background-color: #4079ff !important;
      }
    }
    .btn-prev,
    .btn-next {
      color: #323233;
      background-color: #ffffff;
      &:disabled {
        color: #323233;
      }
    }
  }
}
</style>
