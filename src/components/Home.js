import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="jumbotron">
        <h1 className="display-4">Welcome to Cycle's-R-Us!</h1>
        <p className="lead">Your go-to place for top-notch cycles.</p>
        <hr className="my-4" />
        <p>
          Experience the ride of your life with our wide range of cycles for
          every terrain and every age!
        </p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default Home;