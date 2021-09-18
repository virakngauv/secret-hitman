import './App.css';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route, useParams } from 'react-router-dom';
import AppFooter from './components/AppFooter';
import RulesScreen from './components/RulesScreen';
import CreateGameScreen from './components/CreateGameScreen';
import JoinGameScreen from './components/JoinGameScreen';
import LobbyScreen from './components/LobbyScreen';
import EndScreen from './components/EndScreen';
import ScrollToTop from './components/ScrollToTop';

function App() {

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Switch>
          <Route path="/new">
            <CreateGameScreen />
          </Route>
          <Route path="/join">
            <JoinGameScreen />
          </Route>
          <Route path="/rules">
            <RulesScreen />
          </Route>
          <Route path="/temp-mid-game">
            <GameScreen />
          </Route>
          <Route path="/temp-end-game">
            <EndScreen />
          </Route>
          <Route path="/:roomCode">
            <LobbyScreen />
          </Route>
          <Route path="/">
            <WelcomeScreen />
          </Route>
        </Switch>
      </BrowserRouter>
      <AppFooter />
    </>
  );
}

export default App;
