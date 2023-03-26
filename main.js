const DateTime = luxon.DateTime;

const generateButton = document.getElementById('generateButton');
const datePicker = document.getElementById('datePicker');
const nextWednesday = getNextWednesday().toJSDate();

console.log('Next wednesday is:', nextWednesday);
generateButton.value = nextWednesday;

function getNextWednesday() {
  const now = DateTime.local();
  console.log('Now is:', now);
  if (now.weekday == 3) return now;
  if (now.weekday < 3) return now.set({ weekday: 3 });
  return now.set({ weekday: 3, weekNumber: now.weekNumber + 1 });
}
