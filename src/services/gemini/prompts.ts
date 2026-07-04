import type { StoryContent, ItineraryDay, DestinationRecommendation, CompanionInsights } from '../../types';

// Prompts templates to avoid repetition and enforce structured JSON
/**
 * Generates the system prompt for the Gemini AI model to construct an immersive,
 * structured story about a specific heritage attraction.
 * 
 * @param {string} attractionName - The name of the tourist or heritage attraction.
 * @returns {string} The formatted system prompt requesting structured JSON output.
 */
export const getStoryPrompt = (attractionName: string) => `
You are a local cultural storyteller and heritage expert. Generate an immersive, detailed story about the attraction: "${attractionName}".
Your output must be a valid JSON object matching the following structure (do not wrap in markdown code blocks, just raw JSON):
{
  "history": "Deep historical background, founders, historical timeline in 2-3 engaging paragraphs",
  "legends": "Immersive mystical stories, myths, or oral legends associated with this place in 1-2 paragraphs",
  "folklore": "Quirky local folklore, daily beliefs of the community, or local idioms associated with it",
  "architecture": "Stylistic detailing, materials used, structural wonders, or carvings design details",
  "interestingFacts": ["Fact 1", "Fact 2", "Fact 3", "Fact 4"],
  "travelTips": ["Best time to visit detail", "Local etiquette/dress code rules", "Hidden vantage points", "Local food nearby"]
}
`;

/**
 * Generates the system prompt for the Gemini AI model to create a customized,
 * day-by-day travel itinerary based on user preferences.
 * 
 * @param {string} destination - The target city or destination.
 * @param {string} budget - The budget level (e.g., 'Economy', 'Luxury').
 * @param {string} dates - The travel duration or specific dates.
 * @param {number} groupSize - The number of people traveling.
 * @param {string[]} interests - A list of user interests to customize activities.
 * @returns {string} The formatted system prompt requesting structured JSON itinerary output.
 */
export const getTripPlanPrompt = (destination: string, budget: string, dates: string, groupSize: number, interests: string[]) => `
You are an expert personalized travel planner. Create a premium, day-by-day travel itinerary for "${destination}" from ${dates}.
The trip parameters are:
- Budget level: ${budget}
- Travel Group Size: ${groupSize}
- User Interests: ${interests.join(', ')}

Output must be a valid JSON array of 3 days. Each element must match this structure (do not wrap in markdown, just raw JSON):
[
  {
    "day": 1,
    "date": "Day 1 Date",
    "title": "Day Theme (e.g., Heritage & Mysticism)",
    "morning": {
      "time": "08:00 AM - 12:00 PM",
      "activityName": "Name of activity",
      "description": "Engaging description customized to interests",
      "cost": "Est. cost in INR",
      "duration": "4h"
    },
    "afternoon": {
      "time": "12:30 PM - 04:00 PM",
      "activityName": "Name of activity",
      "description": "Engaging description and local lunch spot",
      "cost": "Est. cost in INR",
      "duration": "3.5h"
    },
    "evening": {
      "time": "05:00 PM - 08:30 PM",
      "activityName": "Name of activity",
      "description": "Relaxing evening walk, market or event",
      "cost": "Est. cost in INR",
      "duration": "3.5h"
    },
    "foodRecommendations": ["Local dish to try", "Authentic street food shop", "A hidden dinner gem"],
    "transport": "Best transit method (e.g., walking + auto-rickshaw)",
    "estimatedCosts": "Total Day Cost in INR",
    "weatherConsiderations": "Advice matching local weather typical conditions",
    "packingSuggestions": ["Item 1", "Item 2"]
  }
]
`;

/**
 * Generates the system prompt for the Gemini AI model to recommend cultural or travel destinations
 * in India based on month, budget, and travel preferences.
 * 
 * @param {string} month - The month of travel.
 * @param {string} budget - The budget level.
 * @param {string[]} preferences - User preferences filter (e.g., 'Adventure', 'History').
 * @returns {string} The formatted system prompt requesting a structured JSON array of recommendations.
 */
export const getDestinationRecommendationsPrompt = (month: string, budget: string, preferences: string[]) => `
Recommend 4 of the best cultural or travel destinations in India for the month of "${month}" on a "${budget}" budget. 
Preferences filter: ${preferences.join(', ')}.

Output must be a valid JSON array of 4 objects matching this structure (do not wrap in markdown, just raw JSON):
[
  {
    "name": "Destination Name (e.g., Hampi)",
    "matchScore": 95,
    "description": "Compelling 2-sentence description highlighting why it fits the preferences",
    "weather": "Weather summary during this month",
    "festivals": ["Festival name occurring in this month or local celebration"],
    "touristCrowd": "Low" | "Medium" | "High",
    "budgetEstimate": "Total estimated budget range in INR",
    "bestExperiences": ["Experience 1", "Experience 2", "Experience 3"]
  }
]
`;

/**
 * Generates the system prompt for the Gemini AI model to act as a virtual local companion,
 * providing insights, etiquette, safety guides, and hidden gems for a city.
 * 
 * @param {string} city - The target city.
 * @param {string[]} preferences - User travel preferences to tailor insights.
 * @returns {string} The formatted system prompt requesting a structured JSON companion guide.
 */
export const getLocalCompanionPrompt = (city: string, preferences: string[]) => `
You are a local virtual companion for "${city}". Generate custom local insights, safety guides, and cultural tips.
User travel preferences: ${preferences.join(', ')}.

Output must be a valid JSON object matching this structure (do not wrap in markdown, just raw JSON):
{
  "city": "${city}",
  "hiddenGems": [
    {
      "name": "Name of gem",
      "description": "What makes it special?",
      "whyLocalsLove": "Why do locals love it?",
      "distance": "Distance from city center (e.g. 5 km)",
      "crowdLevel": "Low" | "Medium" | "High"
    }
  ],
  "festivals": [
    {
      "name": "Festival/Event Name",
      "date": "Season / Approximate date",
      "description": "What happens?"
    }
  ],
  "etiquette": ["Greeting custom", "Eating habit", "Photography rules"],
  "scamAlerts": ["Common tourist trap in this city", "How to negotiate transport fare"],
  "safetyAdvice": ["Area to avoid late night", "Solo female safety tip", "Tap water advice"],
  "dressCode": "Standard advice for temples, street walks, etc.",
  "nearbyWashrooms": ["Vantage point/mall/hotel with clean facilities"],
  "weatherForecast": "Typical seasonal climate advice for current months"
}
`;


// ==========================================
// FALLBACK MOCK DATA FOR DESTINATIONS
// ==========================================

/**
 * Mock fallback story data for popular attractions when the AI API is offline or unavailable.
 * Maps attraction names to StoryContent objects containing history, legends, folklore, and travel tips.
 * 
 * @type {Record<string, StoryContent>}
 */
export const FALLBACK_STORIES: Record<string, StoryContent> = {
  "Robber's Cave": {
    history: "Robber's Cave (locally known as Guchhupani) is a natural river cave formation located near Dehradun. Historically, during the British rule in India, local bandits and robbers used this 600-meter-long cave complex as a hideout. They would plunder British caravans and escape into the narrow, dark crevice, using the complex cave structure to hide their loot and vanish into the wilderness.",
    legends: "According to local folklore, the cave has a mysterious mechanism where water suddenly disappears at certain points and reappears further down. Legend says that the cave is guarded by forest spirits who would create sudden flash torrents to sweep away anyone entering with greedy or evil intentions, protecting the stolen treasures of old still rumored to be buried deep in the limestone walls.",
    folklore: "Locals tell stories of 'Guchhupani' being linked via an underground tunnel to other caves in Mussoorie. Older villagers claim that early morning travelers would occasionally hear the echoing laughter of ancient bandits playing dice inside the caves, although only the sound of cold gushing river water remains today.",
    architecture: "It is a geological marvel rather than human architecture. The cave is formed by a narrow cleft in a conglomerate limestone area. The natural ceiling has collapsed at points, allowing shafts of sunlight to filter down onto the flowing riverbed inside. The cave features a freezing cold natural spring that flows out of a dark, narrow gorge.",
    interestingFacts: [
      "The cave is 600 meters long and has a natural waterfall inside.",
      "Water disappears underground only to erupt again a few yards later.",
      "The cave remains remarkably cold even during scorching summer months.",
      "It was featured in several early Indian adventurous folklore books."
    ],
    travelTips: [
      "Carry an extra pair of dry clothes and slippers, as you will have to wade through knee-deep water.",
      "Visit early in the morning (around 8:30 AM) to experience the cave in absolute silence before crowds arrive.",
      "Avoid visiting during heavy monsoon rains as water levels inside can rise rapidly.",
      "Try local roasted sweet corn (bhutta) sold by local vendors outside the entrance."
    ]
  },
  "Hawa Mahal": {
    history: "Built in 1799 by Maharaja Sawai Pratap Singh, Hawa Mahal is a unique extension of the Royal City Palace in Jaipur. It was designed by Lal Chand Ustad in the form of the crown of Krishna, the Hindu god. The structure was built primarily to allow the royal women of the court to observe daily street festivities and public life without being seen, adhering to the strict rules of 'purdah' (veiling) of that era.",
    legends: "Legends say that Maharaja Sawai Pratap Singh was so devoted to Lord Krishna that he wanted to build a structure resembling Krishna's crown that could catch the wind from all directions. The palace was rumored to have secret tunnels running from the City Palace to the Hawa Mahal, allowing the royal queens to travel under the protection of the shadows.",
    folklore: "In Jaipur's folklore, Hawa Mahal is called the 'Palace of Winds' because of the whistling sounds that echo through its tiny lattice windows during stormy nights. Locals believe the wind acts as a perpetual royal musician, playing natural symphonies for the spirits of the past queens who once stood behind the screens.",
    architecture: "Constructed of red and pink sandstone, the five-story exterior resembles a honeycomb with its 953 small casements called 'jharokhas'. These are decorated with intricate latticework. The lattice design creates a Venturi effect, forcing cool air through the passages and keeping the interior cool during the hot Rajasthani summers.",
    interestingFacts: [
      "Hawa Mahal is the tallest building in the world built without a foundation.",
      "It has 953 tiny windows (jharokhas) decorated with intricate latticework.",
      "There are no stairs to climb to the upper floors; only ramps are used.",
      "The building is only about 1.5 feet deep at the top."
    ],
    travelTips: [
      "The best photography spot is from the rooftop cafes directly across the street.",
      "Visit at sunrise when the golden light strikes the pink sandstone exterior.",
      "Enter from the back entrance rather than looking only at the front facade.",
      "Hire a local guide to show you the optical illusions created by the window angles."
    ]
  },
  "Dashashwamedh Ghat": {
    history: "Dashashwamedh Ghat is the primary and most spectacular ghat on the Ganges River in Varanasi. Historically, it was built by Peshwa Balaji Baji Rao in 1748. The ghat has been a center of spiritual congregation for thousands of years. It is famous for the daily Ganga Aarti, a highly choreographed ritual of fire worship performed by young priests.",
    legends: "According to Hindu mythology, Lord Brahma (the creator god) performed the ten-horse sacrifice (Dasa-Ashwamedha yajna) at this exact spot to welcome Lord Shiva back from exile. Hence, taking a bath at this ghat is believed to wash away all sins and grant the spiritual merit of performing ten grand horse sacrifices.",
    folklore: "Local boatmen tell stories of the river Ganges possessing consciousness. They believe the river rises during the monsoons to touch the feet of the temples on the ghat as a sign of respect. It is said that anyone who sits quietly at the ghat for a night will hear the faint chanting of ancient sages echoing from the river currents.",
    architecture: "The ghat consists of wide sandstone steps leading down to the river, flanked by ancient temples, ashrams, and shrines. The architecture is typical of Maratha riverfront style, characterized by sturdy stone platforms, arched alcoves, and pavilions designed to withstand the heavy seasonal floods of the Ganges.",
    interestingFacts: [
      "The daily Ganga Aarti has been performed here uninterrupted for centuries.",
      "It is the main ghat and divides the northern and southern ghats of Varanasi.",
      "The ghat was completely reconstructed in stone during the Maratha Empire.",
      "Thousands of clay lamps (diyas) are floated on the water here every evening."
    ],
    travelTips: [
      "Book a shared or private wooden boat at 5:30 PM to watch the Ganga Aarti from the water.",
      "Be respectful of pilgrims and avoid taking close-up photos of people bathing or praying without permission.",
      "Watch out for aggressive vendors selling flowers or offering blessings in exchange for large sums.",
      "Taste the famous Malaiyo (saffron milk foam dessert) in the alleys nearby during winter mornings."
    ]
  }
};

/**
 * Mock fallback day-by-day trip itineraries for popular cities when the AI API is offline or unavailable.
 * Maps city names to arrays of ItineraryDay objects.
 * 
 * @type {Record<string, ItineraryDay[]>}
 */
export const FALLBACK_TRIP_PLANS: Record<string, ItineraryDay[]> = {
  "dehradun": [
    {
      day: 1,
      date: "Day 1",
      title: "Nature & Underground Caves",
      morning: {
        time: "09:00 AM - 12:00 PM",
        activityName: "Explore Robber's Cave (Guchhupani)",
        description: "Wade through cold, knee-deep river waters inside a narrow limestone cave formation. Experience the natural spring and cave waterfall.",
        cost: "INR 35 (Entry) + INR 10 (Sandal Rent)",
        duration: "3h"
      },
      afternoon: {
        time: "01:00 PM - 03:30 PM",
        activityName: "Lunch & Walk in Forest Research Institute (FRI)",
        description: "Visit the massive Greco-Roman style colonial architecture campus of FRI, surrounded by lush botanical gardens. Taste local Pahadi cuisine nearby.",
        cost: "INR 150 (Entry)",
        duration: "2.5h"
      },
      evening: {
        time: "04:30 PM - 07:30 PM",
        activityName: "Mindrolling Buddhist Monastery & Market",
        description: "Marvel at the 185-foot-tall Great Stupa, walk around the peaceful gardens, and browse Tibetan handicrafts and clothing in Clement Town market.",
        cost: "Free (Donations welcome)",
        duration: "3h"
      },
      foodRecommendations: [
        "Try authentic Pahadi Kadi-Chawal and Singori sweet at a local eatery.",
        "Eat Tibetan Steamed Momos and Thukpa outside the Mindrolling Monastery.",
        "Grab bakery items from the iconic Ellora's Melting Moments on Rajpur Road."
      ],
      transport: "Local auto-rickshaw (Vikram) or rental scooter.",
      estimatedCosts: "INR 800 per person",
      weatherConsiderations: "Warm during the day, cool breeze in the evening. Carry an umbrella during July monsoons.",
      packingSuggestions: ["Quick-dry shorts", "Waterproof sandals", "Camera", "Hand sanitizer"]
    },
    {
      day: 2,
      date: "Day 2",
      title: "Healing Springs & Valley Views",
      morning: {
        time: "08:30 AM - 11:30 AM",
        activityName: "Dip in Sahastradhara Sulphur Springs",
        description: "Visit the 'Thousandfold Spring' known for its therapeutic sulphur water pools and beautiful terraced limestone caves.",
        cost: "Free (Entry) + INR 50 (Lockers)",
        duration: "3h"
      },
      afternoon: {
        time: "12:30 PM - 03:30 PM",
        activityName: "Tapkeshwar Mahadev Temple",
        description: "A cave temple dedicated to Lord Shiva where water droplets from the cave ceiling continuously drip onto the natural Shivalinga.",
        cost: "Free",
        duration: "3h"
      },
      evening: {
        time: "04:30 PM - 08:30 PM",
        activityName: "Sunset at Rajpur Road Cafes & shopping",
        description: "Explore the upscale cafes overlooking the hills of Mussoorie, and shop for local wooden crafts and woolens.",
        cost: "INR 500 (Dinner)",
        duration: "4h"
      },
      foodRecommendations: [
        "Enjoy a hot cup of tea and bun-maska at a roadside shack.",
        "Try local Garhwali dishes like Chainsoo and Phaanu at a traditional cafe.",
        "Indulge in fusion desserts at Rajpur Road."
      ],
      transport: "Cab or private rental scooter.",
      estimatedCosts: "INR 1000 per person",
      weatherConsiderations: "Pleasant afternoon temperatures. Very breezy in the evening.",
      packingSuggestions: ["Light sweater", "Comfortable walking shoes", "Sunscreen"]
    },
    {
      day: 3,
      date: "Day 3",
      title: "Local Heritage & Craft Trail",
      morning: {
        time: "09:30 AM - 12:00 PM",
        activityName: "Dehradun Zoo & Malsi Deer Park",
        description: "A peaceful morning walk among pine forests, spotting deer, colorful birds, and local Himalayan flora.",
        cost: "INR 50 (Entry)",
        duration: "2.5h"
      },
      afternoon: {
        time: "01:00 PM - 04:00 PM",
        activityName: "Heritage Walk in Paltan Bazaar",
        description: "Wander through the historic heart of Dehradun, exploring spices, local dry fruits, and handcrafted brass items.",
        cost: "Free",
        duration: "3h"
      },
      evening: {
        time: "05:00 PM - 07:30 PM",
        activityName: "Lachhiwala Picnic Spot & Sunset",
        description: "Relax by the natural water streams flowing through the dense Sal forest. Excellent birdwatching opportunity.",
        cost: "INR 20 (Entry)",
        duration: "2.5h"
      },
      foodRecommendations: [
        "Buy pure Himalayan honey and local walnuts from Paltan Bazaar.",
        "Taste piping hot Samosas and Jalebis at Kumar Sweet House.",
        "Enjoy fresh fruit chaat by the canal."
      ],
      transport: "Local bus or auto-rickshaws.",
      estimatedCosts: "INR 600 per person",
      weatherConsiderations: "Humid afternoon. Wear light, breathable clothing.",
      packingSuggestions: ["Hat", "Water bottle", "Insect repellent", "Cash for bazaar"]
    }
  ]
};

/**
 * Mock fallback destination recommendations when the AI API is offline or unavailable.
 * 
 * @type {Record<string, DestinationRecommendation[]>}
 */
export const FALLBACK_RECOMMENDATIONS: Record<string, DestinationRecommendation[]> = {
  "default": [
    {
      name: "Jaipur, Rajasthan",
      matchScore: 98,
      description: "Experience royal palaces, vibrant bazaars, and deep Rajput heritage. Perfect for culture, shopping, and photography enthusiasts.",
      weather: "Warm, dry days (25-32°C) with pleasant breezy evenings.",
      festivals: ["Teej Festival (monsoon folklore dances & parades)"],
      touristCrowd: "Medium",
      budgetEstimate: "INR 8,000 - 15,000",
      bestExperiences: ["Golden sunset view at Nahargarh Fort", "Heritage palace walk in Amber Fort", "Shopping for handmade block prints at Johari Bazaar"]
    },
    {
      name: "Varanasi, Uttar Pradesh",
      matchScore: 94,
      description: "One of the oldest continuously inhabited cities in the world. Ideal for spiritual seekers, history lovers, and street photographers.",
      weather: "Humid but spiritually refreshing with river breezes.",
      festivals: ["Ganga Aarti celebrations & Dev Deepawali preparations"],
      touristCrowd: "High",
      budgetEstimate: "INR 5,000 - 9,000",
      bestExperiences: ["Early morning boat ride on the Ganges", "Exploring narrow labyrinth alleys", "Eating hot Kachori Sabzi & Malaiyo"]
    },
    {
      name: "Goa (North & South)",
      matchScore: 89,
      description: "Portuguese-influenced heritage churches, spice plantations, and golden sandy beaches. Perfect for nature, food, and history lovers.",
      weather: "Tropical and lush, beach breezes, sporadic rains.",
      festivals: ["Bonderam Festival (traditional flag parade on Divar Island)"],
      touristCrowd: "Medium",
      budgetEstimate: "INR 10,000 - 20,000",
      bestExperiences: ["Touring colonial Fontainhas Latin Quarter", "Visiting Sahakari Spice Farm with local lunch", "Watching sunset at Cabo de Rama Fort"]
    },
    {
      name: "Hampi, Karnataka",
      matchScore: 92,
      description: "A UNESCO World Heritage site consisting of ruins of the ancient Vijayanagara Empire amidst boulder-strewn hills. Perfect for history and adventure.",
      weather: "Mild, comfortable winds among historic monoliths.",
      festivals: ["Hampi Utsav (classical dance, drama & music festivals)"],
      touristCrowd: "Low",
      budgetEstimate: "INR 6,000 - 10,000",
      bestExperiences: ["Cycling through ruins of Virupaksha Temple", "Coracle boat ride on Tungabhadra River", "Watching sunset from Matanga Hill"]
    }
  ]
};

/**
 * Mock fallback local companion insights for popular cities when the AI API is offline or unavailable.
 * Maps city names to CompanionInsights objects containing hidden gems, safety advice, and dress codes.
 * 
 * @type {Record<string, CompanionInsights>}
 */
export const FALLBACK_COMPANION: Record<string, CompanionInsights> = {
  "dehradun": {
    city: "Dehradun",
    hiddenGems: [
      {
        name: "Maldevta",
        description: "A serene riverside valley surrounded by green hills, away from tourist crowds.",
        whyLocalsLove: "Quiet stream swimming, local tea shops, and scenic bike rides.",
        distance: "12 km",
        crowdLevel: "Low"
      },
      {
        name: "Shikhar Falls",
        description: "A small waterfall hidden in the hills, requiring a short trek through a jungle stream.",
        whyLocalsLove: "Raw nature, clean water pools, and peaceful trekking trail.",
        distance: "10 km",
        crowdLevel: "Low"
      }
    ],
    festivals: [
      {
        name: "Jhanda Fair",
        date: "March / April",
        description: "A historical fair celebrating the arrival of Guru Ram Rai. A massive flagpole is raised at the Darbar Sahib."
      },
      {
        name: "Likhai Art Workshops",
        date: "Frequent weekends",
        description: "Community woodcarving and traditional aipan art gatherings."
      }
    ],
    etiquette: [
      "Remove shoes before entering Buddhist monasteries or Hindu temples.",
      "Dress modestly when visiting holy sites (shoulders and knees covered).",
      "Greet elders with 'Namaste' or 'Pranam'."
    ],
    scamAlerts: [
      "Taxi drivers at Dehradun Railway Station may quote double prices. Always use app-based cabs or negotiate based on local auto rates (Vikram).",
      "Avoid buying low-quality 'Basmati rice' from shops directly on highway tourist traps. Buy from Paltan Bazaar instead."
    ],
    safetyAdvice: [
      "Avoid visiting Robber's Cave during heavy rainstorms due to flash flood risks.",
      "Keep emergency numbers handy. Dehradun is generally very safe, but walking in forest outskirts after sunset is not recommended due to leopards.",
      "Only drink bottled or filtered RO water."
    ],
    dressCode: "Comfortable layers. Dehradun has breezy evenings. Modest clothes for religious sites.",
    nearbyWashrooms: [
      "Pacific Mall (Rajpur Road) has clean public facilities.",
      "Max Super Speciality Hospital is a clean landmark in case of emergencies."
    ],
    weatherForecast: "Pleasant climate (20-30°C). Beautiful misty mountain clouds."
  },
  "jaipur": {
    city: "Jaipur",
    hiddenGems: [
      {
        name: "Panna Meena ka Kund",
        description: "An ancient, 16th-century stepwell famous for its beautiful symmetrical stairways.",
        whyLocalsLove: "Fascinating architecture, peaceful mornings, and excellent geometric photo compositions.",
        distance: "11 km",
        crowdLevel: "Medium"
      },
      {
        name: "Galta Ji (Monkey Temple)",
        description: "A sacred Hindu pilgrimage site featuring natural fresh-water springs and holy water tanks built into a mountain pass.",
        whyLocalsLove: "Beautiful sunset valley views and unique architecture built into cliffs.",
        distance: "8 km",
        crowdLevel: "Medium"
      }
    ],
    festivals: [
      {
        name: "Gangaur Festival",
        date: "March / April",
        description: "A colorful festival celebrating marital fidelity, featuring massive public processions of goddess Gauri through the streets."
      },
      {
        name: "Jaipur Literature Festival (JLF)",
        date: "January / February",
        description: "The world's largest free literary festival, bringing global writers and readers to Jaipur."
      }
    ],
    etiquette: [
      "Always take off shoes before stepping into temples.",
      "Do not touch religious statues with your feet.",
      "Ask permission before photographing local street vendors or colorful elders."
    ],
    scamAlerts: [
      "Beware of the 'Gem Scam' where drivers offer to take you to a warehouse to buy cheap gems to resell in your home country. This is always a fraud.",
      "Politely refuse guides who claim the City Palace is closed and offer to take you to an emporium instead."
    ],
    safetyAdvice: [
      "Stay hydrated. Jaipur can get extremely hot. Always carry water.",
      "Hold onto your belongings at Galta Ji temple, as the resident monkeys are known to grab food, glasses, or phones.",
      "Use reputable app-based transit like Ola or Uber for long distances."
    ],
    dressCode: "Breathable cottons. Long pants/skirts. Bring a scarf to cover your head if entering shrines.",
    nearbyWashrooms: [
      "City Palace tourist complex has clean restrooms.",
      "WTP Mall (Malviya Nagar) offers premium international standard toilets."
    ],
    weatherForecast: "Sunny, hot during day (30-36°C). Cool desert breeze at night."
  }
};
