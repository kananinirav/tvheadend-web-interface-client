<template>
  <div class="player">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="video-container">
      <video
        ref="videoPlayer"
        class="video-js vjs-default-skin vjs-big-play-centered vjs-theme-custom"
        controls
        preload="auto"
        width="100%"
        height="100%"
      >
        <source :src="streamUrl" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import tvheadendApi from '../services/tvheadendApi'

export default {
  name: 'ChannelPlayer',
  data() {
    return {
      streamUrl: '',
      player: null,
      loading: true,
      error: null
    }
  },
  props: {
    uuid: {
      type: String,
      required: true
    }
  },
  watch: {
    uuid: {
      immediate: true,
      handler(newUuid) {
        if (newUuid) {
          this.loadStream(newUuid)
        }
      }
    }
  },
  methods: {
    async loadStream(uuid) {
      try {
        this.loading = true
        this.error = null
        this.streamUrl = await tvheadendApi.getChannelStream(uuid) + '&profile=webtv-h264-vorbis-mp4'
        this.$nextTick(() => {
          this.initializePlayer()
        })
      } catch (error) {
        this.error = 'Error loading stream: ' + error.message
        console.error('Error fetching stream URL:', error)
      } finally {
        this.loading = false
      }
    },
    initializePlayer() {
      if (this.player) {
        this.player.dispose()
      }

      this.player = videojs(this.$refs.videoPlayer, {
        fluid: true,
        aspectRatio: '16:9',
        responsive: true,
        controls: true,
        autoplay: true,
        playbackRates: [0.5, 1, 1.5, 2],
        controlBar: {
          children: [
            'playToggle',
            'volumePanel',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'progressControl',
            'liveDisplay',
            'remainingTimeDisplay',
            'customControlSpacer',
            'playbackRateMenuButton',
            'pictureInPictureToggle',
            'fullscreenToggle',
            'aspectRatio'
          ]
        }
      })

      // Add error handling
      this.player.on('error', () => {
        this.error = 'Video playback error occurred'
      })
    }
  },
  beforeUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>

<style scoped>
.player {
  padding: 0;
  width: 100%;
  min-height: 100vh;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
}

.channel-title {
  color: #ffffff;
  font-size: 1.8em;
  margin: 20px;
  padding: 0;
}

.video-container {
  flex: 1;
  position: relative;
  width: 100%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Make video.js responsive and fullscreen */
:deep(.video-js) {
  width: 100% !important;
  height: calc(100vh - 100px) !important; /* Subtract header height */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

:deep(.vjs-tech) {
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
}

/* Custom video.js theme */
:deep(.video-js.vjs-theme-custom) {
  --vjs-theme-primary: #42b883;
}

:deep(.video-js .vjs-control-bar) {
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  height: 4em;
}

:deep(.video-js:hover .vjs-control-bar) {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.2s ease;
}

:deep(.video-js .vjs-big-play-button) {
  background-color: rgba(66, 184, 131, 0.8);
  border: none;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  line-height: 80px;
  transform: scale(1);
  transition: transform 0.2s ease;
}

:deep(.video-js .vjs-big-play-button:hover) {
  background-color: rgba(66, 184, 131, 1);
  transform: scale(1.1);
}

:deep(.video-js .vjs-progress-holder) {
  height: 0.5em;
}

:deep(.video-js .vjs-play-progress) {
  background-color: var(--vjs-theme-primary);
}

:deep(.video-js .vjs-volume-panel) {
  margin-right: 10px;
}

:deep(.video-js .vjs-time-control) {
  padding: 0 10px;
}

@media (max-width: 768px) {
  .channel-title {
    font-size: 1.4em;
    margin: 10px;
  }

  :deep(.video-js) {
    height: calc(100vh - 70px) !important; /* Adjust for smaller header on mobile */
  }
}

/* Optional: Add a fullscreen button style */
:deep(.vjs-fullscreen-control) {
  margin-right: 10px;
}

/* Improve fullscreen mode */
:deep(.video-js.vjs-fullscreen) {
  height: 100% !important;
}

/* Custom control bar styling */
:deep(.vjs-control-bar) {
  background-color: rgba(0, 0, 0, 0.7);
}

:deep(.vjs-button) {
  color: #fff;
}

:deep(.vjs-play-progress) {
  background-color: #42b983;
}

:deep(.vjs-volume-level) {
  background-color: #42b983;
}

/* Loading and error states */
.loading,
.error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 1.2em;
  text-align: center;
}

.error {
  color: #ff5252;
}
</style>
