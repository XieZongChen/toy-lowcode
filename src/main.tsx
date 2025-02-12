import ReactDOM from 'react-dom/client';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // react-dnd 用来跨组件传递数据的 provider
  <DndProvider backend={HTML5Backend}>
    <App />
  </DndProvider>
);
