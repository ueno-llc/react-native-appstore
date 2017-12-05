import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { autobind } from 'core-decorators';
import get from 'lodash/get';
import Heading from 'components/heading';
import AppItemSlider from 'components/app-item-slider';
import AppItemRow from 'components/app-item-row';
import relatedApps from 'graphql/queries/relatedApps';

@relatedApps
export default class RelatedApps extends PureComponent {

  static propTypes = {
    data: PropTypes.object.isRequired,
    onAppPress: PropTypes.func,
    onAppPressIn: PropTypes.func,
    onSeeAllPress: PropTypes.func,
  }

  static defaultProps = {
    onAppPress: undefined,
    onAppPressIn: undefined,
    onSeeAllPress: undefined,
  }

  @autobind
  onSeeAllPress() {
    this.props.onSeeAllPress({
      apps: get(this.props.data, 'allApps'),
    });
  }

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
      loading,
      allApps: related,
    } = this.props.data;

    if (loading || (related && related.length === 0)) {
      return null;
    }

    return (
      <View>
        <Heading action="See All" onActionPress={this.onSeeAllPress}>
          You may also like
        </Heading>
        <AppItemSlider itemsPerPage={2}>
          {related.map(this.renderAppItem)}
        </AppItemSlider>
      </View>
    );
  }
}
