import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';
// App.js or index.js

import { QueryClient, QueryClientProvider } from 'react-query';
// ReactDOM.render(
//   <QueryClientProvider client={queryClient}>
//     <MyComponent />
//   </QueryClientProvider>,
//   document.getElementById('root')
// );
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';
// App.js or index.js

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ReactDOM.render(
//   <QueryClientProvider client={queryClient}>
//     <MyComponent />
//   </QueryClientProvider>,
//   document.getElementById('root')
// );
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      cacheTime: 1000 * 60 * 2, // 2 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>
);
