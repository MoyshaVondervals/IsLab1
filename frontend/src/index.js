import React from 'react';
import ReactDOM, {createRoot} from 'react-dom/client';
import './index.css';
import './styles/styles.css'
import App from './App';

import { Provider } from 'react-redux'
import { store } from './redux/store'

export * from './api/index';
createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
)


