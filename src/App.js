import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import LogIn from './component/LogIn';
import UserInterface from'./component/UserInterface';

class App extends React.Component {
   render() {
      return (
         <BrowserRouter>
            <Switch>
               <Route path="/" component={LogIn} exact/>
               <Route path="/userinterface/:user" component={UserInterface}/>
            </Switch>
         </BrowserRouter>
      )
   }
}

export default App;
