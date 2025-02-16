import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_TVHEADEND_URL || '',
  auth: {
    username: import.meta.env.VITE_TVHEADEND_USERNAME || '',
    password: import.meta.env.VITE_TVHEADEND_PASSWORD || ''
  }
});

export default {
  async getChannels() {
    const response = await api.get('/api/channel/grid', {
      params: {
        start: 0,
        limit: 999999999,
        sort: 'index',
        dir: 'ASC'
      }
    });
    return response.data.entries;
  },

  async getChannelStream(channelUuid) {
    const response = await api.get(`/play/ticket/stream/channel/${channelUuid}`);
    const lines = response.data.split('\n');
    const streamUrl = lines.find(line => line.startsWith('http'));
    if (!streamUrl) {
      throw new Error('Stream URL not found in M3U content');
    }
    return streamUrl.trim();
  }
};
