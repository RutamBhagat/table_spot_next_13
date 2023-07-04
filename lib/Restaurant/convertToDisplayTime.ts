export default function convertToDisplayTime(isoTime: string) {
  const timeRegex = /^(\d{2}):(\d{2}):(\d{2}).(\d{3})Z$/;
  const match = isoTime.match(timeRegex);

  if (!match) {
    throw new Error("Invalid time format. Expected '00:00:00.000Z'.");
  }

  const [, hours, minutes] = match;
  const hoursNum = parseInt(hours, 10);
  const ampm = hoursNum >= 12 ? "PM" : "AM";
  const regularHours = hoursNum % 12 || 12;

  return `${regularHours}:${minutes} ${ampm}`;
}
