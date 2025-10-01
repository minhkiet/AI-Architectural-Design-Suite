export enum FeatureKey {
  SURREAL_EXTERIOR = 'SURREAL_EXTERIOR',
  INSTANT_INTERIOR = 'INSTANT_INTERIOR',
  MASTER_PLAN = 'MASTER_PLAN',
  SMART_EDIT = 'SMART_EDIT',
  SKETCHUP_FINALIZE = 'SKETCHUP_FINALIZE',
  PLAN_TO_3D = 'PLAN_TO_3D',
  COST_CALCULATION = 'COST_CALCULATION',
  TASK_GENERATOR = 'TASK_GENERATOR',
}

export interface Feature {
  key: FeatureKey;
  icon: string; // Font Awesome class
  imageUpload: 'required' | 'optional' | 'none';
  outputType: 'image' | 'text';
}

export interface RenderHistoryItem {
  id: string;
  featureKey: FeatureKey;
  featureTitle: string; // The title in the language at the time of creation
  prompt: string;
  imageUrl: string;
  timestamp: string;
}
