<!--
@author wolfBerry
@email 906368017@qq.com
@create date 2021-12-27 16:14:56
@modify date 2021-12-31 10:14:57
@desc
-->
<template>
  <div class="searchComponent">
    <div v-if="searchItem.type === 'input' && searchItem.showRule" class="select-item">
      <span class="si-label">{{ searchItem.label }}</span>
      <el-input
        v-model.trim="searchData[searchItem.model]"
        :placeholder="searchItem.placeHolder"
        type="text"
        size="small"
        @change="$emit('handleChange')"
      ></el-input>
    </div>
    <div v-if="searchItem.type === 'select' && searchItem.showRule" class="select-item">
      <span class="si-label">{{ searchItem.label }}</span>
      <el-select
        v-model="searchData[searchItem.model]"
        size="small"
        @change="$emit('handleChange')"
      >
        <el-option
          v-for="item in searchItem.listData"
          :key="item.value"
          :value="item.value"
          :label="item.key"
        ></el-option>
      </el-select>
    </div>
    <div
      v-if="searchItem.type === 'datePicker' && searchItem.showRule"
      class="select-item picker-item"
    >
      <span class="si-label">{{ searchItem.label }}</span>
      <el-date-picker
        v-model="searchData[searchItem.model]"
        type="datetimerange"
        :start-placeholder="searchItem.placeHolder.start"
        :end-placeholder="searchItem.placeHolder.end"
        :value-format="searchItem.valueFormat"
        :default-time="searchItem.defaultTime"
        size="small"
        :limit-now="true"
        @change="$emit('handleChange')"
      >
      </el-date-picker>
    </div>
    <div v-if="searchItem.type === 'range' && searchItem.showRule" class="select-item range-item">
      <span class="si-label">{{ searchItem.label }}</span>
      <el-input
        v-model.trim="searchData[searchItem.model.start]"
        :placeholder="searchItem.placeHolder.start"
        type="text"
        size="small"
        @change="$emit('handleChange')"
      ></el-input>
      <span class="si-range-text">至</span>
      <el-input
        v-model.trim="searchData[searchItem.model.end]"
        :placeholder="searchItem.placeHolder.end"
        type="text"
        size="small"
        @change="$emit('handleChange')"
      ></el-input>
    </div>
    <div v-if="searchItem.type === 'radioButton' && searchItem.showRule" class="select-item">
      <span class="si-label">{{ searchItem.label }}</span>
      <el-radio-group v-model="searchData[searchItem.model]" size="small">
        <el-radio-button
          v-for="item in searchItem.list"
          :key="item"
          :label="item"
        ></el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="searchItem.type === 'buttons' && searchItem.showRule" class="select-item">
      <el-button size="small" @click="$emit('handleRebase')">重置</el-button>
      <el-button type="primary" size="small" @click="$emit('handleSearch')">搜索</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchComponent',
  props: {
    searchItem: {
      required: true,
      validator: function (value) {
        // 针对不同的类型进行数据校验
        value.showRule = value.showRule ?? true
        if (!value.model && value.type !== 'buttons') {
          console.log(new Error('缺少变量名'))
          return false
        }
        if (!value.label && value.type !== 'buttons') {
          console.log(new Error('缺少筛选项字段名'))
          return false
        }
        if (!value.type) {
          console.log(new Error('缺少类型'))
          return false
        }
        if (['range'].includes(value.type)) {
          if (!value?.model) {
            console.log(new Error('缺少变量名'))
            return false
          }
          if (!value.model?.start) {
            console.log(new Error('缺少起始值变量名'))
            return false
          }
          if (!value.model?.end) {
            console.log(new Error('缺少结束值变量名'))
            return false
          }
        }
        if (['datePicker', 'range'].includes(value.type)) {
          // 有两个placeHolder的类型，需要单独预处理一下，避免使用时报错
          value.placeHolder ??= { start: null, end: null }
          value.placeHolder.start ??= null
          value.placeHolder.end ??= null
        }
        return value
      }
    },
    searchData: {
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.searchComponent {
  margin: 0 30px 20px 0;
  flex: 0 0 auto;
  .select-item {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .si-label {
      flex-shrink: 0;
      text-align: right;
      font-size: 14px;
      color: #333;
    }
    .el-input,
    .el-date-picker,
    .el-select {
      width: 200px;
    }
    .si-range-text {
      width: 30px;
      flex-shrink: 0;
    }
  }
  .range-item {
    .el-input {
      width: 85px;
    }
  }
  .picker-item {
    .el-date-editor--datetimerange.el-input__inner {
      width: 300px;
    }
  }
}
</style>
