export interface TravelPreferences {
  id?: string;
  user_id?: string;
  personality: 'Adventure' | 'Culture' | 'Foodie' | 'Nature' | 'Luxury' | 'Photography' | 'History';
  favorite_destination: 'Mountains' | 'Beaches' | 'Cities' | 'Heritage' | 'Forests' | 'Deserts';
  transport_pref: 'Flight' | 'Train' | 'Bus' | 'Car' | 'Bike' | 'Walking';
  travel_group: 'Solo' | 'Couple' | 'Friends' | 'Family';
  food_pref: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Local Cuisine' | 'Street Food';
  budget: 'Budget' | 'Mid-range' | 'Luxury';
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  preferences?: TravelPreferences;
}

export interface Activity {
  time: string;
  activityName: string;
  description: string;
  cost: string;
  duration: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  morning: Activity;
  afternoon: Activity;
  evening: Activity;
  foodRecommendations: string[];
  transport: string;
  estimatedCosts: string;
  weatherConsiderations: string;
  packingSuggestions: string[];
}

export interface TripPlan {
  id?: string;
  user_id?: string;
  destination: string;
  budget: string;
  dates: string;
  group_size: number;
  interests: string[];
  itinerary: ItineraryDay[];
  created_at?: string;
}

export interface StoryContent {
  history: string;
  legends: string;
  folklore: string;
  architecture: string;
  interestingFacts: string[];
  travelTips: string[];
}

export interface LocalStay {
  id: string;
  name: string;
  type: 'Homestay' | 'Farm Stay' | 'Apple Orchard' | 'Tea Estate' | 'Village Stay';
  location: string;
  price: string;
  rating: number;
  photos: string[];
  cultureExperience: string[];
  hostName: string;
  description: string;
}

export interface Attraction {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: 'Food' | 'Culture' | 'Temples' | 'Museums' | 'Hidden Gems' | 'Shopping' | 'Adventure';
  description: string;
  openingHours: string;
  bestTime: string;
  nearbyAttractions: string[];
  visitDuration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  photo: string;
}

export interface DestinationRecommendation {
  name: string;
  matchScore: number;
  description: string;
  weather: string;
  festivals: string[];
  touristCrowd: 'Low' | 'Medium' | 'High';
  budgetEstimate: string;
  bestExperiences: string[];
}

export interface CompanionInsights {
  city: string;
  hiddenGems: {
    name: string;
    description: string;
    whyLocalsLove: string;
    distance: string;
    crowdLevel: string;
  }[];
  festivals: {
    name: string;
    date: string;
    description: string;
  }[];
  etiquette: string[];
  scamAlerts: string[];
  safetyAdvice: string[];
  dressCode: string;
  nearbyWashrooms: string[];
  weatherForecast: string;
}
