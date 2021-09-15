import './App.css';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route, useParams } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/create-game">
          create-game
        </Route>
        <Route path="/join-game">
          join-game
        </Route>
        <Route path="/rules">
          rules
        </Route>
        <Route path="/:roomCode">
          <GameScreen />
        </Route>
        <Route path="/">
          <WelcomeScreen />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
