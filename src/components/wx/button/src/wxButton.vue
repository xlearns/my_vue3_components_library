<template>
  <button
    class="wx-button"
    :disabled="disabled || loading"
    :class="[
      size ? `wx-button-${size}` : '',
      type ? `wx-button-${type}` : '',
      { 'is-loading': loading },
      { 'is-circle': circle },
      { 'is-disabled': disabled },
      { 'is-round': round },
      { 'is-plain': plain },
    ]"
    @click="handleClick"
  >
    <i class="wx-icon-loading" v-if="loading"></i>
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { debounce } from "throttle-debounce";
export default defineComponent({
  name: `wxButton`,
  //解决两次click
  emits: ["click"],
  props: {
    size: {
      type: String,
      default: "medium",
      validator(val: string): boolean {
        return ["medium", "small", "mini", ""].includes(val);
      },
    },
    type: {
      type: String,
      default: "primary",
      validator(val: string): boolean {
        return ["primary", "success", "warning", "danger"].includes(val);
      },
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    loading: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    circle: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    round: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    plain: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  setup(props: any, { emit }) {
    const throttleClick = debounce(200, false, (event) => {
      emit("click", event);
    });
    const handleClick = function (event) {
      throttleClick(event);
    };
    return {
      handleClick,
    };
  },
});
</script>
