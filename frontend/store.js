// store.js
import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {

  state: () => ({
    lang: 'en',
    loadingStatus: {
      ipcheck: false,
      connectivity: false,
      webrtc: false,
      dnsleaktest: false,
      speedtest: false,
      advancedtools: false,
    },
    isDarkMode: false,
    isMobile: false,
    shouldRefreshEveryThing: false,
    Global_ipDataCards: [],
    configs: {},
    userPreferences: {},
    alert: {
      alertToShow: false,
      alertStyle: "",
      alertMessage: "",
      alertTitle: "",
    },
    ipDBs: [
      { id: 0, text: 'IPCheck.ing', url: '/api/ipchecking?ip={{ip}}&lang={{lang}}', enabled: true },
      { id: 1, text: 'IPinfo.io', url: '/api/ipinfo?ip={{ip}}', enabled: true },
      { id: 2, text: 'IP-API.com', url: '/api/ipapicom?ip={{ip}}&lang={{lang}}', enabled: true },
      { id: 3, text: 'IPAPI.co', url: 'https://ipapi.co/{{ip}}/json/', enabled: true },
      { id: 4, text: 'KeyCDN', url: '/api/keycdn?ip={{ip}}', enabled: true },
      { id: 5, text: 'IP.SB', url: '/api/ipsb?ip={{ip}}', enabled: true },
      { id: 6, text: 'IPAPI.is', url: '/api/ipapiis?ip={{ip}}', enabled: true },
    ],
  }),

  getters: {
    activeSources: (state) => state.ipDBs.filter(db => db.enabled),
  },

  actions: {
    getDbUrl(id, ip, lang) {
      const db = this.ipDBs.find(d => d.id === id);
      if (!db) return null;
      return db.url.replace('{{ip}}', ip).replace('{{lang}}', lang || 'en');
    },
    setLoadingStatus(key, value) {
      this.loadingStatus[key] = value;
    },
    setAlert(alertToShow, alertStyle, alertMessage, alertTitle) {
      this.alert = { alertToShow, alertStyle, alertMessage, alertTitle };
    },
    updateGlobalIpDataCards(payload) {
      const uniqueIPs = new Set([...this.Global_ipDataCards, ...payload]);
      this.Global_ipDataCards = Array.from(uniqueIPs);
    },
    setIsMobile(payload) {
      this.isMobile = payload;
    },
    setRefreshEveryThing(payload) {
      this.shouldRefreshEveryThing = payload;
    },
    setDarkMode(value) {
      this.isDarkMode = value;
    },
    updateIPDBs({ id, enabled }) {
      const index = this.ipDBs.findIndex(db => db.id === id);
      if (index !== -1) {
        this.ipDBs[index].enabled = enabled;
      }
    },
    setPreferences(userPreferences) {
      this.userPreferences = userPreferences;
      localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    },
    updatePreference(key, value) {
      this.userPreferences[key] = value;
      localStorage.setItem('userPreferences', JSON.stringify(this.userPreferences));
    },
    loadPreferences() {
      const defaultPreferences = {
        theme: 'auto', // auto, light, dark
        connectivityAutoRefresh: false,
        showMap: false,
        simpleMode: false,
        autoStart: true,
        hideUnavailableIPStack: false,
        popupConnectivityNotifications: true,
        ipCardsToShow: 6,
        ipGeoSource: 0,
      };
      const storedPreferences = localStorage.getItem('userPreferences');
      let preferencesToStore;

      if (storedPreferences) {
        const currentPreferences = JSON.parse(storedPreferences);
        preferencesToStore = { ...defaultPreferences, ...currentPreferences };
      } else {
        preferencesToStore = defaultPreferences;
      }

      localStorage.setItem('userPreferences', JSON.stringify(preferencesToStore));
      this.setPreferences(preferencesToStore);
    },
    fetchConfigs() {
      fetch('/api/configs')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.configs = data;
        })
        .catch(error => console.error('Fetching configs failed: ', error));
    },
  }
});