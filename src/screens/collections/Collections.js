import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import collectionsWithProps from 'graphql/queries/collections';
import sellerWithProps from 'graphql/queries/seller';
import Collection from './components/collection';
import sellerCollectionsHoc from './utils/sellerCollectionsHoc';

@collectionsWithProps
export default class Collections extends Component {

  static propTypes = {
    navigator: PropTypes.object,
    data: PropTypes.object,
    type: PropTypes.string,
    backTitle: PropTypes.string,
    apps: PropTypes.array,
  }

  static defaultProps = {
    navigator: undefined,
    data: undefined,
    type: undefined,
    backTitle: undefined,
    apps: undefined,
  }

  static navigatorStyle = {
    navBarNoBorder: true,
    drawUnderTabBar: true,
    prefersLargeTitles: true,
    navBarBackgroundColor: 'white',
  }

  get collections() {
    const { apps, data = {} } = this.props;
    const { allCollections = [] } = data;
    if (apps) {
      return [{
        id: 'Seller.New',
        appType: 'APP',
        type: 'SELLER',
        rows: 1,
        title: 'Latest Release',
        apps: apps.slice(0, 1),
      }, {
        id: 'Seller.Apps',
        appType: 'APP',
        type: 'SELLER',
        rows: 3,
        title: 'Apps',
        apps: apps.slice(1),
      }];
    }

    return allCollections;
  }

  keyExtractor(item) {
    return item.key;
  }


  @autobind
  renderItem({ item }) {
    return item;
  }

  render() {
    const { type, navigator } = this.props;
    const { error } = this.props.data || {};

    const backTitle = this.props.backTitle || (type === 'APP' ? 'Apps' : 'Games');

    if (error) {
      console.log('Error while fetching data %o', error);
    }

    return (
      <FlatList
        style={styles.host}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        data={[
          ...this.collections.map(collection => (
            <Collection
              showAction
              key={collection.id}
              type={type}
              navigator={navigator}
              collection={collection}
              backTitle={backTitle}
            />
          )),
          <View key="gutter" style={styles.gutter} />,
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    padding: 18,
    paddingTop: 0,
  },

  gutter: {
    height: 40,
    backgroundColor: 'white',
    marginTop: -2,
  },
});

export const SellerCollectionsScreen = sellerWithProps(sellerCollectionsHoc(Collections));
export default collectionsWithProps(Collections);
