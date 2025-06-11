import Home from '../pages/Home';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    component: Home
  }
};

export const routeArray = Object.values(routes);