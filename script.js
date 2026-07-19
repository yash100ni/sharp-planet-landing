gsap.registerPlugin(ScrollTrigger);

/* nav scroll state */
const nav = document.getElementById('nav');
ScrollTrigger.create({ start:60, onUpdate:self=>{ nav.classList.toggle('scrolled', self.scroll()>60); } });

/* sticky mobile cta — show after hero, hide once the final CTA is on screen */
const stickyCta = document.getElementById('stickyCta');
ScrollTrigger.create({ trigger:'.hero', start:'bottom top', onEnter:()=>stickyCta.classList.add('show'), onLeaveBack:()=>stickyCta.classList.remove('show') });
ScrollTrigger.create({ trigger:'#book-session', start:'top bottom', end:'bottom top', onEnter:()=>stickyCta.classList.remove('show'), onLeaveBack:()=>stickyCta.classList.add('show'), onLeave:()=>stickyCta.classList.remove('show'), onEnterBack:()=>stickyCta.classList.remove('show') });

/* generic reveal-on-scroll for .reveal */
document.querySelectorAll('.reveal').forEach(el=>{
  ScrollTrigger.create({
    trigger:el, start:'top 85%',
    onEnter:()=>el.classList.add('in-view'),
    once:true
  });
});

/* hero illustration entrance */
gsap.set('.spark-card', {opacity:0, y:30});
gsap.to('.spark-card', {opacity:1, y:0, duration:1, delay:.3, ease:'power3.out'});

/* checklist stagger reveal */
gsap.utils.toArray('[data-check]').forEach((el,i)=>{
  ScrollTrigger.create({
    trigger:el, start:'top 82%', once:true,
    onEnter:()=> setTimeout(()=> el.classList.add('in-view'), i*130)
  });
});

/* comparison list stagger */
gsap.utils.toArray('[data-cmp]').forEach((el,i)=>{
  ScrollTrigger.create({
    trigger:el, start:'top 88%', once:true,
    onEnter:()=> setTimeout(()=> el.classList.add('in-view'), (i%4)*100)
  });
});

/* transformation cards stagger */
gsap.utils.toArray('[data-tf]').forEach((el,i)=>{
  ScrollTrigger.create({
    trigger:el, start:'top 88%', once:true,
    onEnter:()=> setTimeout(()=> el.classList.add('in-view'), i*120)
  });
});

/* journey timeline progress */
const steps = gsap.utils.toArray('[data-step]');
const fill = document.getElementById('journeyFill');
ScrollTrigger.create({
  trigger:'#journeyTrack', start:'top 70%', once:true,
  onEnter:()=>{
    steps.forEach((s,i)=>{
      setTimeout(()=>{
        s.classList.add('active');
        fill.style.width = ((i+1)/steps.length*100)+'%';
      }, i*260);
    });
  }
});

/* method cards - tap toggle for touch devices */
document.querySelectorAll('[data-method]').forEach(card=>{
  card.addEventListener('click', ()=>{
    const isActive = card.classList.contains('active');
    document.querySelectorAll('[data-method]').forEach(c=>c.classList.remove('active'));
    if(!isActive) card.classList.add('active');
  });
});

/* animated counters */
document.querySelectorAll('[data-count]').forEach(el=>{
  const target = parseInt(el.getAttribute('data-count'),10);
  const suffix = el.getAttribute('data-suffix') || '';
  ScrollTrigger.create({
    trigger:el, start:'top 85%', once:true,
    onEnter:()=>{
      let obj = {val:0};
      gsap.to(obj, {
        val:target, duration:1.8, ease:'power2.out',
        onUpdate:()=>{ el.textContent = Math.floor(obj.val).toLocaleString()+suffix; }
      });
    }
  });
});

/* testimonial slider */
const track = document.getElementById('testiTrack');
const dotsWrap = document.getElementById('testiDots');
const cards = track.children.length;
const perView = () => window.innerWidth >= 860 ? 2 : 1;
let idx = 0;
function maxIdx(){ return Math.max(0, cards - perView()); }
function renderDots(){
  dotsWrap.innerHTML = '';
  for(let i=0;i<=maxIdx();i++){
    const d = document.createElement('div');
    d.className = 'testi-dot' + (i===idx?' active':'');
    d.addEventListener('click', ()=>{ idx = i; update(); });
    dotsWrap.appendChild(d);
  }
}
function update(){
  const pct = (100/perView()) * idx;
  track.style.transform = `translateX(-${pct}%)`;
  [...dotsWrap.children].forEach((d,i)=> d.classList.toggle('active', i===idx));
}
renderDots(); update();
window.addEventListener('resize', ()=>{ idx = Math.min(idx, maxIdx()); renderDots(); update(); });
let testiTimer = setInterval(()=>{
  idx = idx >= maxIdx() ? 0 : idx+1;
  update();
  [...dotsWrap.children].forEach((d,i)=> d.classList.toggle('active', i===idx));
}, 5000);
track.addEventListener('mouseenter', ()=> clearInterval(testiTimer));

/* FAQ accordion */
document.querySelectorAll('[data-faq]').forEach(item=>{
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', ()=>{
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('[data-faq]').forEach(other=>{
      other.classList.remove('open');
      other.querySelector('.faq-a').style.maxHeight = null;
    });
    if(!isOpen){
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

/* magnetic buttons - subtle */
document.querySelectorAll('.btn-primary').forEach(btn=>{
  btn.addEventListener('mousemove', e=>{
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    gsap.to(btn, {x:x*0.15, y:y*0.3, duration:.4, ease:'power2.out'});
  });
  btn.addEventListener('mouseleave', ()=> gsap.to(btn, {x:0,y:0,duration:.5,ease:'elastic.out(1,0.4)'}));
});
