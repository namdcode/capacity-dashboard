import { Color, ScaleType } from '@swimlane/ngx-charts';

export const PRIMARY_SCHEME: Color = {
  name: 'Primary',
  selectable: true,
  group: ScaleType.Ordinal,
  domain: ['#7c4dff'],
};

export const DUAL_SCHEME: Color = {
  name: 'Dual',
  selectable: true,
  group: ScaleType.Ordinal,
  domain: ['#7c4dff', '#b0bec5'],
};

export const MULTI_SCHEME: Color = {
  name: 'Multi',
  selectable: true,
  group: ScaleType.Ordinal,
  domain: [
    '#7c4dff', // deep purple
    '#00bcd4', // cyan
    '#ff6e40', // deep orange
    '#e040fb', // pink-purple
    '#00e676', // green accent
    '#ffab40', // amber
    '#448aff', // blue
    '#69f0ae', // green light
  ],
};

export const REVENUE_SCHEME: Color = {
  name: 'Revenue',
  selectable: true,
  group: ScaleType.Ordinal,
  domain: [
    '#7c4dff',
    '#9575cd',
    '#b39ddb',
    '#ce93d8',
    '#f48fb1',
    '#ef9a9a',
    '#a5d6a7',
    '#80cbc4',
  ],
};
