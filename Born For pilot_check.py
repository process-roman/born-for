SIGNS = {
    "cancer": dict(creativity=60, analytical=50, empathy=85, communication=60, organization=65, independence=40, curiosity=50, persistence=70),
    "leo": dict(creativity=80, analytical=40, empathy=55, communication=80, organization=40, independence=65, curiosity=55, persistence=65),
    "virgo": dict(creativity=45, analytical=85, empathy=50, communication=45, organization=85, independence=50, curiosity=50, persistence=70),
    "pisces": dict(creativity=85, analytical=45, empathy=85, communication=60, organization=35, independence=55, curiosity=65, persistence=50),
    "sagittarius": dict(creativity=60, analytical=55, empathy=50, communication=65, organization=35, independence=80, curiosity=85, persistence=50),
}

CAREERS = {
    "ux_design": dict(req={"creativity": (70, .4), "empathy": (60, .3), "communication": (60, .3)},
                      tags={"making": 1, "tech": .5, "puzzles": .5}, work=["small_team"]),
    "software_dev": dict(req={"analytical": (75, .4), "persistence": (70, .35), "curiosity": (60, .25)},
                         tags={"tech": 1, "puzzles": 1, "making": .5}, work=["solo", "small_team"]),
    "marketing": dict(req={"communication": (75, .4), "creativity": (65, .35), "curiosity": (55, .25)},
                      tags={"leading": 1, "making": .5, "performing": .5}, work=["small_team", "many"]),
    "teaching": dict(req={"communication": (75, .35), "empathy": (75, .35), "persistence": (60, .3)},
                     tags={"helping": 1, "performing": 1, "learning": .5}, work=["many"]),
    "data_analysis": dict(req={"analytical": (75, .45), "curiosity": (65, .3), "organization": (60, .25)},
                          tags={"puzzles": 1, "tech": .5, "learning": .5}, work=["solo", "small_team"]),
    "project_coord": dict(req={"organization": (75, .45), "communication": (65, .3), "persistence": (60, .25)},
                          tags={"organizing": 1, "leading": .5, "helping": .5}, work=["many", "small_team"]),
}

TARGET = {"yes": 85, "sometimes": 55, "no": 25}


def confirm(sign, answers):
    base = dict(SIGNS[sign])
    for a, ans in answers.items():
        if ans != "skip":
            base[a] = round(0.3 * base[a] + 0.7 * TARGET[ans])
    return base


def pref_score(tags, enjoy):
    w = sorted([tags.get(e, 0) for e in enjoy], reverse=True) + [0, 0]
    return min(1, (w[0] + 0.5 * w[1]) / 1.5)


def attr_fit(req, stats):
    return sum(weight * min(stats[a] / need, 1) for a, (need, weight) in req.items())


def difficulty(req, stats):
    gaps = [need - stats[a] for a, (need, _) in req.items()]
    key = sum(1 for g in gaps if g > 10)
    if key >= 2 or any(g > 30 for g in gaps):
        return "Challenging"
    return "Some training" if key == 1 else "Natural fit"


def rank(stats, enjoy, work):
    out = []
    for cid, c in CAREERS.items():
        p, f = pref_score(c["tags"], enjoy), attr_fit(c["req"], stats)
        w = 1 if work in c["work"] else (0.5 if work == "unsure" else 0)
        score = 100 * (0.52 * p + 0.43 * f + 0.05 * w)
        out.append((round(score, 1), round(p, 2), round(f, 2), cid, difficulty(c["req"], stats)))
    return sorted(out, key=lambda x: (-x[0], -x[1], -x[2], x[3]))


PERSONAS = [
    ("1 Maya, Cancer, accepts sign", "cancer", {}, ["helping", "organizing"], "many"),
    ("2 Liam, Cancer, analytical not empathetic", "cancer",
     {"empathy": "no", "analytical": "yes", "curiosity": "yes", "independence": "yes"}, ["puzzles", "tech"], "solo"),
    ("3 Zoe, Leo, performer", "leo", {}, ["leading", "performing", "making"], "many"),
    ("4 Noah, Virgo, wants to design", "virgo", {"creativity": "sometimes"}, ["making"], "small_team"),
    ("5 Ava, Pisces, unsure", "pisces", {"organization": "no", "communication": "sometimes"}, ["helping", "making", "learning"], "unsure"),
]

for name, sign, ans, enjoy, work in PERSONAS:
    stats = confirm(sign, ans)
    print("\n" + name, stats)
    for r in rank(stats, enjoy, work):
        print("  ", r)
