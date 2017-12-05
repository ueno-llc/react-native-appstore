import graphql from 'react-apollo/graphql';
import gql from 'graphql-tag';
import AppFragment from '../fragments/AppFragment';

export const query = gql`
  query collections($appType: AppType) {
    allCollections(
      filter: {
        appType: $appType
      }
      orderBy: position_ASC
    ) {
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

export default graphql(query, {
  options: props => ({
    variables: {
      appType: props.type,
    },
  }),
  skip: ownProps => ownProps.apps,
});
