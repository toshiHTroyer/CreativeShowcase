Milestone 02
===

[Repository Link](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer)
--- 


Special Instructions for Using Form
---
To register and use the site:
1. Go to register an account [here](https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/register).
2. Fill in username, email, password, focus area (e.g. Film, Graphic Design), and public/private toggle.
3. After registering, you will be redirected to your portfolio page: /portfolio/[username].  
4. You can log out from there.
5. To log in again, return to `/` (homepage) and use your credentials. You can log in [here](https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/).

URL for form 
---
[Registration Form](https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/register)  
[Login Form](https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/)

URL for form result
---
After successful registration or login, user is redirected to their unique site: /portfolio/[username]  
Ex: https://glowing-carnival-66qv746rvgx34v77-3000.app.github.dev/portfolio/tht4789  
Note: you will be able to see page /portfolio/tht4789 as it is public, but from a non-owner perspective

URL to github that shows line of code where research topic(s) are used / implemented
--- 
1. Passport.js LocalStrategy Implementation - [from line 8 in /src/lib/passport.js](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/0dac7df9557a9f29482e4090e1f76c0ad7d6397d/creativeshowcase/src/lib/passport.js#L8) 
2. Next.js Implementations (can really be seen in the whole project)  
[/pages/portfolio/[slug]](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/0dac7df9557a9f29482e4090e1f76c0ad7d6397d/creativeshowcase/src/pages/portfolio/%5Bslug%5D.js#L4)  
[/pages/register.js](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/0dac7df9557a9f29482e4090e1f76c0ad7d6397d/creativeshowcase/src/pages/register.js#L3)  
[/pages/api/register.js](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/0dac7df9557a9f29482e4090e1f76c0ad7d6397d/creativeshowcase/src/pages/api/register.js#L12)


References 
---
1. Passport.js LocalStrategy Implementation - [/src/lib/passport.js from line 8](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/0dac7df9557a9f29482e4090e1f76c0ad7d6397d/creativeshowcase/src/lib/passport.js#L8)  
Resource - [Passport.js LocalStrategy Implementation](https://www.passportjs.org/packages/passport-local/)  
  
2. Passport.js Session Documentation - [/src/lib/passport.js from line 25](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/0dac7df9557a9f29482e4090e1f76c0ad7d6397d/creativeshowcase/src/lib/passport.js#L25)  
Resource - [Passport.js Session Documentation](https://www.passportjs.org/concepts/authentication/sessions/)  
  
3. Passport.js Session Documentation - [Middleware Handling within login.js line 14 - middleware included in all api files](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/0dac7df9557a9f29482e4090e1f76c0ad7d6397d/creativeshowcase/src/pages/api/login.js#L16)  
Resource - [Passport.js Session Documentation](https://www.passportjs.org/concepts/authentication/sessions/)  
3. [Next.js Project Structure Documentation](https://nextjs.org/docs/app/getting-started/project-structure)  
4. Next.js API Routes Documentation: [/pages/register.js](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/0dac7df9557a9f29482e4090e1f76c0ad7d6397d/creativeshowcase/src/pages/register.js#L3) & [/pages/api/register.js](https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-toshiHTroyer/blob/0dac7df9557a9f29482e4090e1f76c0ad7d6397d/creativeshowcase/src/pages/api/register.js#L12)  
Resource - [Next.js Routing](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)
