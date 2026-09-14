export interface PlanetData {
  id: string;
  name: string;
  diameter: number; // km
  distanceFromSun: number; // million km
  orbitalPeriod: number; // Earth days
  color: string;
  ringColor?: string;
  description: string;
  moons: number;
  type: string;
}

export const planets: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    diameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    color: '#b5b5b5',
    description: 'The smallest planet and closest to the Sun. It has no atmosphere and extreme temperature variations.',
    moons: 0,
    type: 'Terrestrial',
  },
  {
    id: 'venus',
    name: 'Venus',
    diameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    color: '#e8cda0',
    description: 'The hottest planet due to its thick atmosphere of CO₂. It rotates in the opposite direction to most planets.',
    moons: 0,
    type: 'Terrestrial',
  },
  {
    id: 'earth',
    name: 'Earth',
    diameter: 12756,
    distanceFromSun: 149.6,
    orbitalPeriod: 365.25,
    color: '#4da6ff',
    description: 'Our home planet — the only known world with liquid water on its surface and life.',
    moons: 1,
    type: 'Terrestrial',
  },
  {
    id: 'mars',
    name: 'Mars',
    diameter: 6792,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    color: '#e07050',
    description: 'The Red Planet, known for its iron oxide surface. Home to the tallest volcano in the solar system — Olympus Mons.',
    moons: 2,
    type: 'Terrestrial',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    diameter: 142984,
    distanceFromSun: 778.6,
    orbitalPeriod: 4333,
    color: '#d4a574',
    description: 'The largest planet, a gas giant with a Great Red Spot — a storm larger than Earth that has raged for centuries.',
    moons: 95,
    type: 'Gas Giant',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    diameter: 120536,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10759,
    color: '#f0d890',
    ringColor: '#c8b070',
    description: 'Famous for its stunning ring system made of ice and rock particles. It is the least dense planet — it could float on water!',
    moons: 146,
    type: 'Gas Giant',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    diameter: 51118,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30687,
    color: '#7de0e0',
    description: 'An ice giant that rotates on its side. Its blue-green color comes from methane in its atmosphere.',
    moons: 28,
    type: 'Ice Giant',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    diameter: 49528,
    distanceFromSun: 4495.1,
    orbitalPeriod: 60190,
    color: '#4070e0',
    description: 'The windiest planet with speeds up to 2,100 km/h. It is the farthest planet from the Sun.',
    moons: 16,
    type: 'Ice Giant',
  },
];
