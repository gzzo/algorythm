import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import { Helmet } from 'react-helmet'
import { ConnectedRouter } from 'connected-react-router'

import { HomePage } from 'pages/home'

import 'sanitize.css'
import './app.scss'

class App extends React.Component {
  render() {
    return (
      <ConnectedRouter history={this.props.history}>
        <div>
          <Helmet>
            <title>Hello</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link
              href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900&display=swap"
              rel="stylesheet"
            />
          </Helmet>
          <Switch>
            <Route path="/" component={HomePage} />
          </Switch>
        </div>
      </ConnectedRouter>
    )
  }
}

export default hot(App)
