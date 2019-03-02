import React, { Component } from 'react'
import axios from 'axios'

import Exercise from './Exercise'

class Exercises extends Component {
  constructor(props) {
    super(props)
    this.state = {
      exercises: [],
      editor: {
        value: '# Enter your code here.',
        button: { isDisabled: false, },
        showGrading: false,
        showCorrect: false,
        showIncorrect: false,
      }
    }
  }

  componentDidMount() {
    this.getExercises()
  }

  getExercises() {
    axios.get(`${process.env.REACT_APP_EXERCISES_SERVICE_URL}/exercises`)
      .then((res) => { this.setState({ exercises: res.data.data.exercises }) })
      .catch((err) => { console.log(err) })
  }

  onChange = (value) => {
    const newState = this.state.editor
    newState.value = value
    this.setState(newState)
  }

  submitExercise = (evt, id) => {
    evt.preventDefault()

    const newState = this.state.editor
    const exercise = this.state.exercises.filter(el => el.id === id)[0]
    newState.showGrading = true
    newState.showCorrect = false
    newState.showIncorrect = false
    newState.button.isDisabled = true 

    this.setState(newState)

    const data = { 
      answer: this.state.editor.value,
      test: exercise.test_code,
      solution: exercise.test_code_solution
    }
    const url = process.env.REACT_APP_API_GATEWAY_URL
    
    axios.post(url, data)
      .then((res) => {
        console.log(res) 
        newState.showGrading = false
        newState.button.isDisabled = false
        if (res.data && !res.data.errorType) { newState.showCorrect = true }
        if (!res.data || res.data.errorType) { newState.showIncorrect = true }
        this.setState(newState)
      })
      .catch((err) => {
        newState.showGrading = false
        newState.button.isDisabled = false
        console.log(err)
      })
  }

  render() {
    return (
      <div>
        <h1 className="title is-1">Exercises</h1>
        <hr/><br/>
        {!this.props.isAuthenticated &&
          <div className="notification is-warning">
            <span>Please log in to submit an exercise.</span>
          </div>
        }
        {this.state.exercises.length > 0 &&
          <Exercise
            exercise={this.state.exercises[0]} 
            editor={this.state.editor}
            isAuthenticated={this.props.isAuthenticated}
            onChange={this.onChange}
            submitExercise={this.submitExercise}
          />
        }
      </div>
    )
  }
}

export default Exercises
