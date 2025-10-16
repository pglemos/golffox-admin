/// <reference types="google.maps" />

declare global {
  interface Window {
    google: typeof google;
    googleMapsApiLoaded: boolean | 'loading' | 'error';
    markerClustererApiLoaded: boolean;
    // Adicionados para compatibilidade com GoogleMapsLoader
    gm_authFailure?: () => void;
    initMap?: () => void;
  }
}

export {};