// @quartz-community/graph는 노드 색을 "현재 페이지 / 방문함·태그 / 그 외" 3단계로만 칠한다.
// 여기서는 그 대신 최상위 폴더(Concepts=청록, Language=자홍, Practice=노랑)를 기준으로,
// 그 노드 자신 + 직접 연결된 이웃들이 어느 카테고리에 속하는지 세어 비율대로 섞은 색을 칠하도록
// 컴파일된 dist 파일을 직접 패치한다. npm install로 패키지가 새로 깔려도 매번
// prebuild/preserve에서 다시 실행되니 매번 다시 적용된다(멱등: 이미 패치돼 있으면 건너뜀).
import { readFileSync, writeFileSync } from "fs"

// graph 패키지는 같은 $e(색 계산) 함수가 dist/index.js와 dist/components/index.js
// 두 군데에 각각 따로 번들돼 있다(전자는 실제로 빌드에 안 쓰이는 것으로 확인됨,
// 후자가 진짜 클라이언트 스크립트로 나가는 파일) — 안전하게 둘 다 패치한다.
const TARGETS = ["dist/index.js", "dist/components/index.js"].map((p) =>
  new URL(`../node_modules/@quartz-community/graph/${p}`, import.meta.url).pathname.replace(
    /^\/([A-Za-z]:)/,
    "$1",
  ),
)

const ORIGINAL = 'function $e(i){var l=i.id===g;return l?Ie:K.has(i.id)||i.id.startsWith("tags/")?Qu:ue}'

// v1 패치(카테고리 3색 혼합만, 노드별 미세 차이 없음) — 업그레이드 대상으로 인식하기 위해 남겨둠
const OLD_PATCHED = `function $e(i){
  if(i.id.startsWith("tags/"))return K.has(i.id)?Qu:ue;
  var CATS={concepts:[34,211,238],language:[232,121,249],practice:[250,204,21]};
  function catOf(id){for(var k in CATS)if(id===k||id.indexOf(k+"/")===0)return k;return null}
  var counts={},total=0;
  var self=catOf(i.id);
  if(self){counts[self]=(counts[self]||0)+1;total++}
  for(var e=0;e<z.length;e++){
    var w=z[e];
    if(w.source.id===i.id||w.target.id===i.id){
      var other=w.source.id===i.id?w.target.id:w.source.id;
      var c=catOf(other);
      if(c){counts[c]=(counts[c]||0)+1;total++}
    }
  }
  if(total===0)return ue;
  var r=0,g2=0,b=0;
  for(var k in counts){var rgb=CATS[k],wt=counts[k]/total;r+=rgb[0]*wt;g2+=rgb[1]*wt;b+=rgb[2]*wt}
  return (Math.round(r)<<16)|(Math.round(g2)<<8)|Math.round(b);
}`

// v2: 카테고리 혼합색을 구한 뒤, id 해시로 hue/명도를 살짝(유사색 범위) 흔들어서
// 같은 카테고리라도 노드마다 색이 조금씩 다르게 보이게 한다.
const PATCHED = `function $e(i){
  if(i.id.startsWith("tags/"))return K.has(i.id)?Qu:ue;
  var CATS={concepts:[34,211,238],language:[232,121,249],practice:[250,204,21]};
  function catOf(id){for(var k in CATS)if(id===k||id.indexOf(k+"/")===0)return k;return null}
  var counts={},total=0;
  var self=catOf(i.id);
  if(self){counts[self]=(counts[self]||0)+1;total++}
  for(var e=0;e<z.length;e++){
    var w=z[e];
    if(w.source.id===i.id||w.target.id===i.id){
      var other=w.source.id===i.id?w.target.id:w.source.id;
      var c=catOf(other);
      if(c){counts[c]=(counts[c]||0)+1;total++}
    }
  }
  if(total===0)return ue;
  var r=0,g2=0,b=0;
  for(var k in counts){var rgb=CATS[k],wt=counts[k]/total;r+=rgb[0]*wt;g2+=rgb[1]*wt;b+=rgb[2]*wt}
  function rgbToHsl(r,g,b){
    r/=255;g/=255;b/=255;
    var max=Math.max(r,g,b),min=Math.min(r,g,b),h=0,s=0,l=(max+min)/2;
    if(max!==min){
      var d=max-min;
      s=l>0.5?d/(2-max-min):d/(max+min);
      if(max===r)h=(g-b)/d+(g<b?6:0);
      else if(max===g)h=(b-r)/d+2;
      else h=(r-g)/d+4;
      h/=6;
    }
    return [h*360,s*100,l*100];
  }
  function hslToRgb(h,s,l){
    h/=360;s/=100;l/=100;
    var r,g,b;
    if(s===0){r=g=b=l}
    else{
      var hue2rgb=function(p,q,t){
        if(t<0)t+=1;if(t>1)t-=1;
        if(t<1/6)return p+(q-p)*6*t;
        if(t<1/2)return q;
        if(t<2/3)return p+(q-p)*(2/3-t)*6;
        return p;
      };
      var q=l<0.5?l*(1+s):l+s-l*s,p=2*l-q;
      r=hue2rgb(p,q,h+1/3);g=hue2rgb(p,q,h);b=hue2rgb(p,q,h-1/3);
    }
    return [Math.round(r*255),Math.round(g*255),Math.round(b*255)];
  }
  var hash=0;
  for(var ci=0;ci<i.id.length;ci++)hash=(hash*31+i.id.charCodeAt(ci))|0;
  hash=Math.abs(hash);
  var hueJitter=(hash%31)-15,lightJitter=((hash>>5)%21)-10;
  var hsl=rgbToHsl(r,g2,b);
  hsl[0]=(hsl[0]+hueJitter+360)%360;
  hsl[2]=Math.min(85,Math.max(15,hsl[2]+lightJitter));
  var rgb2=hslToRgb(hsl[0],hsl[1],hsl[2]);
  return (rgb2[0]<<16)|(rgb2[1]<<8)|rgb2[2];
}`

for (const TARGET of TARGETS) {
  let src
  try {
    src = readFileSync(TARGET, "utf-8")
  } catch {
    console.warn(`[patch-graph-colors] 파일 없음, 건너뜀: ${TARGET}`)
    continue
  }

  if (src.includes("hueJitter")) {
    console.log(`[patch-graph-colors] 이미 패치되어 있음, 건너뜀: ${TARGET}`)
  } else if (src.includes(OLD_PATCHED)) {
    src = src.replace(OLD_PATCHED, PATCHED)
    writeFileSync(TARGET, src)
    console.log(`[patch-graph-colors] v1 -> v2로 업그레이드 패치: ${TARGET}`)
  } else if (!src.includes(ORIGINAL)) {
    console.warn(
      `[patch-graph-colors] 원본 함수를 못 찾음 — 버전이 바뀐 것 같음, 건너뜀: ${TARGET}`,
    )
  } else {
    src = src.replace(ORIGINAL, PATCHED)
    writeFileSync(TARGET, src)
    console.log(`[patch-graph-colors] 패치 완료: ${TARGET}`)
  }
}
