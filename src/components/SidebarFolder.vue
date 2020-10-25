<template>
  <span :class="['folder', isOpen && 'open']">
    <span class="name" @click="open = !open">{{ folderName }}</span>
    <ul v-show="isOpen">
      <li v-for="folder of folders" :key="folder">
        <sidebar-folder
          :path="[...path, folder]"
          :folder="getSubFolder(folder)"
          :class="{ open: isOpen }"
          :searching="searching"
        />
      </li>
      <li v-for="note of notes" :key="note" :class="{ active: true }">
        <router-link :to="getNotePath(note)">{{ note }}</router-link>
      </li>
    </ul>
  </span>
</template>

<script>
import { registerRuntimeCompiler } from 'vue';
export default {
  name: 'SidebarFolder',
  props: {
    path: Array,
    folder: Object,
    class: String,
    searching: Boolean,
  },
  data() {
    return {
      open: this.path.length === 0,
    };
  },
  mounted() {
    setTimeout(() => {
      const path = this.$route.params.path;

      if (path) {
        this.open = this.$route.params.path.startsWith(this.path.join('/'));
      }
    }, 0);
  },
  methods: {
    getNotePath(note) {
      return ['', ...this.path, note].join('/');
    },
    getSubFolder(name) {
      return this.folder.getFolder(name);
    },
  },
  computed: {
    isOpen() {
      return this.open || this.searching;
    },
    folderName() {
      const { path } = this;

      if (!path.length) {
        return '/';
      }

      return path[path.length - 1];
    },
    folders() {
      return this.folder.getFolders()
        .map(({ name }) => name)
        .sort();
    },
    notes() {
      return this.folder.getNotes()
        .map(({ name }) => name)
        .sort();
    },
  },
};
</script>

<style scoped>
.folder {
  user-select: none;
}

.folder .name {
  cursor: pointer;
}

.folder > .name::before {
  margin-right: 6px;
  font-weight: bold;
  font-size: 1.5rem;
}

.folder > .name::before {
  content: ">";
}

.folder.open > .name::before {
  content: "v";
}

.folder ul {
  margin: 0;
  margin-left: 12px;
  font-size: 100%;
}

li {
  margin: 0;
  list-style-type: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

li a.router-link-active {
  font-weight: bold;
}
</style>
