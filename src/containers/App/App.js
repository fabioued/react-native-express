import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import { IndexLink } from 'react-router';
// import { LinkContainer } from 'react-router-bootstrap';
// import Navbar from 'react-bootstrap/lib/Navbar';
// import Nav from 'react-bootstrap/lib/Nav';
// import NavItem from 'react-bootstrap/lib/NavItem';
// import Helmet from 'react-helmet';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
// import { InfoBar } from 'components';
import { routeActions } from 'react-router-redux';
// import config from '../../config';
import { asyncConnect } from 'redux-async-connect';
import Sidebar from './Sidebar'
import NavigatorButton from './NavigatorButton'
import { getNextSection, getPreviousSection } from '../../constants/Sections'
import config from '../../config'
import Helmet from 'react-helmet'

const innerStyle = {
  flex: '1 1 auto',
  flexDirection: 'row',
  alignItems: 'stretch',
  display: 'flex',
  minWidth: 0,
  minHeight: 0,
}

const sidebarStyle = {
  flex: '0 0 280px',
  borderRight: '1px solid rgba(220,220,220,0.5)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  minWidth: 0,
  minHeight: 0,
}

const contentStyle = {
  flex: '1 1 auto',
  display: 'flex',
  position: 'relative',
  // Hack to fix flexbox scrolling in FF
  // position: 'absolute',
  // height: '100%',
  minWidth: 0,
  minHeight: 0,
}

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (!isInfoLoaded(getState())) {
      promises.push(dispatch(loadInfo()));
    }
    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }

    return Promise.all(promises);
  }
}])
@connect(
  state => ({user: state.auth.user}),
  {logout, pushState: routeActions.push})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState('/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/');
    }
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const style = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      minWidth: 0,
      minHeight: 0,
    }

    const children = React.Children.map(this.props.children, (child) => {
      const path = this.props.location.pathname
      return React.cloneElement(child, {
        navigatorButton: (
          <NavigatorButton
            nextSection={getNextSection(path)}
            previousSection={getPreviousSection(path)}
          />
        ),
      })
    })

    return (
      <div style={style}>
        <Helmet {...config.app.head}/>
        <div style={innerStyle}>
          <Sidebar style={sidebarStyle} />
          <div style={contentStyle}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}
