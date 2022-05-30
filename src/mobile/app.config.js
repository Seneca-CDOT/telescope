import * as dotenv from 'dotenv';

dotenv.config({ path: './.env.development' });

export default {
  expo: {
    name: 'Telescope',
    slug: 'Telescope',
    description: 'Telescope mobile app',
    version: '0.0.1',
    orientation: 'portrait',
    icon: './src/assets/icon.png',
    splash: {
      image: './src/assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#121d59',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
    },
    web: {
      favicon: './src/assets/favicon.png',
    },
    entryPoint: './src/App.jsx',
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.ANON_KEY,
      postsUrl: process.env.POSTS_URL,
      imageServiceUrl: process.env.IMAGE_URL,
    },
  },
};
