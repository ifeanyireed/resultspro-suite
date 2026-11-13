'use client';

/**
 * Reusable UI Modules for ResultsPRO
 * Exported for seamless embedding in ScholarsNG Workspace and third-party hosts.
 * Follows Monorepo Presentational Feature Slice architecture (blueprint.md § 15).
 */

export { CompactGradebook } from './components/gradebook/CompactGradebook';
export { ResultCheckerView, default as DefaultResultCheckerView } from './components/ResultCheckerView';
export type { ResultCheckerViewProps } from './components/ResultCheckerView';
export { getTemplate, gradebookTemplates } from './lib/gradebookTemplates';
export type { School, SchoolResult, GradebookTemplate } from './lib/schoolData';
