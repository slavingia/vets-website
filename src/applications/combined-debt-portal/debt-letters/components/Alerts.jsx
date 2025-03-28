import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { formatDate } from '../../combined/utils/helpers';

export const DownloadLettersAlert = () => (
  <va-alert status="warning">
    <h3 slot="headline">
      Downloadable letters have incorrect repayment plan terms
    </h3>
    <p>
      We’re sorry. The length of time listed for repayment plans in these
      letters is too short. Use the letters you get in the mail to find the
      correct repayment plan terms.
    </p>
    <p>
      If you have any questions, call us at{' '}
      <va-telephone contact={CONTACTS.DMC} /> (or{' '}
      <va-telephone contact={CONTACTS.DMC_OVERSEAS} international /> from
      overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. If
      you have hearing loss, call TTY:{' '}
      <va-telephone contact={CONTACTS['711']} />.
    </p>
    <p>
      We’re working to fix this problem as fast as we can. Check back soon for
      updates.
    </p>
  </va-alert>
);

export const DowntimeMessage = () => {
  return (
    <va-alert status="error">
      <h3 slot="headline">Nightly tool maintenance</h3>
      <p>
        We’re working on this tool right now. If you have trouble signing in or
        using this tool, check back after we’re finished.
      </p>
      <p>
        Please note that we’ll be doing maintenance at this time each night from
        12:30 a.m. to 3 a.m. ET. Thank you for your patience.
      </p>

      <p>Date: {formatDate(new Date())}</p>
      <p>Start/End time: 12:30 a.m. to 3:00 a.m. ET</p>

      <h4>What can you do</h4>

      <p>
        You can still
        <Link to="/debt-balances/letters" className="vads-u-margin-x--0p5">
          download your debt letters.
        </Link>
        If you need help resolving a debt, or you would like to get information
        about a debt that has been resolved, call the Debt Management Center at{' '}
        <va-telephone contact={CONTACTS.DMC} />.
      </p>
    </va-alert>
  );
};

export const DebtLetterDownloadDisabled = () => (
  <va-alert data-testid="letters-disabled-alert" status="warning">
    <h3 className="vads-u-font-size--h3" slot="headline">
      Your debt letters are currently unavailable for download.
    </h3>
    <p>
      If you have VA health care copay debt, go to our
      <Link className="vads-u-margin-x--0p5" to="/copay-balances/">
        Pay your VA copay bill
      </Link>
      page to learn about your payment options.
    </p>
    <va-link
      href="/manage-va-debt/summary/debt-balances/"
      icon-name="navigate_before"
      icon-size={3}
      text="Back to current debts"
      class="vads-u-font-weight--bold vads-u-margin-left--neg0p5 vads-u-margin-top--2"
    />
  </va-alert>
);

export const ErrorAlert = () => (
  <va-alert status="error">
    <h3 slot="headline">Your debt letters are currently unavailable.</h3>
    <p>
      You can’t download your debt letters because something went wrong on our
      end.
    </p>
    <h4>What you can do</h4>
    <p>
      You can check back later or call the Debt Management Center at{' '}
      <va-telephone contact={CONTACTS.DMC} /> to find out more information about
      how to resolve your debt.
    </p>
    <va-link
      href="/manage-va-debt/summary/debt-balances/"
      icon-name="navigate_before"
      icon-size={3}
      text="Back to current debts"
      class="vads-u-font-weight--bold vads-u-margin-left--neg0p5 vads-u-margin-top--2"
    />
  </va-alert>
);

export const DependentDebt = () => (
  <va-alert status="error">
    <h3 slot="headline">Your debt letters are currently unavailable.</h3>
    <p>
      You can’t download your debt letters because something went wrong on our
      end.
    </p>
    <h4>What you can do</h4>
    <p>
      If you need to access debt letters that were mailed to you, call the Debt
      Management Center at <va-telephone contact={CONTACTS.DMC} />.
    </p>
    <va-link
      href="/manage-va-debt/summary/debt-balances/"
      icon-name="navigate_before"
      icon-size={3}
      text="Back to current debts"
      class="vads-u-font-weight--bold vads-u-margin-left--neg0p5 vads-u-margin-top--2"
    />
  </va-alert>
);

export const NoDebtLinks = () => (
  <va-alert status="error">
    <h3 slot="headline">You don’t have any VA debt letters</h3>
    <p>
      Our records show you don’t have any debt letters related to VA benefits.
      If you think this is an error, please contact the Debt Management Center
      at <va-telephone contact={CONTACTS.DMC} />.
    </p>
    <p>
      If you have VA health care copay debt, go to our
      <Link className="vads-u-margin-x--0p5" to="/copay-balances/">
        Pay your VA copay bill
      </Link>
      page to learn about your payment options.
    </p>
    <va-link
      href="/manage-va-debt/summary/debt-balances/"
      icon-name="navigate_before"
      icon-size={3}
      text="Back to current debts"
      class="vads-u-font-weight--bold vads-u-margin-left--neg0p5 vads-u-margin-top--2"
    />
  </va-alert>
);
