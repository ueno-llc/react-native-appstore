import React, { Component } from 'react';
import { StyleSheet, Animated, View, Text } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { autobind } from 'core-decorators';
import { COLLECTIONS_SCREEN, COLLECTION_SCREEN, REVIEWS_SCREEN, VERSIONS_SCREEN, pushAppScreen } from 'screens';
import PropTypes from 'prop-types';
import Heading from 'components/heading';
import Divider from 'components/divider';
import InfoRow from 'components/info-row';
import { appWithProps } from 'graphql/queries/app';
import get from 'lodash/get';
import Header from './components/header';
import StatsRow from './components/stats-row';
import Screenshots from './components/screenshots';
import ReviewsOverview from './components/reviews-overview';
import VersionOverview from './components/version-overview';
import RelatedApps from './components/related-apps';
import SellerApps from './components/seller-apps';
import Description from './components/description';

const formatReviewsCount = (count) => {
  if (count > 1000) {
    return `${(count / 1000).toFixed(2)}K`;
  }
  return count;
};

/**
 * App detail screen
 * Can be showed with initial data that will be used to render some parts of the screen while
 * data needed further down the screen is being loaded.
 */
@appWithProps
@inject('ui')
@observer
export default class App extends Component {

  static propTypes = {
    navigator: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
  }

  static navigatorStyle = {
    prefersLargeTitles: false,
    // Make sure those are set from the previous screen
  }

  static navigatorButtons = {
    // Make sure those are set from the previous screen
  }

  constructor(props) {
    super(props);
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    this.opacity = this.props.ui.appScreenHeaderOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });
  }

  @autobind
  onNavigatorEvent(e) {
    const { id, type } = e;
    if (type === 'ScreenChangedEvent') {
      if (id === 'didDisappear') {
        // Save the state of header visibility
        this.props.ui.appScreenHeaderVisible = !!this.props.ui.appScreenHeaderOpacity._value; // eslint-disable-line
        this.props.ui.appScreenHeaderOpacity.setValue(0);
      }
    }
  }

  @autobind
  onScroll(e) {
    const isHeaderVisible = e.nativeEvent.contentOffset.y < 110;
    if (isHeaderVisible !== this.isHeaderVisible) {
      Animated.spring(this.props.ui.appScreenHeaderOpacity, {
        toValue: Number(!isHeaderVisible),
        bounciness: 0,
      }).start();
      this.isHeaderVisible = isHeaderVisible;
    }
  }

  @autobind
  onReviewsPress() {
    this.props.navigator.push({
      screen: REVIEWS_SCREEN,
      title: 'Ratings & Reviews',
      passProps: {
        appId: this.props.id,
      },
    });
  }

  @autobind
  onReviewPress({ id }) {
    this.props.navigator.push({
      screen: REVIEWS_SCREEN,
      title: 'Ratings & Reviews',
      passProps: {
        reviewId: id,
      },
    });
  }

  @autobind
  onVersionsPress() {
    this.props.navigator.push({
      screen: VERSIONS_SCREEN,
      passProps: {
        appId: this.props.id,
      },
    });
  }

  @autobind
  onAppPress(props) {
    const { navigator } = this.props;
    pushAppScreen({
      navigator,
      backTitle: 'Back',
      app: props,
    });
  }

  @autobind
  onAppPressIn(props, previewView) {
    const { navigator } = this.props;
    pushAppScreen({
      navigator,
      backTitle: 'Back',
      app: props,
      previewView,
    });
  }

  @autobind
  onSellerSeeAllPress() {
    const seller = get(this.props.data, 'App.seller');
    this.props.navigator.push({
      screen: COLLECTIONS_SCREEN,
      title: seller.name,
      passProps: {
        apps: seller.apps,
      },
    });
  }

  @autobind
  onRelatedSeeAllPress({ apps }) {
    // Get seller info
    this.props.navigator.push({
      screen: COLLECTION_SCREEN,
      title: 'Related Apps',
      passProps: {
        type: 'RELATED_APPS',
        relatedAppId: this.props.id,
        apps, // Cached list of apps
      },
    });
  }

  /**
   * Render partial details of the app, we already pass props needed for this method.
   * @param {object} app App object
   */
  @autobind
  renderPartial(app) {
    const action = {
      label: app.price ? `$${app.price}` : 'GET',
      onPress: () => this.props.navigator.pop(),
    };

    return (
      <View>
        <Animated.View style={{ opacity: this.opacity }}>
          <Header
            iconUrl={app.iconUrl}
            title={app.title}
            subtitle={app.subtitle}
            action={action}
          />
        </Animated.View>

        <StatsRow>
          <StatsRow.Item
            title={get(app, 'rating', 0).toFixed(1)}
            value={`${formatReviewsCount(get(app, 'ratingsCount.count'))} Ratings`}
          />
          <StatsRow.Item title={`${app.age}+`} value="Age" />
        </StatsRow>
      </View>
    );
  }

  render() {
    const { navigator, data } = this.props;
    const {
      App: app,
      loading,
      error,
    } = data;

    if (app && (loading || error)) {
      return (
        <View style={styles.host}>
          {this.renderPartial(app)}
        </View>
      );
    }

    const type = get(app, 'type', 'APP') === 'APP' ? 'Apps' : 'Games';
    const version = get(app, 'versions.0');

    return (
      <Animated.ScrollView
        style={styles.host}
        scrollEventThrottle={16}
        onScroll={this.onScroll}
      >
        {this.renderPartial(app)}

        <Screenshots
          navigator={navigator}
          data={[{
            title: 'iPhone',
            screenshots: get(app, 'previews'),
          }]}
        />

        <Description
          seller={get(app, 'seller')}
          onDeveloperPress={this.onSellerSeeAllPress}
        >
          {get(app, 'description')}
        </Description>

        <ReviewsOverview
          title="Ratings & Reviews"
          reviews={get(app, 'reviews')}
          rating={get(app, 'rating')}
          votes={get(app, 'ratingsCount.count')}
          onActionPress={this.onReviewsPress}
          onReviewPress={this.onReviewPress}
        />

        <VersionOverview
          version={get(version, 'version')}
          date={get(version, 'date')}
          description={get(version, 'changelog')}
          onActionPress={this.onVersionsPress}
        />

        <View>
          <Heading>Information</Heading>
          <InfoRow label="Seller" value={get(app, 'seller.name')} />
          <InfoRow label="Category" value={`${type}: ${get(app, 'categories.0.title')}`} />
          <InfoRow label="Compatibility" value="Works on this iPhone and some other stuff I dont know about yet" />
          <InfoRow label="Languages" value="English" />
          <InfoRow label="Age Rating" value={`${get(app, 'age')}+`} />
          <InfoRow label="In-App Purchases" value={get(app, 'hasInAppPurchases') ? 'Yes' : 'No'}>
            <InfoRow.Item label="No ads" value="$0.99" />
            <InfoRow.Item label="300 Diamonds" value="$0.99" />
            <InfoRow.Item label="All levels" value="$1.99" />
          </InfoRow>
          <InfoRow link label="Developer Website" onPress={() => {}} />
          <InfoRow link label="Privacy Policy" onPress={() => {}} divider={false} />
        </View>

        <View style={styles.bottom}>
          <SellerApps
            seller={get(app, 'seller')}
            onAppPress={this.onAppPress}
            onAppPressIn={this.onAppPressIn}
            onSeeAllPress={this.onSellerSeeAllPress}
          />
          <RelatedApps
            id={app.id}
            type={app.type}
            categories={app.categories.map(c => c.id)}
            onAppPress={this.onAppPress}
            onAppPressIn={this.onAppPressIn}
            onSeeAllPress={this.onRelatedSeeAllPress}
          />
          <Divider />
          <View style={styles.copyright}>
            <Text style={styles.copyright__text}>© {get(app, 'seller.name')}</Text>
          </View>
        </View>
      </Animated.ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    padding: 18,
  },

  copyright: {
    paddingTop: 13,
  },

  copyright__text: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    color: '#8A8A8F',
    letterSpacing: -0.08,
  },

  bottom: {
    backgroundColor: '#F0F0F8',
    margin: -20,
    padding: 20,
    paddingBottom: 240,
    marginBottom: -200,
    marginTop: 20,
  },
});
