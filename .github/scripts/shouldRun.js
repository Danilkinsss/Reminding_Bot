// .github/scripts/shouldRun.js
const crypto = require('crypto')
const fs = require('fs')

const now = new Date()
const weekday = now.getUTCDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
const utcDate = now.toISOString().slice(0, 10) // YYYY-MM-DD in UTC
const currentHour = now.getUTCHours()

// Write the decision to the workflow (step outputs) and the run log.
function emit(action) {
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `action=${action}\n`)
  }
  console.log(action)
}

// === Weekends ===
if (weekday === 0 || weekday === 6) {
  emit('skip_day')
  process.exit(0)
}

// === Vacation dates ===
const vacationDates = [
  '2025-07-30',
  '2025-07-31',
  '2025-08-01',
  '2025-08-02',
  '2025-08-03',
  '2025-08-13',
  '2025-08-14',
  '2025-08-15',
  '2025-08-16',
  '2025-08-17',
  '2025-08-18',
]

// Skip if it's a vacation day
if (vacationDates.includes(utcDate)) {
  emit('skip_day') // skip vacation day
  process.exit(0)
}

// === Biased skip probabilities ===
// Monday and Friday have higher chance to skip
const skipChances = {
  1: 0.4, // Monday
  5: 0.35, // Friday
  default: 0.15, // Other weekdays
}

// Generate hash-based pseudo-random numbers using UTC date (stable all day)
const seed = `commit-${utcDate}`
const hash = crypto.createHash('sha256').update(seed).digest('hex')

const skipRandom = parseInt(hash.slice(0, 8), 16) / 0xffffffff // 0–1
const timeRandom = parseInt(hash.slice(8, 16), 16) / 0xffffffff // 0–1

// === Step 1: Should today be skipped entirely? ===
const threshold = skipChances[weekday] ?? skipChances.default
if (skipRandom < threshold) {
  emit('skip_day')
  process.exit(0)
}

// === Step 2: Pick a random hour for today ===
// Picks WHICH scheduled run performs the commit — no sleeping, no delay.
// MUST match the cron hours in daily_commit.yml (09/13/17 UTC) so the chosen
// hour always has a scheduled run to catch it. The commit lands at that hour's
// natural run time, giving free day-to-day variation.
const workingHours = [9, 13, 17]
const chosenHour =
  workingHours[Math.min(workingHours.length - 1, Math.floor(timeRandom * workingHours.length))]

// === Step 3: Commit on the first scheduled run at/after the chosen hour ===
if (currentHour >= chosenHour) {
  emit('commit')
} else {
  emit('skip_hour')
}
