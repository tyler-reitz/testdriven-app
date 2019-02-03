import React, { Component } from 'react';
import axios from 'axios';
import { Route, Switch } from 'react-router-dom';

import UsersList from './components/UsersList';
import AddUser from './components/AddUser';
import NavBar from './components/NavBar';
import About from './components/About';
import Form from './components/Form'
import Logout from './components/Logout'

class App extends Component {
  constructor() { super()
    this.state = {
      users: [],
      username: '',
      email: '',
      title: 'TestDriven.io',
      formData: {
        username: '',
        email: '',
        password: ''
      },
      isAuthenticated: false
    }
  }

  componentDidMount() {
    this.getUsers()
  }

  getUsers() {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then(res => this.setState({ users: res.data.data.users }))
      .catch(err => console.log(err))
  }

  addUser = (event) => {
    event.preventDefault();

    const data = {
      username: this.state.username,
      email: this.state.email
    }

    axios.post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
      .then((res) => {
        this.getUsers();
        this.setState({ username: '', email: '' })
      })
      .catch((err) => { console.log(err); })
  }

  handleChange = (event) => {
    const obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  }

  handleUserFormSubmit = (event) => {
    event.preventDefault()
    const formType = window.location.href.split('/').reverse()[0]
    let data = {
      email: this.state.formData.email,
      password: this.state.formData.password,
    }
    if (formType === 'register') {
      data.username = this.state.formData.username
    }
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${formType}`
    axios.post(url, data)
      .then((res) => {
        this.clearFormData()
        window.localStorage.setItem('authToken', res.data.auth_token)
        this.setState({ isAuthenticated: true, })
        this.getUsers()
      })
      .catch((err) => console.log(err))
  }

  handleFormChange = (event) => { const obj = this.state.formData
    obj[event.target.name] = event.target.value
    this.setState(obj)
  }

  clearFormData = () => {
    this.setState({
      formData: { username: '', email: '', password: '' },
      username: '',
      email: ''
    })
  }

  logoutUser = () => {
    window.localStorage.clear()
    this.setState({ isAuthenticated: false })
  }

  render() {
    return (
      <div>
        <NavBar title={this.state.title} />
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-half">
                <br/>
                <Switch>
                  <Route exact path='/' render={() => (
                    <div>
                      <h1 className="title is-1 is-1">All Users</h1>
                      <hr/><br/>
                      <AddUser
                        addUser={this.addUser}
                        email={this.state.email}
                        addUser={this.addUser}
                        handleChange={this.handleChange}
                      />
                      <hr/><br/>
                      <UsersList users={this.state.users} />
                    </div>
                  )} />
                  <Route exact path='/about' component={About} />
                  <Route exact path='/register' render={() => (
                    <Form 
                      formType={'Register'}
                      formData={this.state.formData}
                      handleUserFormSubmit={this.handleUserFormSubmit}
                      handleFormChange={this.handleFormChange}
                      isAuthenticated={this.state.isAuthenticated}
                    />  
                  )}/>
                  <Route exact path='/login' render={() => (
                    <Form 
                      formType={'Login'}
                      formData={this.state.formData}
                      handleUserFormSubmit={this.handleUserFormSubmit}
                      handleFormChange={this.handleFormChange}
                      isAuthenticated={this.state.isAuthenticated}
                    />  
                  )}/>
                  <Route exact path='/logout' render={() => (
                    <Logout 
                      logoutUser={this.logoutUser}
                      isAuthenticated={this.state.isAuthenticated}
                    />
                  )} />
                </Switch>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
};

export default App
