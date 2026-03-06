import { logEvent } from 'firebase/analytics';
import { analytics } from '../lib/firebase';

async function track(eventName: string, params?: Record<string, unknown>) {
  const instance = await analytics;
  if (instance) logEvent(instance, eventName, params);
}

export const trackPageView = (path: string) =>
  track('page_view', { page_path: path });

export const trackCTAClick = (location: string) =>
  track('cta_click', { cta_location: location });

export const trackWizardStepView = (stepNumber: number, stepName: string) =>
  track('wizard_step_view', { step_number: stepNumber, step_name: stepName });

export const trackWizardStepComplete = (
  stepNumber: number,
  stepName: string,
  timeOnStepMs: number
) =>
  track('wizard_step_complete', {
    step_number: stepNumber,
    step_name: stepName,
    time_on_step_ms: timeOnStepMs,
  });

export const trackWizardAbandon = (
  lastStepNumber: number,
  lastStepName: string
) =>
  track('wizard_abandon', {
    last_step_number: lastStepNumber,
    last_step_name: lastStepName,
  });

export const trackLoadingScreenView = () => track('loading_screen_view');

export const trackResultsView = (cardCount: number, topCardName: string) =>
  track('results_view', { card_count: cardCount, top_card_name: topCardName });

export const trackResultCardClick = (cardName: string, cardRank: number) =>
  track('result_card_click', { card_name: cardName, card_rank: cardRank });

export const trackFilterClick = (filterName: string) =>
  track('filter_click', { filter_name: filterName });
