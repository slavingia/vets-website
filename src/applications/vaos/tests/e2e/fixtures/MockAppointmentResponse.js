import moment from 'moment';
import {
  APPOINTMENT_STATUS,
  TYPE_OF_VISIT_ID,
  VIDEO_TYPES,
} from '../../../utils/constants';

/**
 * @typedef {import('moment-timezone').Moment} Moment
 */

/**
 * Mock appointment class.
 *
 * @export
 * @class MockAppointment
 */
export default class MockAppointmentResponse {
  /**
   * Creates an instance of MockAppointment.
   * @param {Object} props - Properties used to determine what type of mock appointment to create.
   * @param {Object=} props.atlas - Set this to create an atlas appointment.
   * @param {Moment} props.localStartTime - Set appointment start time.
   * @param {Moment} props.created - Set appointment created date to the value passed in otherwise set the date to today's date as the default.
   * @param {string=} props.url - Set video appointment URL.
   * @param {string=} props.vvsKind - Set type of video appointment.
   * @param {string|number} [props.id=1] - Set appointment id.
   * @param {boolean} [props.cancellable=true] - Set if appointment is cancellable.
   * @param {string|TYPE_OF_VISIT_ID} [props.kind=clinic] - Set if appointment is VA or CC appointment.
   * @param {boolean} [props.patientHasMobileGfe=false] - Set if patient has mobile device for video appointments.
   * @param {string} [props.serviceType=primaryCare] - Set appointment type of care.
   * @param {string} [props.status=booked] - Set appointment status. If appointment status is 'APPOINTMENT_STATUS.proposed', localStart time is used for requested periods.
   * @memberof MockAppointment
   */
  constructor({
    atlas,
    created,
    localStartTime,
    url,
    vvsKind,
    id = '1',
    cancellable = true,
    kind = TYPE_OF_VISIT_ID.clinic,
    patientHasMobileGfe = false,
    serviceType = 'primaryCare',
    status = 'booked',
    future = false,
    pending = false,
    past = false,
  } = {}) {
    const requestedPeriods = [];
    let timestamp = moment();
    let createdStamp = moment();

    if (localStartTime && localStartTime instanceof moment)
      timestamp = localStartTime;

    if (status === APPOINTMENT_STATUS.proposed) {
      requestedPeriods.push({
        start: timestamp.format('YYYY-MM-DDTHH:mm:ss.000Z'),
        end: timestamp.format('YYYY-MM-DDTHH:mm:ss.000Z'),
      });
    }

    if (created && created instanceof moment)
      createdStamp = created.format('YYYY-MM-DDTHH:mm:ss.000Z');
    else createdStamp = timestamp.format('YYYY-MM-DDTHH:mm:ss.000Z');

    this.id = id.toString();
    this.type = 'MockAppointment';
    this.attributes = {
      id,
      cancellable,
      extension: {
        patientHasMobileGfe,
      },
      kind,
      localStartTime: timestamp.format('YYYY-MM-DDTHH:mm:ss.000Z'),
      preferredDates: [
        moment()
          .startOf('day')
          .format('ddd, MMMM D, YYYY [in the morning]'),
      ],
      requestedPeriods:
        requestedPeriods.length > 0 ? requestedPeriods : undefined,
      created: createdStamp,
      serviceType,
      status,
      telehealth: {
        atlas,
        url,
        vvsKind,
      },
      future,
      pending,
      past,
    };
  }

  static createAtlasResponses({
    localStartTime,
    future = false,
    past = false,
    count = 1,
  }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.telehealth,
            localStartTime,
            atlas: {
              confirmationCode: '7VBBCA',
              address: {
                streetAddress: '114 Dewey Ave',
                city: 'Eureka',
                state: 'MT',
                zipCode: '59917',
              },
            },
            vvsKind: VIDEO_TYPES.adhoc,
            future,
            past,
          }),
      );
  }

  static createCCResponses({ localStartTime, future = false, count = 1 }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: 'cc',
            localStartTime,
            future,
          }),
      );
  }

  static createClinicResponses({
    localStartTime,
    future = false,
    past = false,
    count = 1,
  }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.telehealth,
            localStartTime,
            vvsKind: VIDEO_TYPES.clinic,
            future,
            past,
          }),
      );
  }

  static createGfeResponses({
    localStartTime,
    future = false,
    past = false,
    count = 1,
  }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.telehealth,
            localStartTime,
            vvsKind: VIDEO_TYPES.mobile,
            patientHasMobileGfe: true,
            future,
            past,
          }),
      );
  }

  static createMobileResponses({ localStartTime, future = false, count = 1 }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.telehealth,
            localStartTime,
            vvsKind: VIDEO_TYPES.mobile,
            future,
          }),
      );
  }

  static createPhoneResponses({ localStartTime, future = false, count = 1 }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.phone,
            localStartTime,
            future,
          }),
      );
  }

  static createStoreForwardResponses({
    localStartTime,
    future = false,
    count = 1,
  }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            kind: TYPE_OF_VISIT_ID.telehealth,
            localStartTime,
            vvsKind: VIDEO_TYPES.storeForward,
            future,
          }),
      );
  }

  static createVAResponses({ localStartTime, future = false, count = 1 }) {
    return Array(count)
      .fill(count)
      .map(
        (_, index) =>
          new MockAppointmentResponse({
            id: index,
            localStartTime,
            future,
          }),
      );
  }

  static createCCResponse({ serviceType }) {
    return new MockAppointmentResponse({
      kind: 'cc',
      status: APPOINTMENT_STATUS.proposed,
      serviceType,
    });
  }

  setPatientComments(value) {
    this.attributes.patientComments = value;
    return this;
  }

  setCancelationReason(value) {
    this.attributes.cancelationReason = {
      coding: [{ code: value }],
    };

    return this;
  }

  setClinicId(id) {
    this.attributes.clinic = id;
    return this;
  }

  setPhysicalLocation(room) {
    this.attributes.physicalLocation = room;
    return this;
  }

  setContact({ phone, email }) {
    this.attributes.contact = {
      telecom: [
        { type: 'phone', value: phone },
        { type: 'email', value: email },
      ],
    };

    return this;
  }

  setId(value) {
    this.id = value.toString();
    return this;
  }

  setLocation(location) {
    this.attributes.location = location;
    return this;
  }

  setTypeOfCare(value) {
    this.attributes.serviceType = value;
    return this;
  }

  setCCProvider() {
    this.attributes.extension = {
      ccLocation: {
        address: {
          line: ['Address line 1'],
          city: 'City',
          state: 'State',
          postalCode: '12345',
          text: '10640 MAIN ST ; STE 100\nFAIRFAX VA 22030',
        },
        telecom: [
          {
            system: 'phone',
            value: '123-456-7890',
          },
        ],
      },
      ccTreatingSpecialty: 'Treating specialty',
    };

    return this;
  }

  setLocationId(value) {
    this.attributes.locationId = value.toString();
    return this;
  }

  setPractitioner({ id }) {
    this.attributes.practitioners = [
      {
        identifier: [
          {
            system: 'http://hl7.org/fhir/sid/us-npi',
            value: id,
          },
        ],
        address: {
          line: ['line 1'],
          city: 'City',
          state: 'State',
          postalCode: 'Postal code',
        },
      },
    ];

    return this;
  }

  setPreferredProviderName(value) {
    this.attributes.preferredProviderName = value;
    return this;
  }

  setPreferredTimesForPhoneCall({ morning, afternoon, evening }) {
    const array = [];

    if (morning) array.push('Morning');
    if (afternoon) array.push('Afternoon');
    if (evening) array.push('Evening');

    this.attributes.preferredTimesForPhoneCall = array;

    return this;
  }

  setReasonCode({ code, text }) {
    this.attributes.reasonCode = {
      coding: [{ code }],
      text,
    };

    return this;
  }

  getRequestedPeriods() {
    // Throwing an error since using null, undefined or [] when constructing a moment
    // will default to the current date and time.
    if (!this.attributes.requestedPeriods)
      throw new Error('Attribute not defined');

    return this.attributes.requestedPeriods;
  }

  setRequestedPeriods(requestedPeriods) {
    this.attributes.localStartTime = undefined;
    this.attributes.requestedPeriods = requestedPeriods.map(date => {
      return {
        start: moment(date).format('YYYY-MM-DDThh:mm:ssZ'),
        end: moment(date)
          .add(1, 'hour')
          .format('YYYY-MM-DDThh:mm:ssZ'),
      };
    });

    return this;
  }

  setStart(value) {
    this.attributes.start = value;
    return this;
  }

  setStatus(value) {
    this.attributes.status = value;
    return this;
  }

  setPreferredModlity(value) {
    this.attributes.preferredModality = value;
    return this;
  }

  setUrl(value = 'test.com') {
    this.attributes.telehealth = {
      ...this.attributes.telehealth,
      url: value,
    };

    return this;
  }
}
