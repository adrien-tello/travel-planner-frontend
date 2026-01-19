import Mapbox from '@rnmapbox/maps';

const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

if (MAPBOX_ACCESS_TOKEN) {
  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
  console.log('✓ Mapbox token loaded');
} else {
  console.error('❌ Mapbox access token not found in .env');
}

export default Mapbox;