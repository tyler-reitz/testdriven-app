import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Logout extends Component {
  componentDidMount() {
    this.props.logoutUser()
  }
  render() {
    return (
      <p>You are now logged out. Click <Link to="/login">here</Link> to log back in.</p>
    )
  }
}

export default Logout
