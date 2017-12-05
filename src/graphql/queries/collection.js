import React, { Component } from 'react';
import PropTypes from 'prop-types';
import graphql from 'react-apollo/graphql';
import gql from 'graphql-tag';
import hoistNonReactStatic from 'hoist-non-react-statics';
import AppFragment from '../fragments/AppFragment';

export const query = gql`
  query collection($id: ID!) {
    Collection(id: $id) {
      id
      title
      appType
      type
      position
      rows
      apps {
        ...AppFragment
      }
    }
  }
  ${AppFragment}
`;

const collectionWithProps = graphql(query, {
  options: props => ({
    variables: {
      id: props.collectionId,
    },
  }),
  // Attempt to re-use passed props while loading
  props: ({ ownProps, data }) => ({
    data: {
      apps: (data.Collection && data.Collection.apps) || ownProps.apps,
    },
  }),
});

// Nice little query switcher
export default ComposedComponent => hoistNonReactStatic(class extends Component {

  static propTypes = {
    collectionId: PropTypes.string,
    relatedAppId: PropTypes.string,
    apps: PropTypes.array,
  }

  static defaultProps = {
    collectionId: undefined,
    relatedAppId: undefined,
    apps: [],
  }

  render() {
    const { collectionId, relatedAppId } = this.props;
    let passProps = this.props;
    let Composed = ComposedComponent;

    if (collectionId) {
      Composed = collectionWithProps(ComposedComponent);
    }

    if (relatedAppId) {
      // TODO: Add composed query component
      passProps = {
        data: {
          apps: this.props.apps,
        },
      };
    }

    return <Composed {...passProps} />;
  }
}, ComposedComponent);
