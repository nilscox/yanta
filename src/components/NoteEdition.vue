<template>
  <div />
</template>

<script>
import CodeMirror from 'codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/shell/shell';

const mapExtensionToMode = {
  'md': { mode: 'gmf' },
  'sh': { mode: 'shell' },
  'js': { mode: 'javascript' },
  'json': { mode: 'javascript', json: true },
  'ts': { mode: 'javascript', typescript: true },
};

export default {
  name: 'NoteEdition',
  props: {
    name: String,
    modelValue: String,
    lineNumbers: Boolean,
    lineWrapping: Boolean,
    closeEdition: Function,
  },
  data() {
    return {
      value: this.modelValue,
    };
  },
  mounted() {
    const matchExt = this.name.match(/\.([^.]+)$/);
    const ext = matchExt && matchExt[1];

    this.cm = new CodeMirror(this.$el, {
      lineNumbers: this.lineNumbers,
      lineWrapping: this.lineWrapping,
      autofocus: true,
      value: this.value,
      highlightFormatting: true,
      ...(mapExtensionToMode[ext] || {}),
    });

    this.cm.on('change', (editor) => {
      const value = editor.doc.getValue();

      this.value = value;
      this.$emit('update:modelValue', value);
    });

    this.cm.on('keydown', (editor, event) => {
      if (event.key === 'Escape') {
        this.closeEdition();
      }
    });

    this.cm.on('focus', (editor) => {
      this.$emit('focus');
    });

    this.cm.on('blur', (editor) => {
      this.$emit('blur');
    });
  },
  unmounted() {
    this.cm.getWrapperElement().remove();
  },
};
</script>

<style>
.CodeMirror {
  font-family: "Source Code Pro", monospace;
  font-size: 1.3rem;
  height: auto;
  border: 1px solid #EEE;
}
</style>
