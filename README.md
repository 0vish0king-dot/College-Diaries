# College Diaries 🎓

A beginner-friendly, student-built website where students share their profiles, photos, skills, and college stories while learning HTML, CSS, JavaScript, Git, and GitHub collaboration.

## Features

- Student profiles with photos, introductions, skills, and personal stories
- Search by name, skill, or interest
- Filter profiles by course
- Responsive layout for mobile and desktop
- Add a profile by editing HTML—no JSON or JavaScript edits needed

## Technologies

- HTML
- CSS
- JavaScript
- Git and GitHub

## Project Structure

```text
college-diaries/
├── index.html
├── style.css
├── app.js
├── images/
├── README.md
└── LICENSE
```

## Run Locally

Open `index.html` in your browser. The site does not need a server or any extra tools.

## How to Contribute

### 1. Fork the Repository

Click **Fork** to create a copy in your GitHub account.

### 2. Clone Your Fork

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git clone https://github.com/YOUR_USERNAME/college-diaries.git
cd college-diaries
```

### 3. Create a Branch

Replace `your-name` with your name:

```bash
git switch -c profile/your-name
```

### 4. Add Your Photo

Save your photo at:

```text
images/your-name.jpg
```

### 5. Add Your HTML Profile

Open `index.html`. Find `<div id="grid" class="grid">` and add your card inside it. Copy this example and replace the sample details with yours:

```html
<article class="card" data-course="MCA">
  <div class="portrait" style="--tint: #e1e8d9">
    <img src="images/your-name.jpg" alt="Your Name profile image">
    <span class="course">MCA</span>
  </div>
  <div class="card-body">
    <h3>Your Name</h3>
    <span class="year">1st year</span>
    <p>A short introduction about you.</p>
    <div class="tags"><span>HTML</span><span>CSS</span><span>Art</span></div>
    <p class="story" hidden>Write about your interests, projects or favourite college memory.</p>
    <div class="card-bottom"><span>A story in progress</span><button class="view">View diary ↗</button></div>
  </div>
</article>
```

Use the same course name in `data-course` and the course label. Available filters are `MCA`, `BCA`, and `BSc Data Science`. Add or remove skill tags by copying or deleting `<span>` elements. Keep the `story` paragraph and change its text to what you want people to read when they open your diary. You do not need to edit `app.js`.

### 6. Test Your Changes

Open `index.html` in your browser and check:

- Your photo and profile appear correctly.
- Your profile appears in search results.
- The course filter works.
- Your diary opens.
- The layout looks good on mobile.

### 7. Commit and Push

```bash
git add index.html images/your-name.jpg
git commit -m "Add my student profile"
git push -u origin profile/your-name
```

### 8. Open a Pull Request

On GitHub, click **Compare & pull request**.

Select the original repository's `main` branch as the destination.

Include:
- A clear title, such as `Add Aarav's profile`
- A short description of your changes
- A screenshot of your profile

Your teacher will review the PR and request corrections or merge it.

To make corrections, update the same branch, commit, and push again. The existing PR will update automatically.

## Contribution Rules

- Use one branch and one PR per task.
- Add your own HTML card and photo; do not remove or change another student's card.
- Write meaningful commit messages.
- Use only images you have permission to share.
- Avoid sharing private contact details.
- Test your changes before submitting.

## Practice Tasks

- Add your profile and photo.
- Improve the mobile layout.
- Add a course filter.
- Improve accessibility.
- Fix a bug or improve documentation.

## Sample Profiles

The included profiles and avatars are illustrative examples. Replace them or add real student profiles through pull requests.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
