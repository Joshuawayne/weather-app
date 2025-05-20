# 🌦️ SkyCast Weather App 🚀

Hey there, fellow weather enthusiast or intrepid developer! Welcome to SkyCast, your friendly, full-stack weather forecasting sidekick! ☀️⛈️❄️

Ever wondered if you should pack an umbrella ☂️ or your shades 🕶️? SkyCast is here to give you the deets, pulling fresh weather data and presenting it with a dash of modern tech magic. This project bundles a robust **Laravel API backend** with a sleek **Next.js & TypeScript frontend**, showing off a decoupled architecture in action.

## ✨ Features That Make a Splash!

*   **Current Weather Conditions:** Get the latest temperature, "feels like," humidity, and a snappy description for any city you throw at it!
*   **3-Day Forecast:** Plan ahead! See what the next few days have in store with daily min/max temps and a representative weather icon.
*   **Detailed Insights:** Wind speed (in km/h & mph!) and direction, plus humidity levels.
*   **Dynamic Unit Conversion:** Toggle between Celsius (°C) and Fahrenheit (°F) on the fly!
*   **Sleek UI:** Built with Next.js, TypeScript, Tailwind CSS, and RippleUI for a modern, responsive look.
*   **Smooth Animations:** Because who doesn't love a bit of GSAP magic to make things slide and fade in style? 😉
*   **Decoupled Power:** A Laravel backend serves up the data, keeping the frontend focused on presentation.

## 🛠️ Tech Stack Under the Hood

This project is a symphony of awesome technologies:

*   **Backend (`/weather-api`):**
    *   PHP / **Laravel** (Latest and Greatest!)
    *   Fetches data from [OpenWeatherMap API](https://openweathermap.org/api)
    *   Serves a clean JSON API.
*   **Frontend (`/weather-frontend`):**
    *   **Next.js** (App Router)
    *   **React**
    *   **TypeScript** (for that sweet, sweet type safety!)
    *   **Tailwind CSS** (utility-first styling)
    *   **RippleUI** (lovely pre-styled Tailwind components)
    *   **GSAP** (for smooth, delightful animations)
*   **Monorepo Management:** Git (keeping it all together!)

## 🚀 Getting SkyCast Up and Running!

Ready to launch your own instance of SkyCast? Follow these steps, and you'll be forecasting in no time!

**Prerequisites:**

*   PHP (>= 8.1 recommended) & Composer
*   Node.js (LTS version recommended) & npm (or yarn)
*   An [OpenWeatherMap API Key](https://home.openweathermap.org/api_keys) (it's free!)
*   Git

**Backend Setup (`/weather-api`):**

1.  **Navigate to the backend directory:**
    ```bash
    cd weather-api
    ```
2.  **Install PHP dependencies:**
    ```bash
    composer install
    ```
3.  **Set up your environment file:**
    *   Copy the example: `cp .env.example .env`
    *   Generate an application key: `php artisan key:generate`
    *   Open `.env` and add your OpenWeatherMap API key:
        ```env
        OPENWEATHERMAP_API_KEY="YOUR_SECRET_OPENWEATHERMAP_API_KEY"
        ```
4.  **Start the Laravel development server (usually on port 8000):**
    ```bash
    php artisan serve
    ```
    Leave this terminal running!

**Frontend Setup (`/weather-frontend`):**

1.  **Open a NEW terminal window.**
2.  **Navigate to the frontend directory:**
    ```bash
    cd weather-frontend
    ```
3.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```
4.  **Set up your frontend environment file:**
    *   Create a `.env.local` file in the `weather-frontend` root.
    *   Add the URL for your running Laravel backend:
        ```env
        NEXT_PUBLIC_LARAVEL_API_URL=http://127.0.0.1:8000/api/v1
        ```
5.  **Start the Next.js development server (usually on port 3000):**
    ```bash
    npm run dev
    ```
    Leave this terminal running too!

6.  **Blast Off!** 🚀
    Open your browser and navigate to `http://localhost:3000`. You should see SkyCast in all its glory!

## 🎨 Customization & Future Ideas

Feeling adventurous? Here are some ways you could take SkyCast to the next level:

*   **Geolocation:** Automatically fetch weather for the user's current location.
*   **More Detailed Forecasts:** Hourly forecasts, chance of rain, UV index.
*   **Saved Locations:** Allow users to save and quickly access weather for their favorite cities.
*   **Theme Customization:** Light/dark mode, or even themes based on the current weather!
*   **PWA Features:** Make it installable for an app-like experience.
*   **Backend Caching:** Cache OpenWeatherMap API responses in Laravel to reduce external API calls and improve speed.
*   **Even MORE Animations:** Go wild with GSAP!

## 🤝 Contributing

Got a cool idea or a bug fix? Feel free to fork this repo, make your changes, and submit a pull request! Let's make SkyCast even more awesome together.

*(If this were a public project, you'd add contribution guidelines, a code of conduct, etc.)*

## 🐛 Found a Bug?

Oh no! If you've spotted a glitch in the matrix (or just a bug), please open an issue in the repository, and be sure to include:
*   Steps to reproduce the bug.
*   Expected behavior.
*   Actual behavior.
*   Screenshots (if applicable).

---

Thanks for checking out SkyCast! Happy coding, and may your skies be clear (unless you're hoping for rain 🌧️)!

Built with ❤️ and a sprinkle of tech wizardry by **Joshua**!
