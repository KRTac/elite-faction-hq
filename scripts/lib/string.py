import re


def lower_rest(s):
    if isinstance(s, str) and len(s) > 1:
        return s[0] + str(s[1:]).lower()

    return s

def slugify(s):
    s = s.replace(' ', '_')
    s = re.sub(r'[^A-Za-z0-9_.-]', '', s)

    return s
