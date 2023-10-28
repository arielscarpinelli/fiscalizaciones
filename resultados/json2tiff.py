import json
import base64
import sys

# run with `find . -name '*_tiff.json' -exec python json2tiff.py {} \;`

with open(sys.argv[1], "r") as f:
    print sys.argv[1]
    data = json.loads(f.read())
    base64.b64decode(data['encodingBinary'])
    with open(sys.argv[1].replace('.json', '.tiff'), "wb") as f:
        f.write(base64.b64decode(data['encodingBinary']))