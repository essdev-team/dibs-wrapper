import * as ReactDOM from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter as Router } from 'react-router';
import App from '../components/App';
const page = require('../client/page');

export default function renderAppToString(req, context, store) {
  const appString = ReactDOM.renderToString(
    <Provider store={store}>
      <Router context={context} location={req.url}>
        <App />
      </Router>
    </Provider>
  );

  const storeScript = `<script>
    window.ESSDEV = {};
    window.ESSDEV.store = ${ JSON.stringify(store.getState()).replace(
    /</g,
    '\\u003c'
  )};</script>;`;

  return `<div id="main" role="main">${appString}</div>` + storeScript;
}
