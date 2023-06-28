import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

function renderWithRouterAndContext(component, path = '/', history) {
  if (!history) {
    history = createMemoryHistory({ initialEntries: [path] });
  }

  return {
    ...render(

      <Router history={ history }>
        {component}
      </Router>,

    ),
    history,
  };
}

export default renderWithRouterAndContext;
