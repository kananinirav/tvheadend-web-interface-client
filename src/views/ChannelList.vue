<template>
  <div class="channels">
    <div class="header">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search channels..."
          @input="filterChannels"
        >
        <span v-if="searchQuery" class="clear-search" @click="clearSearch">×</span>
      </div>
    </div>
    <ul v-if="filteredChannels.length">
      <li v-for="channel in filteredChannels"
          :key="channel.uuid"
          :class="{ active: selectedChannel === channel.uuid }"
          @click="selectChannel(channel)">
        <span class="channel-number">{{ channel.number }}</span>
        <span class="channel-name">{{ channel.name }}</span>
      </li>
    </ul>
    <p v-else-if="loading" class="message">Loading channels...</p>
    <p v-else class="message">No channels found</p>
  </div>
</template>

<script>
import tvheadendApi from '../services/tvheadendApi'

export default {
  name: 'ChannelList',
  data() {
    return {
      channels: [],
      filteredChannels: [],
      selectedChannel: null,
      searchQuery: '',
      loading: true
    }
  },
  async created() {
    try {
      const data = await tvheadendApi.getChannels()
      this.channels = data.map(channel => ({
        name: channel.name,
        uuid: channel.uuid,
        number: channel.number || 0 // Add channel number, default to 0 if not present
      })).sort((a, b) => {
        // Sort by number first
        return a.number - b.number
      })
      this.filteredChannels = [...this.channels]
    } catch (error) {
      console.error('Error fetching channels:', error)
    } finally {
      this.loading = false
    }
  },
  methods: {
    selectChannel(channel) {
      this.selectedChannel = channel.uuid
      this.$emit('channel-selected', channel)
    },
    filterChannels() {
      if (!this.searchQuery) {
        this.filteredChannels = [...this.channels]
        return
      }

      const query = this.searchQuery.toLowerCase()
      this.filteredChannels = this.channels.filter(channel =>
        channel.name.toLowerCase().includes(query) ||
        channel.number.toString().includes(query)
      )
    },
    clearSearch() {
      this.searchQuery = ''
      this.filterChannels()
    }
  }
}
</script>

<style scoped>
.channels {
  width: 300px;
  height: 100vh;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 20px;
  border-bottom: 1px solid #ddd;
  background: #fff;
}

h1 {
  margin: 0 0 15px 0;
  font-size: 1.5em;
}

.search-box {
  position: relative;
  width: 100%;
}

input {
  width: 100%;
  padding: 8px 30px 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #42b983;
}

.clear-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.clear-search:hover {
  color: #666;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
}

li {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
}

li:hover {
  background-color: #e9e9e9;
}

li.active {
  background-color: #42b983;
  color: white;
}

.channel-number {
  min-width: 40px;
  margin-right: 10px;
  color: #666;
  font-size: 0.9em;
}

li.active .channel-number {
  color: white;
}

.channel-name {
  flex: 1;
}

.message {
  padding: 20px;
  text-align: center;
  color: #666;
}

/* Scrollbar styling */
ul::-webkit-scrollbar {
  width: 8px;
}

ul::-webkit-scrollbar-track {
  background: #f1f1f1;
}

ul::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}

ul::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}
</style>
