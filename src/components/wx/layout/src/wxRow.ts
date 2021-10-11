import { h, provide, computed, getCurrentInstance } from 'vue'
export default {
  name: 'wxRow',
  componentName: 'wxRow',
  setup(props) {
    const style = computed(() => {
      const ret = {}
      if (props.gutter) {
        ret.marginLeft = `-${props.gutter / 2}px`
        ret.marginRight = ret.marginLeft
      }
      return ret
    })
    provide('wx-row', getCurrentInstance())
    return { style }
  },
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    gutter: {
      type: Number,
      default: 0
    },
    type: String,
    justify: {
      type: String,
      default: 'start'
    },
    align: {
      type: String,
      default: 'top'
    }
  },

  render() {
    return h(
      this.tag,
      {
        class: [
          'wx-row',
          this.justify !== 'start' ? `is-justify-${this.justify}` : '',
          this.align !== 'top' ? `is-align-${this.align}` : '',
          { 'wx-row--flex': this.type === 'flex' }
        ],
        style: this.style
      },
      this.$slots.default && this.$slots.default()
    )
  }
}
