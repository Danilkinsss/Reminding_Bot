// .github/scripts/shouldRun.js
const crypto = require('crypto')

const now = new Date()
const weekday = now.getUTCDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
const utcDate = now.toISOString().slice(0, 10) // YYYY-MM-DD in UTC
const currentHour = now.getUTCHours()

// === Biased skip probabilities ===
// Monday and Friday have higher chance to skip
const skipChances = {
  1: 0.4, // Monday
  5: 0.35, // Friday
  default: 0.15, // Other weekdays
}

// Generate hash-based pseudo-random numbers using UTC date
const seed = `commit-${utcDate}`
const hash = crypto.createHash('sha256').update(seed).digest('hex')

// Use different parts of the hash for different random decisions
const skipRandom = parseInt(hash.slice(0, 8), 16) / 0xffffffff // 0–1
const timeRandom = parseInt(hash.slice(8, 16), 16) / 0xffffffff // 0–1

// === Step 1: Check if today should be skipped ===
const threshold = skipChances[weekday] ?? skipChances.default
if (skipRandom < threshold) {
  console.log('skip_day') // skip today entirely
  process.exit(0)
}

// === Step 2: Pick random hour for today (9-18 UTC = 10-19 CET) ===
const workingHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
const chosenHour = workingHours[Math.floor(timeRandom * workingHours.length)]

// === Step 3: Check if it's time to commit ===
if (currentHour === chosenHour) {
  console.log('commit_with_delay') // time to commit with random delay!
} else {
  console.log('skip_hour') // not time yet, skip this run
}
