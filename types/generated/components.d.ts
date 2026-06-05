import type { Schema, Struct } from '@strapi/strapi';

export interface LayoutHero extends Struct.ComponentSchema {
  collectionName: 'components_layout_heroes';
  info: {
    displayName: 'Hero';
    icon: 'alien';
  };
  attributes: {
    badge: Schema.Attribute.String;
    cta_text: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    title_gradient: Schema.Attribute.String;
    title_primary: Schema.Attribute.String;
    title_secondary: Schema.Attribute.String;
  };
}

export interface LayoutMetrics extends Struct.ComponentSchema {
  collectionName: 'components_layout_metrics';
  info: {
    displayName: 'Metrics';
    icon: 'dashboard';
  };
  attributes: {
    description: Schema.Attribute.Text;
    metrics: Schema.Attribute.Component<'shared.metric-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface LayoutServicesGrid extends Struct.ComponentSchema {
  collectionName: 'components_layout_services_grids';
  info: {
    displayName: 'Services Grid';
    icon: 'grid';
  };
  attributes: {
    description: Schema.Attribute.Text;
    services: Schema.Attribute.Component<'shared.service-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface LayoutTimeline extends Struct.ComponentSchema {
  collectionName: 'components_layout_timelines';
  info: {
    displayName: 'Timeline';
    icon: 'clock';
  };
  attributes: {
    description: Schema.Attribute.Text;
    steps: Schema.Attribute.Component<'shared.step-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface SharedMetricItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_metric_items';
  info: {
    displayName: 'Metric Item';
    icon: 'chart';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface SharedServiceItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_service_items';
  info: {
    displayName: 'Service Item';
    icon: 'apps';
  };
  attributes: {
    desc: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedStepItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_step_items';
  info: {
    displayName: 'Step Item';
    icon: 'check';
  };
  attributes: {
    desc: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'layout.hero': LayoutHero;
      'layout.metrics': LayoutMetrics;
      'layout.services-grid': LayoutServicesGrid;
      'layout.timeline': LayoutTimeline;
      'shared.metric-item': SharedMetricItem;
      'shared.service-item': SharedServiceItem;
      'shared.step-item': SharedStepItem;
    }
  }
}
