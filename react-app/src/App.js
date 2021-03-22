import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { Root } from 'App.styled';
import Navbar from 'components/Navbar/Navbar';
import Typography from 'components/Typography/Typography';

// Pages
import Home from 'containers/Home/Home';
import Upload from 'containers/Upload/Upload';

function App() {
  return (
    <Router>
      <Root>
        <Navbar>
          <Link to="/">
            <Typography cursive variant="h2">
              GovTech
            </Typography>
          </Link>
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/upload">Upload</Link>
            </li>
          </ul>
        </Navbar>
        <Switch>
          <Route path="/upload">
            <Upload />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Root>
    </Router>
  );
}

export default App;
