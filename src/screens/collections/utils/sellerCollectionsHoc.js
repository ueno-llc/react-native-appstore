import { mapProps } from 'recompose';
import get from 'lodash/get';

const mapper = (props) => {
  const apps = get(props, 'data.Seller.apps');

  if (!apps) {
    return props;
  }

  const latestApp = apps
    .reduce((a, b) => (new Date(get(a, 'versions[0].date')) > new Date(get(b, 'versions[0].date')) ? a : b));
  const latestRelease = {
    id: 'latest-releases',
    apps: [latestApp],
    type: 'SMALL_TITLE',
    rows: 1,
    title: 'Latest Release',
  };
  const appsAndGames = {
    id: 'apps-and-games',
    apps,
    type: 'SMALL_TITLE',
    rows: 3,
    title: 'Apps & Games',
  };

  return {
    ...props,
    data: {
      ...props.data,
      allCollections: [latestRelease, appsAndGames],
    },
    title: get(props, 'data.Seller.name'),
  };
};

export default mapProps(mapper);
