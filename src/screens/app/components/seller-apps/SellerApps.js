import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Heading from 'components/heading';
import AppItemSlider from 'components/app-item-slider';
import AppItemRow from 'components/app-item-row';
import { autobind } from 'core-decorators';

export default class SellerApps extends PureComponent {

  static propTypes = {
    seller: PropTypes.object,
    onAppPress: PropTypes.func,
    onAppPressIn: PropTypes.func,
    onSeeAllPress: PropTypes.func,
  }

  static defaultProps = {
    seller: undefined,
    onAppPress: undefined,
    onAppPressIn: undefined,
    onSeeAllPress: undefined,
  }

  @autobind
  onSeeAllPress() {
    this.props.onSeeAllPress({
      seller: this.props.seller,
    });
  }
  /**
   * Render app item in
   * @param {object} item
   */
  @autobind
  renderAppItem(item, index, arr) {
    const {
      id,
      iconUrl,
      price,
      hasInAppPurchases,
    } = item;

    return (
      <AppItemRow
        {...item}
        key={id}
        id={id}
        imageUrl={iconUrl}
        action={{
          label: price ? `$${price}` : 'GET',
          subtitle: hasInAppPurchases ? 'In-App Purchases' : undefined,
          white: true,
        }}
        divider={arr.length > 1 && index % 2 === 0}
        onPress={this.props.onAppPress}
        onPressIn={this.props.onAppPressIn}
      />
    );
  }

  render() {
    const {
      apps = [],
      name = 'seller',
    } = this.props.seller || {};

    if (apps.length === 0) {
      return null;
    }

    return (
      <View>
        <Heading action="See All" onActionPress={this.onSeeAllPress}>More by {name}</Heading>
        <AppItemSlider itemsPerPage={2}>
          {apps.map(this.renderAppItem)}
        </AppItemSlider>
      </View>
    );
  }
}
