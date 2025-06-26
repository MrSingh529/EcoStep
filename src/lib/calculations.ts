export const EMISSION_FACTORS = {
  // kg CO2e per unit
  GASOLINE_PER_LITER: 2.31,
  PUBLIC_TRANSPORT_PER_KM: 0.04, // Average for bus/metro per passenger-km
  ENERGY_PER_KWH: 0.45,
  WASTE_PER_KG: 0.5,
  WATER_PER_LITER: 0.001,
  MEAT_PER_SERVING: 2.5,
  CAR_DEFAULT_EFFICIENCY_KM_PER_L: 12.5, // Approx 8L/100km
};

export type TransportMode = 'car' | 'motorbike' | 'public_transport' | 'cycling' | 'walking';

export interface ActivityData {
  transportMode: TransportMode;
  distance: number; // Daily distance in km
  fuelEfficiency?: number; // km per liter
  ownsVehicle?: boolean;

  // Other activities
  energy: number; // kWh per month
  waste: number; // kg per day
  water: number; // liters per day
  food: number; // meat servings per day
  date: string;
}

export type ImpactData = {
  transport: number;
  energy: number;
  waste: number;
  water: number;
  food: number;
  total: number;
}

// Base calculation for a single day
function calculateDailyImpactRaw(activity: Omit<ActivityData, 'date'>): ImpactData {
  let transportImpact = 0;
  switch (activity.transportMode) {
    case 'car':
    case 'motorbike':
      // (distance / km_per_liter) gives liters used. Then multiply by emission factor.
      if (activity.fuelEfficiency && activity.fuelEfficiency > 0) {
        transportImpact = (activity.distance / activity.fuelEfficiency) * EMISSION_FACTORS.GASOLINE_PER_LITER;
      }
      break;
    case 'public_transport':
      transportImpact = activity.distance * EMISSION_FACTORS.PUBLIC_TRANSPORT_PER_KM;
      break;
    case 'cycling':
    case 'walking':
      transportImpact = 0;
      break;
  }

  const energyImpact = (activity.energy * EMISSION_FACTORS.ENERGY_PER_KWH) / 30; // Monthly energy usage to daily
  const wasteImpact = activity.waste * EMISSION_FACTORS.WASTE_PER_KG;
  const waterImpact = activity.water * EMISSION_FACTORS.WATER_PER_LITER;
  const foodImpact = activity.food * EMISSION_FACTORS.MEAT_PER_SERVING;

  const totalImpact = transportImpact + energyImpact + wasteImpact + waterImpact + foodImpact;
  
  return {
    transport: transportImpact,
    energy: energyImpact,
    waste: wasteImpact,
    water: waterImpact,
    food: foodImpact,
    total: totalImpact,
  };
}

// Calculate emissions saved by choosing a greener transport option
export function calculateSavings(activity: Omit<ActivityData, 'date'>): number {
    if (!activity.ownsVehicle || activity.transportMode === 'car' || activity.transportMode === 'motorbike') {
        return 0;
    }

    // Calculate hypothetical impact if they drove a car
    const hypotheticalCarImpact = (activity.distance / EMISSION_FACTORS.CAR_DEFAULT_EFFICIENCY_KM_PER_L) * EMISSION_FACTORS.GASOLINE_PER_LITER;

    // Calculate actual impact
    const dailyImpact = calculateDailyImpactRaw(activity);
    const actualTransportImpact = dailyImpact.transport;

    const saved = hypotheticalCarImpact - actualTransportImpact;
    return Math.round(saved > 0 ? saved : 0);
}


// Helper to round all values in an ImpactData object
function roundImpactData(data: ImpactData): ImpactData {
    return {
        transport: Math.round(data.transport),
        energy: Math.round(data.energy),
        waste: Math.round(data.waste),
        water: Math.round(data.water),
        food: Math.round(data.food),
        total: Math.round(data.total),
    }
}

// Calculate for a single day
export function calculateDailyImpact(activity: Omit<ActivityData, 'date'>): ImpactData {
  const dailyRaw = calculateDailyImpactRaw(activity);
  return roundImpactData(dailyRaw);
}

// Calculate for a week (daily * 7)
export function calculateWeeklyImpact(activity: Omit<ActivityData, 'date'>): ImpactData {
  const dailyRaw = calculateDailyImpactRaw(activity);
  const weeklyRaw: ImpactData = {
      transport: dailyRaw.transport * 7,
      energy: dailyRaw.energy * 7,
      waste: dailyRaw.waste * 7,
      water: dailyRaw.water * 7,
      food: dailyRaw.food * 7,
      total: dailyRaw.total * 7,
  };
  return roundImpactData(weeklyRaw);
}

// Calculate for a month (daily * 30, except for energy which is already monthly)
export function calculateMonthlyImpact(activity: Omit<ActivityData, 'date'>): ImpactData {
  const dailyRaw = calculateDailyImpactRaw(activity);
  
  const transportImpact = dailyRaw.transport * 30;
  const energyImpact = activity.energy * EMISSION_FACTORS.ENERGY_PER_KWH; // Use the full monthly value
  const wasteImpact = dailyRaw.waste * 30;
  const waterImpact = dailyRaw.water * 30;
  const foodImpact = dailyRaw.food * 30;

  const totalImpact = transportImpact + energyImpact + wasteImpact + waterImpact + foodImpact;
  
  return roundImpactData({
    transport: transportImpact,
    energy: energyImpact,
    waste: wasteImpact,
    water: waterImpact,
    food: foodImpact,
    total: totalImpact,
  });
}
