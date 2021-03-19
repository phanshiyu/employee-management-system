import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';

import Home from 'containers/Home/Home';
import { Root } from 'App.styled';

function App() {
  return (
    <Router>
      <Root>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Root>
    </Router>
  );
}

export default App;
