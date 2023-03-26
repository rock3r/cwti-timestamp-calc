const DateTime = luxon.DateTime;

const datePicker = document.getElementById('datePicker');
const streamTimeSpan = document.getElementById('streamTime');
const vodTimeSpan = document.getElementById('vodTime');
const dateWarning = document.getElementById('dateWarning');

datePicker.addEventListener('change', (event) => {
  const newDateValue = event.target.value;
  console.log('New date value:', newDateValue);
  validateSelectedDate(DateTime.fromISO(newDateValue));
  updateTimestamps();
});

const nextWednesday = getNextWednesday();
console.log('Next wednesday is:', nextWednesday);
datePicker.value = nextWednesday.toISODate();
updateTimestamps();
validateSelectedDate(nextWednesday);

function getNextWednesday() {
  const now = DateTime.local();
  if (now.weekday === 3) return now;
  if (now.weekday < 3) return now.set({ weekday: 3 });
  return now.set({ weekday: 3, weekNumber: now.weekNumber + 1 });
}

function validateSelectedDate(newDate) {
  const isWednesday = newDate.weekday === 3;
  console.log('Is selected day a wednesday?', isWednesday);
  if (isWednesday) {
    dateWarning.setAttribute('style', 'display: none');
  } else {
    dateWarning.removeAttribute('style');
  }
}

function updateTimestamps() {
  const selectedDate = DateTime.fromISO(datePicker.value);
  const streamDateTime = selectedDate
    .set({ hour: 18, minute: 30 })
    .setZone('Europe/Rome', { keepLocalTime: true });
  const vodDateTime = streamDateTime.plus({ days: 1 }).set({ hour: 20 });

  console.log('Stream date:', streamDateTime.toISO());
  console.log('VOD date:', vodDateTime.toISO());

  const streamTimeString = formatTimestamp(streamDateTime);
  streamTimeSpan.innerText = streamTimeString;
  const vodTimeString = formatTimestamp(vodDateTime);
  vodTimeSpan.innerText = vodTimeString;
}

function formatTimestamp(dateTime) {
  const formatString12h = 'h:mm ZZZZ';
  const formatString24h = 'H:mm ZZZZ';

  const italyTimeWonky = dateTime
    .setZone('Europe/Rome')
    .toFormat(formatString24h);
  const italyTime = fixEuropeanZoneName(italyTimeWonky);
  const eastCoastTime = dateTime
    .setZone('America/New_York')
    .toFormat(formatString12h);
  const westCoastTime = dateTime
    .setZone('America/Los_Angeles')
    .toFormat(formatString12h);
  const indiaTime = dateTime
    .setZone('Asia/Kolkata')
    .toFormat(formatString24h)
    .replace('GMT+5:30', 'IST');

  return `${italyTime} / ${eastCoastTime} / ${westCoastTime} / ${indiaTime}`;
}

function fixEuropeanZoneName(timestamp) {
  return timestamp.replace('GMT+2', 'CEST').replace('GMT+1', 'CET');
}
