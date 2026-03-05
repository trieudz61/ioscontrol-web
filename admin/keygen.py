#!/usr/bin/env python3
"""IOSControl — Key Generator (Admin Tool)
Usage: python3 keygen.py <days> [count]
Example: python3 keygen.py 7        # Gen 1 key cho 7 ngày
         python3 keygen.py 30 5     # Gen 5 key cho 30 ngày
"""

import sys, uuid, json, os
from datetime import datetime, timedelta

KEYS_FILE = os.path.join(os.path.dirname(__file__), "keys.json")

def load_keys():
    if os.path.exists(KEYS_FILE):
        with open(KEYS_FILE) as f:
            return json.load(f)
    return {}

def save_keys(keys):
    with open(KEYS_FILE, "w") as f:
        json.dump(keys, f, indent=2)

def gen_key():
    """Generate key format: IOSC-XXXX-XXXX-XXXX"""
    u = uuid.uuid4().hex.upper()
    return f"IOSC-{u[:4]}-{u[4:8]}-{u[8:12]}"

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    
    days = int(sys.argv[1])
    count = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    
    keys = load_keys()
    generated = []
    
    for _ in range(count):
        key = gen_key()
        keys[key] = {
            "days": days,
            "created_at": datetime.now().isoformat(),
            "udid": None,  # Will be bound on first activation
            "status": "unused"
        }
        generated.append(key)
    
    save_keys(keys)
    
    print(f"\n🔑 Generated {count} key(s) for {days} days:\n")
    for k in generated:
        print(f"  {k}")
    print(f"\n💾 Saved to {KEYS_FILE}")
    print(f"📋 Total keys: {len(keys)}")

if __name__ == "__main__":
    main()
