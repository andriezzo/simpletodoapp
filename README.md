# Advanced To-Do App

A modern, feature-rich to-do application built with Astro and React. This project goes beyond a simple task list, incorporating features like user assignments, a tagging system, a dashboard summary, and local storage persistence.

**[➡️ View Live Demo](https://tools.androe.com/simpletodoapp/)**

## ✨ Key Features

* **Task Management:** Add, delete, and toggle the completion status of tasks.
* **Dashboard Summary:** Get a quick overview of task status (total, active, completed), top tags, and active tasks per user.
* **Dynamic Filtering:** Filter the task list by status (All, Active, Completed), by tag, or by assigned user.
* **Tagging System:**
  * Assign multiple tags to tasks.
  * Interactive tag input with autocomplete suggestions.
  * Add new tags on the fly.
* **User Assignment:** Assign tasks to one or more users from a predefined list.
* **Responsive Design:** A two-column layout on desktop that stacks vertically for a seamless experience on mobile devices.
* **Persistent State:** Your tasks are automatically saved to your browser's `localStorage` and reloaded on your next visit.
* **Secure Input:** User-provided text is sanitized using DOMPurify to prevent Cross-Site Scripting (XSS) attacks.

## 🚀 Tech Stack

* **Framework:** [Astro](https://astro.build/) - For building fast, content-focused websites.
* **UI Library:** [React](https://reactjs.org/) - For creating interactive UI components.
* **Styling:** [SCSS/Sass](https://sass-lang.com/) - For structured and maintainable CSS.
* **Security:** [DOMPurify](https://github.com/cure53/DOMPurify) - For XSS sanitization.

## 💡 Development Notes & Credits

* **AI-Assisted Development:** The core Astro and React logic for this project was developed with significant assistance from AI programming assistants, including **GitHub Copilot** and **Google's Gemini**.
* **CSS Framework:** The styling is based on a personal CSS framework currently in development by the author.

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher is recommended)
* [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation & Local Development

1. **Clone the repository:**

    ```bash
    git clone https://github.com/andriezzo/simpletodoapp.git
    cd simpletodoapp
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Configure Environment Variables:**
    Create a new file named `.env` in the root of the project and add your production domain. This is required for the production build to generate correct absolute URLs for meta tags.

    ```
    # .env
    PUBLIC_SITE_URL="https://tools.androe.com"
    ```

4. **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:4321`.

### Deploying to a Subdirectory

This project is configured to be deployed to a subdirectory. If you need to change it, you must update the following two files before building:

1. **`astro.config.mjs`**: Set the `base` property to your subdirectory name.

    ```javascript
    // astro.config.mjs
    export default defineConfig({
      base: '/simpletodoapp', // Set this to your subdirectory name
      // ...
    });
    ```

2. **`.env`**: Ensure the `PUBLIC_SITE_URL` is set to your root domain.

    ```
    # .env
    PUBLIC_SITE_URL="https://tools.androe.com"
    ```

After configuring these files, run `npm run build` to generate the production files in the `dist/` directory.

## 📦 Building for Production

To create a production-ready version of your app, run the following command:

```bash
npm run build
```

This will generate a static version of your site in the `dist/` directory. These are the files you can deploy to any static hosting service.

## 📂 Project Structure

* `public/`: Contains static assets like images that are not processed by the build pipeline.
* `src/components/`: Reusable React components (`TodoApp`, `UserList`, `TodoItem`, etc.).
* `src/layouts/`: Astro layout components.
* `src/pages/`: Astro pages, which define the routes of the application.
* `src/scss/`: Global styles, variables, and component-specific SCSS files.
* `astro.config.mjs`: The main configuration file for the Astro project.

## 📄 License

This project is licensed under the terms of the license specified in the `LICENSE.txt` file.
