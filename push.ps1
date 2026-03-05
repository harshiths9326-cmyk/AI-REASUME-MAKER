$git = "C:\Program Files\Git\cmd\git.exe"
& $git init
& $git config user.name "Harshith"
& $git config user.email "harshiths9326@gmail.com"
& $git add .
& $git commit -m "Initial setup of AI Resume Builder"
& $git branch -M main
& $git remote add origin https://github.com/harshiths9326-cmyk/AI-REASUME-MAKER.git
& $git push -u origin main
