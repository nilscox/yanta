<template>
  <div class="wrapper">
    <sidebar />
    <router-view />
  </div>
</template>

<script>
import { computed } from 'vue';
import Sidebar from './components/Sidebar.vue';
import IconButton from './components/IconButton.vue';
import { NotesLocalStorageAdapter } from './adapters/notes-local-storage-adapter';

import data from './data.json';

const keybindings = [
  { key: 'e', action: 'edit', modifier: false },
  { key: 'r', action: 'rename', modifier: false },
  { key: 's', action: 'search', modifier: false },
  { key: 'D', action: 'delete', modifier: false },
];

export default {
  name: 'App',
  components: {
    Sidebar,
    IconButton,
  },
  data() {
    return {
      adapter: new NotesLocalStorageAdapter(data),
      keybindingListeners: [],
      listening: true,
    };
  },
  mounted() {
    document.body.addEventListener('keyup', this.keyup);
  },
  unmounted() {
    document.body.removeEventListener('keyup', this.keyup);
  },
  provide() {
    return {
      notesAdapter: computed(() => this.adapter),
      registerKeybindingListener: this.registerKeybindingListener,
      unregisterKeybindingListener: this.unregisterKeybindingListener,
      setListening: this.setListening,
    };
  },
  methods: {
    registerKeybindingListener(listener) {
      this.keybindingListeners.push(listener);
    },
    unregisterKeybindingListener(listener) {
      const idx = this.keybindingListeners.indexOf(listener);

      if (idx >= 0) {
        this.keybindingListeners.splice(idx, 1);
      }
    },
    setListening(value) {
      this.listening = value;
    },
    keyup(event) {
      if (!this.listening) {
        return;
      }

      const keybinding = keybindings.find(({ key }) => event.key === key);

      if (!keybinding) {
        return;
      }

      if (keybinding.modifier && !event[keybinding.modifier]) {
        return;
      }

      this.keybindingListeners.forEach(listener => listener(keybinding.action));
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  background-color: #FAFAFA;
  height: 100%;
  outline: none;
}
</style>
