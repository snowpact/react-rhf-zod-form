export type RenderMode = 'auto' | 'children';

export interface DemoConfig {
  // Render mode
  renderMode: RenderMode;

  // Simulation
  simulateSlowSubmission: boolean;
  simulateEndpointError: boolean;

  // Debug
  showDebugMode: boolean;
}
