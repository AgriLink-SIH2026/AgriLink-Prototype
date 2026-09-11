import { CropRegistration, CropType } from '../types';
import { SUPPORTED_CROPS } from '../config/crops';

export interface SmartInsight {
  id: string;
  category: 'Yield Prediction' | 'Harvest Window' | 'Scheduling Optimization' | 'Anomaly Detection';
  title: string;
  description: string;
  confidenceScore: number; // 0 to 100
  recommendation: string;
  badge: 'Smart Insight — Prototype';
}

export class SmartInsightsService {
  /**
   * Generates prototype agricultural insights for a specific crop registration
   */
  public static generateInsightsForCrop(crop: CropRegistration): SmartInsight[] {
    const meta = SUPPORTED_CROPS[crop.cropType];
    const baseYieldPerAcre = meta ? meta.expectedYieldPerAcreKg : 1000;
    const estimatedTotalKg = Math.round(crop.landArea * baseYieldPerAcre);

    const insights: SmartInsight[] = [
      {
        id: `ins-yield-${crop.id}`,
        category: 'Yield Prediction',
        title: `Estimated Biomass Yield: ~${(estimatedTotalKg / 1000).toFixed(1)} MT`,
        description: `Based on agro-climatic zoning in ${crop.district}, ${crop.state}, and historical ${crop.variety} performance over ${crop.landArea} ${crop.landUnit}.`,
        confidenceScore: 88,
        recommendation: `Plan container/trailer capacity for approximately ${(estimatedTotalKg / 1000).toFixed(1)} metric tonnes.`,
        badge: 'Smart Insight — Prototype',
      },
      {
        id: `ins-harvest-${crop.id}`,
        category: 'Harvest Window',
        title: `Optimal Harvest Maturity Window`,
        description: `Calculated from sowing date (${crop.sowingDate}) + ${meta?.growingSeasonMonths || 6} months lifecycle. Peak sucrose/fiber accumulation expected within 10 days of ${crop.expectedHarvestDate}.`,
        confidenceScore: 92,
        recommendation: 'Lock in mill crushing queue slot 14 days before peak maturity to minimize post-harvest sucrose/weight inversion.',
        badge: 'Smart Insight — Prototype',
      },
    ];

    // Anomaly detection check (sample logic)
    if (crop.landArea > 50) {
      insights.push({
        id: `ins-anomaly-${crop.id}`,
        category: 'Anomaly Detection',
        title: 'Large Land Holding Flag',
        description: `Registered area (${crop.landArea} ${crop.landUnit}) exceeds typical smallholder median (2-5 acres).`,
        confidenceScore: 75,
        recommendation: 'Field officer physical polygon GPS walk advised for large perimeter validation.',
        badge: 'Smart Insight — Prototype',
      });
    }

    return insights;
  }

  /**
   * Generates factory scheduling optimization insights
   */
  public static generateFactoryOptimization(activeQueueCount: number, dailyCapacityTons: number): SmartInsight[] {
    return [
      {
        id: 'fac-opt-1',
        category: 'Scheduling Optimization',
        title: 'Intake Gate Queue Balancing',
        description: `Current queue has ${activeQueueCount} active farm lots. Recommended staggering arrivals between 07:00 - 13:00 and 14:00 - 20:00 to eliminate weighbridge idle time.`,
        confidenceScore: 94,
        recommendation: 'Issue automated SMS pickup tokens with specific 2-hour yard entry windows.',
        badge: 'Smart Insight — Prototype',
      },
      {
        id: 'fac-opt-2',
        category: 'Scheduling Optimization',
        title: `Crushing Capacity Utilization (${dailyCapacityTons} TCD)`,
        description: 'Estimated 96% mill utilization achievable by clustering Kasaba Bavada and nearby district transport dispatches on consecutive days.',
        confidenceScore: 89,
        recommendation: 'Group nearby village transport routes to save diesel and reduce turnaround time.',
        badge: 'Smart Insight — Prototype',
      },
    ];
  }
}
