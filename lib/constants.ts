export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: 'Smartphone' },
  { id: 'phones', name: 'Phones & Accessories', icon: 'Smartphone' },
  { id: 'laptops', name: 'Laptops & Computers', icon: 'Laptop' },
  { id: 'books', name: 'Books', icon: 'BookOpen' },
  { id: 'academic', name: 'Academic Material', icon: 'GraduationCap' },
  { id: 'cycles', name: 'Cycles', icon: 'Bike' },
  { id: 'vehicles', name: 'Vehicles', icon: 'Car' },
  { id: 'furniture', name: 'Furniture', icon: 'Armchair' },
  { id: 'hostel', name: 'Hostel Essentials', icon: 'Home' },
  { id: 'clothing', name: 'Clothing', icon: 'Shirt' },
  { id: 'sports', name: 'Sports & Fitness', icon: 'Dumbbell' },
  { id: 'gaming', name: 'Gaming', icon: 'Gamepad2' },
  { id: 'kitchen', name: 'Kitchen Items', icon: 'Utensils' },
  { id: 'tickets', name: 'Tickets', icon: 'Ticket' },
  { id: 'services', name: 'Services', icon: 'Wrench' },
  { id: 'misc', name: 'Miscellaneous', icon: 'Package' }
];

export const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Used'] as const;

export const CAMPUS_LOCATIONS = [
  'Hostel', 'Academic Block', 'Library', 'Cafeteria',
  'Sports Complex', 'Main Gate', 'Near OUTR', 'Other'
] as const;