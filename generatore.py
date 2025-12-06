import os
import random

output_path = os.path.expanduser("~/weak_passwords.txt")

weak_passwords = set()

words = ["password", "admin", "guest", "user", "root"] + [f"word{i}" for i in range(300)]
numbers = [str(i) for i in range(0, 5000)]

for w in words:
    weak_passwords.add(w)
    for n in ["1", "123", "1234", "000", "111", "999"]:
        weak_passwords.add(w + n)

for n in numbers:
    if len(n) <= 4:
        weak_passwords.add(n)

final_passwords = list(weak_passwords)[:20000]

with open(output_path, "w") as f:
    for pwd in final_passwords:
        f.write(pwd + "\n")

print("Saved to:", output_path)
print("Total:", len(final_passwords))
