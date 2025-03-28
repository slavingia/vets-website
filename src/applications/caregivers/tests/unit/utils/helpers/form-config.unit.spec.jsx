import { expect } from 'chai';
import {
  hideCaregiverRequiredAlert,
  hideUploadWarningAlert,
  primaryHasDifferentMailingAddress,
  secondaryOneHasDifferentMailingAddress,
  secondaryTwoHasDifferentMailingAddress,
  showFacilityConfirmation,
} from '../../../../utils/helpers';

describe('CG `hideCaregiverRequiredAlert` method', () => {
  it('should return `true` when primary caregiver is defined', () => {
    const formData = { 'view:hasPrimaryCaregiver': true };
    expect(hideCaregiverRequiredAlert(formData)).to.be.true;
  });

  it('should return `true` when secondary caregiver is defined', () => {
    const formData = { 'view:hasSecondaryCaregiverOne': true };
    expect(hideCaregiverRequiredAlert(formData)).to.be.true;
  });

  it('should return `true` when secondary caregiver is undefined', () => {
    const formData = {
      'view:hasPrimaryCaregiver': false,
      'view:hasSecondaryCaregiverOne': undefined,
    };
    expect(hideCaregiverRequiredAlert(formData)).to.be.true;
  });

  it('should return `false` when no caregiver is defined', () => {
    const formData = {
      'view:hasPrimaryCaregiver': false,
      'view:hasSecondaryCaregiverOne': false,
    };
    expect(hideCaregiverRequiredAlert(formData)).to.be.false;
  });
});

describe('CG `hideUploadWarningAlert` method', () => {
  it('should return `true` when file data contains an error message', () => {
    const formData = {
      signAsRepresentativeDocumentUpload: [
        { name: 'test-name', guid: 'test-guid', errorMessage: 'test-error' },
      ],
    };
    expect(hideUploadWarningAlert(formData)).to.be.true;
  });

  it('should return `true` if upload array is empty', () => {
    const formData = { signAsRepresentativeDocumentUpload: [] };
    expect(hideUploadWarningAlert(formData)).to.be.true;
  });

  it('should return `false` when valid file data exists', () => {
    const formData = {
      signAsRepresentativeDocumentUpload: [
        { name: 'test-name', guid: 'test-guid' },
      ],
    };
    expect(hideUploadWarningAlert(formData)).to.be.false;
  });
});

describe('CG `primaryHasDifferentMailingAddress` method', () => {
  it('should return `false` when primary caregiver is not defined', () => {
    const formData = { 'view:hasPrimaryCaregiver': false };
    expect(primaryHasDifferentMailingAddress(formData)).to.be.false;
  });

  it('should return `false` when user indicates home & mailing addresses are the same', () => {
    const formData = {
      'view:hasPrimaryCaregiver': true,
      'view:primaryHomeSameAsMailingAddress': true,
    };
    expect(primaryHasDifferentMailingAddress(formData)).to.be.false;
  });

  it('should return `true` when user indicates home & mailing addresses are different', () => {
    const formData = {
      'view:hasPrimaryCaregiver': true,
      'view:primaryHomeSameAsMailingAddress': false,
    };
    expect(primaryHasDifferentMailingAddress(formData)).to.be.true;
  });
});

describe('CG `secondaryOneHasDifferentMailingAddress` method', () => {
  it('should return `false` when secondary caregiver is not defined', () => {
    const formData = { 'view:hasSecondaryCaregiverOne': false };
    expect(secondaryOneHasDifferentMailingAddress(formData)).to.be.false;
  });

  it('should return `false` when user indicates home & mailing addresses are the same', () => {
    const formData = {
      'view:hasSecondaryCaregiverOne': true,
      'view:secondaryOneHomeSameAsMailingAddress': true,
    };
    expect(secondaryOneHasDifferentMailingAddress(formData)).to.be.false;
  });

  it('should return `true` when user indicates home & mailing addresses are different', () => {
    const formData = {
      'view:hasSecondaryCaregiverOne': true,
      'view:secondaryOneHomeSameAsMailingAddress': false,
    };
    expect(secondaryOneHasDifferentMailingAddress(formData)).to.be.true;
  });
});

describe('CG `secondaryTwoHasDifferentMailingAddress` method', () => {
  it('should return `false` when secondary caregivers are not defined', () => {
    const formData = {
      'view:hasSecondaryCaregiverOne': false,
      'view:hasSecondaryCaregiverTwo': false,
    };
    expect(secondaryTwoHasDifferentMailingAddress(formData)).to.be.false;
  });

  it('should return `false` when user indicates home & mailing addresses are the same', () => {
    const formData = {
      'view:hasSecondaryCaregiverOne': true,
      'view:hasSecondaryCaregiverTwo': true,
      'view:secondaryTwoHomeSameAsMailingAddress': true,
    };
    expect(secondaryTwoHasDifferentMailingAddress(formData)).to.be.false;
  });

  it('should return `true` when user indicates home & mailing addresses are different', () => {
    const formData = {
      'view:hasSecondaryCaregiverOne': true,
      'view:hasSecondaryCaregiverTwo': true,
      'view:secondaryTwoHomeSameAsMailingAddress': false,
    };
    expect(secondaryTwoHasDifferentMailingAddress(formData)).to.be.true;
  });
});

describe('CG `hasPlannedMedicalCenter` method', () => {
  it('should return `false` when useFacilitiesAPI is off', () => {
    const formData = { 'view:useFacilitiesAPI': false };
    expect(showFacilityConfirmation(formData)).to.be.false;
  });

  context('useFacilitiesAPI is on', () => {
    it('should return `false` when veteranSelected and caregiverSupport are the same facility', () => {
      const formData = {
        'view:useFacilitiesAPI': true,
        'view:plannedClinic': {
          veteranSelected: { id: 'my-id' },
          caregiverSupport: { id: 'my-id' },
        },
      };
      expect(showFacilityConfirmation(formData)).to.be.false;
    });

    it('should return `false` when view:plannedClinic is undefined', () => {
      const formData = {
        'view:useFacilitiesAPI': true,
      };
      expect(showFacilityConfirmation(formData)).to.be.false;
    });

    it('should return `false` when view:plannedClinic is empty object', () => {
      const formData = {
        'view:useFacilitiesAPI': true,
        'view:plannedClinic': {},
      };
      expect(showFacilityConfirmation(formData)).to.be.false;
    });

    it('should return `false` when veteranSelected is empty object', () => {
      const formData = {
        'view:useFacilitiesAPI': true,
        'view:plannedClinic': {
          veteranSelected: {},
        },
      };
      expect(showFacilityConfirmation(formData)).to.be.false;
    });

    it('should return `true` when veteranSelected and caregiverSupport are different facilities', () => {
      const formData = {
        'view:useFacilitiesAPI': true,
        'view:plannedClinic': {
          veteranSelected: { id: 'my-id' },
          caregiverSupport: { id: 'not-my-id' },
        },
      };
      expect(showFacilityConfirmation(formData)).to.be.true;
    });
  });
});
