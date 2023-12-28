import React from 'react'

const HomePage = (props) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <img id="big-logo" src="logo.png" alt="Scrabble score logo" />
        </div>
      </div>
      <div className="mb-5">{props.children}</div>
    </div>
  )
}

export default HomePage
