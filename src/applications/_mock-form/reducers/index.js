import vapService from '@@vap-svc/reducers';

import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  vapService,
};
