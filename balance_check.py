"""Reference engine + balance test for the Born For life simulator.

Plays thousands of lives with every sign's starting stats and three player
strategies, then reports how often each ending, event and check result occurs.
Claude Code should port this logic to TypeScript (see LIFE_SIM_SPEC.md) and
keep an equivalent balance script.

Usage: python3 balance_check.py [content_dir] [career_id]
"""
import json
import random
import sys
from collections import Counter
from pathlib import Path

SIGNS = {
    "aries":       ("fire",  dict(creativity=60, analytical=50, empathy=50, communication=70, organization=40, independence=85, curiosity=70, persistence=55)),
    "taurus":      ("earth", dict(creativity=65, analytical=55, empathy=55, communication=50, organization=70, independence=60, curiosity=40, persistence=85)),
    "gemini":      ("air",   dict(creativity=65, analytical=60, empathy=50, communication=85, organization=40, independence=55, curiosity=85, persistence=40)),
    "cancer":      ("water", dict(creativity=60, analytical=50, empathy=85, communication=60, organization=65, independence=40, curiosity=50, persistence=70)),
    "leo":         ("fire",  dict(creativity=80, analytical=40, empathy=55, communication=80, organization=40, independence=65, curiosity=55, persistence=65)),
    "virgo":       ("earth", dict(creativity=45, analytical=85, empathy=50, communication=45, organization=85, independence=50, curiosity=50, persistence=70)),
    "libra":       ("air",   dict(creativity=70, analytical=60, empathy=75, communication=80, organization=55, independence=35, curiosity=55, persistence=50)),
    "scorpio":     ("water", dict(creativity=50, analytical=75, empathy=55, communication=40, organization=50, independence=70, curiosity=55, persistence=85)),
    "sagittarius": ("fire",  dict(creativity=60, analytical=55, empathy=50, communication=65, organization=35, independence=80, curiosity=85, persistence=50)),
    "capricorn":   ("earth", dict(creativity=45, analytical=70, empathy=45, communication=45, organization=85, independence=60, curiosity=45, persistence=85)),
    "aquarius":    ("air",   dict(creativity=80, analytical=65, empathy=45, communication=50, organization=35, independence=80, curiosity=80, persistence=45)),
    "pisces":      ("water", dict(creativity=85, analytical=45, empathy=85, communication=60, organization=35, independence=55, curiosity=65, persistence=50)),
}

# The fixed shape of every life: 10 slots.
SLOTS = [
    ("start", "opener", 18),
    ("training", "career", 19),
    ("training", "life", 21),
    ("breaking_in", "job_hunt", 22),
    ("breaking_in", "career", 23),
    ("first_job", "career", 24),
    ("first_job", "sign", 25),
    ("crossroads", "crossroads", 26),
    ("crossroads", "life", 28),
    ("thirty", "finale", 29),
]
START_METERS = dict(joy=50, energy=65, money=30, mastery=0)
METERS = ("joy", "energy", "money", "mastery")
MAX_FORCED_PER_RUN = 2


def odds(stats, check, flags):
    bonus = sum(v for f, v in check.get("bonus", {}).items() if f in flags)
    raw = 50 + 1.5 * (stats[check["attribute"]] - check["difficulty"]) + bonus
    return int(round(max(15, min(90, raw))))


def meets(cond, state):
    if not cond:
        return True
    flags, meters = state["flags"], state["meters"]
    if "anyOf" in cond and not any(meets(c, state) for c in cond["anyOf"]):
        return False
    if any(f not in flags for f in cond.get("flagsAll", [])):
        return False
    if any(f in flags for f in cond.get("flagsNone", [])):
        return False
    if any(meters[m] < v for m, v in cond.get("meterMin", {}).items()):
        return False
    if any(meters[m] > v for m, v in cond.get("meterMax", {}).items()):
        return False
    if "elements" in cond and state["element"] not in cond["elements"]:
        return False
    return True


def pick_event(pool, stage, kind, state, rng):
    eligible = [e for e in pool
                if e["kind"] == kind and stage in e.get("stages", [])
                and e["id"] not in state["used"] and meets(e.get("conditions"), state)]
    if not eligible:
        return None
    top = max(e.get("priority", 0) for e in eligible)
    eligible = [e for e in eligible if e.get("priority", 0) == top]
    weights = [e.get("weight", 1) for e in eligible]
    return rng.choices(eligible, weights)[0]


def apply(effects, state):
    for m in METERS:
        if m in effects:
            state["meters"][m] = max(0, min(100, state["meters"][m] + effects[m]))
    state["flags"].update(effects.get("set", []))
    state["flags"].difference_update(effects.get("clear", []))
    if effects.get("highlight"):
        state["highlights"].append(effects["highlight"])


def play_event(event, state, stats, strategy, rng, log):
    choices = [c for c in event["choices"] if meets(c.get("requires"), state)]
    if strategy == "random":
        choice = rng.choice(choices)
    elif strategy == "safe":  # prefer choices without a check
        safe = [c for c in choices if "check" not in c]
        choice = rng.choice(safe or choices)
    else:  # "bold": prefer the check with the best odds
        checks = [c for c in choices if "check" in c]
        choice = max(checks, key=lambda c: odds(stats, c["check"], state["flags"])) if checks else rng.choice(choices)
    if "check" in choice:
        p = odds(stats, choice["check"], state["flags"])
        ok = rng.random() * 100 < p
        outcome = choice["success"] if ok else choice["fail"]
        log["checks"].append((choice["check"]["attribute"], p, ok))
    else:
        outcome = choice["result"]
    apply(outcome["effects"], state)
    log["events"].append(event["id"])


def play_life(life, shared, sign, strategy, rng):
    element, stats = SIGNS[sign]
    pool = life["events"] + shared["events"]
    forced = [e for e in shared["events"] if e["kind"] == "forced"]
    state = dict(meters=dict(START_METERS), flags=set(), used=set(), highlights=[], element=element)
    log = dict(events=[], checks=[], skipped=[], forced=0)
    for stage, kind, _age in SLOTS:
        event = pick_event(pool, stage, kind, state, rng)
        if event is None:
            log["skipped"].append(f"{stage}/{kind}")
        else:
            state["used"].add(event["id"])
            play_event(event, state, stats, strategy, rng, log)
        for f in forced:  # forced events check after every slot
            if (log["forced"] < MAX_FORCED_PER_RUN and f["id"] not in state["used"]
                    and meets(f["trigger"], state)):
                state["used"].add(f["id"])
                log["forced"] += 1
                play_event(f, state, stats, strategy, rng, log)
    ending = next(e for e in life["endings"] if meets(e["when"], state))
    return ending["id"], state, log


def main():
    content = Path(sys.argv[1] if len(sys.argv) > 1 else "content")
    career = sys.argv[2] if len(sys.argv) > 2 else "ux_design"
    life = json.loads((content / "lives" / f"{career}.json").read_text())
    shared = json.loads((content / "shared_events.json").read_text())
    rng = random.Random(42)
    runs_per = 1000
    total = 0
    endings_by_strategy = {}
    event_counts, checks, skipped, finals = Counter(), [], Counter(), Counter()
    burnout = 0
    sign_endings = {}
    for strategy in ("random", "safe", "bold"):
        ends = Counter()
        for sign in SIGNS:
            for _ in range(runs_per):
                end, state, log = play_life(life, shared, sign, strategy, rng)
                total += 1
                ends[end] += 1
                sign_endings.setdefault(sign, Counter())[end] += 1
                event_counts.update(log["events"])
                checks.extend(log["checks"])
                skipped.update(log["skipped"])
                burnout += "shared_burnout" in log["events"]
                for m in METERS:
                    finals[m] += state["meters"][m]
        endings_by_strategy[strategy] = ends

    n_per_strategy = runs_per * len(SIGNS)
    print(f"Career: {career} · {total} lives (12 signs × 3 strategies × {runs_per})\n")
    print("Endings by strategy (%):")
    ids = [e["id"] for e in life["endings"]]
    print(f"  {'ending':<18}" + "".join(f"{s:>9}" for s in endings_by_strategy))
    for eid in ids:
        print(f"  {eid:<18}" + "".join(f"{100*c[eid]/n_per_strategy:>8.1f}%" for c in endings_by_strategy.values()))
    print("\nThriving + Steady by sign (random strategy, %):")
    for sign, c in sign_endings.items():
        tot = sum(c.values())
        print(f"  {sign:<12} thriving {100*c['ux_end_thriving']/tot:5.1f}  steady {100*c['ux_end_steady']/tot:5.1f}  pivot {100*c['ux_end_pivot']/tot:5.1f}")
    avg_p = sum(p for _, p, _ in checks) / len(checks)
    rate = 100 * sum(ok for _, _, ok in checks) / len(checks)
    print(f"\nChecks: {len(checks)} · average shown odds {avg_p:.1f}% · actual success {rate:.1f}%")
    print(f"Burnout event in {100*burnout/total:.1f}% of lives")
    print("Average final meters: " + ", ".join(f"{m} {finals[m]/total:.0f}" for m in METERS))
    print(f"Average events per life: {sum(event_counts.values())/total:.1f}")
    print(f"Skipped slots: {dict(skipped) or 'none'}")
    all_ids = [e["id"] for e in life["events"] + shared["events"]]
    print("\nEvent appearance (% of lives):")
    for eid in all_ids:
        print(f"  {eid:<22} {100*event_counts[eid]/total:5.1f}%")
    never = [e for e in all_ids if event_counts[e] == 0]
    print(f"\nNever appeared: {never or 'none'}")


if __name__ == "__main__":
    main()
