import './App.css'
import React, { Component } from 'react'
import FeedList from './components/FeedList'
import  GroupList  from './components/GroupList'
import { Router, Link , Route, Switch } from 'react-router-dom'
import { NotFound } from './components/NotFound'
import { CreateGroup } from './components/CreateGroup'
import { CreateFeed } from './components/CreateFeed'
import Auth from './auth/Auth'
import styled from 'styled-components';

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: right;
`;

const Nav = styled.div`
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.0975);
`;
const NavHeader = styled.div`
  padding: 26px 20px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const NavLeft = styled.div`
  width: 33.333%;
  text-align: left;
`;
const NavCenter = styled.div`
  width: 33.333%;
`;
const Button = styled.button`
  cursor: pointer;
  background: transparent;
  font-size: 16px;
  border-radius: 3px;
  color: #5199FF;
  border: 2px solid #5199FF;
  margin: 0 1em;
  padding: 0.25em 1em;
  transition: 0.5s all ease-out;
  &:hover {
    background-color: #5199FF;
    color: white;
  }
`;
const NavRight = styled.div`
  width: 33.333%;
  text-align: right;
  svg {
    margin-right: 20px;
  }
`;
const NavLogo = styled(NavLeft)`
  font-family: udagramLogo;
  font-size: 48px;
`;

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
          <Body>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
          </Body>                
    )
  }

  generateMenu() {
    return (
      <Nav>
          <NavHeader>
            <NavLeft>
                <NavLogo>Udagram</NavLogo>
            </NavLeft>
            <NavCenter></NavCenter>
            <NavRight>
                {this.logInLogOutButton()}
            </NavRight>
          </NavHeader>
      </Nav>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Button onClick={this.handleLogout}>
          Log Out
        </Button>
      )
    } else {
      return (
        <Button onClick={this.handleLogin}>
          Log In
        </Button >
      )
    }
  }

  generateCurrentPage() {
    return (
      <Switch>
        <Route
          path="/groups/create"
          exact
          render={props => {
            return <CreateGroup {...props} auth={this.props.auth} />
          }}
        />

        <Route path="/feeds/:groupId" exact component={FeedList} />

        <Route
          path="/feeds/:groupId/create"
          exact
          render={props => {
            return <CreateFeed {...props} auth={this.props.auth} />
          }}
        />

        <Route path="/" exact component={GroupList} />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
