<template>
  <main class="note">
    <div :class="[!fullWidth && 'container']">
      <note-header
        :name="name"
        :path="path"
        :created="created"
        :updated="updated"
        :creating="creating"
        :editing="editing"
        :edit="edit"
        :closeEdition="closeEdition"
        :fullWidth="fullWidth"
        :toggleFullWidth="toggleFullWidth"
        :lineNumbers="lineNumbers"
        :toggleLineNumbers="toggleLineNumbers"
        :lineWrapping="lineWrapping"
        :toggleLineWrapping="toggleLineWrapping"
      />
      <div
        class="text markdown-github"
        v-if="!editing"
        v-html="html"
      />
      <note-edition
        :name="name"
        :lineNumbers="lineNumbers"
        :lineWrapping="lineWrapping"
        :closeEdition="closeEdition"
        v-if="editing"
        v-model="textValue"
      />
    </div>
  </main>
</template>

<script>
import { format as formatDate } from 'date-fns';
import debounce from 'lodash.debounce';

import NoteHeader from "./NoteHeader.vue";
import NoteEdition from "../../components/NoteEdition.vue";
import notesMixin from "../../mixins/notes.mixin";
import showdownMixin from "../../mixins/showdown.mixin";
import keybindingMixin from "../../mixins/keybinding.mixin";

import data from "../../data.json";

export default {
  name: "Note",
  props: {
    path: String,
    note: Object,
    creating: Boolean,
  },
  components: {
    NoteHeader,
    NoteEdition,
  },
  mixins: [
    notesMixin,
    showdownMixin,
    keybindingMixin,
  ],
  data() {
    return {
      textValue: this.note?.text || '',
      editing: false,
      fullWidth: false,
      lineNumbers: true,
      lineWrapping: true,
    };
  },
  created() {
    this.debouncedTextChange = debounce(() => {
      this.saveNote(this.path, this.textValue);
    }, 500);
  },
  unmounted() {
    this.debouncedTextChange.cancel();
  },
  methods: {
    handleKeybinding(action) {
      if (action === 'edit') {
        this.edit();
      }
    },
    toggleFullWidth() {
      this.fullWidth = !this.fullWidth;
    },
    toggleLineNumbers() {
      this.lineNumbers = !this.lineNumbers;
    },
    toggleLineWrapping() {
      this.lineWrapping = !this.lineWrapping;
    },
    edit() {
      this.editing = true;
    },
    closeEdition() {
      this.editing = false;
    },
    formatDate(date) {
      if (!date) {
        return '';
      }

      return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    }
  },
  computed: {
    name() {
      return this.note?.name || '';
    },
    created() {
      return this.formatDate(this.note?.created);
    },
    updated() {
      return this.formatDate(this.note?.updated);
    },
    text() {
      return this.note?.text || '';
    },
    html() {
      if (this.name.endsWith('.md')) {
        return this.makeHtml(this.text);
      }

      return `<pre wrap>${this.text}</pre>`;
    },
  },
  watch: {
    note(note) {
      this.textValue = note.text;
      this.$nextTick(() => this.debouncedTextChange.cancel());
      this.closeEdition();
    },
    textValue() {
      this.debouncedTextChange();
    },
    editing(editing) {
      if (editing) {
        this.pauseListeners();
      } else {
        this.unpauseListeners();
      }
    }
  },
};
</script>

<style scoped>
.note > div {
  height: 100%;
}
</style>
