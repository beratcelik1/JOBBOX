// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        {/* Add other routes as you develop the other pages */}
      </Switch>
    </Router>
  );
}

export default App;
