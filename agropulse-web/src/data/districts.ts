export interface DistrictInfo {
  name: string;
  state: 'Karnataka' | 'Kerala' | 'Tamil Nadu';
  lat: number;
  lon: number;
  primaryCrops: string[];
  climateZone: string;
}

export const TARGET_DISTRICTS: DistrictInfo[] = [
  // Karnataka
  { name: 'Bengaluru Urban', state: 'Karnataka', lat: 12.9716, lon: 77.5946, primaryCrops: ['Tomato', 'Ragi', 'Vegetables'], climateZone: 'Eastern Dry Zone' },
  { name: 'Bengaluru Rural', state: 'Karnataka', lat: 13.2847, lon: 77.5753, primaryCrops: ['Ragi', 'Grapes', 'Tomato'], climateZone: 'Eastern Dry Zone' },
  { name: 'Kolar', state: 'Karnataka', lat: 13.1367, lon: 78.1292, primaryCrops: ['Tomato', 'Potato', 'Mango'], climateZone: 'Eastern Dry Zone' },
  { name: 'Chikkaballapur', state: 'Karnataka', lat: 13.4355, lon: 77.7315, primaryCrops: ['Potato', 'Tomato', 'Grapes'], climateZone: 'Eastern Dry Zone' },
  { name: 'Mandya', state: 'Karnataka', lat: 12.5218, lon: 76.8951, primaryCrops: ['Sugarcane', 'Rice', 'Ragi'], climateZone: 'Southern Dry Zone' },
  { name: 'Mysuru', state: 'Karnataka', lat: 12.2958, lon: 76.6394, primaryCrops: ['Rice', 'Cotton', 'Pulses'], climateZone: 'Southern Dry Zone' },
  { name: 'Hassan', state: 'Karnataka', lat: 13.0072, lon: 76.1030, primaryCrops: ['Potato', 'Coffee', 'Pepper'], climateZone: 'Southern Transition Zone' },
  { name: 'Chikkamagaluru', state: 'Karnataka', lat: 13.3161, lon: 75.7720, primaryCrops: ['Coffee', 'Pepper', 'Arecanut'], climateZone: 'Hilly / Malnad Zone' },
  { name: 'Shivamogga', state: 'Karnataka', lat: 13.9299, lon: 75.5681, primaryCrops: ['Rice', 'Arecanut', 'Ginger'], climateZone: 'Southern Transition' },
  { name: 'Dharwad', state: 'Karnataka', lat: 15.4589, lon: 75.0078, primaryCrops: ['Cotton', 'Soybean', 'Chilli'], climateZone: 'Northern Transition' },
  { name: 'Belagavi', state: 'Karnataka', lat: 15.8497, lon: 74.4977, primaryCrops: ['Sugarcane', 'Vegetables', 'Soybean'], climateZone: 'Northern Transition' },
  { name: 'Ballari', state: 'Karnataka', lat: 15.1394, lon: 76.9214, primaryCrops: ['Chilli', 'Rice', 'Cotton'], climateZone: 'North Eastern Dry Zone' },
  { name: 'Raichur', state: 'Karnataka', lat: 16.2120, lon: 77.3439, primaryCrops: ['Rice', 'Cotton', 'Pigeonpea'], climateZone: 'North Eastern Dry Zone' },
  { name: 'Kalaburagi', state: 'Karnataka', lat: 17.3297, lon: 76.8343, primaryCrops: ['Pigeonpea', 'Sunflower', 'Jowar'], climateZone: 'North Eastern Transition' },
  { name: 'Dakshina Kannada', state: 'Karnataka', lat: 12.8703, lon: 74.8806, primaryCrops: ['Arecanut', 'Coconut', 'Rubber'], climateZone: 'Coastal Zone' },
  { name: 'Kodagu', state: 'Karnataka', lat: 12.3375, lon: 75.8069, primaryCrops: ['Coffee', 'Pepper', 'Cardamom'], climateZone: 'Hilly Zone' },

  // Kerala
  { name: 'Wayanad', state: 'Kerala', lat: 11.6854, lon: 76.1320, primaryCrops: ['Black Pepper', 'Coffee', 'Rice', 'Banana'], climateZone: 'High Altitude Zone' },
  { name: 'Idukki', state: 'Kerala', lat: 9.8500, lon: 76.9700, primaryCrops: ['Cardamom', 'Tea', 'Black Pepper', 'Rubber'], climateZone: 'High Range Zone' },
  { name: 'Palakkad', state: 'Kerala', lat: 10.7867, lon: 76.6548, primaryCrops: ['Rice', 'Coconut', 'Sugarcane'], climateZone: 'Central Zone (Palakkad Plains)' },
  { name: 'Kottayam', state: 'Kerala', lat: 9.5916, lon: 76.5222, primaryCrops: ['Natural Rubber', 'Coconut', 'Cocoa'], climateZone: 'Southern Mid-land' },
  { name: 'Thrissur', state: 'Kerala', lat: 10.5276, lon: 76.2144, primaryCrops: ['Rice', 'Coconut', 'Banana'], climateZone: 'Central Zone' },
  { name: 'Kozhikode', state: 'Kerala', lat: 11.2588, lon: 75.7804, primaryCrops: ['Coconut', 'Arecanut', 'Spices'], climateZone: 'Northern Coastal' },
  { name: 'Kasaragod', state: 'Kerala', lat: 12.4996, lon: 74.9869, primaryCrops: ['Coconut', 'Arecanut', 'Rubber'], climateZone: 'Northern Coastal' },
  { name: 'Alappuzha', state: 'Kerala', lat: 9.4981, lon: 76.3388, primaryCrops: ['Rice (Kuttanad)', 'Coconut', 'Vegetables'], climateZone: 'Problem Area (Below sea level)' },

  // Tamil Nadu
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lon: 76.9558, primaryCrops: ['Tomato', 'Coconut', 'Cotton', 'Maize'], climateZone: 'Western Zone' },
  { name: 'Thanjavur', state: 'Tamil Nadu', lat: 10.7870, lon: 79.1378, primaryCrops: ['Rice (Cauvery Delta)', 'Pulses', 'Banana'], climateZone: 'Cauvery Delta Zone' },
  { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lon: 78.1198, primaryCrops: ['Rice', 'Cotton', 'Millets', 'Jasmine'], climateZone: 'Southern Zone' },
  { name: 'Dindigul', state: 'Tamil Nadu', lat: 10.3673, lon: 77.9803, primaryCrops: ['Tomato', 'Banana', 'Onion', 'Vegetables'], climateZone: 'Southern Zone' },
  { name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lon: 78.1460, primaryCrops: ['Tapioca', 'Tomato', 'Mango', 'Sugarcane'], climateZone: 'North Western Zone' },
  { name: 'Erode', state: 'Tamil Nadu', lat: 11.3410, lon: 77.7172, primaryCrops: ['Turmeric', 'Sugarcane', 'Banana', 'Rice'], climateZone: 'Western Zone' },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lon: 78.7047, primaryCrops: ['Banana', 'Rice', 'Cotton', 'Onion'], climateZone: 'Cauvery Delta' },
  { name: 'The Nilgiris', state: 'Tamil Nadu', lat: 11.4102, lon: 76.6950, primaryCrops: ['Potato', 'Tea', 'Carrot', 'Cabbage'], climateZone: 'High Altitude Hilly Zone' },
];
