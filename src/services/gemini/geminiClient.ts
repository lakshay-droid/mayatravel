import { 
  getStoryPrompt, 
  getTripPlanPrompt, 
  getDestinationRecommendationsPrompt, 
  getLocalCompanionPrompt,
  FALLBACK_STORIES,
  FALLBACK_TRIP_PLANS,
  FALLBACK_RECOMMENDATIONS,
  FALLBACK_COMPANION
} from './prompts';
import type { StoryContent, ItineraryDay, DestinationRecommendation, CompanionInsights } from '../../types';
import { sanitizeString } from '../security';

const MOCK_DELAY = 1000;

// Resolve the API key or endpoint proxy URL
const LOCAL_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const PROXY_ENDPOINT = '/.netlify/functions/gemini-proxy';
const MODEL_NAME = 'gemini-2.5-flash';

// Helper to delay simulation (feels realistic for fallback mock calls, bypassed in tests)
const sleep = (ms: number) => {
  if (import.meta.env.MODE === 'test') {
    return Promise.resolve();
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
};

interface GeminiCandidate {
  content?: {
    parts?: Array<{
      text?: string;
    }>;
  };
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

/**
 * Secure API caller that handles Netlify functions or direct fallback.
 * 
 * @param prompt Prompt to send to Gemini API
 * @returns Parsed JSON response from Gemini
 */
async function callGeminiAPI(prompt: string): Promise<unknown> {
  if (import.meta.env.MODE === 'test') {
    throw new Error('Test environment: bypassing api call');
  }
  const payload = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: 'application/json'
    }
  };

  // 1. Try to call the Netlify serverless proxy function first (Recommended)
  try {
    const response = await fetch(PROXY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        payload
      })
    });

    if (response.ok) {
      const data = await response.json() as GeminiResponse;
      return parseGeminiResponse(data);
    }
  } catch (e) {
    console.warn('Netlify serverless function proxy failed or not available. Attempting direct browser fallback...', e);
  }

  // 2. If proxy fails and we have a local client key, call Google's API directly
  if (LOCAL_API_KEY) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${LOCAL_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json() as GeminiResponse;
        return parseGeminiResponse(data);
      }
    } catch (e) {
      console.error('Direct Gemini API call failed.', e);
    }
  }

  // Throw error to trigger mock fallback
  throw new Error('All API channels exhausted. Falling back to local dataset.');
}

/**
 * Parses Google Gemini response content safely and sanitizes the output string.
 * 
 * @param data Response payload from Gemini
 * @returns Parsed and sanitized JSON object
 */
function parseGeminiResponse(data: GeminiResponse): unknown {
  try {
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Empty content returned from Gemini.');
    }
    const sanitizedText = sanitizeString(text);
    return JSON.parse(sanitizedText);
  } catch (e) {
    console.error('Failed to parse Gemini response as JSON:', e, data);
    throw new Error('Invalid JSON format returned by AI.');
  }
}

// ==========================================
// EXPOSED API METHODS
// ==========================================

/**
 * Generates an immersive story about a specific heritage attraction.
 * Calls the Gemini AI API, falling back to a local mock dataset if the API is offline/unavailable.
 * 
 * @param {string} attractionName - The name of the tourist attraction to generate a story for.
 * @returns {Promise<StoryContent>} A promise that resolves to the structured story content.
 */
export async function generateStory(attractionName: string): Promise<StoryContent> {
  try {
    const prompt = getStoryPrompt(attractionName);
    const story = await callGeminiAPI(prompt);
    return story as StoryContent;
  } catch {
    console.log(`Using story mock fallback for: ${attractionName}`);
    await sleep(MOCK_DELAY);
    
    // Find matching story mock or return a generic one
    const matchingKey = Object.keys(FALLBACK_STORIES).find(
      key => attractionName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(attractionName.toLowerCase())
    );
    
    if (matchingKey && FALLBACK_STORIES[matchingKey]) {
      return FALLBACK_STORIES[matchingKey];
    }

    // Default generic fallback
    return {
      history: `The heritage history of ${attractionName} traces back centuries. Established by ancient dynasties, it served as a strategic and cultural epicenter. Over the generations, it saw massive renovations under different rulers, eventually transitioning into a modern symbol of local regional identity and national pride.`,
      legends: `Local myths whisper that ${attractionName} is blessed by celestial deities. Old tales say that a spiritual leader once performed intense meditations here, leaving a sacred imprint on the land that protects visitors from bad fortune.`,
      folklore: `Villagers hold the tradition that visiting ${attractionName} during the full moon brings harmony to families. Old folk songs celebrate this site as the bridge between the misty mountains and the plains below.`,
      architecture: `Built with locally sourced stones, limestone plaster, and intricate wood carvings. The arches reflect a fusion of classical Himalayan art and medieval regional styling, optimized to keep the interiors cool in summer.`,
      interestingFacts: [
        "Constructed entirely with local materials.",
        "Stands as an architectural reference of ancient style.",
        "Attracts thousands of local pilgrims during annual festivals.",
        "Contains natural hidden chambers built for defense."
      ],
      travelTips: [
        "Wear comfortable shoes as there is light walking involved.",
        "Photography is permitted inside the exterior courtyard.",
        "Explore early morning hours to beat the tourist rush.",
        "Buy local snacks from women-run cooperatives nearby."
      ]
    };
  }
}

/**
 * Generates a day-by-day customized travel itinerary based on budget, dates, group size, and interests.
 * Calls the Gemini AI API, falling back to a local mock dataset if the API is offline/unavailable.
 * 
 * @param {string} destination - The target travel destination.
 * @param {string} budget - The budget level preference (e.g. 'Economy', 'Standard', 'Luxury').
 * @param {string} dates - The trip date range or duration.
 * @param {number} groupSize - The size of the travel group.
 * @param {string[]} interests - A list of user interests (e.g. 'History', 'Adventure').
 * @returns {Promise<ItineraryDay[]>} A promise that resolves to an array of daily itineraries.
 */
export async function generateTripPlan(
  destination: string, 
  budget: string, 
  dates: string, 
  groupSize: number, 
  interests: string[]
): Promise<ItineraryDay[]> {
  try {
    const prompt = getTripPlanPrompt(destination, budget, dates, groupSize, interests);
    const plan = await callGeminiAPI(prompt);
    return plan as ItineraryDay[];
  } catch {
    console.log(`Using trip plan mock fallback for: ${destination}`);
    await sleep(MOCK_DELAY);

    const normDest = destination.toLowerCase();
    if (normDest.includes('dehradun') && FALLBACK_TRIP_PLANS['dehradun']) {
      return FALLBACK_TRIP_PLANS['dehradun'];
    }

    // Generic Itinerary generator
    return [
      {
        day: 1,
        date: "Day 1",
        title: `Exploring the Heart of ${destination}`,
        morning: {
          time: "09:00 AM - 12:00 PM",
          activityName: `Cultural Walk & Historic Center`,
          description: `Discover the oldest alleys and heritage monuments of ${destination}. Connect with local heritage guides.`,
          cost: "INR 100",
          duration: "3h"
        },
        afternoon: {
          time: "01:00 PM - 04:00 PM",
          activityName: `Local Food Tasting Tour`,
          description: `Sample authentic local specialties at generational street vendor stalls and family-run restaurants.`,
          cost: "INR 300",
          duration: "3h"
        },
        evening: {
          time: "05:00 PM - 08:00 PM",
          activityName: `Sunset Scenic Point & Crafts Market`,
          description: `Enjoy a gorgeous sunset from the highest local viewpoint and browse local artisan goods.`,
          cost: "Free",
          duration: "3h"
        },
        foodRecommendations: [
          "Try the traditional main course dish.",
          "Eat local milk sweets at a legacy store.",
          "Sip refreshing herbal tea."
        ],
        transport: "Walking and auto-rickshaws",
        estimatedCosts: "INR 1,200",
        weatherConsiderations: "Comfortable weather. Dress in light layers.",
        packingSuggestions: ["Comfortable shoes", "Cash", "Camera", "Sunglasses"]
      },
      {
        day: 2,
        date: "Day 2",
        title: `Hidden Gems & Local Stays`,
        morning: {
          time: "08:30 AM - 11:30 AM",
          activityName: `Secret Nature Trail Hike`,
          description: `A guided walk through a nearby forest sanctuary or orchard away from standard tourist tracks.`,
          cost: "INR 200",
          duration: "3h"
        },
        afternoon: {
          time: "12:30 PM - 03:30 PM",
          activityName: `Homestay Cooking Workshop`,
          description: `Cook a traditional meal alongside a local family host, learning age-old spice combinations.`,
          cost: "INR 500",
          duration: "3h"
        },
        evening: {
          time: "05:00 PM - 08:30 PM",
          activityName: `Bonfire & Folk Storytelling`,
          description: `Sit under the stars listening to regional myths and music performed by local village artists.`,
          cost: "INR 300",
          duration: "3.5h"
        },
        foodRecommendations: [
          "Hand-rolled flatbreads with wood-fired lentils.",
          "Fresh seasonal fruit jams.",
          "Traditional home-brewed drinks."
        ],
        transport: "Private car or local rentals",
        estimatedCosts: "INR 1,500",
        weatherConsiderations: "Pleasant breeze. Bring a light windbreaker jacket.",
        packingSuggestions: ["Walking boots", "Warm shawl", "Insect repellent"]
      },
      {
        day: 3,
        date: "Day 3",
        title: `Handicrafts & Departure`,
        morning: {
          time: "09:30 AM - 12:30 PM",
          activityName: `Artisan Woodcarving/Weaving Tour`,
          description: `Visit a cooperative workshop to learn how local woolens, brass, or wooden sculptures are made.`,
          cost: "Free",
          duration: "3h"
        },
        afternoon: {
          time: "01:30 PM - 04:30 PM",
          activityName: `Leisurely Garden Stroll & Museum`,
          description: `Visit the central regional museum containing old clothes, weapons, and historical manuscripts.`,
          cost: "INR 100",
          duration: "3h"
        },
        evening: {
          time: "05:30 PM - 07:30 PM",
          activityName: `Departure Transit Prep`,
          description: `Head back to your hotel, gather souvenirs, and prepare for onward transit back home.`,
          cost: "Free",
          duration: "2h"
        },
        foodRecommendations: [
          "Indulge in a wholesome heavy lunch platter.",
          "Drink fresh sugarcane or fruit juices.",
          "Pick up packets of local tea or spices to take home."
        ],
        transport: "Auto-rickshaw or taxi cab",
        estimatedCosts: "INR 800",
        weatherConsiderations: "Warm and bright. Wear a wide-brimmed hat.",
        packingSuggestions: ["Extra luggage bag for souvenirs", "Travel docs", "Charger pack"]
      }
    ];
  }
}

/**
 * Generates cultural or travel destination recommendations in India based on month, budget, and travel preferences.
 * Calls the Gemini AI API, falling back to a local mock dataset if the API is offline/unavailable.
 * 
 * @param {string} month - The month of travel.
 * @param {string} budget - The budget tier.
 * @param {string[]} preferences - User travel preferences.
 * @returns {Promise<DestinationRecommendation[]>} A promise that resolves to recommended destinations.
 */
export async function generateDestinationRecommendations(
  month: string, 
  budget: string, 
  preferences: string[]
): Promise<DestinationRecommendation[]> {
  try {
    const prompt = getDestinationRecommendationsPrompt(month, budget, preferences);
    const recs = await callGeminiAPI(prompt);
    return recs as DestinationRecommendation[];
  } catch {
    console.log('Using destination recommendations mock fallback');
    await sleep(MOCK_DELAY);
    return FALLBACK_RECOMMENDATIONS.default;
  }
}

/**
 * Generates local companion insights, safety guidelines, hidden gems, and etiquette for a given city.
 * Calls the Gemini AI API, falling back to a local mock dataset if the API is offline/unavailable.
 * 
 * @param {string} city - The target city name.
 * @param {string[]} preferences - User travel preferences to customize tips.
 * @returns {Promise<CompanionInsights>} A promise that resolves to local companion insights.
 */
export async function generateLocalCompanionInsights(
  city: string, 
  preferences: string[]
): Promise<CompanionInsights> {
  try {
    const prompt = getLocalCompanionPrompt(city, preferences);
    const insights = await callGeminiAPI(prompt);
    return insights as CompanionInsights;
  } catch {
    console.log(`Using local companion mock fallback for: ${city}`);
    await sleep(MOCK_DELAY);
    
    const normCity = city.toLowerCase();
    if (normCity.includes('jaipur')) {
      return FALLBACK_COMPANION.jaipur;
    }
    
    // Default to Dehradun data if not Jaipur or others
    return {
      ...FALLBACK_COMPANION.dehradun,
      city: city
    };
  }
}
