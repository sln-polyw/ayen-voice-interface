export class Analytics {
    static trackEvent(eventName: string, eventData: Record<string, any> = {}) {
      // In a real application, you would send this data to your analytics service
      console.log(`Tracking event: ${eventName}`, eventData);
    }
  }