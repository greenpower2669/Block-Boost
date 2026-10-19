#!/usr/bin/env python3
"""Restore 21 approved embedded FX from a SHA-verified complete 0.13 game APK.
Use only in GitHub Actions temporary build tree. No standalone audio publishing.
"""
import hashlib
import io
import json
from pathlib import Path
import sys
from urllib.request import urlopen
import zipfile

ROOT=Path(sys.argv[1]).resolve()
URL=("https://raw.githubusercontent.com/greenpower2669/Block-Boost/"
     "temp/blockboost-fireworks-full-0.13.0/temp/android/"
     "BlockBoost-0.13.0-fireworks-full-debug.apk")
SHA256="c2943324577d7014851890fe767321beb36c26fcc41ae57a06cb78ede0215ec3"
OLD={"grab","drop","lineSingle","newBatch","streak1","streak2","streak3",
     "loss","festival-bubbles-create","bubbles-pop","festival-disco"}
NEW={"result-guitar","fireworks-bed-amb","fireworks-bed-explosions"} | {
     f"fireworks-bang-{i:02}" for i in range(1,8)}
EXPECTED=OLD | NEW

def main():
    assert (ROOT/"src/private-audio.mjs").exists(),"Not a Block Boost source checkout"
    with urlopen(URL,timeout=60) as response:
        game=response.read()
    assert hashlib.sha256(game).hexdigest()==SHA256,"Complete 0.13 APK SHA mismatch"
    with zipfile.ZipFile(io.BytesIO(game)) as archive:
        manifest=archive.read("assets/www/src/private-audio.mjs").decode("utf8")
        mapping=json.loads(manifest.split("Object.freeze(",1)[1].rsplit(");",1)[0])
        assert set(mapping)==EXPECTED,(sorted(set(mapping)^EXPECTED),"Audio mapping mismatch")
        directory=ROOT/"assets/licensed"
        directory.mkdir(parents=True,exist_ok=True)
        for event in sorted(EXPECTED):
            data=archive.read(f"assets/www/assets/licensed/{event}.ogg")
            assert data.startswith(b"OggS") and len(data)>2000,(event,"bad OGG")
            assert mapping[event]=="../assets/licensed/"+event+".ogg",event
            (directory/(event+".ogg")).write_bytes(data)
        assert len(list(directory.glob("*.ogg")))==21
        (ROOT/"src/private-audio.mjs").write_text(manifest,encoding="utf8")
    print("21 licensed game FX temporarily staged in CI, complete game only")

if __name__=="__main__":main()
