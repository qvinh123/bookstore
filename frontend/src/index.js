import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./index.css"
import store from "./redux/store"
import { Provider } from "react-redux"
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import { BrowserRouter } from "react-router-dom"
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

// optional cofiguration
const options = {
  position: 'bottom center',
  timeout: 2000,
  offset: '30px',
  transition: 'scale'
}

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ScrollToTop />
      <AlertProvider template={AlertTemplate} {...options}>
        <App />
      </AlertProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);