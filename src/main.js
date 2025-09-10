import { router } from './router.js';
import './styles/index.css';

router();                       // primera carga
window.addEventListener('hashchange', router); // navegación hash

