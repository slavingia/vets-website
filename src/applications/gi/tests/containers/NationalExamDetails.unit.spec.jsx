import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { cleanup } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';
import NationalExamDetails from '../../containers/NationalExamDetails';

const mockStore = configureStore([thunk]);

describe('NationalExamDetails', () => {
  let store;
  let initialState;
  let addEventListenerSpy;
  let removeEventListenerSpy;
  let originalInnerWidth;
  let mockVaTableInner;
  let mockUsaTable;

  beforeEach(() => {
    initialState = {
      nationalExams: { examDetails: null, loadingDetails: false, error: null },
    };
    store = mockStore(initialState);
    global.MutationObserver = class {
      observe() {}

      disconnect() {}
    };
    addEventListenerSpy = sinon.spy(window, 'addEventListener');
    removeEventListenerSpy = sinon.spy(window, 'removeEventListener');

    // Preserve original window.innerWidth so we can restore it later
    originalInnerWidth = global.innerWidth;

    // Mock your table in the shadow DOM
    mockUsaTable = { classList: { add: sinon.spy(), remove: sinon.spy() } };

    mockVaTableInner = {
      shadowRoot: {
        querySelector: sinon.stub().returns(mockUsaTable),
      },
    };

    // Stub document.querySelector so it returns our fake va-table-inner
    sinon.stub(document, 'querySelector').callsFake(selector => {
      if (selector === '.exams-table va-table-inner') {
        return mockVaTableInner;
      }
      return null;
    });
  });

  afterEach(() => {
    cleanup();
    addEventListenerSpy.restore();
    removeEventListenerSpy.restore();
    document.querySelector.restore();
    global.innerWidth = originalInnerWidth;
  });

  const mountComponent = (examId = '1@acce9') => {
    return mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/national-exams/${examId}`]}>
          <Route path="/national-exams/:examId">
            <NationalExamDetails />
          </Route>
        </MemoryRouter>
      </Provider>,
    );
  };

  it('should display a loading indicator when loadingDetails is true', () => {
    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
        loadingDetails: true,
      },
    });

    const wrapper = mountComponent();
    expect(wrapper.find('va-loading-indicator').exists()).to.be.true;
    expect(wrapper.find('va-loading-indicator').prop('message')).to.equal(
      'Loading your national exam details...',
    );
    wrapper.unmount();
  });

  it('should display an error alert when error is present', () => {
    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
        error: 'Server error occurred',
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/national-exams/1@acce9`]}>
          <Route path="/national-exams/:examId">
            <NationalExamDetails />
          </Route>
        </MemoryRouter>
      </Provider>,
    );
    const alert = wrapper.find('va-alert');
    expect(alert.exists()).to.be.true;
    expect(alert.prop('status')).to.equal('error');
    expect(alert.find('h2[slot="headline"]').text()).to.equal(
      'We can’t load the national exam details right now',
    );
    expect(alert.find('p').text()).to.include(
      'We’re sorry. There’s a problem with our system. Try again later.',
    );
    wrapper.unmount();
  });

  it('should render exam details when loaded and no error', () => {
    const mockExamDetails = {
      name: 'Sample National Exam',
      tests: [
        {
          name: 'Test A',
          beginDate: '2020-01-01',
          endDate: '2020-12-31',
          fee: '100',
        },
        {
          name: 'Test B',
          beginDate: '2020-01-01',
          endDate: '2020-12-31',
          fee: '100',
        },
      ],
      institution: {
        name: 'Sample Institution',
        physicalAddress: {
          address1: '123 Main St',
          city: 'Anytown',
          state: 'VA',
          zip: '12345',
          country: 'USA',
        },
        webAddress: 'www.sample.org',
      },
    };

    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
        loadingDetails: false,
        examDetails: mockExamDetails,
      },
    });

    const wrapper = mountComponent();
    expect(wrapper.find('va-loading-indicator').exists()).to.be.false;
    expect(wrapper.find('h1').text()).to.equal('Sample National Exam');
    const institutionSpan = wrapper
      .find('.provider-info-container span')
      .findWhere(n => n.text() === 'Sample Institution');
    expect(institutionSpan.exists()).to.be.true;
    const addressBlock = wrapper.find('.va-address-block');
    expect(addressBlock.text()).to.contain('123 Main St');
    expect(addressBlock.text()).to.contain('Anytown, VA 12345');
    const formLink = wrapper.find(
      'va-link[href="https://www.va.gov/find-forms/about-form-22-0810/"]',
    );
    expect(formLink.exists()).to.be.true;
    expect(formLink.prop('text')).to.equal(
      'Get link to VA Form 22-0810 to download',
    );

    const tableRows = wrapper.find('va-table-row');
    expect(tableRows.length).to.equal(3);

    const testRow = tableRows.at(1);
    expect(testRow.text()).to.contain('Test A');
    expect(testRow.text()).to.contain('$100');
    wrapper.unmount();
  });

  it('should not render anything if examDetails is null and loadingDetails is false (edge case)', () => {
    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
        examDetails: null,
        loadingDetails: false,
      },
    });

    const wrapper = mountComponent();
    expect(wrapper.find('va-loading-indicator').exists()).to.be.true;
    expect(wrapper.find('va-loading-indicator').prop('message')).to.equal(
      'Loading your national exam details...',
    );
    wrapper.unmount();
  });
  it('should display "Not available" if institution.webAddress is null and No tests available', () => {
    const mockExamDetails = {
      name: 'Sample National Exam',
      tests: undefined,
      institution: {
        name: 'Sample Institution',
        physicalAddress: {
          address1: '123 Main St',
          city: 'Anytown',
          state: 'VA',
          zip: '12345',
          country: 'USA',
        },
        webAddress: null,
      },
    };

    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
        loadingDetails: false,
        examDetails: mockExamDetails,
      },
    });
    const wrapper = mountComponent();
    const webAddressSpan = wrapper
      .find('.provider-info-container')
      .find('span')
      .filterWhere(n => n.text() === 'Not available');
    expect(webAddressSpan.exists()).to.be.true;
    expect(wrapper.text()).to.contain('No tests available');
    wrapper.unmount();
  });
  it('renders single test info when exactly one valid test exists', () => {
    const mockExamDetails = {
      name: 'Single Test Exam',
      tests: [
        {
          name: 'Single Test',
          fee: '150',
        },
        { name: 'Blank', fee: '' },
      ],
      institution: {
        name: 'Single Institution',
        physicalAddress: {
          address1: '123 Example St',
          city: 'Example City',
          state: 'EX',
          zip: '00000',
          country: 'USA',
        },
        webAddress: 'www.example.com',
      },
    };

    store = mockStore({
      nationalExams: {
        examDetails: mockExamDetails,
        loadingDetails: false,
        error: null,
      },
    });

    const wrapper = mountComponent();
    expect(wrapper.find('.exam-single-test').exists()).to.be.true;
    expect(wrapper.find('.exam-single-test h3').text()).to.equal('Test Info');
    expect(
      wrapper
        .find('.exam-single-test p')
        .first()
        .text(),
    ).to.equal('Showing 1 of 1 test');
    const feeDescription = wrapper.find('[data-testid="fee-description"]');
    expect(feeDescription.text()).to.contain('Single Test');
    const reimbursement = wrapper.find('[data-testid="maximum-reimbursement"]');
    expect(reimbursement.text()).to.contain('$150');

    wrapper.unmount();
  });

  it('adds and removes the resize event listener on mount/unmount', () => {
    const wrapper = mountComponent();
    expect(addEventListenerSpy.calledWith('resize')).to.be.true;
    wrapper.unmount();
    expect(removeEventListenerSpy.calledWith('resize')).to.be.true;
  });

  it('sets table to borderless and removes bordered classes when width >= 481px', () => {
    global.innerWidth = 800;
    mountComponent();
    expect(mockUsaTable.classList.remove.calledWith('usa-table--bordered')).to
      .be.true;
    expect(mockUsaTable.classList.add.calledWith('usa-table--borderless')).to.be
      .true;
  });
  it('sets table to bordered classes when width < 481px', async () => {
    // 1. Force window.innerWidth = 480:
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 480,
    });
    store = mockStore({
      nationalExams: {
        examDetails: {
          name: 'Sample National Exam',
          tests: [
            {
              name: 'Test A',
              beginDate: '2020-01-01',
              endDate: '2020-12-31',
              fee: '100',
            },
            {
              name: 'Test B',
              beginDate: '2020-01-01',
              endDate: '2020-12-31',
              fee: '200',
            },
          ],
          institution: {
            name: 'Sample Institution',
            physicalAddress: {
              address1: '123 Main St',
              city: 'Anytown',
              state: 'VA',
              zip: '12345',
              country: 'USA',
            },
            webAddress: 'www.sample.org',
          },
        },
        loadingDetails: false,
        error: null,
      },
    });

    // 3. Mount inside an `act` so the effect can run:
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/national-exams/123']}>
            <Route path="/national-exams/:examId">
              <NationalExamDetails />
            </Route>
          </MemoryRouter>
        </Provider>,
      );
    });

    wrapper.update();
    expect(mockUsaTable.classList.add.calledWith('usa-table--bordered')).to.be
      .true;
    expect(mockUsaTable.classList.remove.calledWith('usa-table--borderless')).to
      .be.true;

    wrapper.unmount();
  });
});
