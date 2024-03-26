import subprocess
import sys


commands = [
    "manage.py makemigrations users",
    "manage.py makemigrations EasyTrade",
    "manage.py migrate",
]

# Determine which Python launcher to use based on the platformpy m
python_launcher = "python3" if sys.platform != "win32" else "py"

for command in commands:
    print(f"Executing command: {command}")
    subprocess.run(f"{python_launcher} {command}", shell=True)

print("All commands executed successfully.")