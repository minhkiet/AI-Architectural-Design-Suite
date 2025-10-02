export enum FeatureKey {
  SURREAL_EXTERIOR = 'SURREAL_EXTERIOR',
  INSTANT_INTERIOR = 'INSTANT_INTERIOR',
  MASTER_PLAN = 'MASTER_PLAN',
  SMART_EDIT = 'SMART_EDIT',
  SKETCHUP_FINALIZE = 'SKETCHUP_FINALIZE',
  PLAN_TO_3D = 'PLAN_TO_3D',
  COST_CALCULATION = 'COST_CALCULATION',
  TASK_GENERATOR = 'TASK_GENERATOR',
  REAL_TO_TECH_DRAWING = 'REAL_TO_TECH_DRAWING',
}

export interface Feature {
  key: FeatureKey;
  icon: string; // Font Awesome class
  imageUpload: 'required' | 'optional' | 'none';
  outputType: 'image' | 'text';
}

export interface RenderSettings {
  // Image settings
  negativePrompt?: string;
  stylePreset?: string;
  aspectRatio?: string;
  detailLevel?: string;
  // Tech Drawing settings
  drawingScale?: string;
  lineThickness?: string;
  lineStyle?: string;
  symbolLibrary?: string;
  // Task Generator settings
  startDate?: string;
  endDate?: string;
  workerCount?: number;
  dimensionLength?: number | '';
  dimensionWidth?: number | '';
  dimensionHeight?: number | '';
}

export interface RenderHistoryItem {
  id: string;
  featureKey: FeatureKey;
  featureTitle: string; // The title in the language at the time of creation
  prompt: string;
  imageUrl: string;
  timestamp: string;
  settings: RenderSettings;
}
