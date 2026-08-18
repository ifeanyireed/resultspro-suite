# Dashboard Components Reference

This document lists the reusable components extracted from the Overview pages for easy reference and reusability across the application.

## 1. `DashboardMetricCard`
**Location**: `frontend/src/components/Dashboard/DashboardMetricCard.tsx`

A flexible metric card used for top-level stats (e.g., Total Revenue, Active Agents). It supports two visual variants:
- **Primary Dark Variant**: Used for the most important metric (e.g., Total Revenue). Displays with a blue gradient background, subtle depth effects, and white text.
- **Default White Variant**: Used for secondary metrics. Displays with a white background and subtle borders.

### Props:
- `title` (string): The label for the metric (e.g., "Total Revenue").
- `value` (string | ReactNode): The main value to display (e.g., "₦12.5M").
- `icon` (React.ElementType): The heroicon component to display in the top right.
- `trendValue` (string, optional): The percentage or value showing the trend (e.g., "+5%").
- `trendLabel` (string, optional): The label describing the trend (e.g., "vs last month").
- `isPrimary` (boolean, optional): Set to `true` to render the Primary Dark Variant.
- `valueColorClass` (string, optional): Tailwind classes to override the metric value color (e.g., "text-orange-500").
- `iconColorClass` (string, optional): Tailwind classes to override the icon color.
- `trendBgClass` (string, optional): Tailwind classes to override the trend badge background.
- `trendTextClass` (string, optional): Tailwind classes to override the trend badge text color.


## 2. `RevenueGrowthChart`
**Location**: `frontend/src/components/Dashboard/RevenueGrowthChart.tsx`

A bar chart component to visualize growth metrics over time using Tailwind CSS for rendering the bars (e.g., Revenue Growth).

### Props:
- `title` (string, optional): The title of the chart card. Defaults to "Revenue Growth".
- `data` (Array of Objects): The dataset to render. Each object contains:
  - `height` (string): The height of the bar (e.g., "40%").
  - `type` ('stripe' | 'solid-dark' | 'solid-light'): Visual style of the bar.
  - `tooltip` (string, optional): The value to show in the tooltip above the bar.
  - `label` (string): The x-axis label below the bar (e.g., "Jan", "Feb").


## 3. `TopAgentsList`
**Location**: `frontend/src/components/Dashboard/TopAgentsList.tsx`

A card component used to display a list of top-performing users or agents, complete with their avatars, a metric description, and their revenue.

### Props:
- `title` (string, optional): The title of the card. Defaults to "Top Agents".
- `agents` (Array of `TopAgent`): A list of agent data objects to render.
- `onViewAll` (function, optional): A callback function triggered when the "View All" button is clicked. If omitted, the button is not rendered.

### `TopAgent` Type:
- `id` (string | number): Unique identifier.
- `name` (string): The name of the agent.
- `avatarSrc` (string): The URL or path to the agent's avatar image.
- `metricLabel` (string): Description of their performance (e.g., "12 Schools Onboarded").
- `revenue` (string): The revenue value to display (e.g., "₦1.2M").
