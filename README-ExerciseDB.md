# ExerciseDB API Integration

## Setup

1. Get your RapidAPI credentials:
   - Go to [ExerciseDB on RapidAPI](https://rapidapi.com/) and subscribe to the API.
   - Copy your `x-rapidapi-key` and `x-rapidapi-host` values.

2. Create a `.env.local` file in your project root:
   ```env
   VITE_EXERCISEDB_BASE=https://exercisedb-api1.p.rapidapi.com
   VITE_EXERCISEDB_KEY=a49291bdbbmsh969993937f08c84p1a7b7fjsnb2455bcbd8ac
   VITE_EXERCISEDB_HOST=exercisedb-api1.p.rapidapi.com
   ```

3. Restart your dev server:
   ```powershell
   npm run dev
   ```

## Usage

- The app will use ExerciseDB for exercise data in the Armory (WorkoutLibrary).
- You can search for exercises using the API:
  ```js
  import { exerciseApi } from '../services/exerciseApi';
  // Example search
  exerciseApi.searchExercises('strength exercises').then(console.log);
  ```

## Troubleshooting
- If you see errors, check your API key and host values.
- If the API is unreachable, the app will fall back to local seed data.

## Endpoint Reference
- All exercises: `/exercises`
- Search: `/api/v1/exercises/search?search=...`
- By body part: `/exercises/bodyPart/{bodyPart}`
- By target: `/exercises/target/{target}`
- By equipment: `/exercises/equipment/{equipment}`

---
For more details, see the RapidAPI docs for ExerciseDB.
