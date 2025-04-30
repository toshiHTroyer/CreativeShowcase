Milestone 04 - Final Project Documentation
===

NetID
---
tht4789

Name
---
Toshi Troyer

Repository Link
---
**Link to Repo**  
    [Repo](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer)

URL for deployed site 
---
**URL to Site**  
  [Deployed Site](https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/)

URL for form 1 (Login & Registration from Milestone 2) 
---
- **Login** (same as URL to site)  
  [Login](https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/)

- **Registration**  
  [Registration](https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/register)
Special Instructions for Form 1
---
To register and use the site:
1. Go to register an account [here](https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/register).
2. Fill in username, email, password, focus area (e.g. Film, Graphic Design), and public/private toggle.
3. After registering, you will be redirected to your portfolio page: /portfolio/[username].  
4. You can log out from there.
5. To log in again, return to `/` (homepage) and use your credentials. You can log in [here](https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/).

URL for Form 2 (for current milestone)
---
- **Project Upload**  
  - [Add a Project `/portfolio/project`](https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/portfolio/project)
    -  Result on user portfolio page
    -  Note: Some files will take a long time to load (may have to refresh manually)
- **User Portfolio - Explore Other Creatives Section** (replace `[username]` with yours)  
    - [https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/portfolio/[username]](https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/portfolio/[username])

Special Instructions for Form 2
---
- **Important**
    - I had to remove /public/uploads and /public/projectUploads from my repository, so in order to be able to upload user / project images, you may need to recreate these two folders. 
- No new dedicated form was created for this milestone.
- The project file upload feature was fully implemented in my already existing add a project form. I used the formidable npm package in the /api project.js backend route to implement this feature. The uploaded projects are displayed dynamically inside the existing public portfolio page /portfolio/[username], which now renders images/PDFs styled within their own project card within their category card using Tailwind CSS.
  - To upload a project, just select what category to add to, add a tile (and description if you would like), and upload a reasonably sized image or pdf. After a succesful upload, you will be redirected to your personal updated /portfolio/[username] site. 
- I also implemented a new /api/public-users API route, which fetches all users with public portfolios. On the 
/portfolio/[slug] users portfolio page, the public users are fetched from /api/public-users and displayed underneath the bio section so that users can explore public portfolios. 
  - To explore other public users, simply scroll down the `Explore Other Creatives` section, and click on a users portfolio image or username. You will be redirected to their public portfolio where you can view their projects. Just click `Back to My Portfolio` to return. You can also click on Creative Showcase in the header to return to your profile. 

URL for Form 3 (User Portfolio, Add a Category, Add a Project, Edit Portfolio from Milestone 2 and 3)
---

- **User Portfolio Link Template**  
    - User Portfolio (replace `[username]` with yours)   
    - (https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/portfolio/[username])

- **Example - My Public Portfolio**  
    - [Public Portfolio - username `tht4789`](https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/portfolio/tht4789)

- **Add a Category**  
  - [Add a Category](https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/portfolio/project)

- **Add a Project**  
  - [Add a Project](https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/portfolio/project)

- **Edit Portfolio**  
  - [Edit Portfolio](https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/portfolio/settings)

Special Instructions for Form 3
---
1. Register and get logged into your personal portfolio page with your username slug path
2. Once you are logged in, you can add categories to your portfolio, projects to your categories, or update your bio in portfolio settings. 
3. Just click on Creative Showcase in the header to return to your portfolio. 

First link to github line number(s) for constructor, HOF, etc.
---
[Use of `map` to render categories - /src/pages/portfolio/[slug].js](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/85b367c9be82e8778361e1fc623faafc873c2325/creativeshowcase/src/pages/portfolio/%5Bslug%5D.js#L177)

Second link to github line number(s) for constructor, HOF, etc.
---
[Use of `filter` to show only public users - /src/pages/portfolio/[slug].js](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/85b367c9be82e8778361e1fc623faafc873c2325/creativeshowcase/src/pages/portfolio/%5Bslug%5D.js#L149)

Short description for links above
---
1. `map` is first used to transform the categories array into a list of rendered sections on the portfolio page, with each section representing a category. Inside each category, map is used again (line 194) to iterate over its projects array and render individual project details. Overall, map is used twice in [slug].js: once to iterate over the categories array and once inside each category to iterate over its projects array. 
2. `filter` is used to transform the publicUsers array by removing the logged-in user’s own account from the list so they only see other users’ public portfolios.

Link to github line number(s) for schemas
---
[Link to Schemas](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/adcbba76c2b80b64a43fae31e2374708b2522d6b/creativeshowcase/src/models/db.js#L1) 

Description of research topics above with points
---
- **Authentication / Passport.js (2 points)**   
    -  Implemented user authentication and session management using Passport.js LocalStrategy in (`/lib/passport.js`) and protected API routes throughout my project, for example in (`login.js`, `me.js`, `project.js`) by nesting sessionOptions,passport.initialize(), and passport.session() to guaraentee authentication middlewarecompletes before anything else each time a user navigates to a form. 
- **Next.js (6 points)**  
    - Structured the entire application using Next.js, implementing dynamic nested routes like `/portfolio/[slug]` and `/portfolio/project` to support user-specific portfolio pages and project forms, while also using Next.js API routes (`/api/login.js`, `/api/project.js`) for server-side functionality and secure database operations.  
- **Tailwind.css (4 points)**
    - Used Tailwind CSS utility classes throughout the app (such as in `/portfolio/[slug].js`, `/portfolio/project.js`, `/portfolio/settings.js`, `/pages/index.js`, and `/src/components/PortfolioHeader.js`) to create fully responsive layouts, customized styled sections for categories, projects, and forms without relying on any external UI libraries.

Links to github line number(s) for research topics described above (one link per line)
---
- **Auth/Passport**
    - [Implementation in `/lib/passport.js`: entire file](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/7d872346a83f61ad5a431142919a25e98152a539/creativeshowcase/src/lib/passport.js#L1)
    - [Implementation in API Files in `/pages/api/login`: note lines 21 - 30 specifically](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/08ab6fc7ac8734eac568a22daedb599254ca1e89/creativeshowcase/src/pages/api/login.js#L21)
    - [Login with req.login in `/pages/api/login`](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/f50d2f1c755f82721c5b8417eddccf18f37390ea/creativeshowcase/src/pages/api/login.js#L39)

- **Next.js**   
    - [Implementation in `/pages/portfolio/[slug].js`](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/7f1bb62059f79e74d74be990674df4facfc1b255/creativeshowcase/src/pages/portfolio/%5Bslug%5D.js#L7)  
    - [API Implementation in `/pages/api/login.js`](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/08ab6fc7ac8734eac568a22daedb599254ca1e89/creativeshowcase/src/pages/api/login.js#L6)
    - Next.js implementation is seen throughout the entire project (including project structure)  

- **Tailwind.css**  
    - [Implementation ex in `/pages/portfolio/[slug].js`: lines 79 - 240](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/7f1bb62059f79e74d74be990674df4facfc1b255/creativeshowcase/src/pages/portfolio/%5Bslug%5D.js#L95)
    - [Implementation ex in `/pages/index.js`: lines 27 -85](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/ceb4617c262315f3d0b7610d085360b8769647ff/creativeshowcase/src/pages/index.js#L44)
    - [Implementation ex in `/components/PortfolioHeader.js` entire file](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/ceb4617c262315f3d0b7610d085360b8769647ff/creativeshowcase/src/components/PortfolioHeader.js#L9)
    - Tailwind CSS is used for all client-side layout and design across the project, implemented in all /components files and in all non-/api files under /pages.


Attributions
---
1. **Embedding Links to New Pages (LinkedIn, Instagram)**  
   [Code Reference](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/f50d2f1c755f82721c5b8417eddccf18f37390ea/creativeshowcase/src/pages/portfolio/%5Bslug%5D.js#L122)  
   [Resource - Stack Overflow](https://stackoverflow.com/questions/50709625/link-with-target-blank-and-rel-noopener-noreferrer-still-vulnerable)

2. **File Upload Form Parsing with Formidable**  
   [Code Reference](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/fd5637af84f758f71417bd5dbb8342b7c87d2778/creativeshowcase/src/pages/api/project.js#L27)  
   [Resource - npmjs.com (Formidable Package)](https://www.npmjs.com/package/formidable)

3. **Passport.js LocalStrategy Implementation**  
   [Code Reference - Passport.js LocalStrategy Implementation in `/lib/passport.js`](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/7d872346a83f61ad5a431142919a25e98152a539/creativeshowcase/src/lib/passport.js#L6)  
   [Resource - Passport.js LocalStrategy Documentation](https://www.passportjs.org/packages/passport-local/)

4. **Passport.js Session Handling**  
   [Code Reference 1 - Passport.js Session Setup in `/lib/passport.js`](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/7d872346a83f61ad5a431142919a25e98152a539/creativeshowcase/src/lib/passport.js#L25)  
   [Code Reference 2 - Middleware Handling within `/pages/api/login.js`](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/08ab6fc7ac8734eac568a22daedb599254ca1e89/creativeshowcase/src/pages/api/login.js#L21)  
   [Resource - Passport.js Session Documentation](https://www.passportjs.org/concepts/authentication/sessions/)



