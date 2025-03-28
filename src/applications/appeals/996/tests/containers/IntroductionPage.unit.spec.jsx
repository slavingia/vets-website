import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import IntroductionPage from '../../containers/IntroductionPage';
import formConfig from '../../config/form';

import { FETCH_CONTESTABLE_ISSUES_SUCCEEDED } from '../../../shared/actions';

const getData = ({
  loggedIn = true,
  isVerified = true,
  data = {},
  contestableIssues = [],
  status = FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  error = '',
} = {}) => ({
  props: {
    loggedIn,
    location: {
      basename: '/base-url',
    },
    route: {
      formConfig,
      pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
    },
  },
  mockStore: {
    getState: () => ({
      // getContestableIssues: () => {},
      isVerified,
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          userFullName: { last: 'last' },
          dob: '2000-01-01',
          claims: { appeals: true },
          // need to have a saved form or else form will redirect to v2
          savedForms: [
            // {
            //   form: VA_FORM_IDS.FORM_20_0996,
            //   metadata: { lastUpdated: 3000, expiresAt: unix time + 2000 },
            // },
          ],
          prefillsAvailable: [],
          signIn: { serviceName: 'mhv' },
          verified: isVerified,
        },
      },
      form: {
        formId: formConfig.formId,
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: {
          metadata: {},
        },
        data,
        contestableIssues,
      },
      contestableIssues: {
        status,
        error,
        issues: contestableIssues,
      },
      saveInProgress: {
        user: {},
      },
      location: {
        pathname: '/introduction',
      },
      saveInProgressActions: {},
      route: {
        formConfig: {
          verifyRequiredPrefill: true,
          savedFormMessages: {},
        },
        pageList: [],
      },
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: { get() {} },
        dismissedDowntimeWarnings: [],
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('IntroductionPage', () => {
  it('should render', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('h1', container).textContent).to.contain(
      'Request a Higher-Level Review',
    );
    expect($('va-process-list', container)).to.exist;
    expect($('va-omb-info', container)).to.exist;
    expect($('va-alert-sign-in[variant="signInRequired"]', container)).to.exist;
  });

  it('should render start action links', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($$('.vads-c-action-link--green', container).length).to.equal(2);
  });

  it('should render verify identity alert', () => {
    const { props, mockStore } = getData({ isVerified: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    expect($('va-alert-sign-in[variant="signInEither"]', container)).to.exist;
  });
});
