export const dateConverter = (timestamp: string): string => {
    const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
    const date: Date = new Date(timestampNum * 1000);
    const now: Date = new Date();
  
    const diff: number = now.getTime() - date.getTime();
    const diffInSeconds: number = diff / 1000;
    const diffInMinutes: number = diffInSeconds / 60;
    const diffInHours: number = diffInMinutes / 60;
    const diffInDays: number = diffInHours / 24;
    const diffInMonths: number = diffInDays / 30; // Approximation: 30 days per month
    const diffInYears: number = diffInMonths / 12;
  
    switch (true) {
      case diffInYears >= 1:
        return `${Math.floor(diffInYears)} ${Math.floor(diffInYears) === 1 ? "year" : "years"} ago`;
      case diffInMonths >= 1:
        return `${Math.floor(diffInMonths)} ${Math.floor(diffInMonths) === 1 ? "month" : "months"} ago`;
      case diffInDays > 7:
        return `${Math.floor(diffInDays / 7)} ${Math.floor(diffInDays / 7) === 1 ? "week" : "weeks"} ago`;
      case diffInDays >= 1:
        return `${Math.floor(diffInDays)} ${Math.floor(diffInDays) === 1 ? "day" : "days"} ago`;
      case diffInHours >= 1:
        return `${Math.floor(diffInHours)} ${Math.floor(diffInHours) === 1 ? "hour" : "hours"} ago`;
      case diffInMinutes >= 1:
        return `${Math.floor(diffInMinutes)} ${Math.floor(diffInMinutes) === 1 ? "minute" : "minutes"} ago`;
      default:
        return "Just now";
    }
  };
  