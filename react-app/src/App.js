import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Home from 'containers/Home/Home';
import { Root } from 'App.styled';
import Navbar from 'components/Navbar/Navbar';
import Typography from 'components/Typography/Typography';

function App() {
  return (
    <Router>
      <Root>
        <Navbar>
          <Typography cursive variant="h2">
            GovTech
          </Typography>
          <ul>
            <li>{/* <button>Upload</button> */}</li>
          </ul>
        </Navbar>
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
