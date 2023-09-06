import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components';
// css stylesheets can be created for each component
// place them in the src/style directory, and import them like this:
import './style/index.css';

// ReactDOM.render(<App />, document.getElementById('app'));
// ^ That would probably work, but... We're using react and not axios so...

const root = createRoot(document.getElementById('app'));
root.render(<App />);