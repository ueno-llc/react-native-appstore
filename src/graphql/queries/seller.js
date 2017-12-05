import graphql from 'react-apollo/graphql';
import gql from 'graphql-tag';
import AppFragment from '../fragments/AppFragment';

const query = gql`
  query getSeller($id: ID!) {
    Seller(id: $id) {
      id
      name
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
      id: props.id,
    },
  }),
});
