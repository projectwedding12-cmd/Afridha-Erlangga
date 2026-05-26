import re

with open(r'c:\Users\syafi\OneDrive\Dokumen\GitHub\Afridha-Erlangga\m01\index-1.htm', 'r', encoding='utf-8') as f:
    content1 = f.read()
with open(r'c:\Users\syafi\OneDrive\Dokumen\GitHub\Afridha-Erlangga\m01\index.html', 'r', encoding='utf-8') as f:
    content2 = f.read()

css1 = re.findall(r"href='([^']*\.css[^']*)'", content1)
css2 = re.findall(r"href='([^']*\.css[^']*)'", content2)

print('=== CSS di index-1.htm ===')
for c in css1:
    print(c)

print()
print('=== CSS di index.html ===')
for c in css2:
    print(c)

print()
set1 = set(css1)
set2 = set(css2)
print('=== Ada di index-1.htm tapi TIDAK di index.html ===')
for c in set1 - set2:
    print(c)

print()
print('=== Ada di index.html tapi TIDAK di index-1.htm ===')
for c in set2 - set1:
    print(c)
