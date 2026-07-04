import type { Attraction, LocalStay } from '../types';

export const ATTRACTIONS_BY_CITY: Record<string, Attraction[]> = {
  "dehradun": [
    {
      id: "deb-1",
      name: "Robber's Cave",
      lat: 30.3783,
      lng: 78.0612,
      category: "Adventure",
      description: "A natural river cave formation locally known as Guchhupani. Visitors can wade through cold knee-deep water between narrow conglomerate limestone walls.",
      openingHours: "07:00 AM - 06:00 PM",
      bestTime: "March to June (Summer)",
      nearbyAttractions: ["Malsi Deer Park", "Sahastradhara"],
      visitDuration: "2 hours",
      difficulty: "Moderate",
      photo: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "deb-2",
      name: "Mindrolling Monastery",
      lat: 30.2599,
      lng: 78.0076,
      category: "Culture",
      description: "One of the largest Buddhist centers in India, featuring a majestic 185-foot-tall Great Stupa and beautiful landscaped gardens.",
      openingHours: "09:00 AM - 07:00 PM",
      bestTime: "October to March",
      nearbyAttractions: ["Clement Town Bazaar"],
      visitDuration: "1.5 hours",
      difficulty: "Easy",
      photo: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "deb-3",
      name: "Forest Research Institute",
      lat: 30.3414,
      lng: 77.9972,
      category: "Museums",
      description: "A premier research institution featuring magnificent Greco-Roman colonial architecture and six museums covering forestry, botany, and timber.",
      openingHours: "09:00 AM - 05:30 PM",
      bestTime: "September to April",
      nearbyAttractions: ["Tapkeshwar Temple"],
      visitDuration: "2.5 hours",
      difficulty: "Easy",
      photo: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "deb-4",
      name: "Tapkeshwar Mahadev Temple",
      lat: 30.3552,
      lng: 78.0205,
      category: "Temples",
      description: "A popular cave temple dedicated to Lord Shiva, located on the forest banks of the Tons River, where water droplets naturally drip on the Shivalinga.",
      openingHours: "06:00 AM - 08:00 PM",
      bestTime: "Shivratri Festival",
      nearbyAttractions: ["Forest Research Institute"],
      visitDuration: "1 hour",
      difficulty: "Easy",
      photo: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "deb-5",
      name: "Maldevta Picnic Spot",
      lat: 30.3496,
      lng: 78.1189,
      category: "Hidden Gems",
      description: "A serene riverside valley surrounded by green hills, popular among locals for weekend picnics and slow riverside walks.",
      openingHours: "24 Hours open",
      bestTime: "October to April",
      nearbyAttractions: ["Sahastradhara"],
      visitDuration: "3 hours",
      difficulty: "Easy",
      photo: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "deb-6",
      name: "Kumar Sweets & Snacks",
      lat: 30.3222,
      lng: 78.0416,
      category: "Food",
      description: "A legendary local culinary institution famous for its traditional Garhwali sweets, piping hot Samosas, and Rasmalai.",
      openingHours: "08:00 AM - 10:00 PM",
      bestTime: "Evening snack hours",
      nearbyAttractions: ["Paltan Bazaar"],
      visitDuration: "45 mins",
      difficulty: "Easy",
      photo: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"
    }
  ],
  "jaipur": [
    {
      id: "jai-1",
      name: "Hawa Mahal",
      lat: 26.9239,
      lng: 75.8267,
      category: "Culture",
      description: "The 'Palace of Winds' is a stunning five-story red and pink sandstone honeycomb facade built in 1799 for royal women to watch street scenes.",
      openingHours: "09:00 AM - 05:00 PM",
      bestTime: "Sunrise photography hours",
      nearbyAttractions: ["City Palace", "Jantar Mantar"],
      visitDuration: "1 hour",
      difficulty: "Easy",
      photo: "https://images.unsplash.com/photo-1477584308802-e9c378852d92?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "jai-2",
      name: "Galta Ji (Monkey Temple)",
      lat: 26.9168,
      lng: 75.8586,
      category: "Temples",
      description: "An ancient Hindu pilgrimage site with natural water springs and seven sacred bathing pools, nestled between mountain passes and home to friendly macaques.",
      openingHours: "05:00 AM - 07:00 PM",
      bestTime: "Late afternoon / Sunset",
      nearbyAttractions: ["Sisodia Rani Garden"],
      visitDuration: "2 hours",
      difficulty: "Moderate",
      photo: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "jai-3",
      name: "Panna Meena ka Kund",
      lat: 26.9934,
      lng: 75.8496,
      category: "Hidden Gems",
      description: "A gorgeous symmetrical stepwell and rain-water catchment basin from the 16th century, featuring nested geometric staircases.",
      openingHours: "07:00 AM - 06:00 PM",
      bestTime: "Morning",
      nearbyAttractions: ["Anokhi Museum of Block Printing", "Amber Fort"],
      visitDuration: "45 mins",
      difficulty: "Easy",
      photo: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "jai-4",
      name: "Nahargarh Fort Cycling Trail",
      lat: 26.9374,
      lng: 75.8156,
      category: "Adventure",
      description: "An energetic cycling loop that winds up the Aravalli hills to Nahargarh Fort, offering panoramic sunrise views of Jaipur city.",
      openingHours: "06:00 AM - 09:00 AM (for cycling)",
      bestTime: "Early morning winter months",
      nearbyAttractions: ["Jaigarh Fort"],
      visitDuration: "3 hours",
      difficulty: "Challenging",
      photo: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
    }
  ]
};

export const LOCAL_STAYS_BY_CITY: Record<string, LocalStay[]> = {
  "dehradun": [
    {
      id: "stay-deb-1",
      name: "Dwarika Homestay & Orchard",
      type: "Apple Orchard",
      location: "Rajpur Foothills, Dehradun",
      price: "₹3,200 / night",
      rating: 4.9,
      photos: ["https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=500&q=80"],
      cultureExperience: ["Fresh Apple Harvesting", "Garhwali Cooking Class", "Stargazing Bonfire"],
      hostName: "Mama Dwarika Negi",
      description: "Nestled in the higher foothills of Rajpur, this traditional stone homestay is surrounded by organic apple trees and wild berries."
    },
    {
      id: "stay-deb-2",
      name: "The Doon Valley Tea Estate Retreat",
      type: "Tea Estate",
      location: "Vikasnagar, Dehradun Outskirts",
      price: "₹4,500 / night",
      rating: 4.8,
      photos: ["https://images.unsplash.com/photo-1563889362-57c2a5d1644d?auto=format&fit=crop&w=500&q=80"],
      cultureExperience: ["Tea Leaf Plucking", "Artisan Woodcarving Workshop", "Local Village Walk"],
      hostName: "Ranjit & Devika Singh",
      description: "Stay in a restored 1920s colonial planter bungalow. Wake up to the aroma of fresh tea leaves and misty morning walks."
    }
  ],
  "jaipur": [
    {
      id: "stay-jai-1",
      name: "Haveli Kalwara Heritage Homestay",
      type: "Homestay",
      location: "Johari Bazaar, Old City Jaipur",
      price: "₹2,800 / night",
      rating: 4.7,
      photos: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80"],
      cultureExperience: ["Block Printing Tutorial", "Rajasthani Puppetry Show", "Traditional Dal-Baati Dinner"],
      hostName: "Thakur Mahendra Singh",
      description: "A beautifully preserved 17th-century Haveli within the walls of the Pink City, run by direct descendants of royal court officers."
    }
  ]
};
