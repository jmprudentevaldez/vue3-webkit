## About WebAppKit SPA (Campfire)

WebAppKit SPA (Campfire) is a VueJS 3 SPA starter kit. This kit includes the following features:

- Implementation of [TailwindCSS](https://tailwindcss.com)
- Implementation of [Pinia](https://pinia.vuejs.org) for Central State Management
- Implementation of [Vuelidate](https://vuelidate-next.netlify.app) for form validation
- Installation of [FontAwesome](https://fontawesome.com) and [Hero Icons](https://heroicons.com)
- Router guards for Role-based Access Control
- Login and Register Screens
- Home Screen
- Manage Users Screen (CRUD, Search)
- Manage App Settings Screen (with change theme implementation)
- Update Profile information with image upload
- Forgot and Reset Password Screens
- Validate Email Screens for Registered Users
- Validate Account for Users created from the Admin Panel
- Implementation Forgot and Reset Password with Email Notification
- International phone number validation support
- Git hook and NPM automation with Husky
- Implementation of field input masking
- Implementation of reusable input components
- Eslint, Prettier, Vite, and TailwindCss styling configuration
- Gitlab MR template in `.gitlab/merge_request_templates`

## Set up your local development environment

- Install the LTS version of [NodeJS](https://nodejs.org/en) and [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Create a **.env.development.local** files from the **.env** file that came with this project. Make sure that the value for **VITE_API_ROOT_URL** is pointed to your local environment
- Make sure you have the [WebAppKit API](https://gitlab.dswd-dx.com/jego.ramos/webapp-kit-api) running on the background
- Run the command `npm install && npm run prepare` to install all the project and dev dependencies and configure Git hooks
