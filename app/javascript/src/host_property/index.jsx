import React from 'react';
import ReactDOM from 'react-dom';
import HostProperty from './hostProperty';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<HostProperty />, document.body.appendChild(document.createElement('div')));
});