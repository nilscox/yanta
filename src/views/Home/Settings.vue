<template>
  <main>
    <h1>Settings</h1>
    <h2>Synchronization</h2>
    <form>
      <label v-for="adapter of adapterTypes" :key="adapter">
        <input type="radio" name="syncAdapter" :value="adapter" v-model="adapterType" />
        {{ adapterName(adapter) }}
      </label>
    </form>
  </main>
</template>

<script>
import adapters from '../../adapters';
import Folder from '../../models/folder';

export default {
  name: 'Settings',
  inject: ['notesAdapter', 'setNotesAdapter'],
  components: {
  },
  data() {
    return {
      adapterType: localStorage.getItem('adapter'),
    };
  },
  computed: {
    adapterTypes() {
      return Object.keys(adapters);
    },
  },
  methods: {
    adapterName(type) {
      return {
        IN_MEMORY: 'In Memory',
        LOCAL_STORAGE: 'Local Storage',
        GOOGLE_DRIVE: 'Google Drive',
      }[type];
    },
    askDataOverwrite(currentAdapter, targetAdapter) {
      const label = {
        IN_MEMORY: 'memory',
        LOCAL_STORAGE: 'the browser\'s local storage',
        GOOGLE_DRIVE: 'google drive\'s storage',
      };

      const lines = [
        `There already is some data in ${label[targetAdapter]}. Which one do you want to keep?`,
        `Type "current" to keep the data in ${label[currentAdapter]}, or "target" to keep the data in ${label[targetAdapter]})`,
      ];

      const keep = prompt(lines.join('\n\n'));

      if (!['current', 'target'].includes(keep)) {
        return null;
      }

      if (keep === 'current') {
        if (!confirm(`All data in ${label[targetAdapter]} will be lost. Is that okay?`)) {
          return null;
        }
      }

      return keep;
    },
    async changeAdapter(oldAdapterType, newAdapterType) {
      const oldAdapter = this.notesAdapter.value;

      const Adapter = adapters[newAdapterType];
      const newAdapter = new Adapter();

      await newAdapter.init();

      if (newAdapter.getRootFolder().entries.length === 0) {
        newAdapter.root = oldAdapter.root;
        await newAdapter.save();
      } else {
        const keep = this.askDataOverwrite(oldAdapterType, newAdapterType);

        if (keep === null) {
          return;
        }

        if (keep === 'current') {
          newAdapter.root = oldAdapter.root;
          await newAdapter.save();
        }
      }

      await oldAdapter.teardown();

      return newAdapter;
    },
  },
  watch: {
    async adapterType(newAdapterType, oldAdapterType) {
      if (localStorage.getItem('adapter') === newAdapterType) {
        return
      }

      const newAdapter = await this.changeAdapter(oldAdapterType, newAdapterType);

      if (newAdapter) {
        this.setNotesAdapter(newAdapter);
        localStorage.setItem('adapter', newAdapterType);
      } else {
        this.adapterType = oldAdapterType;
      }
    },
  },
};
</script>

<style scoped>
h2 {
  margin-top: 4rem;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: bold;
}

label {
  font-weight: normal;
}
</style>
