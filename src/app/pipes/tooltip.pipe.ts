import { Pipe, PipeTransform } from '@angular/core';

export interface TooltipConfig {
  text?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  showArrow?: boolean;
  customClass?: string;
  maxWidth?: number;
  html?: boolean;
}

@Pipe({
  name: 'tooltip',
  standalone: true
})
export class TooltipPipe implements PipeTransform {
  
  transform(value: any, config?: TooltipConfig | string): string {
    if (!value) {
      return '';
    }

    // If config is a string, treat it as tooltip text
    if (typeof config === 'string') {
      return this.formatTooltip(value, { text: config });
    }

    // If config is an object, use it directly
    if (config && typeof config === 'object') {
      return this.formatTooltip(value, config);
    }

    // Default tooltip formatting
    return this.formatTooltip(value, {});
  }

  private formatTooltip(value: any, config: TooltipConfig): string {
    let tooltipText = config.text || this.generateDefaultTooltip(value);
    
    // Apply formatting based on value type
    if (typeof value === 'object') {
      tooltipText = this.formatObjectTooltip(value, tooltipText);
    } else if (typeof value === 'string') {
      tooltipText = this.formatStringTooltip(value, tooltipText);
    } else if (typeof value === 'number') {
      tooltipText = this.formatNumberTooltip(value, tooltipText);
    } else if (typeof value === 'boolean') {
      tooltipText = this.formatBooleanTooltip(value, tooltipText);
    }

    // Add HTML attributes for tooltip configuration
    const attributes = this.generateTooltipAttributes(config);
    
    return `${tooltipText}${attributes}`;
  }

  private generateDefaultTooltip(value: any): string {
    if (typeof value === 'string') {
      return value.length > 50 ? `${value.substring(0, 50)}...` : value;
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }

  private formatObjectTooltip(obj: any, baseText: string): string {
    if (obj.name) {
      return `${obj.name}${obj.description ? ` - ${obj.description}` : ''}`;
    }
    if (obj.title) {
      return `${obj.title}${obj.subtitle ? ` - ${obj.subtitle}` : ''}`;
    }
    if (obj.label) {
      return `${obj.label}${obj.value ? `: ${obj.value}` : ''}`;
    }
    return baseText;
  }

  private formatStringTooltip(str: string, baseText: string): string {
    // If string is too long, truncate it
    if (str.length > 100) {
      return `${str.substring(0, 100)}...`;
    }
    return str;
  }

  private formatNumberTooltip(num: number, baseText: string): string {
    // Format numbers with appropriate units or formatting
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  }

  private formatBooleanTooltip(bool: boolean, baseText: string): string {
    return bool ? 'Yes' : 'No';
  }

  private generateTooltipAttributes(config: TooltipConfig): string {
    const attributes: string[] = [];

    if (config.position) {
      attributes.push(`data-position="${config.position}"`);
    }

    if (config.delay) {
      attributes.push(`data-delay="${config.delay}"`);
    }

    if (config.showArrow !== undefined) {
      attributes.push(`data-arrow="${config.showArrow}"`);
    }

    if (config.customClass) {
      attributes.push(`data-class="${config.customClass}"`);
    }

    if (config.maxWidth) {
      attributes.push(`data-max-width="${config.maxWidth}"`);
    }

    if (config.html) {
      attributes.push('data-html="true"');
    }

    return attributes.length > 0 ? ` ${attributes.join(' ')}` : '';
  }

  // Utility methods for common tooltip patterns
  static createStatusTooltip(status: string, additionalInfo?: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'Active - Currently in use',
      'inactive': 'Inactive - Not currently in use',
      'pending': 'Pending - Awaiting approval',
      'completed': 'Completed - Finished successfully',
      'cancelled': 'Cancelled - No longer active',
      'draft': 'Draft - Not yet finalized'
    };

    const baseText = statusMap[status.toLowerCase()] || `Status: ${status}`;
    return additionalInfo ? `${baseText}\n${additionalInfo}` : baseText;
  }

  static createDateTooltip(date: Date | string, format?: string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let relativeText = '';
    if (diffDays === 0) {
      relativeText = 'Today';
    } else if (diffDays === 1) {
      relativeText = 'Yesterday';
    } else if (diffDays < 7) {
      relativeText = `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      relativeText = `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      relativeText = `${months} month${months > 1 ? 's' : ''} ago`;
    }

    const formattedDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `${formattedDate}\n(${relativeText})`;
  }

  static createProgressTooltip(current: number, total: number, unit?: string): string {
    const percentage = Math.round((current / total) * 100);
    const unitText = unit || '';
    
    return `${current}${unitText} of ${total}${unitText}\n${percentage}% complete`;
  }

  static createUserTooltip(user: any): string {
    if (!user) return 'Unknown user';
    
    const parts: string[] = [];
    
    if (user.name) {
      parts.push(user.name);
    }
    
    if (user.email) {
      parts.push(user.email);
    }
    
    if (user.role) {
      parts.push(`Role: ${user.role}`);
    }
    
    if (user.department) {
      parts.push(`Dept: ${user.department}`);
    }
    
    return parts.join('\n');
  }
} 