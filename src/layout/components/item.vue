<script>
export default {
  name: 'Item',
  props: {
    routeData: {
      required: true
    }
  },
  methods: {
    handleClick(expanded, path) {
      if (expanded !== undefined) {
        this.$emit('handleExpand', path)
      }
    }
  },
  render: function (h) {
    const { path, meta, children, expanded } = this.routeData
    const main = (
      <div class='item' style={{ height: expanded ? 'auto' : '50px' }}>
        <div class='item-title' on-click={() => this.handleClick(expanded, path)}>
          <i class='icon icon-Icon-2'></i>
          <span>{meta?.title || '默认title'}</span>
          <i
            class={{
              'icon icon-arrow-right': true,
              'rotate-item': expanded
            }}
            v-show={children}
          ></i>
        </div>
        {this.$slots.default}
      </div>
    )
    if (!children) {
      return (
        <router-link to={path} active-class='activeItemClass'>
          {main}
        </router-link>
      )
    } else {
      return main
    }
  }
}
</script>
<style lang="less" scoped>
.item {
  width: 100%;
  height: auto;
  overflow: hidden;
  .item-title {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    i:first-child {
      margin: 0 8px 0 30px;
      flex-shrink: 0;
    }
    span {
      display: block;
      width: 100%;
      color: #fff;
      text-align: left;
      padding-right: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .icon-arrow-right {
      position: absolute;
      right: 20px;
      transition: all 0.1s linear;
    }
    .hidden-item {
      display: none;
    }
    .rotate-item {
      transform: rotate(90deg);
    }
  }
}
</style>
