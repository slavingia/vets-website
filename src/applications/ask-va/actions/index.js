import { removeFormApi } from 'platform/forms/save-in-progress/api';
import recordEvent from 'platform/monitoring/record-event';
import { REMOVING_SAVED_FORM_SUCCESS } from 'platform/user/profile/actions';

export const SET_CATEGORY_ID = 'SET_CATEGORY_ID';
export const SET_TOPIC_ID = 'SET_TOPIC_ID';
export const SET_SUBTOPIC_ID = 'SET_SUBTOPIC_ID';
export const SET_UPDATED_IN_REVIEW = 'SET_UPDATED_IN_REVIEW';
export const OPEN_REVIEW_CHAPTER = 'OPEN_REVIEW_CHAPTER';
export const CLOSE_REVIEW_CHAPTER = 'CLOSE_REVIEW_CHAPTER';
export const SET_LOCATION_SEARCH = 'SET_LOCATION_SEARCH';
export const SET_VA_HEALTH_FACILITY = 'SET_VA_HEALTH_FACILITY';
export const REMOVE_ASK_VA_FORM = 'REMOVE_ASK_VA_FORM';
export const CLEAR_FORM_DATA = 'CLEAR_FORM_DATA';

export function setCategoryID(id) {
  return { type: SET_CATEGORY_ID, payload: id };
}

export function setTopicID(id) {
  return { type: SET_TOPIC_ID, payload: id };
}

export function setSubtopicID(id) {
  return { type: SET_SUBTOPIC_ID, payload: id };
}

export function setUpdatedInReview(page) {
  return { type: SET_UPDATED_IN_REVIEW, payload: page };
}

export function closeReviewChapter(closedChapter, pageKeys = []) {
  return {
    type: CLOSE_REVIEW_CHAPTER,
    closedChapter,
    pageKeys,
  };
}

export function openReviewChapter(openedChapter) {
  return {
    type: OPEN_REVIEW_CHAPTER,
    openedChapter,
  };
}

export function setLocationInput(searchInput) {
  return { type: SET_LOCATION_SEARCH, payload: searchInput };
}

export function setVAHealthFacility(name) {
  return { type: SET_VA_HEALTH_FACILITY, payload: name };
}

export function removeAskVaForm(formId) {
  return dispatch => {
    return removeFormApi(formId)
      .then(() => {
        recordEvent({ event: 'sip-form-delete-success' });
        dispatch({ type: REMOVING_SAVED_FORM_SUCCESS, formId });
      })
      .catch(error => {
        recordEvent({
          event: 'sip-form-delete-failed',
          error: error?.message,
        });
      });
  };
}

export const clearFormData = () => ({
  type: CLEAR_FORM_DATA,
});
