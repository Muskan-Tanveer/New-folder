export interface Destination {
  id: string;
  title: string;
  region: "North" | "South" | "Central" | "East" | "West";
  description: string;
  shortDesc: string;
  bestTime: string;
  howToReach: string;
  highlights: string[];
  image: string;
  rating: number;
}

export const destinations: Destination[] = [
  {
    id: "hunza-valley",
    title: "Hunza Valley",
    region: "North",
    description:
      "Hunza Valley is a stunning mountain valley in the Gilgit-Baltistan region. Known for its breathtaking scenery, ancient forts, and the famous Karimabad bazaar, it remains one of Pakistan's most beloved destinations.",
    shortDesc: "Breathtaking mountain valley with ancient forts and glaciers",
    bestTime: "March to October",
    howToReach: "Fly to Gilgit from Islamabad, then drive 2 hours to Hunza",
    highlights: ["Baltit Fort", "Attabad Lake", "Rakaposhi View", "Hunza Apricots"],
    image: "public\\images\s\hunza.jpg",
    rating: 4.9,
  },
  {
    id: "lahore",
    title: "Lahore",
    region: "East",
    description:
      "The cultural heart of Pakistan, Lahore is a city of Mughal grandeur, vibrant food streets, and rich history. Home to the Badshahi Mosque, Lahore Fort, and the famous Food Street.",
    shortDesc: "Cultural capital with Mughal heritage and amazing food",
    bestTime: "October to March",
    howToReach: "Direct flights from all major cities. Well-connected by motorway.",
    highlights: ["Badshahi Mosque", "Lahore Fort", "Shalimar Gardens", "Food Street"],
    image: "/images/lahore.jpg",
    rating: 4.8,
  },
  {
    id: "swat-valley",
    title: "Swat Valley",
    region: "North",
    description:
      "Called the 'Switzerland of Pakistan', Swat Valley is famous for lush green meadows, clear rivers, and snow-capped peaks. A paradise for nature lovers and adventure seekers.",
    shortDesc: "The Switzerland of Pakistan with green meadows and rivers",
    bestTime: "April to October",
    howToReach: "Drive 4-5 hours from Islamabad via M-1 Motorway",
    highlights: ["Malam Jabba", "Kalam", "Fizagat Park", "Swat Museum"],
    image: "/images/swat.jpg",
    rating: 4.7,
  },
  {
    id: "karachi",
    title: "Karachi",
    region: "South",
    description:
      "Pakistan's largest city and economic hub, Karachi offers beautiful beaches, amazing seafood, vibrant nightlife, and a diverse cultural mix that makes every visit unique.",
    shortDesc: "Pakistan's mega-city with beautiful beaches and seafood",
    bestTime: "November to February",
    howToReach: "Direct international flights. Major transport hub.",
    highlights: ["Clifton Beach", "Mohatta Palace", "Frere Hall", "Burns Road Food"],
    image: "/images/karachi.jpg",
    rating: 4.5,
  },
  {
    id: "skardu",
    title: "Skardu",
    region: "North",
    description:
      "Gateway to the world's highest peaks including K2, Skardu is a mesmerizing high-altitude valley with serene lakes, ancient ruins, and some of the world's most dramatic landscapes.",
    shortDesc: "Gateway to K2 with stunning lakes and dramatic landscapes",
    bestTime: "May to September",
    howToReach: "Fly from Islamabad to Skardu Airport (weather permitting)",
    highlights: ["Shangrila Resort", "Deosai Plains", "Kachura Lakes", "Skardu Fort"],
    image: "/images/skardu.jpg",
    rating: 4.9,
  },
  {
    id: "islamabad",
    title: "Islamabad",
    region: "Central",
    description:
      "Pakistan's beautiful capital city, built in the 1960s, combines modern architecture with natural beauty. Surrounded by the Margalla Hills, it's one of the greenest capitals in Asia.",
    shortDesc: "Pakistan's green capital with modern architecture and hiking trails",
    bestTime: "Year-round (Spring and Autumn best)",
    howToReach: "International airport (NIIA) with direct flights worldwide",
    highlights: ["Faisal Mosque", "Margalla Hills Trails", "Daman-e-Koh", "Lok Virsa Museum"],
    image: "/images/islamabad.jpg",
    rating: 4.6,
  },
];