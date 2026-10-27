import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
test("Google Play API 36 + unique package + monotonic version 17",()=>{
  const gradle=read("android/app/build.gradle");
  assert.match(gradle,/compileSdk\s+36\b/);
  assert.match(gradle,/targetSdk\s+36\b/);
  assert.match(gradle,/versionCode\s+17\b/);
  assert.match(gradle,/versionName\s+'0\.17\.0'/);
  assert.match(gradle,/applicationId\s+'fr\.greenpower\.blockboost'/);
  assert.match(gradle,/include 'src\/\*\*\/\*\.mjs'/);
});
test("Android 16 cutouts & system navigation insets protect touch controls",()=>{
  const java=read("android/app/src/main/java/fr/greenpower/blockboost/MainActivity.java");
  assert.match(java,/WindowInsets\.Type\.systemBars\(\)\s*\|\s*WindowInsets\.Type\.displayCutout\(\)/);
  assert.match(java,/view\.setPadding\(safe\.left, safe\.top, safe\.right, safe\.bottom\)/);
  assert.match(java,/insets\.getSystemWindowInsetTop\(\)/); // legacy support
});
test("No remote network or ads/analytics introduced by API upgrade",()=>{
  const manifest=read("android/app/src/main/AndroidManifest.xml");
  assert.doesNotMatch(manifest,/android\.permission\.INTERNET|com\.google\.android\.gms\.permission\.AD_ID|com\.google\.android\.gms\.ads/i);
  assert.match(manifest,/android\.permission\.VIBRATE/);
});
