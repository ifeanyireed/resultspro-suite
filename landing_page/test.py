import os

directories = ["schoolhub", "resultspro", "examspro", "classroompro", "tutorspro", "coursespro", "puzzlepro"]
for d in directories:
    with open(f"src/app/(marketing)/{d}/page.tsx", "r") as f:
        content = f.read()
        if "          </div>\n        </div>\n      </section>" in content:
            print(f"{d}: Match")
        else:
            print(f"{d}: NO Match")
