// This is a simplified list. In a production app, this should be more comprehensive
export const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
] as const;

// This is a simplified mapping. In a production app, this should be more comprehensive
export const stateCities: Record<string, string[]> = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
  "Delhi": ["New Delhi", "Delhi NCR"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  // Add more states and cities as needed
};

export type IndianState = typeof indianStates[number];
