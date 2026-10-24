(function(){
"use strict";
/* ============ constants ============ */
const $=s=>document.querySelector(s);
const CHC={lead:'#f5c451',harm:'#6fd6c8',bass:'#93d36b',drum:'#ef8a6a'};
const CHN={lead:{name:'Lead',chip:'Pulse 1'},harm:{name:'Harmony',chip:'Pulse 2'},bass:{name:'Bass',chip:'Triangle'},drum:{name:'Drums',chip:'Noise'}};
const MEL=['lead','harm','bass'], ALL=['lead','harm','bass','drum'];
const DRUM_ROWS=['Kick','Snare','Hat','Open','Tom'];
const BASE={lead:60,harm:60,bass:36};
const NN=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const SCALES={
  ionian:{name:'Major (Ionian)',iv:[0,2,4,5,7,9,11]},
  dorian:{name:'Dorian',iv:[0,2,3,5,7,9,10]},
  phrygian:{name:'Phrygian',iv:[0,1,3,5,7,8,10]},
  lydian:{name:'Lydian',iv:[0,2,4,6,7,9,11]},
  mixolydian:{name:'Mixolydian',iv:[0,2,4,5,7,9,10]},
  aeolian:{name:'Minor (Aeolian)',iv:[0,2,3,5,7,8,10]},
  harmonic:{name:'Harmonic minor',iv:[0,2,3,5,7,8,11]},
  majpent:{name:'Major pentatonic',iv:[0,2,4,7,9]},
  minpent:{name:'Minor pentatonic',iv:[0,3,5,7,10]}
};
const STYLE_OPTS={
  harm:[['arp','Arpeggio'],['pad','Long pad'],['stabs','Off-beat stabs'],['counter','Counter-melody']],
  bass:[['walk','Walking'],['pulse8','Eighth pulse'],['drone','Drone'],['drive','Driving'],['heartbeat','Heartbeat']],
  drum:[['light','Light'],['shuffle','Shuffle'],['sparse','Sparse'],['heartbeat','Heartbeat'],['drive','Driving'],['march','March']]
};
const DRUM_PATS={
  light:['x.......x.......','....o.......x...','..x...x...x...x.','..............o.','................'],
  shuffle:['x.....x...x.....','....x.......x...','x.xox.x.x.xox.x.','................','................'],
  sparse:['x.........o.....','................','....x.......x...','........o.......','.............o..'],
  heartbeat:['x..x............','................','......o.......o.','................','........o.....o.'],
  drive:['x...x...x...x..o','....x.......x...','xoxxxoxxxoxxxoxx','..............x.','.........o......'],
  march:['x.......x.o.....','....x..o....x.xx','x.x.x.x.x.x.x.x.','................','................']
};
const MOODS=[
 {id:'dawn',name:'Dawn Grove',short:'Exploring',blurb:'Wandering the healed meadows at first light.',key:2,scale:'ionian',bpm:100,progs:[[0,4,5,3],[0,3,4,0],[0,5,3,4]],density:.55,
  mix:{echo:.25,swing:.08,crunch:12},lead:{duty:.25,env:'pluck',vib:.3,arp:false},harm:{duty:.125,env:'pluck',vib:0,arp:true},bass:{env:'hold'},drum:{noise:'soft'},style:{harm:'arp',bass:'walk',drum:'light'},
  pal:{skyTop:'#3b4f8a',skyBot:'#f2a86b',sea:'#2d5f8a',seaHi:'#9fd3e8',sand:'#e3c58a',grass:'#5fa04e',grassDk:'#3d7a3a',leaf:'#3f8a45',leafHi:'#7cc95c',trunk:'#6b4a2f',stone:'#8a8f99',cel:'sun',celC:'#ffe08a',rune:'#ffe08a'}},
 {id:'tide',name:'Tidepool Drift',short:'Shoreline',blurb:'Combing the shallows for shells and seeds.',key:5,scale:'lydian',bpm:108,progs:[[0,1,0,1],[0,4,1,5],[0,1,4,0]],density:.5,
  mix:{echo:.35,swing:.2,crunch:8},lead:{duty:.25,env:'pluck',vib:.4,arp:false},harm:{duty:.5,env:'pluck',vib:0,arp:true},bass:{env:'pluck'},drum:{noise:'soft'},style:{harm:'arp',bass:'pulse8',drum:'shuffle'},
  pal:{skyTop:'#3d8fd1',skyBot:'#b8ebf4',sea:'#1f7f99',seaHi:'#c8f6f2',sand:'#f0d9a0',grass:'#6cb85a',grassDk:'#46914a',leaf:'#3c9a5a',leafHi:'#8fdc77',trunk:'#7a5232',stone:'#9aa3ad',cel:'sun',celC:'#fff3b0',rune:'#c8f6f2'}},
 {id:'moon',name:'Moonlit Stones',short:'Night',blurb:'The standing stones hum while the island sleeps.',key:4,scale:'dorian',bpm:84,progs:[[0,3,0,3],[0,6,5,3],[0,4,3,0]],density:.35,
  mix:{echo:.55,swing:0,crunch:10},lead:{duty:.5,env:'hold',vib:.6,arp:false},harm:{duty:.25,env:'swell',vib:.2,arp:false},bass:{env:'hold'},drum:{noise:'soft'},style:{harm:'pad',bass:'drone',drum:'sparse'},
  pal:{skyTop:'#070b1c',skyBot:'#2a3462',sea:'#121d3d',seaHi:'#6176bb',sand:'#6d6a7a',grass:'#2c4a4a',grassDk:'#1e3638',leaf:'#24464f',leafHi:'#3f7173',trunk:'#3a2e33',stone:'#7c86a8',cel:'moon',celC:'#e8ecff',rune:'#9ff0ff',night:true}},
 {id:'blight',name:'Blight Creep',short:'Danger',blurb:'Something rotten spreads from the eastern woods.',key:1,scale:'phrygian',bpm:76,progs:[[0,1,0,1],[0,1,6,1],[0,5,1,0]],density:.3,
  mix:{echo:.4,swing:0,crunch:35},lead:{duty:.125,env:'fade',vib:.2,arp:false},harm:{duty:.25,env:'pluck',vib:0,arp:false},bass:{env:'pluck'},drum:{noise:'metal'},style:{harm:'stabs',bass:'heartbeat',drum:'heartbeat'},
  pal:{skyTop:'#1a0d26',skyBot:'#5a2f5e',sea:'#2a1f3d',seaHi:'#8a64a8',sand:'#7a6670',grass:'#4a4a3a',grassDk:'#33302c',leaf:'#4d3d55',leafHi:'#7a5f86',trunk:'#3d2e2a',stone:'#6a6070',cel:'moon',celC:'#c9a6e8',rune:'#d68cff',night:true,blight:true}},
 {id:'ritual',name:'Ritual of Roots',short:'Cleansing',blurb:'Driving the blight from its source.',key:9,scale:'harmonic',bpm:140,progs:[[0,5,3,4],[0,6,5,4],[0,3,4,0]],density:.75,
  mix:{echo:.15,swing:0,crunch:20},lead:{duty:.25,env:'pluck',vib:.3,arp:false},harm:{duty:.125,env:'pluck',vib:0,arp:true},bass:{env:'pluck'},drum:{noise:'soft'},style:{harm:'arp',bass:'drive',drum:'drive'},
  pal:{skyTop:'#2a0f12',skyBot:'#d9653b',sea:'#3a2230',seaHi:'#e89a6a',sand:'#b0855a',grass:'#5a7a3a',grassDk:'#3d5a2a',leaf:'#4a6a35',leafHi:'#9ac55a',trunk:'#4a3020',stone:'#a07a6a',cel:'sun',celC:'#ffb36b',rune:'#ffd27a'}},
 {id:'restored',name:'Balance Restored',short:'Triumph',blurb:'The grove blooms again. For now.',key:7,scale:'mixolydian',bpm:124,progs:[[0,6,3,0],[0,3,6,4],[0,4,6,3]],density:.6,
  mix:{echo:.2,swing:.05,crunch:10},lead:{duty:.5,env:'hold',vib:.4,arp:false},harm:{duty:.25,env:'pluck',vib:0,arp:true},bass:{env:'hold'},drum:{noise:'soft'},style:{harm:'arp',bass:'walk',drum:'march'},
  pal:{skyTop:'#4a9be8',skyBot:'#ffe2a8',sea:'#2f8fb8',seaHi:'#d6f6ff',sand:'#f2dca5',grass:'#7ccc5a',grassDk:'#4fa048',leaf:'#45a85a',leafHi:'#a8ec7a',trunk:'#7a5232',stone:'#b0b8c2',cel:'sun',celC:'#fff6c2',rune:'#fff6c2',bloom:true}},
 {id:'hollow',name:'Spirit Hollow',short:'Mystery',blurb:'Old voices drift through the fog of the hollow.',key:11,scale:'minpent',bpm:72,progs:[[0,3,2,0],[0,2,3,4],[0,4,3,1]],density:.3,
  mix:{echo:.6,swing:0,crunch:6},lead:{duty:.5,env:'swell',vib:.5,arp:false},harm:{duty:.125,env:'swell',vib:.3,arp:false},bass:{env:'hold'},drum:{noise:'soft'},style:{harm:'counter',bass:'drone',drum:'sparse'},
  pal:{skyTop:'#0e1f1c',skyBot:'#3f6b5a',sea:'#16302e',seaHi:'#6aa894',sand:'#5d6b5a',grass:'#2f5a40',grassDk:'#21412f',leaf:'#2a5a44',leafHi:'#5fa07a',trunk:'#33302a',stone:'#7a9488',cel:'moon',celC:'#d8ffe8',rune:'#a8ffd0',night:true,fog:true}}
];
const moodById=id=>MOODS.find(m=>m.id===id)||MOODS[0];
const PITCH_COLORS=['#f5c451','#ffe08a','#9ef0a0','#6fd6c8','#b9a0ff','#ff9ec4','#ffd27a'];
const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============ utils ============ */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const pick=(r,a)=>a[Math.floor(r()*a.length)];
function wpick(r,items,w){let s=0;for(const x of w)s+=x;let v=r()*s;for(let i=0;i<items.length;i++){v-=w[i];if(v<=0)return items[i]}return items[items.length-1]}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function hexRgb(h){const n=parseInt(h.slice(1),16);return[n>>16&255,n>>8&255,n&255]}
function lerpHex(a,b,t){const A=hexRgb(a),B=hexRgb(b);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'}
function hexA(h,a){const[r,g,b]=hexRgb(h);return`rgba(${r},${g},${b},${a})`}
let toastT=0;function toast(msg){const t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,2600)}

/* ============ song state ============ */
let song=null, IDX={};
function songFromMood(m,seed,bars){
  return {v:1,mood:m.id,seed,bpm:m.bpm,key:m.key,scale:m.scale,bars:bars||4,chords:[],
    mix:{vol:.8,echo:m.mix.echo,swing:m.mix.swing,crunch:m.mix.crunch},
    style:{density:m.density,harm:m.style.harm,bass:m.style.bass,drum:m.style.drum},
    seeds:{},
    ch:{lead:{...m.lead,vol:.8,mute:false,solo:false,notes:[]},
        harm:{...m.harm,vol:.7,mute:false,solo:false,notes:[]},
        bass:{duty:.5,vib:0,arp:false,...m.bass,vol:.9,mute:false,solo:false,notes:[]},
        drum:{...m.drum,vol:.8,mute:false,solo:false,hits:[]}}};
}
const N=()=>SCALES[song.scale].iv.length;
const maxDeg=()=>2*N();
const total=()=>song.bars*16;
const kOff=()=>song.key>6?song.key-12:song.key;
function midiOf(ch,d){const iv=SCALES[song.scale].iv,n=iv.length;return BASE[ch]+kOff()+iv[((d%n)+n)%n]+12*Math.floor(d/n)}
const hz=m=>440*Math.pow(2,(m-69)/12);
const noteName=m=>NN[((m%12)+12)%12]+(Math.floor(m/12)-1);
function chordTones(c){const n=N();return n===7?[c%n,(c+2)%n,(c+4)%n]:[c%n,(c+2)%n,(c+3)%n]}
function chordName(c){const iv=SCALES[song.scale].iv,n=iv.length;const root=(iv[c%n]+song.key)%12;let q='';
  if(n===7){const th=(iv[(c+2)%7]-iv[c%7]+12)%12,fi=(iv[(c+4)%7]-iv[c%7]+12)%12;q=th===3?(fi===6?'°':'m'):(fi===8?'+':'')}
  return NN[root]+q}
function reindex(){const t=total();IDX={};for(const c of MEL){const a=new Array(t).fill(null);for(const n of song.ch[c].notes)if(n.s<t)a[n.s]=n;IDX[c]=a}
  const H=song.ch.drum.hits;for(let r=0;r<5;r++){if(!H[r])H[r]=[];while(H[r].length<t)H[r].push(0);H[r].length=t}}
let saveT=0;function save(){clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem('druidisle.song.v1',JSON.stringify(song))}catch(e){}},300)}

/* ============ generator ============ */
const seedFor=name=>((song.seed>>>0)^hashStr(name))>>>0;
function genChords(r){const m=moodById(song.mood),n=N();const p1=pick(r,m.progs),p2=pick(r,m.progs);
  song.chords=Array.from({length:song.bars},(_,b)=>(((b>=4?p2:p1)[b%4])%n))}
function genLead(r){
  const n=N(),mx=maxDeg(),dens=song.style.density,notes=[];
  const W=[1,.15,.4,.15,.85,.15,.4,.2,.95,.15,.4,.15,.75,.2,.5,.3];
  const mkMotif=()=>{let on=[];for(let s=0;s<16;s++){if(s===0?r()<.85:r()<W[s]*dens*1.25)on.push(s)}if(on.length<2)on=[0,8];
    return on.map((s,i)=>{const nx=i+1<on.length?on[i+1]:16,gap=nx-s;const len=r()<.3?Math.max(1,gap-1):Math.min(gap,8);
      return{s,len,step:wpick(r,[-2,-1,0,1,2,3,-3],[.13,.3,.07,.3,.13,.035,.035]),strong:s%4===0}})};
  const vary=m=>m.map((e,i)=>i>=m.length-2&&r()<.6?{...e,step:wpick(r,[-2,-1,1,2],[.2,.3,.3,.2])}:e);
  const nearest=(cur,c,rootOnly)=>{const tones=rootOnly?[c%n]:chordTones(c);let best=cur,bd=99;for(let d=2;d<=mx;d++){if(!tones.includes(d%n))continue;const dd=Math.abs(d-cur)+r()*.6;if(dd<bd){bd=dd;best=d}}return best};
  const A=mkMotif(),B=mkMotif();let cur=n+(song.chords[0]%n);
  for(let b=0;b<song.bars;b++){
    const c=song.chords[b],p=b%4,base=b*16;
    if(p===3||(song.bars===2&&b===1)){
      const evs=mkMotif().filter(e=>e.s<8);
      for(const e of evs){e.len=Math.min(e.len,8-e.s);cur=e.strong?nearest(cur+e.step,c):clamp(cur+e.step,2,mx);notes.push({s:base+e.s,d:cur,len:e.len})}
      cur=nearest(cur,c,true);const fs=r()<.5?8:12;notes.push({s:base+fs,d:cur,len:16-fs-(r()<.5?1:0)});continue}
    let m=(b>=4&&p<2&&r()<.5)?B:A;if(p===1)m=vary(m);if(p===2&&r()<.4)m=vary(m);
    for(const e of m){cur=e.strong?nearest(cur+e.step,c):clamp(cur+e.step,2,mx);notes.push({s:base+e.s,d:cur,len:e.len})}
  }
  return notes}
function genHarm(r){
  const n=N(),mx=maxDeg(),notes=[],st=song.style.harm;
  for(let b=0;b<song.bars;b++){const c=song.chords[b]%n,base=b*16;const add=(s,d,len)=>notes.push({s:base+s,d:clamp(d,0,mx),len});
    if(st==='arp'){if(r()<.35){for(let k=0;k<4;k++)add(k*4,k%2?c+n:c,4)}else{add(0,c,8);add(8,r()<.5?c:c+n,8)}}
    else if(st==='pad'){if(r()<.5)add(0,c+2,16);else{add(0,c+2,8);add(8,c+(n===7?4:3),8)}}
    else if(st==='stabs'){add(4,c+2,2);add(12,c+(n===7?4:3),2);if(r()<.5)add(10,c+2,1);if(r()<.3)add(7,c,1)}
    else{const tones=chordTones(c).map(t=>t+n);for(const s of[2,6,10,14]){if(r()<.5)add(s,pick(r,tones),2)}if(r()<.4)add(8,pick(r,tones),2)}
  }
  return notes}
function genBass(r){
  const n=N(),mx=maxDeg(),notes=[],st=song.style.bass,fifth=n===7?4:3;
  for(let b=0;b<song.bars;b++){const R=song.chords[b]%n,O=R+n,F=R+fifth,base=b*16;const add=(s,d,len)=>notes.push({s:base+s,d:clamp(d,0,mx),len});
    if(st==='walk'){add(0,R,3);add(4,F,3);add(8,O,3);const nxt=song.chords[(b+1)%song.bars]%n;add(12,r()<.4?nxt+(r()<.5?1:-1)+ (nxt+1<1?n:0):F,3)}
    else if(st==='pulse8'){for(let i=0;i<8;i++)add(i*2,(i===3||i===7)&&r()<.45?O:R,r()<.2?1:2)}
    else if(st==='drone'){if(r()<.5)add(0,R,16);else{add(0,R,8);add(8,r()<.5?F:O,8)}}
    else if(st==='drive'){for(let i=0;i<8;i++)add(i*2,i%2?O:R,1);if(r()<.4)add(15,F,1)}
    else{add(0,R,2);add(3,R,2);if(r()<.5){add(8,R,2);add(11,r()<.3?R+1:R,3)}}
  }
  return notes}
function genDrums(r){
  const pat=DRUM_PATS[song.style.drum]||DRUM_PATS.light,t=total();const H=Array.from({length:5},()=>new Array(t).fill(0));
  for(let b=0;b<song.bars;b++){for(let row=0;row<5;row++){const p=pat[row];for(let s=0;s<16;s++){const ch=p[s];if(ch==='x'||(ch==='o'&&r()<.5))H[row][b*16+s]=1}}
    const fillOk=!['sparse','heartbeat'].includes(song.style.drum);
    if(fillOk&&b%4===3&&r()<.65){for(let s=12;s<16;s++){for(let row=0;row<5;row++)H[row][b*16+s]=0;if(r()<.6)H[1][b*16+s]=1;else H[4][b*16+s]=1}if(r()<.5)H[0][b*16+12]=1}}
  return H}
function genTrack(ch){const r=mulberry32(song.seeds[ch]||seedFor(ch));
  if(ch==='lead')song.ch.lead.notes=genLead(r);else if(ch==='harm')song.ch.harm.notes=genHarm(r);else if(ch==='bass')song.ch.bass.notes=genBass(r);else song.ch.drum.hits=genDrums(r);
  reindex();save()}
function composeAll(){song.seeds={};for(const c of ALL)song.seeds[c]=seedFor(c);genChords(mulberry32(seedFor('chords')));for(const c of ALL)genTrack(c)}

/* ============ audio engine ============ */
let ctx=null,G=null,playing=false,timer=0,nextTime=0,stepPtr=0,vq=[],playhead=-1;
function waveFromFn(ac,fn){const NS=256,H=64,re=new Float32Array(H+1),im=new Float32Array(H+1),s=[];for(let i=0;i<NS;i++)s.push(fn(i/NS));
  for(let h=1;h<=H;h++){let a=0,b=0;for(let i=0;i<NS;i++){const w=2*Math.PI*h*i/NS;a+=s[i]*Math.cos(w);b+=s[i]*Math.sin(w)}re[h]=2*a/NS;im[h]=2*b/NS}
  return ac.createPeriodicWave(re,im)}
function makeWaves(ac){return{p125:waveFromFn(ac,x=>x<.125?1:-1),p25:waveFromFn(ac,x=>x<.25?1:-1),p50:waveFromFn(ac,x=>x<.5?1:-1),
  tri:waveFromFn(ac,x=>{const st=Math.floor(x*32);const v=st<16?st:31-st;return v/7.5-1})}}
function makeNoise(ac){const sr=ac.sampleRate,len=sr;const mk=(tap,bitLen)=>{const b=ac.createBuffer(1,len,sr),d=b.getChannelData(0);let reg=1;
  for(let i=0;i<len;i++){if(i%bitLen===0){const fb=(reg&1)^((reg>>tap)&1);reg=(reg>>1)|(fb<<14)}d[i]=(reg&1)?.8:-.8}return b};
  return{white:mk(1,2),metal:mk(6,6)}}
const crushCache={};
function crushCurve(c){c=Math.round(c);if(c<=0)return null;if(crushCache[c])return crushCache[c];const levels=Math.round(64-(c/100)*58),n=4096,a=new Float32Array(n);
  for(let i=0;i<n;i++){const x=i/(n-1)*2-1;a[i]=Math.round(x*levels)/levels}return crushCache[c]=a}
function buildGraph(ac,rt){
  const g={ac,waves:makeWaves(ac),noise:makeNoise(ac),ch:{},an:{}};
  g.mix=ac.createGain();g.shaper=ac.createWaveShaper();g.comp=ac.createDynamicsCompressor();
  g.comp.threshold.value=-10;g.comp.ratio.value=3;g.comp.attack.value=.003;g.comp.release.value=.15;
  g.master=ac.createGain();g.mix.connect(g.shaper);g.shaper.connect(g.comp);g.comp.connect(g.master);g.master.connect(ac.destination);
  g.delay=ac.createDelay(2);g.fb=ac.createGain();g.wet=ac.createGain();g.delay.connect(g.fb);g.fb.connect(g.delay);g.delay.connect(g.wet);g.wet.connect(g.mix);
  for(const c of ALL){const gn=ac.createGain();g.ch[c]=gn;
    if(rt){const a=ac.createAnalyser();a.fftSize=2048;gn.connect(a);a.connect(g.mix);g.an[c]=a}else gn.connect(g.mix);
    if(c==='lead'||c==='harm'){const s=ac.createGain();s.gain.value=c==='lead'?1:.6;gn.connect(s);s.connect(g.delay)}}
  applyMix(g);return g}
function chanLevel(c){const any=ALL.some(x=>song.ch[x].solo),o=song.ch[c];if(o.mute)return 0;if(any&&!o.solo)return 0;return o.vol}
function applyMix(g){if(!g)return;for(const c of ALL)g.ch[c].gain.value=chanLevel(c);
  g.master.gain.value=song.mix.vol;g.wet.gain.value=song.mix.echo*.55;g.fb.gain.value=.2+song.mix.echo*.35;
  g.delay.delayTime.value=Math.min(1.9,60/song.bpm*.75);g.shaper.curve=crushCurve(song.mix.crunch)}
function envelope(gn,t,dur,v,env){const P=gn.gain;P.setValueAtTime(0,t);const end=t+dur;
  if(env==='swell'){P.linearRampToValueAtTime(v,t+Math.max(.02,Math.min(dur*.7,.5)))}
  else{P.linearRampToValueAtTime(v,t+.004);if(env==='pluck')P.setTargetAtTime(v*.3,t+.004,.07);else if(env==='hold')P.setTargetAtTime(v*.75,t+.004,.25);else P.setTargetAtTime(0,t+.004,Math.max(.03,dur*.3))}
  P.setTargetAtTime(0,end,env==='swell'?.05:.015);return end+(env==='swell'?.4:.15)}
const dutyKey=d=>d<=.13?'p125':d<=.3?'p25':'p50';
function playNote(g,ch,n,t,sd){
  const ac=g.ac,o=song.ch[ch],env=o.env||'hold';const dur=Math.max(.03,n.len*sd*(env==='hold'||env==='swell'?.97:.9));
  const osc=ac.createOscillator();osc.setPeriodicWave(ch==='bass'?g.waves.tri:g.waves[dutyKey(o.duty)]);
  if(o.arp&&ch!=='bass'){const fs=[n.d,n.d+2,n.d+(N()===7?4:3)].map(d=>hz(midiOf(ch,d)));let i=0;for(let tt=t;tt<t+dur;tt+=.045,i++)osc.frequency.setValueAtTime(fs[i%3],tt)}
  else osc.frequency.setValueAtTime(hz(midiOf(ch,n.d)),t);
  if(o.vib>0&&dur>.18){const l=ac.createOscillator();l.frequency.value=5.5;const lg=ac.createGain();lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(o.vib*35,t+Math.min(.25,dur*.5));l.connect(lg);lg.connect(osc.detune);l.start(t);l.stop(t+dur+.4)}
  const gn=ac.createGain();const v=ch==='lead'?.16:ch==='harm'?.11:.34;const stop=envelope(gn,t,dur,v,env);
  osc.connect(gn);gn.connect(g.ch[ch]);osc.start(t);osc.stop(stop)}
function playDrum(g,row,t,vel){
  const ac=g.ac,out=g.ch.drum,metal=song.ch.drum.noise==='metal';
  const nsrc=(buf,rate)=>{const s=ac.createBufferSource();s.buffer=buf;s.loop=true;s.playbackRate.value=rate;return s};
  const tone=(f0,f1,len,v,tc)=>{const o=ac.createOscillator();o.setPeriodicWave(g.waves.tri);o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+len);
    const gn=ac.createGain();gn.gain.setValueAtTime(v,t);gn.gain.setTargetAtTime(0,t+.01,tc);o.connect(gn);gn.connect(out);o.start(t);o.stop(t+len+.3)};
  const noise=(buf,rate,ftype,freq,v,tc,len)=>{const s=nsrc(buf,rate);const f=ac.createBiquadFilter();f.type=ftype;f.frequency.value=freq;f.Q.value=.7;
    const gn=ac.createGain();gn.gain.setValueAtTime(v,t);gn.gain.setTargetAtTime(0,t,tc);s.connect(f);f.connect(gn);gn.connect(out);s.start(t,Math.random()*.5);s.stop(t+len)};
  if(row===0){tone(180,40,.12,.75*vel,.045);noise(g.noise.white,1,'lowpass',3000,.25*vel,.006,.06)}
  else if(row===1){noise(metal?g.noise.metal:g.noise.white,metal?.6:1,'bandpass',1800,.5*vel,.055,.4);tone(230,140,.06,.22*vel,.03)}
  else if(row===2)noise(metal?g.noise.metal:g.noise.white,metal?1.6:1,'highpass',6500,.22*vel,.012,.12);
  else if(row===3)noise(metal?g.noise.metal:g.noise.white,metal?1.6:1,'highpass',6000,.2*vel,.08,.6);
  else tone(280,110,.2,.5*vel,.07)}
const swingT=(st,sd)=>st%2?song.mix.swing*sd*.6:0;
function scheduleStep(g,st,t,sd){
  for(const c of MEL){if(chanLevel(c)===0)continue;const n=IDX[c]&&IDX[c][st];if(n)playNote(g,c,n,t,sd)}
  if(chanLevel('drum')>0){const H=song.ch.drum.hits;for(let r=0;r<5;r++)if(H[r][st])playDrum(g,r,t,st%4===0?1:.72)}}
function ensureCtx(){if(!ctx){const AC=window.AudioContext||window.webkitAudioContext;ctx=new AC();G=buildGraph(ctx,true)}if(ctx.state==='suspended')ctx.resume()}
function tick(){const sd=60/song.bpm/4,tt=total();while(nextTime<ctx.currentTime+.12){if(stepPtr>=tt)stepPtr=0;const t=nextTime+swingT(stepPtr,sd);scheduleStep(G,stepPtr,t,sd);vq.push({st:stepPtr,t});nextTime+=sd;stepPtr++}}
function play(){ensureCtx();if(playing)return;playing=true;stepPtr=0;vq=[];nextTime=ctx.currentTime+.06;tick();timer=setInterval(tick,25);updatePlayBtn()}
function stop(){playing=false;clearInterval(timer);vq=[];playhead=-1;updatePlayBtn();drawGrid()}
function updatePlayBtn(){const b=$('#playBtn');b.textContent=playing?'Stop':'Play';b.classList.toggle('playing',playing);b.setAttribute('aria-pressed',String(playing))}
function preview(ch,n){ensureCtx();const sd=60/song.bpm/4;const t=ctx.currentTime+.01;if(ch==='drum')playDrum(G,n,t,1);else playNote(G,ch,n,t,sd)}

/* ============ rendering to file ============ */
async function renderLoop(loops){
  const sd=60/song.bpm/4,tt=total(),L=tt*sd,sr=44100;
  const oac=new OfflineAudioContext(1,Math.ceil(sr*L*(loops+1))+16,sr);const g=buildGraph(oac,false);
  for(let k=0;k<=loops;k++)for(let st=0;st<tt;st++)scheduleStep(g,st,k*L+st*sd+swingT(st,sd),sd);
  const buf=await oac.startRendering();const start=Math.round(L*sr),len=Math.round(L*sr*loops);
  return buf.getChannelData(0).slice(start,start+len)}
function wavBytes(data,sr){let peak=0;for(let i=0;i<data.length;i++){const a=Math.abs(data[i]);if(a>peak)peak=a}const k=peak>0?.89/peak:1,n=data.length;
  const buf=new ArrayBuffer(44+n*2),v=new DataView(buf),w=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i))};
  w(0,'RIFF');v.setUint32(4,36+n*2,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);
  for(let i=0;i<n;i++){const s=clamp(data[i]*k,-1,1);v.setInt16(44+i*2,s<0?s*32768:s*32767,true)}return new Uint8Array(buf)}
async function offerFile(name,bytes,mime){
  const url=URL.createObjectURL(new Blob([bytes],{type:mime}));
  const a=document.createElement('a');a.href=url;a.download=name;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),5000);toast('Downloaded '+name);
}

/* ============ scene ============ */
const SW=256,SH=112,HZ=72;
const scv=$('#scene'),sx=scv.getContext('2d');
let bgL=null,islL=null,pal=null,patches=[];
const S={bass:0,kick:0,snare:0,hat:0,harm:0,lead:0,crystal:'#f5c451',rune:0,runeE:[0,0,0],parts:[],ripples:[],flowers:[],stars:[],idle:0};
const TREES=[{x:42,t:'pine',ph:0},{x:60,t:'round',ph:1},{x:80,t:'pine',ph:2},{x:180,t:'round',ph:3},{x:198,t:'pine',ph:4},{x:216,t:'round',ph:5}];
const STONES=[{x:142,h:11},{x:151,h:15},{x:160,h:10}];
const DRUID_X=114;
function gy(x){const dx=(x-128)/90;return Math.round(86-18*Math.sqrt(Math.max(0,1-dx*dx)))}
function mkLayer(){const c=document.createElement('canvas');c.width=SW;c.height=SH;return c}
function disc(g,cx,cy,r,c){g.fillStyle=c;for(let dy=-r;dy<=r;dy++){const hw=Math.floor(Math.sqrt(r*r-dy*dy));g.fillRect(cx-hw,cy+dy,hw*2+1,1)}}
function buildLayers(){
  pal=moodById(song.mood).pal;const r=mulberry32(hashStr(song.mood));
  bgL=mkLayer();let g=bgL.getContext('2d');
  for(let y=0;y<HZ;y++){const f=y/HZ*9,b=Math.floor(f),fr=f-b;g.fillStyle=lerpHex(pal.skyTop,pal.skyBot,b/9);g.fillRect(0,y,SW,1);
    if(fr>.55){g.fillStyle=lerpHex(pal.skyTop,pal.skyBot,Math.min(1,(b+1)/9));for(let x=y%2;x<SW;x+=2)g.fillRect(x,y,1,1)}}
  // distant isles
  g.fillStyle=lerpHex(pal.skyBot,pal.sea,.55);
  for(const[cx,w,h]of[[22,30,4],[236,40,6],[200,18,3]]){for(let x=-w;x<=w;x++){const hh=Math.round(h*Math.sqrt(1-(x/w)**2));g.fillRect(cx+x,HZ-hh,1,hh)}}
  for(let y=HZ;y<SH;y++){g.fillStyle=lerpHex(pal.sea,'#000000',(y-HZ)/(SH-HZ)*.35);g.fillRect(0,y,SW,1)}
  g.fillStyle=pal.seaHi;g.globalAlpha=.6;g.fillRect(0,HZ,SW,1);g.globalAlpha=1;
  islL=mkLayer();g=islL.getContext('2d');
  // beach
  for(let y=82;y<=98;y++){const dy=(y-90)/8;if(Math.abs(dy)>1)continue;const hw=Math.round(108*Math.sqrt(1-dy*dy));g.fillStyle=y>94?lerpHex(pal.sand,pal.sea,.35):pal.sand;g.fillRect(128-hw,y,hw*2,1)}
  // grass mound
  for(let x=38;x<=218;x++){const top=gy(x);g.fillStyle=pal.grass;g.fillRect(x,top,1,90-top);g.fillStyle=pal.leafHi;g.fillRect(x,top,1,1);
    g.fillStyle=pal.grassDk;for(let y=top+3;y<90;y++){if(y>86||((x*7+y*3)%11===0))g.fillRect(x,y,1,1)}}
  // grass tufts
  g.fillStyle=pal.leafHi;for(let i=0;i<40;i++){const x=40+Math.floor(r()*176),y=gy(x)+2+Math.floor(r()*12);if(y<88){g.fillRect(x,y,1,1);g.fillRect(x+1,y-1,1,1)}}
  // path to the stones
  g.fillStyle=lerpHex(pal.sand,pal.grass,.4);for(let x=DRUID_X+4;x<STONES[2].x+4;x++){if(x%3)g.fillRect(x,gy(x)+4+((x>>2)&1),1,1)}
  // blight patches
  patches=[];if(pal.blight){for(let i=0;i<7;i++){const x=150+Math.floor(r()*64),y=gy(x)+3+Math.floor(r()*8),w=3+Math.floor(r()*6);patches.push({x,y,w});
    for(let k=-w;k<=w;k++){const hh=Math.round(2*Math.sqrt(1-(k/w)**2));g.fillStyle='#3a2048';g.fillRect(x+k,y-hh,1,hh*2+1)}}}
  // stars
  S.stars=[];for(let i=0;i<46;i++)S.stars.push({x:Math.floor(r()*SW),y:Math.floor(r()*(HZ-14)),p:r()*6.28,b:r()<.15});
  S.flowers=[];if(pal.bloom)for(let i=0;i<26;i++)addFlower(r);
}
function addFlower(r){r=r||Math.random;if(S.flowers.length>80)S.flowers.shift();const x=40+Math.floor(r()*176);if(Math.abs(x-DRUID_X)<6)return;
  S.flowers.push({x,y:gy(x)+2+Math.floor(r()*10),c:pick(r,['#ff9ec4','#fff6c2','#b9a0ff','#ffd27a','#ffffff']),age:0})}
function drawPine(x,base,h,sway){sx.fillStyle=pal.trunk;sx.fillRect(x-1,base-3,2,4);
  for(let r=0;r<h;r++){const w=1+Math.floor((r%5)*.8+r*.26),y=base-3-h+r,xo=Math.round(sway*(1-r/h));sx.fillStyle=pal.leaf;sx.fillRect(x-w+xo,y,w*2,1);sx.fillStyle=pal.leafHi;sx.fillRect(x-w+xo,y,1,1)}}
function drawRound(x,base,h,sway){sx.fillStyle=pal.trunk;sx.fillRect(x-1,base-6,2,7);const rr=Math.round(h*.38),cx=x+Math.round(sway),cy=base-6-rr+1;
  disc(sx,cx,cy,rr,pal.leaf);sx.fillStyle=pal.leafHi;for(let dy=-rr+1;dy<0;dy++){const hw=Math.floor(Math.sqrt(rr*rr-dy*dy));sx.fillRect(cx-hw+1,cy+dy,Math.max(1,hw-1),1)}
  sx.fillStyle=pal.grassDk;sx.fillRect(cx-rr+2,cy+rr-1,rr*2-3,1)}
const DRUID=['..hhh...','.hhhhh..','.hfffh..','.hefeh..','.hhhhh..','rrrrrrr.','.rrrrr..','.rBrrr..','.rrrrr..','.rrrrr..','rrrrrrr.','.b...b..'];
const DCOL={h:'#3f6b3a',f:'#e8c39e',e:'#1a1a1a',r:'#5d7f3c',B:'#c9a24a',b:'#3a2a1e'};
function drawDruid(t){const fy=gy(DRUID_X)+1,bob=S.kick>.55&&!RM?1:0,top=fy-DRUID.length+bob;
  for(let y=0;y<DRUID.length;y++)for(let x=0;x<8;x++){const c=DRUID[y][x];if(c!=='.'){sx.fillStyle=DCOL[c];sx.fillRect(DRUID_X-4+x,top+y,1,1)}}
  const sxp=DRUID_X+4;sx.fillStyle='#7a5a32';sx.fillRect(sxp,top-4,1,DRUID.length+4-bob);
  const glow=.25+S.lead*.75;sx.globalAlpha=glow*.35;disc(sx,sxp,top-6,3,S.crystal);sx.globalAlpha=1;sx.fillStyle=S.crystal;sx.fillRect(sxp-1,top-7,2,2);sx.globalAlpha=glow;sx.fillStyle='#ffffff';sx.fillRect(sxp-1,top-7,1,1);sx.globalAlpha=1;
  return{x:sxp,y:top-7}}
function spawnFireflies(n,x,y,color){for(let i=0;i<n;i++)S.parts.push({x:x+Math.random()*2-1,y,vx:(Math.random()-.5)*.5,vy:-.25-Math.random()*.5,life:1.4+Math.random()*1.4,max:2.8,c:color,ph:Math.random()*6})}
const tip={x:DRUID_X+4,y:60};
const scene={
  hit(ch,n){const m=midiOf(ch,n.d);
    if(ch==='lead'){S.lead=1;S.crystal=PITCH_COLORS[((n.d%N())+N())%N()];spawnFireflies(RM?1:2,tip.x,tip.y,S.crystal);if(pal.bloom&&Math.random()<.5)addFlower()}
    else if(ch==='harm'){S.harm=1;S.rune=(S.rune+1)%3;S.runeE[S.rune]=1;if(!RM)S.ripples.push({x:Math.random()<.5?8+Math.random()*30:218+Math.random()*30,y:92+Math.random()*16,r:1,life:1})}
    else if(ch==='bass'){S.bass=Math.min(1,.6+(m%12)/30)}},
  drum(r){if(r===0)S.kick=1;else if(r===1){S.snare=1;if(pal.blight&&!RM){const p=pick(Math.random,patches);if(p)S.parts.push({x:p.x,y:p.y,vx:(Math.random()-.5)*.3,vy:-.3,life:1.2,max:1.2,c:'#b07ad8',ph:0})}}else if(r===2||r===3)S.hat=1;else S.bass=Math.max(S.bass,.5)}
};
function drawScene(now,dt){
  const t=now/1000,k=Math.pow(.015,dt);S.bass*=k;S.kick*=Math.pow(.002,dt);S.snare*=k;S.hat*=Math.pow(.001,dt);S.harm*=k;S.lead*=Math.pow(.05,dt);for(let i=0;i<3;i++)S.runeE[i]*=Math.pow(.2,dt);
  if(!pal)return;sx.drawImage(bgL,0,0);
  // stars
  if(pal.night){for(const s of S.stars){const b=.25+.55*Math.abs(Math.sin(t*.8+s.p))+(s.b?S.hat*.5:0);sx.globalAlpha=Math.min(1,b);sx.fillStyle='#ffffff';sx.fillRect(s.x,s.y,1,1);
    if(s.b&&b>.8){sx.globalAlpha=b*.4;sx.fillRect(s.x-1,s.y,3,1);sx.fillRect(s.x,s.y-1,1,3)}}sx.globalAlpha=1}
  // celestial
  const cx=206,cy=22;
  if(pal.cel==='sun'){const rr=8+Math.round(S.harm*1.5);sx.globalAlpha=.25;disc(sx,cx,cy,rr+3,pal.celC);sx.globalAlpha=1;disc(sx,cx,cy,rr,pal.celC);
    sx.fillStyle=pal.celC;for(let i=0;i<8;i++){const a=t*.25+i*Math.PI/4;sx.fillRect(Math.round(cx+Math.cos(a)*(rr+5)),Math.round(cy+Math.sin(a)*(rr+5)),1,1)}}
  else{sx.globalAlpha=.18+S.harm*.15;disc(sx,cx,cy,11,pal.celC);sx.globalAlpha=1;disc(sx,cx,cy,7,pal.celC);sx.fillStyle=lerpHex(pal.celC,pal.skyTop,.3);sx.fillRect(cx-3,cy-2,2,2);sx.fillRect(cx+2,cy+2,2,1);sx.fillRect(cx,cy-4,1,1)}
  // clouds or fog
  if(!pal.night){sx.fillStyle='#ffffff';sx.globalAlpha=.75;for(let i=0;i<3;i++){const w=16+i*6,x=Math.round(((i*97+t*(2+i))%(SW+60))-30),y=10+i*13;sx.fillRect(x,y,w,2);sx.fillRect(x+3,y-2,w-8,2);sx.fillRect(x+6,y-3,5,1)}sx.globalAlpha=1}
  // waves
  sx.fillStyle=pal.seaHi;for(let y=HZ+3,i=0;y<SH;y+=3,i++){const sp=(i%2?1:-1)*(5+i*1.4),off=Math.floor(t*sp+i*7),len=2+Math.floor(S.bass*3)+(i>6?1:0),per=SW+32;
    sx.globalAlpha=.3+.45*(i/12);for(let x=0;x<per;x+=13+(i%3)*4){const xx=((x+off)%per+per)%per-16;sx.fillRect(xx,y,len,1)}}sx.globalAlpha=1;
  // ripples
  sx.fillStyle=pal.seaHi;for(const p of S.ripples){p.r+=dt*14;p.life-=dt*.8;sx.globalAlpha=Math.max(0,p.life);for(let a=0;a<16;a++){const an=a/16*6.283;sx.fillRect(Math.round(p.x+Math.cos(an)*p.r),Math.round(p.y+Math.sin(an)*p.r*.3),1,1)}}
  sx.globalAlpha=1;S.ripples=S.ripples.filter(p=>p.life>0);
  // island
  const oy=(S.kick>.7&&!RM)?1:0;sx.save();sx.translate(0,oy);
  sx.drawImage(islL,0,0);
  // blight pulse
  if(pal.blight){for(const p of patches){sx.fillStyle='#8a4aa8';sx.globalAlpha=.35+.35*Math.abs(Math.sin(t*1.7+p.x))+S.snare*.3;for(let k2=-p.w+1;k2<p.w;k2+=2)sx.fillRect(p.x+k2,p.y,1,1);}sx.globalAlpha=1}
  // stones
  STONES.forEach((s,i)=>{const b=gy(s.x)+2;sx.fillStyle=pal.stone;sx.fillRect(s.x-2,b-s.h,5,s.h);sx.fillRect(s.x-1,b-s.h-1,3,1);sx.fillStyle='rgba(0,0,0,.28)';sx.fillRect(s.x+2,b-s.h,1,s.h);
    const e=S.runeE[i];sx.fillStyle=pal.rune;sx.globalAlpha=.25+e*.75;sx.fillRect(s.x,b-s.h+3,1,4);sx.fillRect(s.x-1,b-s.h+4,3,1);if(e>.3){sx.globalAlpha=e*.3;sx.fillRect(s.x-3,b-s.h-2,7,s.h+2)}sx.globalAlpha=1});
  // trees
  for(const tr of TREES){const base=gy(tr.x)+2,h=(tr.t==='pine'?17:16)+Math.round(S.bass*(tr.ph%2?3:2)),sway=Math.sin(t*1.1+tr.ph)*1.1;tr.t==='pine'?drawPine(tr.x,base,h,sway):drawRound(tr.x,base,h,sway)}
  if(S.hat>.4&&!pal.night){sx.fillStyle='#ffffff';sx.globalAlpha=S.hat*.8;const tr=TREES[Math.floor(t*7)%TREES.length];sx.fillRect(tr.x-3+Math.floor(Math.random()*6),gy(tr.x)-12+Math.floor(Math.random()*6),1,1);sx.globalAlpha=1}
  // flowers
  for(const f of S.flowers){f.age=Math.min(1,f.age+dt*2);sx.fillStyle=pal.grassDk;sx.fillRect(f.x,f.y,1,1);if(f.age>.5){sx.fillStyle=f.c;sx.fillRect(f.x,f.y-1,1,1)}}
  const tp=drawDruid(t);tip.x=tp.x;tip.y=tp.y;
  sx.restore();
  // fog
  if(pal.fog){sx.fillStyle=pal.skyBot;for(let i=0;i<4;i++){const x=Math.round(((t*(3+i)+i*80)%(SW+140))-140),y=58+i*9;sx.globalAlpha=.16;sx.fillRect(x,y,130,3);sx.fillRect(x+12,y-1,90,1)}sx.globalAlpha=1}
  // particles
  if(!playing){S.idle-=dt;if(S.idle<=0){S.idle=.9+Math.random()*1.2;const tr=pick(Math.random,TREES);spawnFireflies(1,tr.x,gy(tr.x)-10,pal.night?'#d8ffb0':'#fff2b0')}}
  for(const p of S.parts){p.x+=(p.vx+Math.sin(t*3+p.ph)*.12)*dt*60;p.y+=p.vy*dt*60;p.vy*=Math.pow(.6,dt);p.life-=dt;const a=Math.min(1,p.life/(p.max*.5));sx.globalAlpha=Math.max(0,a);sx.fillStyle=p.c;sx.fillRect(Math.round(p.x),Math.round(p.y),1,1);
    if(a>.7){sx.globalAlpha=a*.35;sx.fillRect(Math.round(p.x)-1,Math.round(p.y),3,1);sx.fillRect(Math.round(p.x),Math.round(p.y)-1,1,3)}}
  sx.globalAlpha=1;S.parts=S.parts.filter(p=>p.life>0);if(S.parts.length>160)S.parts.splice(0,S.parts.length-160);
}

/* ============ scopes ============ */
const scopeEls={};const SCOPE_GAIN={lead:5,harm:6,bass:2.4,drum:3};const sbuf=new Float32Array(2048);
function buildScopes(){const w=$('#scopes');w.innerHTML='';
  for(const c of ALL){const d=document.createElement('div');d.className='scope';d.style.setProperty('--c',CHC[c]);
    d.innerHTML=`<div class="scope-head"><span class="sname">${CHN[c].name.toUpperCase()}</span><span class="chip">${CHN[c].chip}</span><span class="ms"><button type="button" data-m="${c}" title="Mute ${CHN[c].name}" aria-label="Mute ${CHN[c].name}">M</button><button type="button" data-s="${c}" title="Solo ${CHN[c].name}" aria-label="Solo ${CHN[c].name}">S</button></span></div><canvas width="128" height="32"></canvas><div class="snote">·</div>`;
    w.appendChild(d);const cv=d.querySelector('canvas');scopeEls[c]={root:d,g:cv.getContext('2d'),note:d.querySelector('.snote')}}
  w.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const m=b.dataset.m,s=b.dataset.s;if(m)song.ch[m].mute=!song.ch[m].mute;if(s)song.ch[s].solo=!song.ch[s].solo;applyMix(G);refreshMS();save()})}
function refreshMS(){const any=ALL.some(x=>song.ch[x].solo);for(const c of ALL){const e=scopeEls[c];e.root.querySelector('[data-m]').classList.toggle('on',song.ch[c].mute);e.root.querySelector('[data-s]').classList.toggle('on',song.ch[c].solo);e.root.classList.toggle('dim',chanLevel(c)===0||(any&&!song.ch[c].solo))}}
function drawScopes(){for(const c of ALL){const e=scopeEls[c],g=e.g;g.fillStyle='#0a101b';g.fillRect(0,0,128,32);g.fillStyle='#16233a';for(let x=0;x<128;x+=8)g.fillRect(x,16,4,1);
  g.fillStyle=CHC[c];let prev=16;
  if(G&&G.an[c]){G.an[c].getFloatTimeDomainData(sbuf);let tr=1;for(let i=1;i<900;i++){if(sbuf[i-1]<0&&sbuf[i]>=0){tr=i;break}}
    for(let x=0;x<128;x++){const v=sbuf[tr+x*6]||0,y=Math.round(16-clamp(v*SCOPE_GAIN[c],-1,1)*14);const a=Math.min(y,prev),h=Math.abs(y-prev)+1;g.fillRect(x,a,1,h);prev=y}}
  else g.fillRect(0,16,128,1)}}

/* ============ grid ============ */
let activeCh='lead';const CW=18;const grid=$('#grid'),labelsCv=$('#gridLabels'),gwrap=$('#gridwrap');
function gdims(){const mel=activeCh!=='drum';return{mel,rows:mel?maxDeg()+1:5,CH:mel?15:26,HEAD:24,cols:total()}}
function sizeCanvas(cv,w,h){const dpr=Math.min(2,window.devicePixelRatio||1);const W=Math.round(w*dpr),H=Math.round(h*dpr);if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}cv.style.width=w+'px';cv.style.height=h+'px';const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);return g}
function drawGrid(){
  const D=gdims(),W=D.cols*CW,H=D.HEAD+D.rows*D.CH,g=sizeCanvas(grid,W,H),col=CHC[activeCh],n=N();
  g.fillStyle='#0c1320';g.fillRect(0,0,W,H);
  for(let b=0;b<song.bars;b++){g.fillStyle=b%2?'#101a2a':'#0d1624';g.fillRect(b*16*CW,D.HEAD,16*CW,H-D.HEAD)}
  if(D.mel){for(let b=0;b<song.bars;b++){const tones=chordTones(song.chords[b]);for(let r=0;r<D.rows;r++){const d=D.rows-1-r;if(tones.includes(d%n)){g.fillStyle=hexA(col,d%n===song.chords[b]%n?.11:.06);g.fillRect(b*16*CW,D.HEAD+r*D.CH,16*CW,D.CH)}}}}
  g.fillStyle='#1b283b';for(let r=0;r<=D.rows;r++)g.fillRect(0,D.HEAD+r*D.CH,W,1);
  for(let s=0;s<=D.cols;s++){g.fillStyle=s%16===0?'#3c5375':s%4===0?'#263750':'#162132';g.fillRect(s*CW,D.HEAD,1,H-D.HEAD)}
  g.fillStyle='#131e2e';g.fillRect(0,0,W,D.HEAD);g.textBaseline='middle';
  for(let b=0;b<song.bars;b++){const x=b*16*CW;g.fillStyle='#1d2c42';g.fillRect(x+3,3,64,D.HEAD-7);g.fillStyle=hexA(col,.9);g.fillRect(x+3,D.HEAD-6,64,2);
    g.font='18px VT323, monospace';g.fillStyle=col;g.fillText(chordName(song.chords[b]),x+9,D.HEAD/2);
    g.fillStyle='#8a99ab';g.font='16px VT323, monospace';g.textAlign='right';g.fillText('bar '+(b+1),x+16*CW-6,D.HEAD/2);g.textAlign='left';
    for(let q=1;q<4;q++){g.fillStyle='#3c5375';g.fillRect(x+q*4*CW,D.HEAD-5,2,2)}}
  if(playhead>=0){g.fillStyle='rgba(255,255,255,.09)';g.fillRect(playhead*CW,D.HEAD,CW,H-D.HEAD);g.fillStyle=col;g.fillRect(playhead*CW,D.HEAD-3,CW,3)}
  if(D.mel){const o=song.ch[activeCh];for(const nt of o.notes){const r=D.rows-1-nt.d;if(r<0||r>=D.rows)continue;const x=nt.s*CW,y=D.HEAD+r*D.CH,w=nt.len*CW;
      const on=playing&&playhead>=nt.s&&playhead<nt.s+nt.len;g.fillStyle=on?'#ffffff':col;g.fillRect(x+1,y+2,w-2,D.CH-3);
      g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x+1,y+D.CH-3,w-2,2);g.fillStyle='rgba(255,255,255,.6)';g.fillRect(x+1,y+2,3,D.CH-5);
      if(o.arp&&activeCh!=='bass'){g.fillStyle='rgba(0,0,0,.35)';for(let xx=x+7;xx<x+w-3;xx+=5)g.fillRect(xx,y+5,2,D.CH-9)}}}
  else{const Hh=song.ch.drum.hits;for(let r=0;r<5;r++)for(let s=0;s<D.cols;s++)if(Hh[r][s]){const on=playing&&playhead===s;g.fillStyle=on?'#ffffff':(s%4===0?col:hexA(col,.75));g.fillRect(s*CW+3,D.HEAD+r*D.CH+5,CW-6,D.CH-9)}}
  drawLabels(D,H)}
function drawLabels(D,H){const W=58,g=sizeCanvas(labelsCv,W,H),col=CHC[activeCh];g.fillStyle='#131e2e';g.fillRect(0,0,W,H);g.textBaseline='middle';g.font='17px VT323, monospace';
  for(let r=0;r<D.rows;r++){const y=D.HEAD+r*D.CH+D.CH/2;if(D.mel){const d=D.rows-1-r,m=midiOf(activeCh,d);g.fillStyle=d%N()===0?col:'#8a99ab';g.fillText(noteName(m),8,y)}else{g.fillStyle='#c9cdb8';g.fillText(DRUM_ROWS[r],6,y)}}
  g.fillStyle='#2a3c56';g.fillRect(W-2,0,2,H)}
let drag=null;
function cellAt(e){const D=gdims(),rect=grid.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;return{D,s:Math.floor(x/CW),head:y<D.HEAD,r:Math.floor((y-D.HEAD)/D.CH)}}
function placeNote(nn){const o=song.ch[activeCh];o.notes=o.notes.filter(n=>n===nn||!(n.s>=nn.s&&n.s<nn.s+nn.len));for(const n of o.notes){if(n!==nn&&n.s<nn.s&&n.s+n.len>nn.s)n.len=nn.s-n.s}if(!o.notes.includes(nn))o.notes.push(nn);o.notes.sort((a,b)=>a.s-b.s)}
function beginEdit(s,r){const D=gdims();if(s<0||s>=D.cols||r<0||r>=D.rows)return;
  if(D.mel){const d=D.rows-1-r,o=song.ch[activeCh],hit=o.notes.find(n=>n.s<=s&&s<n.s+n.len);
    if(hit&&hit.d===d){o.notes=o.notes.filter(n=>n!==hit);drag={mode:'erase'}}else{const nn={s,d,len:1};placeNote(nn);drag={mode:'draw',note:nn,s0:s};preview(activeCh,{d,len:2})}}
  else{const H=song.ch.drum.hits,val=H[r][s]?0:1;H[r][s]=val;drag={mode:'paint',r,val};if(val)preview('drum',r)}
  reindex();save();drawGrid()}
function extendEdit(s){if(!drag)return;const D=gdims();
  if(drag.mode==='draw'){const len=clamp(s-drag.s0+1,1,D.cols-drag.s0);if(len!==drag.note.len){drag.note.len=len;placeNote(drag.note);reindex();drawGrid()}}
  else if(drag.mode==='paint'&&s>=0&&s<D.cols&&song.ch.drum.hits[drag.r][s]!==drag.val){song.ch.drum.hits[drag.r][s]=drag.val;drawGrid()}}
let touchPend=null;
grid.addEventListener('pointerdown',e=>{const c=cellAt(e);if(c.s<0||c.s>=c.D.cols)return;
  if(c.head){cycleChord(Math.floor(c.s/16));return}
  if(e.pointerType==='touch'){touchPend={s:c.s,r:c.r};return}
  e.preventDefault();grid.setPointerCapture(e.pointerId);beginEdit(c.s,c.r)});
grid.addEventListener('pointermove',e=>{if(drag&&e.buttons)extendEdit(cellAt(e).s)});
grid.addEventListener('pointerup',()=>{if(touchPend){beginEdit(touchPend.s,touchPend.r);touchPend=null}if(drag){drag=null;save()}});
grid.addEventListener('pointercancel',()=>{touchPend=null;drag=null});
function cycleChord(b){song.chords[b]=(song.chords[b]+1)%N();genTrack('bass');genTrack('harm');drawGrid();toast('Bar '+(b+1)+' is now '+chordName(song.chords[b]))}

/* ============ UI ============ */
function el(tag,attrs,html){const e=document.createElement(tag);if(attrs)for(const k in attrs)e.setAttribute(k,attrs[k]);if(html!=null)e.innerHTML=html;return e}
function buildStatic(){
  const key=$('#key');NN.forEach((n,i)=>key.appendChild(el('option',{value:i},n)));
  const sc=$('#scale');for(const k in SCALES)sc.appendChild(el('option',{value:k},SCALES[k].name));
  const mg=$('#moodGrid');for(const m of MOODS){const b=el('button',{type:'button',class:'mood','data-mood':m.id,title:m.blurb});
    b.innerHTML=`<span class="sw" style="background:linear-gradient(90deg,${m.pal.skyTop} 0 30%,${m.pal.skyBot} 30% 60%,${m.pal.leafHi} 60% 80%,${m.pal.sea} 80%)"></span><b>${m.name}</b><small>${m.short} · ${m.bpm} bpm</small>`;
    b.addEventListener('click',()=>applyMood(m));mg.appendChild(b)}
  const tabs=$('#tabs');for(const c of ALL){const b=el('button',{type:'button',class:'btn tab',role:'tab','data-ch':c},CHN[c].name);b.style.setProperty('--c',CHC[c]);b.addEventListener('click',()=>{activeCh=c;renderTabs();renderChOpts();drawGrid()});tabs.appendChild(b)}
  buildScopes();buildSfx()}
function renderTabs(){document.querySelectorAll('.tab').forEach(b=>{const on=b.dataset.ch===activeCh;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)})}
function seg(opt,items,cur){return `<div class="seg" data-opt="${opt}">${items.map(([v,l])=>`<button type="button" class="btn${String(v)===String(cur)?' on':''}" data-v="${v}">${l}</button>`).join('')}</div>`}
function renderChOpts(){
  const c=activeCh,o=song.ch[c],box=$('#chopts');box.style.setProperty('--c',CHC[c]);let h='';
  if(c==='lead'||c==='harm')h+=`<div class="field"><span>Pulse width</span>${seg('duty',[[.125,'12.5%'],[.25,'25%'],[.5,'50%']],o.duty)}</div>`;
  if(c==='drum')h+=`<div class="field"><span>Noise</span>${seg('noise',[['soft','Soft'],['metal','Metal']],o.noise)}</div>`;
  else h+=`<div class="field"><span>Envelope</span>${seg('env',c==='bass'?[['pluck','Pluck'],['hold','Hold'],['fade','Fade']]:[['pluck','Pluck'],['hold','Hold'],['swell','Swell'],['fade','Fade']],o.env)}</div>`;
  if(c==='lead'||c==='harm')h+=`<div class="field"><span>Arpeggio</span><button type="button" class="btn${o.arp?' on':''}" id="opt-arp">${o.arp?'On':'Off'}</button></div>
    <label class="field rng"><span>Vibrato</span><input type="range" id="opt-vib" min="0" max="1" step="0.01" value="${o.vib}"></label>`;
  if(c==='lead')h+=`<label class="field rng"><span>Note density</span><input type="range" id="opt-dens" min="0.15" max="1" step="0.01" value="${song.style.density}"></label>`;
  else h+=`<label class="field"><span>Pattern</span><select id="opt-style">${STYLE_OPTS[c].map(([v,l])=>`<option value="${v}"${song.style[c]===v?' selected':''}>${l}</option>`).join('')}</select></label>`;
  h+=`<label class="field rng"><span>Volume</span><input type="range" id="opt-vol" min="0" max="1" step="0.01" value="${o.vol}"></label>
    <div class="field"><span>Track</span><div class="row"><button type="button" class="btn" id="opt-reroll">Re-roll</button><button type="button" class="btn" id="opt-clear">Clear</button></div></div>`;
  box.innerHTML=h;
  box.querySelectorAll('.seg').forEach(sg=>sg.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const k=sg.dataset.opt;let v=b.dataset.v;if(k==='duty')v=parseFloat(v);o[k]=v;renderChOpts();save();if(c==='drum')preview('drum',2);else preview(c,{d:N()+ (c==='bass'?0:2),len:3})}));
  const q=id=>box.querySelector(id);
  q('#opt-arp')&&q('#opt-arp').addEventListener('click',()=>{o.arp=!o.arp;renderChOpts();drawGrid();save()});
  q('#opt-vib')&&q('#opt-vib').addEventListener('input',e=>{o.vib=+e.target.value;save()});
  q('#opt-dens')&&q('#opt-dens').addEventListener('change',e=>{song.style.density=+e.target.value;genTrack('lead');drawGrid()});
  q('#opt-style')&&q('#opt-style').addEventListener('change',e=>{song.style[c]=e.target.value;genTrack(c);drawGrid()});
  q('#opt-vol').addEventListener('input',e=>{o.vol=+e.target.value;applyMix(G);save()});
  q('#opt-reroll').addEventListener('click',()=>{song.seeds[c]=(Math.random()*4294967295)>>>0;genTrack(c);drawGrid();toast(CHN[c].name+' re-rolled')});
  q('#opt-clear').addEventListener('click',()=>{if(c==='drum')song.ch.drum.hits=Array.from({length:5},()=>new Array(total()).fill(0));else o.notes=[];reindex();save();drawGrid()})}
function renderMix(){const set=(id,v,f)=>{$(id).value=v;$(id+'O').textContent=f(v)};
  set('#mixVol',song.mix.vol,v=>Math.round(v*100));set('#mixCrunch',song.mix.crunch,v=>Math.round(v));set('#mixEcho',song.mix.echo,v=>Math.round(v*100));set('#mixSwing',song.mix.swing,v=>Math.round(v*100)+'%')}
function renderAll(){
  $('#bpm').value=song.bpm;$('#key').value=song.key;$('#scale').value=song.scale;$('#bars').value=song.bars;$('#seed').value=song.seed;
  document.querySelectorAll('.mood').forEach(b=>b.classList.toggle('on',b.dataset.mood===song.mood));
  const m=moodById(song.mood);$('#moodName').textContent=m.name;$('#moodBlurb').textContent=m.blurb;updateNow();
  renderTabs();renderChOpts();renderMix();refreshMS();buildLayers();applyMix(G);drawGrid()}
function updateNow(){$('#nowInfo').textContent=`${NN[song.key]} ${SCALES[song.scale].name.replace(/ \(.*\)/,'').toLowerCase()} · ${song.bpm} bpm · seed ${song.seed}`}
function applyMood(m){const keep=song?song.bars:4;song=songFromMood(m,song?song.seed:2417,keep);composeAll();renderAll();toast(m.name)}
function remapScale(ns){const n1=N();song.scale=ns;const n2=N();if(n1===n2)return;const mx=2*n2;
  for(const c of MEL)for(const nt of song.ch[c].notes)nt.d=clamp(Math.round(nt.d*n2/n1),0,mx);song.chords=song.chords.map(c=>Math.round(c*n2/n1)%n2)}
function resizeBars(nb){const ob=song.bars,nt=nb*16,ot=ob*16;if(nb===ob)return;
  for(const c of MEL){const o=song.ch[c];if(nb>ob){const orig=o.notes.slice();for(let b=ob;b<nb;b++){const src=b%ob;for(const n of orig)if(Math.floor(n.s/16)===src)o.notes.push({...n,s:n.s+(b-src)*16})}}
    else{o.notes=o.notes.filter(n=>n.s<nt);for(const n of o.notes)n.len=Math.min(n.len,nt-n.s)}}
  song.ch.drum.hits=song.ch.drum.hits.map(row=>Array.from({length:nt},(_,s)=>s<ot?row[s]:row[s%ot]));
  song.chords=Array.from({length:nb},(_,b)=>song.chords[b%ob]);song.bars=nb;reindex()}
function bindStatic(){
  $('#loadSong').addEventListener('click',()=>$('#loadInput').click());
  $('#playBtn').addEventListener('click',()=>playing?stop():play());
  document.addEventListener('keydown',e=>{if(e.code!=='Space')return;const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='SELECT'||t.tagName==='TEXTAREA'||t.tagName==='BUTTON'))return;e.preventDefault();playing?stop():play()});
  $('#bpm').addEventListener('change',e=>{song.bpm=clamp(Math.round(+e.target.value||100),50,220);e.target.value=song.bpm;applyMix(G);updateNow();save()});
  $('#key').addEventListener('change',e=>{song.key=+e.target.value;updateNow();drawGrid();save()});
  $('#scale').addEventListener('change',e=>{remapScale(e.target.value);reindex();updateNow();drawGrid();save()});
  $('#bars').addEventListener('change',e=>{resizeBars(+e.target.value);drawGrid();save()});
  $('#composeBtn').addEventListener('click',()=>{song.seed=1+Math.floor(Math.random()*999998);composeAll();renderAll();toast('New tune · seed '+song.seed)});
  $('#seedApply').addEventListener('click',()=>{song.seed=clamp(Math.round(+$('#seed').value||1),1,999999);composeAll();renderAll();toast('Composed from seed '+song.seed)});
  const mix=(id,key,f)=>$(id).addEventListener('input',e=>{song.mix[key]=+e.target.value;$(id+'O').textContent=f(+e.target.value);applyMix(G);save()});
  mix('#mixVol','vol',v=>Math.round(v*100));mix('#mixCrunch','crunch',v=>Math.round(v));mix('#mixEcho','echo',v=>Math.round(v*100));mix('#mixSwing','swing',v=>Math.round(v*100)+'%');
  $('#exportWav').addEventListener('click',async e=>{const b=e.currentTarget;b.disabled=true;b.textContent='Rendering…';
    try{const loops=+$('#loops').value;const data=await renderLoop(loops);const solo=ALL.filter(c=>song.ch[c].solo);
      await offerFile(`druid-isle-${song.mood}-${song.seed}${solo.length?'-'+solo.join('-'):''}.wav`,wavBytes(data,44100),'audio/wav')}
    catch(err){toast("Couldn't render the audio: "+(err&&err.message||err))}finally{b.disabled=false;b.textContent='Render .wav'}});
  $('#saveJson').addEventListener('click',()=>offerFile(`druid-isle-${song.mood}-${song.seed}.json`,new TextEncoder().encode(JSON.stringify(song)),'application/json'));
  $('#loadInput').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;if(f.size>1024*1024){toast('Song files must be smaller than 1 MB.');e.target.value='';return}try{const o=JSON.parse(await f.text());song=normalizeSong(o);reindex();renderAll();save();toast('Loaded '+f.name)}catch(err){toast("That file isn't a Druid Isle song.")}e.target.value=''});
  window.addEventListener('resize',()=>drawGrid())}
function normalizeSong(o){
  if(!o||!o.ch||!Array.isArray(o.ch.lead?.notes))throw new Error('Invalid song');
  const m=moodById(o.mood), s=songFromMood(m,1,[2,4,8].includes(o.bars)?o.bars:4);
  const num=(v,f,lo,hi)=>typeof v==='number'&&Number.isFinite(v)?clamp(v,lo,hi):f;
  s.seed=Math.round(num(o.seed,1,1,999999));s.bpm=Math.round(num(o.bpm,m.bpm,50,220));
  s.key=Math.round(num(o.key,m.key,0,11));s.scale=Object.hasOwn(SCALES,o.scale)?o.scale:m.scale;
  const degrees=SCALES[s.scale].iv.length, steps=s.bars*16;
  s.chords=Array.from({length:s.bars},(_,i)=>Math.round(num(o.chords?.[i],0,0,degrees-1)));
  for(const k of ['vol','echo','swing','crunch'])s.mix[k]=num(o.mix?.[k],s.mix[k],0,k==='crunch'?100:k==='swing'?.6:1);
  s.style.density=num(o.style?.density,s.style.density,.15,1);
  for(const c of ALL){
    const input=o.ch[c]||{},out=s.ch[c];
    s.seeds[c]=num(o.seeds?.[c],0,0,4294967295);
    out.vol=num(input.vol,out.vol,0,1);out.mute=input.mute===true;out.solo=input.solo===true;
    if(c!=='lead'&&STYLE_OPTS[c].some(([v])=>v===o.style?.[c]))s.style[c]=o.style[c];
    if(c==='drum'){
      out.noise=input.noise==='metal'?'metal':'soft';
      out.hits=Array.from({length:5},(_,r)=>Array.from({length:steps},(_,i)=>input.hits?.[r]?.[i]?1:0));
    }else{
      out.duty=[.125,.25,.5].includes(input.duty)?input.duty:out.duty;
      out.env=['pluck','hold','swell','fade'].includes(input.env)?input.env:out.env;
      out.vib=num(input.vib,0,0,1);out.arp=input.arp===true;
      out.notes=(Array.isArray(input.notes)?input.notes:[]).slice(0,steps).filter(n=>n&&Number.isInteger(n.s)&&n.s>=0&&n.s<steps&&Number.isInteger(n.d)&&Number.isInteger(n.len)&&n.len>0).map(n=>({s:n.s,d:clamp(n.d,0,2*degrees),len:clamp(n.len,1,steps-n.s)})).sort((a,b)=>a.s-b.s);
    }
  }
  return s;
}

/* ============ sound effects ============ */
const ARPS={none:[],up:[0,4,7,12],upmin:[0,3,7,12],fifth:[0,7],octave:[0,12],chime:[0,4,7,12,7,12],trill:[0,2,0,2,0,2],fall:[12,7,4,0]};
const SFX_PRESETS=[
  {id:'seed',name:'Seed pickup',wave:'p25',f0:988,f1:988,slide:'none',dur:.16,arp:'fifth',stepT:.05,vib:0,env:'pluck'},
  {id:'grow',name:'Plant grows',wave:'tri',f0:262,f1:262,slide:'none',dur:.42,arp:'up',stepT:.07,vib:.1,env:'hold'},
  {id:'cleanse',name:'Cleanse blight',wave:'p125',f0:330,f1:1320,slide:'exp',dur:.7,arp:'octave',stepT:.035,vib:.5,env:'swell'},
  {id:'spell',name:'Cast spell',wave:'p25',f0:440,f1:1760,slide:'exp',dur:.32,arp:'none',stepT:.05,vib:.35,env:'fade'},
  {id:'sting',name:'Blight sting',wave:'p50',f0:420,f1:90,slide:'exp',dur:.25,arp:'none',stepT:.05,vib:0,env:'fade'},
  {id:'heal',name:'Animal healed',wave:'p50',f0:523,f1:523,slide:'none',dur:.5,arp:'chime',stepT:.08,vib:.2,env:'hold'},
  {id:'step',name:'Grass step',wave:'noise',f0:2400,f1:1200,slide:'lin',dur:.06,arp:'none',stepT:.05,vib:0,env:'fade'},
  {id:'chop',name:'Chop wood',wave:'metal',f0:700,f1:300,slide:'exp',dur:.12,arp:'none',stepT:.05,vib:0,env:'fade'},
  {id:'splash',name:'Splash',wave:'noise',f0:3000,f1:400,slide:'exp',dur:.55,arp:'none',stepT:.05,vib:0,env:'fade'},
  {id:'build',name:'Place block',wave:'tri',f0:180,f1:90,slide:'exp',dur:.09,arp:'none',stepT:.05,vib:0,env:'pluck'},
  {id:'spirit',name:'Spirit whisper',wave:'p125',f0:880,f1:660,slide:'lin',dur:1.1,arp:'trill',stepT:.12,vib:.7,env:'swell'},
  {id:'blip',name:'Menu blip',wave:'p50',f0:1320,f1:1320,slide:'none',dur:.05,arp:'none',stepT:.05,vib:0,env:'hold'}
];
let sfx={...SFX_PRESETS[0]},sfxData=null;
const fToS=f=>Math.round(Math.log(f/40)/Math.log(4000/40)*1000),sToF=s=>40*Math.pow(4000/40,s/1000);
async function renderSfx(p){const sr=44100,tail=.25,oac=new OfflineAudioContext(1,Math.ceil(sr*(p.dur+tail)),sr),waves=makeWaves(oac),nz=makeNoise(oac);
  const gn=oac.createGain(),cr=oac.createWaveShaper();cr.curve=crushCurve(song.mix.crunch);gn.connect(cr);cr.connect(oac.destination);
  const isN=p.wave==='noise'||p.wave==='metal';let src,param;
  if(isN){src=oac.createBufferSource();src.buffer=p.wave==='metal'?nz.metal:nz.white;src.loop=true;param=src.playbackRate}else{src=oac.createOscillator();src.setPeriodicWave(waves[p.wave]);param=src.frequency}
  const conv=f=>isN?f/(p.wave==='metal'?600:1500):f;
  param.setValueAtTime(conv(p.f0),0);if(p.slide==='lin')param.linearRampToValueAtTime(conv(p.f1),p.dur);else if(p.slide==='exp')param.exponentialRampToValueAtTime(conv(Math.max(20,p.f1)),p.dur);
  (ARPS[p.arp]||[]).forEach((semi,i)=>{if(i*p.stepT<p.dur)src.detune.setValueAtTime(semi*100,i*p.stepT)});
  if(p.vib>0){const l=oac.createOscillator();l.frequency.value=8;const lg=oac.createGain();lg.gain.value=p.vib*60;l.connect(lg);lg.connect(src.detune);l.start(0);l.stop(p.dur+tail)}
  envelope(gn,0,p.dur,.5,p.env);src.connect(gn);src.start(0);src.stop(p.dur+tail);
  const buf=await oac.startRendering();return buf.getChannelData(0)}
function drawSfxWave(d){const cv=$('#sfxWave'),g=cv.getContext('2d');g.fillStyle='#0a101b';g.fillRect(0,0,320,64);g.fillStyle='#16233a';g.fillRect(0,32,320,1);if(!d)return;
  let pk=0;for(let i=0;i<d.length;i++)pk=Math.max(pk,Math.abs(d[i]));const k=pk>0?1/pk:1,per=d.length/320;g.fillStyle=CHC.harm;
  for(let x=0;x<320;x++){let mn=0,mx=0;for(let i=Math.floor(x*per);i<Math.floor((x+1)*per);i+=4){const v=d[i]*k;if(v<mn)mn=v;if(v>mx)mx=v}const y0=Math.round(32-mx*29),y1=Math.round(32-mn*29);g.fillRect(x,y0,1,Math.max(1,y1-y0))}}
function syncSfxUI(){$('#sfxWaveSel').value=sfx.wave;$('#sfxEnv').value=sfx.env;$('#sfxSlide').value=sfx.slide;$('#sfxArp').value=sfx.arp;
  $('#sfxF0').value=fToS(sfx.f0);$('#sfxF1').value=fToS(sfx.f1);$('#sfxDur').value=sfx.dur;$('#sfxVib').value=sfx.vib;
  $('#sfxF0O').textContent=Math.round(sfx.f0)+' Hz';$('#sfxF1O').textContent=Math.round(sfx.f1)+' Hz';$('#sfxDurO').textContent=sfx.dur.toFixed(2)+' s';$('#sfxVibO').textContent=Math.round(sfx.vib*100);
  document.querySelectorAll('#sfxPresets .btn').forEach(b=>b.classList.toggle('on',b.dataset.id===sfx.id))}
async function refreshSfx(playIt){try{sfxData=await renderSfx(sfx);drawSfxWave(sfxData);if(playIt){ensureCtx();const b=ctx.createBuffer(1,sfxData.length,44100);b.copyToChannel(sfxData,0);const s=ctx.createBufferSource();s.buffer=b;const g=ctx.createGain();g.gain.value=song.mix.vol;s.connect(g);g.connect(ctx.destination);s.start()}}catch(e){}}
function buildSfx(){const box=$('#sfxPresets');for(const p of SFX_PRESETS){const b=el('button',{type:'button',class:'btn','data-id':p.id,title:p.name},p.name);b.addEventListener('click',()=>{sfx={...p};syncSfxUI();refreshSfx(true)});box.appendChild(b)}
  const on=(id,ev,fn)=>$(id).addEventListener(ev,e=>{fn(e.target.value);sfx.id='custom';syncSfxUI();refreshSfx(ev==='change')});
  on('#sfxWaveSel','change',v=>sfx.wave=v);on('#sfxEnv','change',v=>sfx.env=v);on('#sfxSlide','change',v=>sfx.slide=v);on('#sfxArp','change',v=>sfx.arp=v);
  for(const[id,fn]of[['#sfxF0',v=>sfx.f0=sToF(+v)],['#sfxF1',v=>sfx.f1=sToF(+v)],['#sfxDur',v=>sfx.dur=+v],['#sfxVib',v=>sfx.vib=+v]]){on(id,'input',fn);$(id).addEventListener('change',()=>refreshSfx(true))}
  $('#sfxPlay').addEventListener('click',()=>refreshSfx(true));
  $('#sfxMutate').addEventListener('click',()=>{const m=x=>x*(.75+Math.random()*.58);sfx={...sfx,id:'custom',f0:clamp(m(sfx.f0),40,4000),f1:clamp(m(sfx.f1),40,4000),dur:clamp(m(sfx.dur),.03,1.5),vib:clamp(sfx.vib+(Math.random()-.5)*.3,0,1)};
    if(Math.random()<.25)sfx.arp=pick(Math.random,Object.keys(ARPS));if(Math.random()<.2)sfx.env=pick(Math.random,['pluck','hold','swell','fade']);if(Math.random()<.15&&!['noise','metal'].includes(sfx.wave))sfx.wave=pick(Math.random,['p125','p25','p50','tri']);syncSfxUI();refreshSfx(true)});
  $('#sfxExport').addEventListener('click',async()=>{if(!sfxData)sfxData=await renderSfx(sfx);const name=(SFX_PRESETS.find(p=>p.id===sfx.id)||{id:'custom'}).id;offerFile(`druid-isle-sfx-${name}.wav`,wavBytes(sfxData,44100),'audio/wav')})}

/* ============ loop ============ */
let lastF=performance.now();
function onStep(st){playhead=st;for(const c of MEL){const n=IDX[c][st];if(n&&chanLevel(c)>0){scene.hit(c,n);scopeEls[c].note.textContent=noteName(midiOf(c,n.d))+(song.ch[c].arp&&c!=='bass'?' arp':'')}}
  if(chanLevel('drum')>0){const H=song.ch.drum.hits,hitRows=[];for(let r=0;r<5;r++)if(H[r][st]){scene.drum(r);hitRows.push(DRUM_ROWS[r])}if(hitRows.length)scopeEls.drum.note.textContent=hitRows.join(' + ')}
  if(st%16===0)$('#nowInfo').textContent=`bar ${st/16+1} · ${chordName(song.chords[st/16])} · ${song.bpm} bpm · seed ${song.seed}`;
  drawGrid();const x=st*CW+58;if(!drag&&(x<gwrap.scrollLeft+50||x>gwrap.scrollLeft+gwrap.clientWidth-40))gwrap.scrollLeft=Math.max(0,x-70)}
function frame(now){const dt=Math.min(.05,(now-lastF)/1000);lastF=now;
  if(ctx&&playing){while(vq.length&&vq[0].t<=ctx.currentTime)onStep(vq.shift().st)}
  drawScene(now,dt);drawScopes();requestAnimationFrame(frame)}

/* ============ boot ============ */
function start(data){
  buildStatic();bindStatic();
  let loaded=null;try{if(data&&data.song)loaded=normalizeSong(data.song)}catch(e){}
  if(!loaded){try{const raw=localStorage.getItem('druidisle.song.v1');if(raw)loaded=normalizeSong(JSON.parse(raw))}catch(e){}}
  if(loaded){song=loaded}else{song=songFromMood(MOODS[0],2417,4);composeAll()}
  reindex();renderAll();syncSfxUI();refreshSfx(false);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>drawGrid());
  requestAnimationFrame(frame)}
start();
})();
