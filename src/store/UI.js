import { Animated } from 'react-native';

export default class UI {

  // Current opacity of header custom view
  appScreenHeaderOpacity = new Animated.Value(0);

  // Last known visbility state of custom view
  appScreenHeaderVisible = false;

}
