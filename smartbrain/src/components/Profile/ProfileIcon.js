import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { onRouteChange } from '../Navigation/Navigation';

import './ProfileIcon.css'

class ProfileIcon extends React.Component {
  constructor(props) {
    super(props);
    // this.toggle = this.toggle.bind(this) :the this keyword is used to get bind to the component.
    this.state = {
      dropdownOpen: false
    };
  };

  toggle = () => { // arrow function implicitly binds the compononet or state.
    this.setState(prevState => ({
    dropdownOpen: !prevState.dropdownOpen
    }));
  };

  render() {
    return (
      <div className="pa4 tc">
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle
            tag="span"
            data-toggle="dropdown"
            aria-expanded={this.state.dropdownOpen}
          >      
            <img
              src="http://tachyons.io/img/logo.jpg"
              className="br-100 ba h3 w3 dib" alt="avatar" 
            />
          </DropdownToggle>
          <DropdownMenu
            right
            className="b--transparent shadwo-5" 
            style={{backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
              <DropdownItem>Profile</DropdownItem>
              <DropdownItem onClick={ () => this.props.onRouteChange('signout')}>Sign Out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    )
  }
};

export default ProfileIcon