export function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 px-6 md:px-10 overflow-hidden">
      {/* 装饰性模糊圆 */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-coral/20 rounded-full blur-3xl float" />
      <div className="absolute bottom-40 left-20 w-96 h-96 bg-moss/15 rounded-full blur-3xl float-slow" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 bg-coral-pale/60 border border-border-soft/40 rounded-full px-4 py-2 mb-8 fade-up">
              <span className="w-2 h-2 rounded-full bg-moss breathe" />
              <span className="text-xs tracking-wider text-text-soft">基于真实 XGBoost 模型 · 95.98% 准确率</span>
            </div>

            <h1 className="font-serif text-[3.5rem] md:text-[5.5rem] leading-[0.95] font-light tracking-tight fade-up" style={{ animationDelay: '0.1s' }}>
              <span className="block">健康，</span>
              <span className="block italic font-normal text-coral">不是一场战斗。</span>
              <span className="block text-[2rem] md:text-[2.5rem] mt-6 font-light text-text-soft">是一段，被理解的旅程。</span>
            </h1>

            <p className="mt-8 text-lg text-text-soft max-w-xl leading-relaxed fade-up" style={{ animationDelay: '0.2s' }}>
              我们不告诉你"该减肥了"。<br />
              而是告诉你——身体的信号背后，<br />
              <span className="text-ink">究竟是什么在悄悄影响你。</span>
            </p>

            <div className="mt-10 flex flex-wrap gap-4 fade-up" style={{ animationDelay: '0.3s' }}>
              <a href="#predict" className="group bg-ink text-cream px-8 py-4 rounded-full hover:bg-coral transition-all duration-300 flex items-center gap-2">
                <span>开始一次温柔的检测</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
              <a href="#knowledge" className="border border-ink/20 px-8 py-4 rounded-full hover:border-ink transition-all">
                先看看科普
              </a>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg fade-up" style={{ animationDelay: '0.4s' }}>
              <Stat num="2,111" label="样本支撑" />
              <Stat num="16" label="行为维度" />
              <Stat num="7" label="状态分级" />
            </div>
          </div>

          <div className="md:col-span-5 relative h-[500px] hidden md:block">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-3xl font-light">{num}</div>
      <div className="text-xs text-text-muted tracking-wider mt-1">{label}</div>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative w-full h-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <defs>
            <radialGradient id="bodyGradient" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#FFE4D6" />
              <stop offset="100%" stopColor="#F5A78F" />
            </radialGradient>
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A8C4A2" />
              <stop offset="100%" stopColor="#7A9B7E" />
            </linearGradient>
          </defs>
          <circle cx="150" cy="150" r="140" fill="none" stroke="#E8B4A0" strokeWidth="0.5" opacity="0.4" />
          <circle cx="150" cy="150" r="120" fill="none" stroke="#E8B4A0" strokeWidth="0.5" opacity="0.5" />
          <circle cx="150" cy="150" r="100" fill="url(#bodyGradient)" className="breathe" />
          <g transform="translate(150, 150)">
            <path d="M 0,-30 Q -25,-20 -25,5 Q -25,25 0,30 Q 25,25 25,5 Q 25,-20 0,-30 Z" fill="url(#leafGrad)" />
            <path d="M 0,-25 L 0,28" stroke="#5C7A5F" strokeWidth="1" />
          </g>
        </svg>
      </div>
      <FloatingChip top="10%" left="10%" delay="0s" emoji="🥗" label="饮食" />
      <FloatingChip top="20%" right="5%" delay="0.5s" emoji="🚶" label="活动" />
      <FloatingChip bottom="25%" left="0%" delay="1s" emoji="💧" label="水分" />
      <FloatingChip bottom="10%" right="10%" delay="1.5s" emoji="😴" label="作息" />
      <FloatingChip top="50%" right="-2%" delay="2s" emoji="🧬" label="遗传" />
    </div>
  );
}

function FloatingChip({ top, left, right, bottom, delay, emoji, label }: any) {
  return (
    <div
      className="absolute bg-white/80 backdrop-blur-sm border border-border-soft/30 rounded-full px-3 py-2 shadow-sm flex items-center gap-2 float"
      style={{ top, left, right, bottom, animationDelay: delay }}
    >
      <span className="text-lg">{emoji}</span>
      <span className="text-xs text-text-soft tracking-wider">{label}</span>
    </div>
  );
}
