import React from 'react'

import './FormErrors.css'

const FormErrors = (props) => {
  return (
    <ul className="validation-list">
      { 
        props.formRules.map((rule) => {
          return <li className={rule.valid ? "success" : "error"} key={rule.id}>
            {rule.name}
          </li>
        })
      }
    </ul>
  )
}

export default FormErrors
