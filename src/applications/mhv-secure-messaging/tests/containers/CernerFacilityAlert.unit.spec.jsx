import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { inbox } from '../fixtures/folder-inbox-response.json';
import messageResponse from '../fixtures/message-response.json';
import folderList from '../fixtures/folder-response.json';
import { Paths } from '../../util/constants';
import reducer from '../../reducers';
import FolderThreadListView from '../../containers/FolderThreadListView';
import {
  drupalStaticData,
  userProfileFacilities,
} from '../fixtures/cerner-facility-mock-data.json';

describe('Cerner Facility Alert', () => {
  const initialStateMock = {
    sm: {
      messageDetails: { message: messageResponse },
      folders: { folder: inbox, folderList },
    },
    drupalStaticData,
    user: {
      profile: {
        facilities: [],
      },
    },
    featureToggles: [],
  };

  const setup = (
    state = initialStateMock,
    path = Paths.INBOX,
    facilities = { facilities: [] },
  ) => {
    return renderWithStoreAndRouter(<FolderThreadListView testing />, {
      initialState: { ...state, user: { ...state.user, profile: facilities } },
      reducers: reducer,
      path,
    });
  };

  it(`does not render CernerFacilityAlert if cernerFacilities is empty`, async () => {
    const screen = setup();

    expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
  });

  it(`renders CernerFacilityAlert with list of facilities if cernerFacilities.length > 1`, async () => {
    const userFacilities = userProfileFacilities.filter(
      f => f.isCerner === false,
    );

    const screen = setup(initialStateMock, Paths.INBOX, {
      facilities: [
        ...userFacilities,
        { facilityId: '668', isCerner: true },
        { facilityId: '687', isCerner: true },
        { facilityId: '692', isCerner: true },
      ],
    });

    expect(screen.queryByTestId('cerner-facilities-alert')).to.exist;
    expect(screen.getByText('VA Spokane health care')).to.exist;
    expect(screen.getByText('VA Walla Walla health care')).to.exist;
    expect(screen.getByText('VA Southern Oregon health care')).to.exist;
    expect(screen.queryByText('VA Puget Sound health care')).to.not.exist;
    expect(
      screen.getByText(
        'Some of your secure messages may be in a different portal. To view or manage secure messages at these facilities, go to My VA Health:',
      ),
    ).to.exist;
  });

  it(`renders CernerFacilityAlert with 1 facility if cernerFacilities.length === 1`, async () => {
    const screen = setup(initialStateMock, Paths.INBOX, {
      facilities: userProfileFacilities.filter(f => f.facilityId === '668'),
    });

    expect(screen.queryByTestId('cerner-facilities-alert')).to.exist;

    expect(
      screen.getByTestId('single-cerner-facility-text').textContent,
    ).to.contain(
      'Some of your secure messages may be in a different portal. To send a secure message to a provider at VA Spokane health care, go to My VA Health.',
    );
    expect(screen.queryByRole('ul')).to.not.exist;
  });
});
