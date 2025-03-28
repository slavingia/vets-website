import { expect } from 'chai';
import prefillTransformer, {
  filterServiceConnected,
  addNoneDisabilityActionType,
} from '../prefill-transformer';

import { SERVICE_CONNECTION_TYPES, disabilityActionTypes } from '../constants';

describe('526v2 prefill transformer', () => {
  const noTransformData = {
    metadata: { test: 'Test Metadata' },
    formData: {
      testData: `This isn't getting transformed`,
      'view:claimType': {
        'view:claimingIncrease': false,
        'view:claimingNew': true,
      },
    },
    pages: { testPage: 'Page 1' },
  };

  it('should return a copy of the prefill data', () => {
    const { pages, formData, metadata } = noTransformData;
    const noTransformActual = prefillTransformer(pages, formData, metadata);
    // ensure transformed data is not the same object as input data
    expect(noTransformActual).to.not.equal(noTransformData);
    // ensure the transformed data properties are the same as input since no
    // changes expected given this input data set
    expect(noTransformActual).to.deep.equal(noTransformData);
  });

  describe('prefillRatedDisabilities', () => {
    it('should filter out non-service-connected disabilities', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        disabilities: [
          {
            name: 'diabetes melitus',
            decisionCode: SERVICE_CONNECTION_TYPES.serviceConnected,
          },
          {
            name: 'other disability',
            decisionCode: SERVICE_CONNECTION_TYPES.notServiceConnected,
          },
        ],
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;
      expect(transformedData.ratedDisabilities)
        .to.be.an('array')
        .with.length(1);
      expect(transformedData.ratedDisabilities[0].name).to.equal(
        formData.disabilities[0].name,
      );
    });

    it('should add claimType when no rated service-connected disabilities', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        disabilities: [
          {
            name: 'other disability',
            decisionCode: SERVICE_CONNECTION_TYPES.notServiceConnected,
          },
        ],
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;
      expect(transformedData['view:claimType']).to.deep.equal(
        noTransformData.formData['view:claimType'],
      );
    });

    it('should add claimType when no disabilities', () => {
      const { pages, metadata } = noTransformData;
      const formData = {};

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;
      expect(transformedData).to.deep.equal({
        'view:claimType': noTransformData.formData['view:claimType'],
      });
    });

    it('should not add claimType when service-connected disabilities present', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        disabilities: [
          {
            name: 'other disability',
            decisionCode: SERVICE_CONNECTION_TYPES.serviceConnected,
          },
        ],
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;
      expect(transformedData.ratedDisabilities[0].name).to.equal(
        formData.disabilities[0].name,
      );
    });
  });

  describe('prefillContactInformation', () => {
    it('should transform contact info when present', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        veteran: {
          primaryPhone: '1123123123',
          emailAddress: 'a@b.c',
          mailingAddress: {
            country: 'USA',
            addressLine1: '123 Any Street',
            addressLine2: 'test',
            addressLine3: 'test 2',
            city: 'Anyville',
            state: 'AK',
            zipCode: '12345',
            // extra data that needs to be removed
            type: 'MILITARY',
            militaryPostOfficeTypeCode: 'APO',
            militaryStateCode: 'AA',
          },
        },
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;

      const { primaryPhone, emailAddress } = formData.veteran;
      expect(transformedData).to.deep.equal({
        'view:claimType': noTransformData.formData['view:claimType'],
        phoneAndEmail: {
          primaryPhone,
          emailAddress,
        },
        mailingAddress: {
          'view:livesOnMilitaryBase': false,
          country: 'USA',
          addressLine1: '123 Any Street',
          addressLine2: 'test',
          addressLine3: 'test 2',
          city: 'Anyville',
          state: 'AK',
          zipCode: '12345',
        },
      });
    });

    it('should transform address on military base when present', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        veteran: {
          primaryPhone: '1123123123',
          emailAddress: 'a@b.c',
          mailingAddress: {
            country: 'USA',
            addressLine1: '123 Any Street',
            city: 'APO',
            state: 'AE',
            zipCode: '12345',
          },
        },
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;

      const { primaryPhone, emailAddress } = formData.veteran;
      expect(transformedData).to.deep.equal({
        'view:claimType': noTransformData.formData['view:claimType'],
        phoneAndEmail: {
          primaryPhone,
          emailAddress,
        },
        mailingAddress: {
          'view:livesOnMilitaryBase': true,
          country: 'USA',
          addressLine1: '123 Any Street',
          addressLine2: undefined,
          addressLine3: undefined,
          city: 'APO',
          state: 'AE',
          zipCode: '12345',
        },
      });
    });

    it('should transform partial contact info', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        veteran: {
          emailAddress: 'a@b.c',
        },
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;

      expect(transformedData).to.deep.equal({
        'view:claimType': noTransformData.formData['view:claimType'],
        phoneAndEmail: {
          emailAddress: formData.veteran.emailAddress,
        },
      });
    });

    it('should transform with missing mailing address fields  ', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        veteran: {
          primaryPhone: '1123123123',
          emailAddress: 'a@b.c',
          mailingAddress: {},
        },
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;

      const { primaryPhone, emailAddress } = formData.veteran;
      expect(transformedData).to.deep.equal({
        'view:claimType': noTransformData.formData['view:claimType'],
        phoneAndEmail: {
          primaryPhone,
          emailAddress,
        },
        mailingAddress: {
          'view:livesOnMilitaryBase': false,
          country: '',
          addressLine1: '',
          addressLine2: undefined,
          addressLine3: undefined,
          city: '',
          state: '',
          zipCode: '',
        },
      });
    });
  });

  describe('prefillServiceInformation', () => {
    it('should transform service info when present', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        servicePeriods: [
          {
            serviceBranch: 'army',
            dateRange: { from: '2010-01-01', to: '2015-10-10' },
          },
        ],
        reservesNationalGuardService: {
          obligationTermOfServiceDateRange: {
            from: '2016-01-01',
            to: '2018-01-01',
          },
        },
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;
      const { servicePeriods, reservesNationalGuardService } = formData;
      expect(transformedData).to.deep.equal({
        'view:claimType': noTransformData.formData['view:claimType'],
        serviceInformation: {
          servicePeriods,
          reservesNationalGuardService,
        },
      });
    });

    it('should transform partial service info when present', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        servicePeriods: [
          {
            serviceBranch: 'army',
            dateRange: { from: '2010-01-01', to: '2015-10-10' },
          },
        ],
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;
      const { servicePeriods } = formData;
      expect(transformedData).to.deep.equal({
        'view:claimType': noTransformData.formData['view:claimType'],
        serviceInformation: { servicePeriods },
      });
    });

    it('should transform service branch names to BRD names', () => {
      const { pages, metadata } = noTransformData;
      const formData = (branch = 'Army Reserve') => ({
        servicePeriods: [
          {
            serviceBranch: branch,
            dateRange: { from: '2010-01-01', to: '2015-10-10' },
          },
        ],
        reservesNationalGuardService: {
          obligationTermOfServiceDateRange: {
            from: '2016-01-01',
            to: '2018-01-01',
          },
        },
      });

      const transformedData = prefillTransformer(pages, formData(), metadata)
        .formData;
      const { reservesNationalGuardService, servicePeriods } = formData(
        'Army Reserves',
      );
      expect(transformedData).to.deep.equal({
        'view:claimType': noTransformData.formData['view:claimType'],
        serviceInformation: {
          servicePeriods,
          reservesNationalGuardService,
        },
      });
    });
  });

  describe('prefillBankInformation', () => {
    it('should transform bank info when present', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        bankAccountType: 'Checking',
        bankAccountNumber: '123123123',
        bankRoutingNumber: '234234234',
        bankName: 'Bank Of Test',
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;
      const {
        bankAccountType,
        bankAccountNumber,
        bankRoutingNumber,
        bankName,
      } = formData;
      expect(transformedData).to.deep.equal({
        'view:claimType': noTransformData.formData['view:claimType'],
        'view:originalBankAccount': {
          'view:bankAccountType': bankAccountType,
          'view:bankAccountNumber': bankAccountNumber,
          'view:bankRoutingNumber': bankRoutingNumber,
          'view:bankName': bankName,
        },
        'view:bankAccount': { 'view:hasPrefilledBank': true },
      });
    });
    it('should not prefill any bank info when some info not present', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        bankAccountType: 'Checking',
        bankAccountNumber: '123123123',
        bankRoutingNumber: '234234234',
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;

      expect(transformedData).to.deep.equal({
        'view:claimType': noTransformData.formData['view:claimType'],
      });
    });
  });

  describe('prefillStartedFormVersion', () => {
    it('should include toxic exposure indicator when present', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        startedFormVersion: '2022',
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;
      expect(transformedData.startedFormVersion).to.equal(
        formData.startedFormVersion,
      );
    });
  });

  describe('prefillSyncModern0781Flow', () => {
    it('should surface PTSD form flow decision when present', () => {
      const { pages, metadata } = noTransformData;
      const formData = {
        syncModern0781Flow: true,
      };

      const transformedData = prefillTransformer(pages, formData, metadata)
        .formData;
      expect(transformedData.syncModern0781Flow).to.equal(
        formData.syncModern0781Flow,
      );
    });
  });
});

describe('addNoneDisabilityActionType', () => {
  const disabilities = [
    { decisionCode: SERVICE_CONNECTION_TYPES.notServiceConnected },
    { decisionCode: SERVICE_CONNECTION_TYPES.serviceConnected },
    { decisionCode: SERVICE_CONNECTION_TYPES.notServiceConnected },
    { decisionCode: SERVICE_CONNECTION_TYPES.serviceConnected },
  ];

  it('should return an array of same length as input', () => {
    const withActionType = addNoneDisabilityActionType(disabilities);
    expect(withActionType)
      .to.be.an('array')
      .that.has.length(disabilities.length);
  });

  it('should return an empty array when no input', () => {
    expect(addNoneDisabilityActionType())
      .to.be.an('array')
      .that.has.length(0);
  });

  it('should set disabilityActionType to NONE for each rated disability', () => {
    const withActionType = addNoneDisabilityActionType(disabilities);
    withActionType.forEach(d => {
      expect(d.disabilityActionType).to.equal(disabilityActionTypes.NONE);
    });
  });
});

describe('filterServiceConnected', () => {
  it('should filter non-service-connected disabililties', () => {
    const disabilities = [
      { decisionCode: SERVICE_CONNECTION_TYPES.notServiceConnected },
      { decisionCode: SERVICE_CONNECTION_TYPES.serviceConnected },
      { decisionCode: SERVICE_CONNECTION_TYPES.notServiceConnected },
      { decisionCode: SERVICE_CONNECTION_TYPES.serviceConnected },
    ];

    const filteredDisabilities = filterServiceConnected(disabilities);
    expect(filteredDisabilities.length).to.equal(2);
    filteredDisabilities.forEach(d =>
      expect(d.decisionCode).to.equal(
        SERVICE_CONNECTION_TYPES.serviceConnected,
      ),
    );
  });

  it('should return an empty array when no disabilities provided', () => {
    const filteredDisabilities = filterServiceConnected();
    expect(filteredDisabilities).to.be.an('array').that.is.empty;
  });
});
