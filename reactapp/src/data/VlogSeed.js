// data/VlogPageData.ts
import { VlogPageData } from "../types/Vlog";

const vlogPages: VlogPageData[] = [
  {
    id: 1,
    blogName: "Travel Vlogs by Anna",
    posts: [
      {
        id: 1,
        title: "Exploring Kyoto",
        description: "A peaceful walk through ancient temples and bamboo forests.",
        date: "Dec 7, 2024",
        image: "https://placehold.co/800x400",
        content: "Kyoto is known for its stunning temples, tea houses, and tranquil scenery..."
      },
      {
        id: 2,
        title: "Weekend in Barcelona",
        description: "Architecture, tapas, and beach sunsets.",
        date: "Sep 2, 2024",
        image: "https://placehold.co/800x400",
        content: "Barcelona’s charm lies in its vibrant street life, art, and food culture..."
      }
    ],
    about: {
      title: "About Me",
      image: "https://placehold.co/100x100",
      description: "I'm Anna, a travel filmmaker capturing unique cultures and stories around the world."
    },
    popularPosts: [
      "https://placehold.co/300x200",
      "https://placehold.co/300x200",
      "https://placehold.co/300x200"
    ],
    followText: "Follow me on Instagram @travelwithanna for daily updates and stories."
  },
  {
    id: 2,
    blogName: "Mountain Treks by Erik",
    posts: [
      {
        id: 3,
        title: "Climbing the Alps",
        description: "A thrilling climb through the snowy peaks of the Alps.",
        date: "Jan 15, 2025",
        image: "https://placehold.co/800x400",
        content: "The climb was challenging, but the view from the summit was worth every step..."
      },
      {
        id: 4,
        title: "Himalayan Adventures",
        description: "Snow, altitude, and unmatched beauty.",
        date: "Feb 10, 2025",
        image: "https://placehold.co/800x400",
        content: "Exploring the Himalayas gave me a new perspective on life and nature..."
      }
    ],
    about: {
      title: "Meet Erik",
      image: "https://placehold.co/100x100",
      description: "Mountain guide and documentary creator passionate about remote treks."
    },
    popularPosts: [
      "https://placehold.co/300x200",
      "https://placehold.co/300x200",
      "https://placehold.co/300x200"
    ],
    followText: "Follow me on YouTube @eriksummits for more mountain adventures."
  },
  {
    id: 3,
    blogName: "City Diaries by Lila",
    posts: [
      {
        id: 5,
        title: "New York in 48 Hours",
        description: "The city that never sleeps explored in two whirlwind days.",
        date: "Mar 5, 2025",
        image: "https://placehold.co/800x400",
        content: "From Central Park to late-night pizza in Brooklyn — here’s how I did it all..."
      },
      {
        id: 6,
        title: "Paris Spring Walks",
        description: "Chasing cherry blossoms in the streets of Paris.",
        date: "Apr 12, 2025",
        image: "https://placehold.co/800x400",
        content: "Spring in Paris is like a dream. Street cafés, pink petals, and sunset by the Seine..."
      }
    ],
    about: {
      title: "Hello from Lila",
      image: "https://placehold.co/100x100",
      description: "Urban explorer, café lover, and photojournalist traveling from city to city."
    },
    popularPosts: [
      "https://placehold.co/300x200",
      "https://placehold.co/300x200",
      "https://placehold.co/300x200"
    ],
    followText: "Let’s connect on TikTok @citydiaries for daily city snaps."
  }
];

export default vlogPages;
