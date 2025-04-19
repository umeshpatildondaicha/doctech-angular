export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  action?: string;
  active?: boolean;
  children?: NavItem[];
} 