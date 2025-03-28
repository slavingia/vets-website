const commonResponses = require('../../../platform/testing/local-dev-mock-api/common');

module.exports = {
  ...commonResponses,
  'GET /v0/user': {
    data: {
      id: '',
      type: 'users_scaffolds',
      attributes: {
        services: [
          'facilities',
          'hca',
          'edu-benefits',
          'form-save-in-progress',
          'form-prefill',
          'user-profile',
          'appeals-status',
          'identity-proofed',
        ],
        account: { accountUuid: '4024a1ac-2a79-4c1a-a20d-4d15618757ca' },
        profile: {
          email: 'vets.gov.user+0@gmail.com',
          firstName: 'HECTOR',
          middleName: 'J',
          lastName: 'ALLEN',
          birthDate: '1932-02-05',
          gender: 'M',
          zip: '20110',
          lastSignedIn: '2022-01-10T19:57:45.590Z',
          loa: { current: 3, highest: 3 },
          multifactor: true,
          verified: true,
          signIn: { serviceName: 'idme', accountType: 'N/A' },
          authnContext: 'http://idmanagement.gov/ns/assurance/loa/3',
        },
        vaProfile: {
          status: 'OK',
          birthDate: '19320205',
          familyName: 'Allen',
          gender: 'M',
          givenNames: ['Hector'],
          isCernerPatient: false,
          facilities: [{ facilityId: '500', isCerner: false }],
          vaPatient: true,
          mhvAccountState: 'NONE',
        },
        veteranStatus: null,
        inProgressForms: [],
        prefillsAvailable: [
          '21-686C',
          '40-10007',
          '0873',
          '22-1990',
          '22-1990N',
          '22-1990E',
          '22-1995',
          '22-5490',
          '22-5495',
          '22-0993',
          '22-0994',
          'FEEDBACK-TOOL',
          '22-10203',
          '22-1990S',
          '22-1990EZ',
          '21-526EZ',
          '1010ez',
          '21P-530',
          '21P-527EZ',
          '686C-674',
          '20-0996',
          '10182',
          'MDOT',
          '5655',
          '28-8832',
          '28-1900',
        ],
        vet360ContactInformation: {},
        session: {
          ssoe: true,
          transactionid: 'sf8mUOpuAoxkx8uWxI6yrBAS/t0yrsjDKqktFz255P0=',
        },
      },
    },
    meta: {
      errors: null,
    },
  },
  'GET /v0/in_progress_forms/22-1990EZ': {
    formData: {
      veteranFullName: { first: 'Hector', middle: 'J', last: 'Allen' },
      userFullName: { first: 'Hector', middle: 'J', last: 'Allen' },
      gender: 'M',
      veteranDateOfBirth: '1932-02-05',
      veteranSocialSecurityNumber: '796126859',
      veteranAddress: {
        street: 'FAIRLAKE CIRCLE',
        city: 'FAIRFAX',
        state: 'VA',
        country: 'USA',
        postalCode: '20110',
      },
    },
    metadata: {
      version: 0,
      prefill: true,
      returnUrl: '/applicant-information/personal-information',
    },
  },
  'GET /meb_api/v0/claimant_info': {
    data: {
      id: '',
      type: 'meb_api_dgi_automation_claimant_responses',
      attributes: {
        claimant: {
          claimantId: 99900000200000000,
          suffix: null,
          dateOfBirth: '1990-01-01',
          firstName: 'John',
          lastName: 'Johnson',
          middleName: null,
          notificationMethod: 'NONE',
          contactInfo: {
            addressLine1: '4600 John Hancock Court',
            addressLine2: '',
            city: 'Woodbridge',
            zipcode: '22191',
            emailAddress: 'vets.gov.user+1200@gmail.com',
            addressType: 'DOMESTIC',
            mobilePhoneNumber: '800-827-1000',
            homePhoneNumber: '800-827-1000',
            countryCode: 'US',
            stateCode: 'VA',
          },
          preferredContact: null,
        },
        serviceData: [
          {
            branchOfService: 'Air Force',
            beginDate: '2010-01-01',
            endDate: '2015-01-01',
            characterOfService: 'Honorable',
            reasonForSeparation: 'Expiration Term Of Service',
            exclusionPeriods: [],
            trainingPeriods: [],
          },
        ],
      },
    },
  },
};
