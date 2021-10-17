<template>
  <div
    :class="{
      ['wx-form-input']: true,
      'input-prepend': $slots.prepend,
      'input-append': $slots.append,
    }"
    :style="{ width: width }"
  >
    <div v-if="$slots.prepend" class="prepend">
      <slot name="prepend"></slot>
    </div>
    <input
      v-bind="$attrs"
      ref="inputEl"
      :value="modelValue"
      :type="inputType"
      :class="{
        disabled: disabled,
        ['wx-input-control']: true,
        'has-prefix': $slots.prefix || prefixIcon,
        [size]: size,
      }"
      :disabled="disabled"
      @input="inputHandler"
      @focus="focusHandler"
      @blur="blurHandler"
    />
    <div v-if="$slots.append" class="append"><slot name="append"></slot></div>
    <span v-if="$slots.prefix || prefixIcon" class="prefix-icon">
      <i v-if="prefixIcon" :class="[prefixIcon]"></i>
      <slot name="prefix"></slot>
    </span>
    <span class="suffix-icon">
      <slot name="suffix"></slot>
      <i v-if="suffixIcon" :class="[suffixIcon]"></i>
      <i
        v-if="clear && modelValue"
        class="icon-close"
        @click.stop="clearValue"
      ></i>
      <i
        v-if="modelValue && showEye && type === 'password'"
        :class="{ 'icon-eye-close': eyeShow, 'icon-eye': !eyeShow }"
        @click.stop="eyeShow = !eyeShow"
      ></i>
    </span>
  </div>
</template>
<script lang="ts">
import { ref, defineComponent, computed, watch, inject, onMounted } from "vue";
export default defineComponent({
  name: `wxInput`,
  components: {},
  inheritAttrs: false,
  props: {
    modelValue: {},
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    type: {
      type: String,
      default: () => {
        return "text";
      },
    },
    clear: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    showEye: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    prefixIcon: {
      type: String,
    }, // 前缀icon
    suffixIcon: {
      type: String,
    }, // 后缀icon
    width: {
      type: String,
    },
    size: {
      type: String,
    },
  },
  emits: ["blur", "focus", "update:modelValue", "change"],
  setup(props, { emit }) {
    const inputEl = ref();
    const eyeShow = ref(false);
    const inputType = computed(() => {
      if (eyeShow.value) {
        return "text";
      } else {
        return props.type;
      }
    });
    const blurHandler = (e: Event) => {
      emit("blur", e);
      const { value } = e.target as HTMLInputElement;
      controlChangeEvent(value, "blur");
    };
    const focusHandler = (e: Event) => {
      emit("focus", e);
      const { value } = e.target as HTMLInputElement;
      controlChangeEvent(value, "focus");
    };
    const inputHandler = (e: Event) => {
      const { value } = e.target as HTMLInputElement;
      emit("update:modelValue", value);
      controlChangeEvent(value);
    };
    const clearValue = () => {
      emit("update:modelValue", "");
      emit("change", "");
    };
    // 通过el.value.focus()设置焦点事件
    const focus = () => {
      inputEl.value.focus();
    };
    const blur = () => {
      inputEl.value.blur();
    };
    watch(
      () => props.modelValue,
      (v: any) => {
        controlChangeEvent(v, "mounted");
      }
    );
    // formItem
    const controlChange: any = inject("controlChange", "");
    const controlChangeEvent = (val: any, type?: string) => {
      controlChange && controlChange(val, type);
    };
    onMounted(() => {
      controlChangeEvent(props.modelValue, "mounted");
    });
    return {
      inputType,
      blurHandler,
      focusHandler,
      inputHandler,
      clearValue,
      eyeShow,
      focus,
      blur,
      inputEl,
    };
  },
});
</script>
