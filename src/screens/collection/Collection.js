import React, { Component } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { pushAppScreen } from 'screens';
import AppItemRowLarge from 'components/app-item-row-large';
import collectionFromProps from 'graphql/queries/collection';
import { autobind } from 'core-decorators';

/**
 * Collection shows a single list of apps from multiple sources.
 * @property collectionId
 * @property relatedAppId
 * @property ...
 */
@collectionFromProps
export default class Collection extends Component {

  static propTypes = {
    navigator: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    backTitle: PropTypes.string,
  }

  static defaultProps = {
    backTitle: 'Back',
  }

  static navigatorStyle = {
    navBarNoBorder: true,
    drawUnderTabBar: true,
    prefersLargeTitles: false,
    navBarBackgroundColor: 'white',
  }

  @autobind
  onPress(props) {
    const { navigator, backTitle } = this.props;
    pushAppScreen({
      navigator,
      backTitle,
      app: props,
    });
  }

  @autobind
  onPressIn(props, previewView) {
    const { navigator, backTitle } = this.props;
    pushAppScreen({
      navigator,
      backTitle,
      app: props,
      previewView,
    });
  }


  @autobind
  keyExtractor(item) {
    return item.id;
  }

  @autobind
  renderItem({ item }) {
    return (
      <AppItemRowLarge
        {...item}
        key={item.id}
        id={item.id}
        imageUrl={item.iconUrl}
        action={{
          label: item.price ? `$${item.price}` : 'GET',
          subtitle: item.hasInAppPurchases ? 'In-App Purchases' : undefined,
        }}
        onPress={this.onPress}
        onPressIn={this.onPressIn}
      />
    );
  }

  render() {
    const { apps } = this.props.data;
    return (
      <FlatList
        style={styles.host}
        data={apps || []}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
      />
    );
  }
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    padding: 20,
  },
});
