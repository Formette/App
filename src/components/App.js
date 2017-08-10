import React, { Component } from 'react';
//Components
import {Navbar, Footer} from './organisms/index';
//Utilities
import {_getUsername} from '../services/utilities';
//Styles
import styled from 'styled-components';

class App extends Component {
  render() {
    return (
      <div className={this.props.className}>
        <Navbar brand="Formette β grande cena" username={_getUsername() || "username"}/>
            <div className="container content">
                {this.props.children}
            </div>
        <Footer/>
      </div>
    );
  }
}

const AppWithStyles = styled(App)`
    .content{
         background: red;   
         min-height: calc(88vh - 70px);
    }
`;

export default AppWithStyles;