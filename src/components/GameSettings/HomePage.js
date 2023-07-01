import React from "react";

const HomePage = (props) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <img id="big-logo" src="logo.png" alt="Scrabble score logo" />
        </div>
      </div>
      <div className="homepage-children">{props.children}</div>
    </div>
  );
};

export default HomePage;
