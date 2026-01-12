# MR340 Distance Calculator

A simple tool for calculating distances between checkpoints and boat ramps along the Missouri River 340 race course.

## What It Does

Select any two locations along the MR340 course and see the distance between them. Shows direction (downstream/upstream) to help with planning.

## Hosting on GitHub Pages

1. Create a new repository on GitHub
2. Push these files to the `main` branch:
   ```
   git init
   git add .
   git commit -m "MR340 Distance Calculator"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   git push -u origin main
   ```
3. Go to your repository on GitHub
4. Click **Settings** > **Pages**
5. Under "Source", select **Deploy from a branch**
6. Select **main** branch and **/ (root)** folder
7. Click **Save**
8. Your site will be live at `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/` within a few minutes

## Local Development

Just open `index.html` in a browser. No build step or server required.

## Data Sources

Location data from the [official MR340 ramps list](https://mr340.org/resources/ramps/).

River miles are measured from the mouth of the Missouri River:
- Higher RM = further upstream (start)
- Lower RM = further downstream (finish)

## Files

```
index.html  - Main page
style.css   - Styling
script.js   - Location data and calculation logic
```

---

*Long. Quiet. Earned.*
