<template>
  <textarea v-model="modelValue" :style="styles" />
</template>

<script>
import CodeMirror from 'codemirror/src/codemirror';
import 'codemirror/lib/codemirror.css'

console.log(CodeMirror.modes);

export default {
  name: 'TextareaAutosize',
  props: {
    modelValue: String,
  },
  data() {
    return {
      height: 'auto',
    };
  },
  mounted() {
    this.resize();
    this.cm = new CodeMirror.fromTextArea(this.$el, {
      lineNumbers: true,
      lineWrapping: true,
      mode: 'javascript',
      autofocus: true,
    });
  },
  computed: {
    styles() {
      return { height: this.height + 'px' };
    },
  },
  methods: {
    resize() {
      this.height = 0;
      this.$nextTick(() => {
        this.height = this.$el.scrollHeight;
      });
    },
  },
  watch: {
    modelValue(value) {
      this.resize();
      this.$emit('update:modelValue', value);
      this.$emit('text-change', value);
    },
  },
};
</script>

<style>
.CodeMirror {
  font-family: "Source Code Pro", monospace;
  font-size: 1.3rem;
  height: auto;
}
</style>
