import React, { Component } from 'react'
import AceEditor from 'react-ace'
import brace from 'brace'
import 'brace/mode/python'
import 'brace/theme/solarized_dark'

class Exercises extends Component {
  constructor(props) {
    super(props)
    this.state = {
      exercises: [],
      editor: {
        value: '# Enter your code here.'
      }
    }
  }

  componentDidMount() {
    this.getExercises()
  }

  getExercises() {
    const exercises = [
      {
        id: 0,
        body: `Define a function called sum that takes
      two integers as arguments and returns their sum.`
      },
      {
        id: 1,
        body: `Define a function called reverse that takes a string
      as an argument and returns the string in reversed order.`
      },
      {
        id: 2,
        body: `Define a function called factorial that takes a random
      number as an argument and then returns the factorial of that
      given number.`,
      }
    ]
    this.setState({ exercises })
  }

  onChange = (value) => {
    this.setState({
      editor: { value }
    })
  }

  submitExercise = (e) => {
    e.preventDefault()
    console.log(this.state.editor.value)
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
        {this.state.exercises.length &&
          <div key={this.state.exercises[0].id}>
            <h5 className="title is-5">{this.state.exercises[0].body}</h5>
            <AceEditor 
              mode="python"
              theme="solarized_dark"
              name={(this.state.exercises[0].id).toString()}
              onLoad={this.onLoad}
              onChange={this.onChange}
              fontSize={14}
              height={'175px'}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              value={this.state.editor.value}
              style={{
                marginBottom: '10px'
              }}
              editorProps={{
                $blockScrolling: Infinity
              }}
            />
            {this.props.isAuthenticated && 
              <button className="button is-primary" onClick={this.submitExercise}>Run Code</button>
            }
            <br/><hr/>
          </div>
        }
      </div>
    )
  }
}

export default Exercises
