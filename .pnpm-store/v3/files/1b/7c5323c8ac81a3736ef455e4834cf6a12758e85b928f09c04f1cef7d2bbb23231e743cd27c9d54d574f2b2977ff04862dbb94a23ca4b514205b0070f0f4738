import './init.js';
import {Loader, CONFIG} from '../../../js/components/loader.js';

Loader.preLoad('loader');

Loader.load(...CONFIG.load)
      .then(() => CONFIG.ready())
      .catch(error => CONFIG.failed(error));
