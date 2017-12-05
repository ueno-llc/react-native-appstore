import graphql from 'react-apollo/graphql';
import gql from 'graphql-tag';
import AppFragment from '../fragments/AppFragment';

export const query = gql`
  query app($id: ID) {
    App(id: $id) {
      ...AppFragment
      seller {
        id
        name
        apps(filter: { id_not: $id }) {
          ...AppFragment
        }
      }
      age
      description
      type
      previews
      categories {
        id
        title
      }
      # Find one good review
      reviews(
        first: 3
        filter: {
          # Contains space, neat little hack for not null
          description_contains: " ",
        }
      ) {
        id
        title
        description
        createdAt
        rating
        name
      }
    }
  }
  ${AppFragment}
`;

export const appWithProps = graphql(query, {
  options: props => ({
    variables: {
      id: props.app.id,
    },
  }),
  // Attempt to re-use passed props while loading
  props: ({ ownProps, data }) => ({
    data: {
      ...data,
      App: {
        ...ownProps.app,
        ...data.App,
      },
    },
  }),
});
