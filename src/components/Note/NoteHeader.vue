<template>
  <div class="note-header">
    <div class="note-info">
      <h2 v-if="!editingName" class="name" @click="editName">
        {{ name }}
      </h2>
      <input
        v-if="editingName"
        :class="['name', !isNameValid && 'error']"
        ref="nameInput"
        v-model="nameValue"
        @blur="nameInputBlur"
        @keydown="nameInputKeydown"
      />
      <div class="path">{{ path }}</div>
      <div :title="'Created: ' + created">Updated: {{ updated }}</div>
    </div>

    <div class="actions">
      <icon-button
        v-for="action in actions"
        v-show="action.show"
        :key="action.title"
        :title="action.title"
        :icon="action.icon"
        :class="action.class"
        :click="action.click"
      />
    </div>
  </div>
</template>

<script>
import notesMixin from '../../mixins/notes.mixin';
import keybindingMixin from '../../mixins/keybinding.mixin';
import IconButton from '../../components/IconButton.vue';
import icons from './icons';

const downloadFile = (charset, text, filename) => {
  // code smell
  const a = document.createElement('a');

  a.download = filename;
  a.href = `data:text/plain;charset=${charset},${encodeURIComponent(text)}`;
  a.style.display = 'none';

  document.body.appendChild(a);

  a.click();
  a.remove();
};

export default {
  name: 'NoteHeader',
  components: {
    IconButton
  },
  props: {
    name: String,
    path: String,
    created: String,
    updated: String,
    creating: Boolean,
    editing: Boolean,
    edit: Function,
    fullWidth: Boolean,
    toggleFullWidth: Function,
    closeEdition: Function
  },
  mixins: [
    notesMixin,
    keybindingMixin,
  ],
  data() {
    return {
      editingName: false,
      nameValue: this.name,
      showMoreActions: false
    };
  },
  mounted() {
    if (this.creating) {
      this.editName();
    }
  },
  computed: {
    nextPath() {
      const dirname = this.path.replace(/\/[^\/]*$/, '');

      return [dirname, this.nameValue].join('/');
    },
    isNameValid() {
      if (this.nameValue === this.name) {
        return true;
      }

      return [this.nameValue.match(/^[-_.a-zA-Z0-9]+$/), !this.entryExists(this.nextPath)].every(Boolean);
    },
    actions() {
      const { editing, fullWidth } = this;
      const { edit, closeEdition, download, toggleFullWidth } = this;

      return [
        { show: true, title: 'supprimer', icon: icons.delete, class: 'icon-small', click: this.delete },
        { show: !editing, title: 'éditer', icon: icons.edit, class: 'icon-small', click: edit },
        { show: editing, title: "arrêter l'édition", icon: icons.close, class: 'icon-big', click: closeEdition },
        { show: true, title: 'télécharger', icon: icons.download, click: download },
        { show: !fullWidth, title: 'agrandir', icon: icons.expand, click: toggleFullWidth },
        { show: fullWidth, title: 'centrer', icon: icons.shrink, click: toggleFullWidth }
      ];
    },
  },
  methods: {
    handleKeybinding(action) {
      if (action === 'rename') {
        this.editName();
      } else if (action === 'delete') {
        this.delete();
      }
    },
    nameInputBlur() {
      this.editingName = false;

      if (this.nameValue === '') {
        return this.editName();
      }

      if (this.path === this.nextPath) {
        return;
      }

      if (this.entryExists(this.nextPath)) {
        alert('Whoops... a file with this name already exsits.');

        this.editingName = true;
        this.$refs.nameInput.focus();
      } else if (this.isNameValid) {
        if (this.creating) {
          this.saveNote(this.nextPath, '');
        } else {
          this.moveEntry(this.path, this.nextPath);
        }

        this.$router.replace(this.nextPath);
      }
    },
    nameInputKeydown(event) {
      if (event.key === 'Enter') {
        this.$refs.nameInput.blur();
      } else if (event.key === 'Escape') {
        this.nameValue = this.name;
        this.$refs.nameInput.blur();
      }
    },
    editName() {
      this.editingName = true;
      this.$nextTick(() => {
        this.$refs.nameInput.focus();
      });
    },
    download() {
      downloadFile('utf-8', this.text, this.name);
    },
    delete() {
      if (!confirm(`WTF?! Delete ${this.name} forever?`)) {
        return;
      }

      this.deleteEntry(this.path);
      this.$router.push('/');
    }
  },
  watch: {
    name(name) {
      this.nameValue = name;
    },
    editingName(editingName) {
      if (editingName) {
        this.pauseListeners();
      } else {
        this.unpauseListeners();
      }
    },
  }
};
</script>

<style scoped>
.note-header {
  display: flex;
  flex-direction: row;
}

h2 {
  margin-bottom: 2rem;
}

.note-info {
  flex: 1;
  font-size: 1.5rem;
  margin-bottom: 24px;
}

input.name {
  font-size: 3.6rem;
  line-height: 1.25;
  border: none;
  margin-bottom: 2rem;
  padding: 0;
  height: unset;
}

input.name.error {
  color: brown;
}
</style>
