(() => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const select = document.getElementById('sceneSelect');
  const pauseBtn = document.getElementById('pauseBtn');

  let width = 0, height = 0, dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let rafId = 0, running = true;
  let t = 0, last = 0;

  function resize() {
    const { innerWidth: w, innerHeight: h } = window;
    width = w; height = h;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (current && current.resize) current.resize(width, height);
  }
  window.addEventListener('resize', resize);

  function rand(n=1){ return Math.random()*n; }
  function randRange(a,b){ return a + Math.random()*(b-a); }
  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

  // 簡易的な流体フィールド関数（正弦波による疑似ノイズ）
  function flowAngle(x, y, time, fx=0.0019, fy=0.0017) {
    const a = Math.sin((x*fx + time*0.2) * 2.0);
    const b = Math.cos((y*fy - time*0.25) * 2.2);
    const c = Math.sin(((x+y)*0.0009 + time*0.12) * 1.7);
    return (a + b + c) * Math.PI; // おおよそ -π ～ π
  }

  // シーンのレジストリ
  const scenes = [];

  // 1) ネオン・オービット
  scenes.push({
    name: 'Neon Orbits',
    create(){
      const orbits = [];
      const colors = [200, 260, 300, 160]; // 色相
      for (let i=0;i<4;i++){
        const baseR = Math.min(width, height) * (0.15 + i*0.1);
        const count = 60 + i*10;
        const speed = 0.2 + i*0.08;
        orbits.push({ baseR, count, speed, hue: colors[i] });
      }
      let tt = 0;
      function init(){
        ctx.clearRect(0,0,width,height);
      }
      function update(dt){ tt += dt; }
      function draw(){
        // 残像をフェードさせる
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(10,14,20,0.12)';
        ctx.fillRect(0,0,width,height);
        ctx.globalCompositeOperation = 'lighter';
        const cx = width*0.5, cy = height*0.5;
        for (const o of orbits){
          const hue = o.hue;
          ctx.strokeStyle = `hsla(${hue} 90% 65% / 0.55)`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          let prev = null;
          for (let i=0;i<o.count;i++){
            const a = (i/o.count)*Math.PI*2 + tt*o.speed*(i%3===0?1.2:1.0);
            const r = o.baseR * (1.0 + 0.04*Math.sin(tt*0.9 + i*0.17));
            const x = cx + Math.cos(a)*r;
            const y = cy + Math.sin(a)*r;
            if (!prev){ prev = {x,y}; continue; }
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(x, y);
            prev = {x,y};
          }
          ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
      }
      function resize(){ init(); }
      return { init, update, draw, resize };
    }
  });

  // 2) フローフィールド粒子
  scenes.push({
    name: 'Flow Field',
    create(){
      const count = Math.floor(600 * (width*height) / (1280*720));
      const particles = new Array(clamp(count, 350, 1200)).fill(0).map(()=>({
        x: rand(width), y: rand(height),
        px: 0, py: 0,
        speed: randRange(0.6, 1.8),
        hue: randRange(180, 320),
      }));
      let tt = 0;
      function init(){
        ctx.fillStyle = '#0b0f14';
        ctx.fillRect(0,0,width,height);
      }
      function update(dt){ tt += dt; }
      function draw(){
        // うっすらフェード
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(11,15,20,0.06)';
        ctx.fillRect(0,0,width,height);
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineWidth = 1;
        for (const p of particles){
          p.px = p.x; p.py = p.y;
          const a = flowAngle(p.x, p.y, tt);
          p.x += Math.cos(a) * p.speed;
          p.y += Math.sin(a) * p.speed;
          if (p.x < -2) p.x = width+2; else if (p.x > width+2) p.x = -2;
          if (p.y < -2) p.y = height+2; else if (p.y > height+2) p.y = -2;
          ctx.strokeStyle = `hsla(${p.hue} 90% 65% / 0.16)`;
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
      }
      function resize(){ init(); }
      return { init, update, draw, resize };
    }
  });

  // 3) 変形するブロブ
  scenes.push({
    name: 'Morphing Blob',
    create(){
      let points = 180;
      let tt = 0;
      function init(){
        ctx.clearRect(0,0,width,height);
      }
      function update(dt){ tt += dt; }
      function draw(){
        ctx.fillStyle = 'rgba(11,15,20,0.08)';
        ctx.fillRect(0,0,width,height);
        const cx = width/2, cy = height/2;
        const base = Math.min(width, height)*0.25;
        const k = 0.45 + 0.15*Math.sin(tt*0.8);
        const hue = 210 + 60*Math.sin(tt*0.6);
        // 輪郭パス
        ctx.save();
        ctx.translate(cx, cy);
        ctx.beginPath();
        let firstX=0, firstY=0, prevX=0, prevY=0;
        for (let i=0;i<=points;i++){
          const a = (i/points)*Math.PI*2;
          const r = base * (1 + 0.18*Math.sin(3*a + tt*1.2) + 0.07*Math.sin(7*a - tt*1.6));
          const x = Math.cos(a)*r;
          const y = Math.sin(a)*r;
          if (i===0){ firstX=x; firstY=y; prevX=x; prevY=y; ctx.moveTo(x,y); continue; }
          const cx1 = prevX + (x - prevX)*k - (y - prevY)*k;
          const cy1 = prevY + (y - prevY)*k + (x - prevX)*k;
          ctx.quadraticCurveTo(cx1, cy1, x, y);
          prevX = x; prevY = y;
        }
        ctx.closePath();
        ctx.shadowColor = `hsla(${hue} 100% 60% / 0.7)`;
        ctx.shadowBlur = 40;
        const grad = ctx.createRadialGradient(0,0,base*0.2, 0,0, base*1.05);
        grad.addColorStop(0, `hsla(${hue} 100% 70% / 0.55)`);
        grad.addColorStop(1, `hsla(${hue+40} 100% 55% / 0.2)`);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 2;
        ctx.strokeStyle = `hsla(${hue} 100% 75% / 0.4)`;
        ctx.stroke();
        ctx.restore();
      }
      function resize(){ init(); }
      return { init, update, draw, resize };
    }
  });

  // 4) リサージュ・グリッド
  scenes.push({
    name: 'Lissajous Grid',
    create(){
      let cols = Math.round(width / 90);
      let rows = Math.round(height / 90);
      cols = clamp(cols, 8, 20); rows = clamp(rows, 5, 12);
      const pts = [];
      for (let j=0;j<rows;j++){
        for (let i=0;i<cols;i++){
          pts.push({i,j});
        }
      }
      let tt = 0;
      function update(dt){ tt += dt; }
      function draw(){
        ctx.fillStyle = 'rgba(11,15,20,0.12)';
        ctx.fillRect(0,0,width,height);
        const gx = width/(cols+1); const gy = height/(rows+1);
        const w1 = 1.2, w2 = 0.9;
        ctx.globalCompositeOperation = 'lighter';
        for (const p of pts){
          const baseX = gx*(p.i+1); const baseY = gy*(p.j+1);
          const x = baseX + Math.sin(tt*w1 + p.j*0.5)*gx*0.35;
          const y = baseY + Math.sin(tt*w2 + p.i*0.6)*gy*0.35;
          const hue = 200 + (p.i/cols)*120 + (p.j/rows)*40;
          const r = 2 + 1.5*Math.sin(tt*1.8 + (p.i+p.j)*0.3);
          const grd = ctx.createRadialGradient(x,y,0, x,y, r*6);
          grd.addColorStop(0, `hsla(${hue} 90% 70% / 0.8)`);
          grd.addColorStop(1, `hsla(${hue} 90% 50% / 0)`);
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI*2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
      }
      function init(){ ctx.clearRect(0,0,width,height); }
      function resize(){ init(); }
      return { init, update, draw, resize };
    }
  });

  // 5) 放射状ウェーブ
  scenes.push({
    name: 'Radial Waves',
    create(){
      let rings = 80;
      let tt = 0;
      function init(){ ctx.clearRect(0,0,width,height); }
      function update(dt){ tt += dt; }
      function draw(){
        ctx.fillStyle = 'rgba(11,15,20,0.08)';
        ctx.fillRect(0,0,width,height);
        const cx = width/2, cy = height/2;
        for (let i=0;i<rings;i++){
          const tNorm = i/(rings-1);
          const baseR = tNorm * Math.hypot(width, height)*0.5;
          const wobble = 12*Math.sin(tt*1.6 + i*0.22);
          const r = baseR + wobble;
          const hue = 180 + 120*tNorm;
          ctx.strokeStyle = `hsla(${hue} 100% ${clamp(40+40*tNorm,40,80)}% / 0.35)`;
          ctx.lineWidth = 1.2 + 1.5*Math.sin(tt*0.9 + i*0.17);
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(0,r), 0, Math.PI*2);
          ctx.stroke();
        }
      }
      function resize(){ init(); }
      return { init, update, draw, resize };
    }
  });

  // 実行ループ管理
  let current = null;
  function setScene(index){
    index = clamp(index|0, 0, scenes.length-1);
    if (current && current.dispose) current.dispose();
    const { create } = scenes[index];
    current = create();
    current.init && current.init();
    select.value = String(index);
  }

  function loop(ms){
    if (!running){ rafId = requestAnimationFrame(loop); return; }
    if (!last) last = ms;
    const dt = Math.min(0.05, (ms - last)/1000);
    last = ms; t += dt;
    current && current.update && current.update(dt);
    current && current.draw && current.draw(ctx);
    rafId = requestAnimationFrame(loop);
  }

  // UI のイベント接続
  function populateSelect(){
    select.innerHTML = '';
    scenes.forEach((s, i) => {
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = `${i+1}. ${s.name}`;
      select.appendChild(opt);
    });
  }
  select.addEventListener('change', (e)=>{
    const idx = parseInt(select.value, 10) || 0;
    setScene(idx);
  });
  pauseBtn.addEventListener('click', ()=>{
    running = !running;
    pauseBtn.textContent = running ? 'Pause' : 'Resume';
  });
  window.addEventListener('keydown', (e)=>{
    if (e.code === 'Space'){ e.preventDefault(); pauseBtn.click(); return; }
    if (e.key >= '1' && e.key <= String(scenes.length)){
      const idx = parseInt(e.key,10) - 1; setScene(idx);
    }
  });

  // 起動処理
  populateSelect();
  resize();
  setScene(0);
  rafId = requestAnimationFrame(loop);
})();
