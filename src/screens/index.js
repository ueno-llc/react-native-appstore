import { Navigation } from 'react-native-navigation';
import { toJS } from 'mobx';
import SplashScreen from './splash';
import TodayScreen from './today';
import CollectionsScreen, {
  SellerCollectionsScreen,
} from './collections';
import CollectionScreen from './collection';
import AppScreen from './app';
import AppToolbar from './app/components/toolbar';
import AppButton from './app/components/button';
import ScreenshotScreen from './screenshot';
import ReviewsScreen from './reviews';
import VersionsScreen from './versions';
import UpdatesScreen from './updates';
import SearchScreen from './search';

// Set screen constants
export const Screens = new Map();
export const SPLASH_SCREEN = 'appStoreClone.SplashScreen';
export const TODAY_SCREEN = 'appStoreClone.TodayScreen';
export const COLLECTIONS_SCREEN = 'appStoreClone.CollectionsScreen';
export const SELLER_COLLECTIONS_SCREEN = 'appStoreClone.SellerCollectionsScreen';
export const COLLECTION_SCREEN = 'appStoreClone.CollectionScreen';
export const APP_SCREEN = 'appStoreClone.AppScreen';
export const APP_TOOLBAR = 'appStoreClone.AppToolbar';
export const APP_BUTTON = 'appStoreClone.AppButton';
export const SCREENSHOT_SCREEN = 'appStoreClone.ScreenshotScreen';
export const REVIEWS_SCREEN = 'appStoreClone.ReviewsScreen';
export const VERSIONS_SCREEN = 'appStoreClone.VersionsScreen';
export const UPDATES_SCREEN = 'appStoreClone.UpdatesScreen';
export const SEARCH_SCREEN = 'appStoreClone.SearchScreen';

// Resolve screen constants to imported class
Screens.set(SPLASH_SCREEN, () => SplashScreen);
Screens.set(TODAY_SCREEN, () => TodayScreen);
Screens.set(COLLECTIONS_SCREEN, () => CollectionsScreen);
Screens.set(SELLER_COLLECTIONS_SCREEN, () => SellerCollectionsScreen);
Screens.set(COLLECTION_SCREEN, () => CollectionScreen);
Screens.set(APP_SCREEN, () => AppScreen);
Screens.set(APP_TOOLBAR, () => AppToolbar);
Screens.set(APP_BUTTON, () => AppButton);
Screens.set(SCREENSHOT_SCREEN, () => ScreenshotScreen);
Screens.set(REVIEWS_SCREEN, () => ReviewsScreen);
Screens.set(VERSIONS_SCREEN, () => VersionsScreen);
Screens.set(UPDATES_SCREEN, () => UpdatesScreen);
Screens.set(SEARCH_SCREEN, () => SearchScreen);

export const startApp = () => {
  Navigation.startTabBasedApp({
    tabs: [{
      label: 'Today',
      screen: TODAY_SCREEN,
      icon: require('images/TodayIcon.png'),
    }, {
      label: 'Games',
      title: 'Games',
      screen: COLLECTIONS_SCREEN,
      icon: require('images/GamesIcon.png'),
      passProps: {
        type: 'GAME',
        title: 'Games',
      },
    }, {
      label: 'Apps',
      title: 'Apps',
      screen: COLLECTIONS_SCREEN,
      icon: require('images/AppsIcon.png'),
      passProps: {
        type: 'APP',
        title: 'Apps',
      },
    }, {
      label: 'Updates',
      title: 'Updates',
      screen: UPDATES_SCREEN,
      icon: require('images/UpdatesIcon.png'),
    }, {
      label: 'Search',
      title: 'Search',
      screen: SEARCH_SCREEN,
      icon: require('images/SearchIcon.png'),
    }],
    tabsStyle: {
      initialTabIndex: 0,
      tabBarTranslucent: true,
    },
  });
};

// Push app screen (helper function)
export const pushAppScreen = ({
  navigator,
  app,
  backTitle,
  previewView,
}) => navigator.push({
  screen: APP_SCREEN,
  backButtonTitle: backTitle,
  backButtonHidden: false,
  navigatorStyle: {
    navBarCustomView: APP_TOOLBAR,
    navBarComponentAlignment: 'fill',
    navBarCustomViewInitialProps: {
      iconUrl: app.iconUrl,
    },
  },
  previewView,
  passProps: {
    id: app.id,
    app: toJS(app),
  },
  navigatorButtons: {
    rightButtons: [{
      id: 'action',
      component: APP_BUTTON,
      passProps: app.action,
    }],
  },
});
