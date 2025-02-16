<template>
  <div class="home-container">
    <ChannelList class="sidebar" @channel-selected="handleChannelSelect" />
    <div class="main-content">
      <ChannelPlayer
        v-if="selectedChannel"
        :uuid="selectedChannel.uuid"
        :key="selectedChannel.uuid"
      />
      <div v-else class="no-selection">
        <h2>Select a channel to start watching</h2>
      </div>
    </div>
  </div>
</template>

<script>
import ChannelList from './ChannelList.vue'
import ChannelPlayer from './ChannelPlayer.vue'

export default {
  name: 'Home',
  components: {
    ChannelList,
    ChannelPlayer
  },
  data() {
    return {
      selectedChannel: null
    }
  },
  methods: {
    handleChannelSelect(channel) {
      this.selectedChannel = channel
    }
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  flex: 0 0 300px;
}

.main-content {
  flex: 1;
  background: #1a1a1a;
}

.no-selection {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.no-selection h2 {
  font-weight: normal;
}
</style>
