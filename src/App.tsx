import React from 'react';
import moment from 'moment';
import { MainRouter } from 'routes';

import 'moment/dist/locale/pt-br';

moment.locale('pt-br');

const App: React.FC = () => {
  return <MainRouter />;
};

export default App;
