import './index.css'
import App from './App'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
