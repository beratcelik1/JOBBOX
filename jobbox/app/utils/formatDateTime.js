export const formatDateTime = (dateTime) => {
  if(typeof dateTime === "string" || typeof dateTime === "number") {
    dateTime = new Date(dateTime);
  }

  // Get the date in the format "month/day/year"
  const formattedDate = `${dateTime?.getMonth() + 1}/${dateTime?.getDate()}/${dateTime?.getFullYear()}`;

  // Convert the time to a 12-hour format
  let hours = dateTime?.getHours();
  let minutes = dateTime?.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;

  const formattedTime = `${hours}:${minutes} ${ampm}`;

  return [formattedDate, formattedTime];
}
