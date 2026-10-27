import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url));
const text = (path) => read(path).toString('utf8');

test('logo approuvé : WebP transparent 192×192 valide', () => {
  const file = read('assets/blockboost-logo.webp');
  assert.equal(file.toString('ascii', 0, 4), 'RIFF');
  assert.equal(file.toString('ascii', 8, 12), 'WEBP');
  assert.equal(file.toString('ascii', 12, 16), 'VP8X');
  assert.ok(file[20] & 0x10, 'canal alpha transparent requis');
  assert.equal(file.readUIntLE(24, 3) + 1, 192);
  assert.equal(file.readUIntLE(27, 3) + 1, 192);
  assert.deepEqual(read('android/app/src/main/res/drawable-nodpi/blockboost_logo.webp'), file);
});

test('icône Android du launcher et PWA utilisent le nouveau visuel', () => {
  assert.match(text('android/app/src/main/AndroidManifest.xml'), /@mipmap\/ic_launcher/);
  assert.match(text('android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml'), /@drawable\/ic_launcher_foreground/);
  assert.match(text('android/app/src/main/res/drawable/ic_launcher_foreground.xml'), /@drawable\/blockboost_logo/);
  assert.match(text('android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml'), /@android:color\/transparent/);
  const manifest = JSON.parse(text('manifest.webmanifest'));
  assert.ok(manifest.icons.some(icon => icon.src === './assets/blockboost-logo.webp' && icon.type === 'image/webp'));
  assert.match(text('index.html'), /href=".\/assets\/blockboost-logo.webp"/);
  assert.match(text('sw.js'), /assets\/blockboost-logo.webp/);
});
