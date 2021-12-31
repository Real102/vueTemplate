<template>
  <svg :class="svgClass" aria-hidden="true">
    <title>{{ title }}</title>
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon '
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  vertical-align: baseline;
  overflow: hidden;
}
</style>
