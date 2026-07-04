import { describe, it, expect } from 'vitest';
import { generateStory, generateTripPlan, generateDestinationRecommendations, generateLocalCompanionInsights } from '../services/gemini/geminiClient';
import { getStoryPrompt, getTripPlanPrompt } from '../services/gemini/prompts';

describe('Gemini Service Wrapper & Prompts', () => {
  it('should correctly format prompt templates', () => {
    const storyPrompt = getStoryPrompt('Robber\'s Cave');
    expect(storyPrompt).toContain('Robber\'s Cave');
    expect(storyPrompt).toContain('JSON');

    const planPrompt = getTripPlanPrompt('Dehradun', 'Budget', 'Oct 1', 2, ['History']);
    expect(planPrompt).toContain('Dehradun');
    expect(planPrompt).toContain('Budget');
    expect(planPrompt).toContain('History');
  });

  it('should resolve story generation fallback details', async () => {
    const story = await generateStory('Robber\'s Cave');
    expect(story).toBeDefined();
    expect(story.history).toContain('Guchhupani');
    expect(story.interestingFacts.length).toBeGreaterThan(0);
    expect(story.travelTips.length).toBeGreaterThan(0);
  });

  it('should resolve trip plan fallback data', async () => {
    const plan = await generateTripPlan('dehradun', 'Budget', 'Oct 1', 1, ['Nature']);
    expect(plan).toBeDefined();
    expect(plan.length).toBe(3);
    expect(plan[0].day).toBe(1);
    expect(plan[0].morning?.activityName).toContain('Robber\'s Cave');
  });

  it('should resolve destination recommendation fallbacks', async () => {
    const recs = await generateDestinationRecommendations('October', 'Mid-range', ['Heritage']);
    expect(recs).toBeDefined();
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].name).toContain('Jaipur');
  });

  it('should resolve local companion insights fallbacks', async () => {
    const insights = await generateLocalCompanionInsights('jaipur', ['Culture']);
    expect(insights).toBeDefined();
    expect(insights.city.toLowerCase()).toBe('jaipur');
    expect(insights.hiddenGems.length).toBeGreaterThan(0);
    expect(insights.safetyAdvice.length).toBeGreaterThan(0);
  });
});
