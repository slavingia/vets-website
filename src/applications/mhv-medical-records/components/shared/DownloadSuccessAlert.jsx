/**
 * Alert Box component specific to access trouble
 *
 * @author Matthew Wright
 * @desc: Alert that displays when a download link is clicked and there are no data issues
 * @notes :
 */

import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { ALERT_TYPE_SUCCESS } from '../../util/constants';

const DownloadSuccessAlert = props => {
  const { className, ccd, visibility } = props;
  return (
    <VaAlert
      status={ALERT_TYPE_SUCCESS}
      visible={visibility}
      class={`vads-u-margin-top--4 no-print ${className}`}
      role="alert"
      data-testid="alert-download-started"
    >
      <h2 slot="headline" data-testid="download-success-alert-message">
        {ccd ? 'Continuity of Care Document download' : 'Download'} started
      </h2>
      <p className="vads-u-margin--0">
        Check your device’s downloads location for your file.
      </p>
    </VaAlert>
  );
};

export default DownloadSuccessAlert;

DownloadSuccessAlert.propTypes = {
  ccd: PropTypes.any,
  className: PropTypes.any,
  completed: PropTypes.any,
  visibility: PropTypes.any,
};
