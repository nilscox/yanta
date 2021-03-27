<template>
  <aside class="sidebar">
    <header>
      <h1>
        <router-link to="/">Notes</router-link>
      </h1>
      <input
        class="search"
        placeholder="Search..."
        v-model="search"
        ref="search"
        @keydown="searchKeydown"
        @focus="pauseListeners"
        @blur="unpauseListeners"
      />
    </header>
    <sidebar-folder v-if="rootFolder" :path="[]" :folder="rootFolder" :searching="Boolean(this.search)" />
  </aside>
</template>

<script>
import notesMixin from '../mixins/notes.mixin';
import SidebarFolder from './SidebarFolder.vue';
import Folder from '../models/folder';
import keybindingMixin from '../mixins/keybinding.mixin';

export default {
  name: 'Sidebar',
  components: {
    SidebarFolder
  },
  mixins: [
    notesMixin,
    keybindingMixin,
  ],
  data() {
    return {
      search: ''
    };
  },
  computed: {
    rootFolder() {
      const root = this.getRootFolder();

      if (!root)
        return null;

      if (!this.search) {
        return root;
      }

      const emptyFolder = new Folder({ name: '/', entries: [] });
      let search;

      try {
        search = new RegExp(this.search);
      } catch (e) {
        if (!e.message.startsWith('Invalid regular expression')) {
          throw e;
        }

        return emptyFolder;
      }

      const getFilteredNotes = folder => {
        const entries = [
          ...folder
            .searchFolders(search)
            .map(getFilteredNotes)
            .filter(Boolean),
          ...folder.searchNotes(search)
        ];

        if (!entries.length) {
          return null;
        }

        return new Folder({ name: folder.name, entries }, folder.parent);
      };

      return getFilteredNotes(root) || emptyFolder;
    }
  },
  methods: {
    handleKeybinding(action) {
      if (action === 'search') {
        this.$refs.search.focus();
      }
    },
    searchKeydown(e) {
      if (e.key === 'Escape') {
        this.search = '';
        this.$refs.search.blur();
      }
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 220px;
  min-width: 220px;
  background-color: #EEE;
  border-right: 1px solid #DDD;
  padding: 12px;
  overflow-y: auto;
}

@media (min-width: 80.0rem) {
  .sidebar {
    width: 280px;
  }
}

h1 {
  font-size: 3rem;
}

input.search {
  margin: 2rem 0;
}

input.search,
input.search:focus {
  border-color: #ccc;
}
</style>
