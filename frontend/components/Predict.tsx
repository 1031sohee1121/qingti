'use client';

import { useState } from 'react';
import { predict, PredictInput, PredictResponse } from '@/lib/api';

const initialInput: PredictInput = {
  Gender: 'Female',
  Age: 25,
  Height: 1.65,
  Weight: 60,
  family_history_with_overweight: 'no',
  FAVC: 'no',
  FCVC: 2,
  NCP: 3,
  CAEC: 'Sometimes',
  SMOKE: 'no',
  CH2O: 2,
  SCC: 'no',
  FAF: 1,
  TUE: 1,
  CALC: 'no',
  MTRANS: 'Walking',
};

export function Predict() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<PredictInput>(initialInput);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [error, setError] = useState<string>('');

  const update = <K extends keyof PredictInput>(k: K, v: PredictInput[K]) =>
    setData(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const r = await predict(data);
      setResult(r);
      setStep(4);
    } catch (e: any) {
      setError(e.message || '预测失败，请检查后端是否启动');
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setStep(0);
    setResult(null);
    setError('');
  };

  return (
    <section id="predict" className="py-24 px-6 md:px-10 bg-cream-light relative">
      <div className="max-w-6xl mx-auto">
        <SectionHead
          eyebrow="01 — 测一测"
          title={<>三分钟，<em className="font-serif italic font-normal text-coral">认识自己。</em></>}
          desc="我们用 16 个温柔的问题，理解你正在过怎样的生活。没有评判，只有理解。"
        />

        <div className="mt-16 bg-white rounded-[2rem] border border-border-soft/30 shadow-[0_20px_60px_-20px_rgba(209,122,92,0.15)] overflow-hidden">
          {step === 0 && <Intro onStart={() => setStep(1)} />}
          {step === 1 && <Step1 data={data} update={update} onNext={() => setStep(2)} />}
          {step === 2 && <Step2 data={data} update={update} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <Step3 data={data} update={update} onSubmit={handleSubmit} onBack={() => setStep(2)} loading={loading} />}
          {step === 4 && result && <Result result={result} onRestart={restart} />}
          {error && (
            <div className="m-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
              <strong>出错了：</strong> {error}
              <div className="mt-2 text-xs text-red-600">
                如果你刚启动后端，可能还在加载模型，请等几秒重试。
                如果一直失败，请确认后端正在 http://localhost:8000 运行。
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, desc }: any) {
  return (
    <div className="max-w-3xl">
      <div className="text-xs tracking-[0.3em] text-coral mb-4">{eyebrow}</div>
      <h2 className="font-serif text-4xl md:text-6xl font-light leading-[1.05] tracking-tight">{title}</h2>
      <p className="mt-6 text-lg text-text-soft leading-relaxed">{desc}</p>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="p-12 md:p-16 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <div className="text-xs tracking-widest text-moss mb-3">即将开始</div>
        <h3 className="font-serif text-3xl mb-6 leading-tight">
          准备好了吗？<br />
          <span className="italic text-coral">深呼吸，</span>我们慢慢来。
        </h3>
        <ul className="space-y-3 text-text-soft mb-8">
          <li className="flex items-start gap-3"><span className="text-moss mt-0.5">✓</span><span>16 个简单问题，分 3 步</span></li>
          <li className="flex items-start gap-3"><span className="text-moss mt-0.5">✓</span><span>不会保存你的隐私数据</span></li>
          <li className="flex items-start gap-3"><span className="text-moss mt-0.5">✓</span><span>结果会告诉你"为什么"，而不只是"是什么"</span></li>
        </ul>
        <button onClick={onStart} className="bg-ink text-cream px-8 py-4 rounded-full hover:bg-coral transition-all">
          开始 →
        </button>
      </div>
      <div className="relative h-80 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-coral-pale to-[#F5E6DC] rounded-3xl" />
        <svg viewBox="0 0 200 200" className="w-64 h-64 relative z-10">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#D17A5C" strokeWidth="1" opacity="0.3" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#D17A5C" strokeWidth="1" opacity="0.5" />
          <circle cx="100" cy="100" r="40" fill="#FFE4D6" />
          <text x="100" y="108" textAnchor="middle" fontSize="32" fill="#D17A5C" fontFamily="Fraunces">3</text>
          <text x="100" y="140" textAnchor="middle" fontSize="10" fill="#5C544A" letterSpacing="2">分钟</text>
        </svg>
      </div>
    </div>
  );
}

function StepBar({ step }: { step: number }) {
  return (
    <div className="px-12 md:px-16 pt-12 pb-6 border-b border-coral-pale/50">
      <div className="flex items-center gap-3 mb-4">
        {[1, 2, 3].map(n => (
          <div key={n} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${n <= step ? 'bg-coral text-white' : 'bg-coral-pale text-text-muted'}`}>{n}</div>
            {n < 3 && <div className={`w-8 h-px ${n < step ? 'bg-coral' : 'bg-coral-pale'}`} />}
          </div>
        ))}
        <span className="ml-4 text-xs tracking-widest text-text-muted">第 {step} / 3 步</span>
      </div>
    </div>
  );
}

function PillSelect<T extends string | number>({ options, value, onChange, labels }: any) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o: T, i: number) => (
        <button
          key={String(o)}
          onClick={() => onChange(o)}
          className={`px-4 py-2 rounded-full text-sm border transition-all ${value === o ? 'bg-ink text-white border-ink' : 'bg-white text-text-soft border-border-soft/40 hover:border-coral'}`}
        >
          {labels ? labels[i] : String(o)}
        </button>
      ))}
    </div>
  );
}

function Step1({ data, update, onNext }: any) {
  return (
    <div>
      <StepBar step={1} />
      <div className="px-12 md:px-16 pb-12">
        <h3 className="font-serif text-2xl mb-8">先说说，你现在的样子</h3>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm mb-2">性别</label>
              <PillSelect options={['Female', 'Male']} labels={['女', '男']} value={data.Gender} onChange={(v: string) => update('Gender', v)} />
            </div>
            <div>
              <label className="block text-sm mb-2">年龄</label>
              <input type="number" value={data.Age} onChange={e => update('Age', Number(e.target.value))} className="w-32 px-4 py-3 border border-border-soft/40 rounded-xl text-lg focus:border-coral focus:outline-none" />
              <span className="ml-2 text-sm text-text-muted">岁</span>
            </div>
            <div>
              <label className="block text-sm mb-2">身高</label>
              <input type="number" step="0.01" value={data.Height} onChange={e => update('Height', Number(e.target.value))} className="w-32 px-4 py-3 border border-border-soft/40 rounded-xl text-lg focus:border-coral focus:outline-none" />
              <span className="ml-2 text-sm text-text-muted">米（如 1.65）</span>
            </div>
            <div>
              <label className="block text-sm mb-2">体重</label>
              <input type="number" value={data.Weight} onChange={e => update('Weight', Number(e.target.value))} className="w-32 px-4 py-3 border border-border-soft/40 rounded-xl text-lg focus:border-coral focus:outline-none" />
              <span className="ml-2 text-sm text-text-muted">kg</span>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">家族超重史</label>
            <div className="text-xs text-text-muted mb-2">父母或亲属中是否有超重情况</div>
            <PillSelect options={['yes', 'no']} labels={['有', '无']} value={data.family_history_with_overweight} onChange={(v: string) => update('family_history_with_overweight', v)} />
          </div>
        </div>
        <div className="flex justify-end pt-8">
          <button onClick={onNext} className="bg-ink text-cream px-8 py-3 rounded-full hover:bg-coral transition-all">下一步 →</button>
        </div>
      </div>
    </div>
  );
}

function Step2({ data, update, onNext, onBack }: any) {
  return (
    <div>
      <StepBar step={2} />
      <div className="px-12 md:px-16 pb-12">
        <h3 className="font-serif text-2xl mb-8">说说你的饮食习惯</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-1">高热量食物的频率</label>
            <div className="text-xs text-text-muted mb-2">比如油炸、快餐</div>
            <PillSelect options={['no', 'yes']} labels={['几乎不', '经常吃']} value={data.FAVC} onChange={(v: string) => update('FAVC', v)} />
          </div>
          <div>
            <label className="block text-sm mb-2">每餐有蔬菜吗？</label>
            <PillSelect options={[1, 2, 3]} labels={['很少', '有时有', '总是有']} value={data.FCVC} onChange={(v: number) => update('FCVC', v)} />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm mb-2">每天主餐次数</label>
              <input type="number" value={data.NCP} onChange={e => update('NCP', Number(e.target.value))} className="w-32 px-4 py-3 border border-border-soft/40 rounded-xl text-lg focus:border-coral focus:outline-none" />
              <span className="ml-2 text-sm text-text-muted">餐</span>
            </div>
            <div>
              <label className="block text-sm mb-2">每天饮水量</label>
              <PillSelect options={[1, 2, 3]} labels={['<1L', '1-2L', '>2L']} value={data.CH2O} onChange={(v: number) => update('CH2O', v)} />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2">两餐之间会吃零食吗？</label>
            <PillSelect options={['no', 'Sometimes', 'Frequently', 'Always']} labels={['几乎不', '偶尔', '经常', '总是']} value={data.CAEC} onChange={(v: string) => update('CAEC', v)} />
          </div>
          <div>
            <label className="block text-sm mb-2">饮酒频率</label>
            <PillSelect options={['no', 'Sometimes', 'Frequently', 'Always']} labels={['不喝', '偶尔', '经常', '总是']} value={data.CALC} onChange={(v: string) => update('CALC', v)} />
          </div>
        </div>
        <div className="flex justify-between pt-8">
          <button onClick={onBack} className="text-text-soft px-6 py-3 hover:text-coral">← 上一步</button>
          <button onClick={onNext} className="bg-ink text-cream px-8 py-3 rounded-full hover:bg-coral transition-all">下一步 →</button>
        </div>
      </div>
    </div>
  );
}

function Step3({ data, update, onSubmit, onBack, loading }: any) {
  return (
    <div>
      <StepBar step={3} />
      <div className="px-12 md:px-16 pb-12">
        <h3 className="font-serif text-2xl mb-8">最后聊聊你的生活方式</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-1">每周运动次数</label>
            <div className="text-xs text-text-muted mb-2">跑步、游泳、健身等</div>
            <PillSelect options={[0, 1, 2, 3]} labels={['几乎没有', '0-1次', '2-4次', '4次以上']} value={data.FAF} onChange={(v: number) => update('FAF', v)} />
          </div>
          <div>
            <label className="block text-sm mb-1">每天屏幕时间</label>
            <div className="text-xs text-text-muted mb-2">电脑、手机、电视</div>
            <PillSelect options={[0, 1, 2]} labels={['<2小时', '3-5小时', '>5小时']} value={data.TUE} onChange={(v: number) => update('TUE', v)} />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm mb-2">是否吸烟</label>
              <PillSelect options={['yes', 'no']} labels={['是', '否']} value={data.SMOKE} onChange={(v: string) => update('SMOKE', v)} />
            </div>
            <div>
              <label className="block text-sm mb-2">是否监控热量摄入</label>
              <PillSelect options={['yes', 'no']} labels={['是', '否']} value={data.SCC} onChange={(v: string) => update('SCC', v)} />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2">主要交通方式</label>
            <PillSelect
              options={['Walking', 'Bike', 'Public_Transportation', 'Automobile', 'Motorbike']}
              labels={['步行', '自行车', '公共交通', '汽车', '摩托']}
              value={data.MTRANS}
              onChange={(v: string) => update('MTRANS', v)}
            />
          </div>
        </div>
        <div className="flex justify-between pt-8">
          <button onClick={onBack} className="text-text-soft px-6 py-3 hover:text-coral" disabled={loading}>← 上一步</button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-coral to-coral-light text-white px-10 py-3 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? '正在分析...' : '看看结果 ✨'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Result({ result, onRestart }: { result: PredictResponse; onRestart: () => void }) {
  const { prediction, bmi, probabilities, shap_explanations } = result;
  const colors: Record<string, string> = {
    'Insufficient_Weight': '#A8C4DA',
    'Normal_Weight': '#7A9B7E',
    'Overweight_Level_I': '#E8B4A0',
    'Overweight_Level_II': '#E8956F',
    'Obesity_Type_I': '#D17A5C',
    'Obesity_Type_II': '#B8634A',
    'Obesity_Type_III': '#9B4F3A',
  };

  const maxAbs = Math.max(...shap_explanations.map(s => s.abs_value));

  return (
    <div className="p-8 md:p-16">
      <div className="text-center max-w-2xl mx-auto mb-12 fade-up">
        <div className="text-xs tracking-widest text-coral mb-4">你的健康画像</div>
        <h3 className="font-serif text-5xl md:text-6xl mb-4 leading-tight">{prediction.message}</h3>
        <div className="inline-flex items-center gap-3 bg-cream-light border border-border-soft/30 rounded-full px-6 py-3 mt-6">
          <span className="w-3 h-3 rounded-full" style={{ background: colors[prediction.label_en] }} />
          <span className="font-medium">{prediction.label_zh}</span>
          <span className="text-text-muted text-sm">·  BMI {bmi.toFixed(1)}</span>
          <span className="text-text-muted text-sm">·  置信度 {(prediction.confidence * 100).toFixed(1)}%</span>
        </div>
        <p className="mt-6 text-text-soft leading-relaxed">
          这只是一个参考——你比任何数字都更重要。<br />
          下面，我们来看看是<em>哪些行为</em>在悄悄影响这个结果。
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8 mt-12">
        <div className="md:col-span-3 bg-cream-light rounded-3xl p-8 border border-coral-pale/50">
          <div className="text-xs tracking-widest text-text-muted mb-1">SHAP 可解释分析（来自真实模型）</div>
          <h4 className="font-serif text-2xl mb-2">为什么是这个结果？</h4>
          <p className="text-sm text-text-soft mb-6">
            红色：<em className="not-italic text-coral">支持这个判定</em>　·　绿色：<em className="not-italic text-moss">反对这个判定</em>
          </p>
          <div className="space-y-3">
            {shap_explanations.map((item, idx) => {
              const pct = (item.abs_value / maxAbs) * 100;
              const isPositive = item.value > 0;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium">{item.feature_zh}</span>
                    <span className={`text-xs ${isPositive ? 'text-coral' : 'text-moss'}`}>
                      {isPositive ? '+' : '−'}{Math.abs(item.value).toFixed(2)}
                    </span>
                  </div>
                  <div className="relative h-7 bg-white rounded-md border border-coral-pale/50 overflow-hidden">
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border-soft/40" />
                    {isPositive ? (
                      <div className="absolute top-0 bottom-0 left-1/2 bg-gradient-to-r from-coral-light to-coral rounded-r-md transition-all duration-1000" style={{ width: `${pct / 2}%` }} />
                    ) : (
                      <div className="absolute top-0 bottom-0 right-1/2 bg-gradient-to-l from-moss-light to-moss rounded-l-md transition-all duration-1000" style={{ width: `${pct / 2}%` }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-cream-light rounded-3xl p-8 border border-coral-pale/50">
            <div className="text-xs tracking-widest text-text-muted mb-1">概率分布</div>
            <h4 className="font-serif text-xl mb-4">模型把你归到</h4>
            <div className="space-y-2">
              {probabilities.map((p, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{p.label_zh}</span>
                    <span className="text-text-muted">{(p.probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden border border-coral-pale/40">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${p.probability * 100}%`, background: colors[p.label_en] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-coral-pale to-[#F5E6DC] rounded-3xl p-8">
            <h4 className="font-serif text-xl mb-3">下一步</h4>
            <p className="text-sm text-text-soft mb-4">基于你的画像，我们准备了温柔的小建议↓</p>
            <a href="#suggestions" className="inline-flex items-center gap-2 text-coral text-sm font-medium hover:gap-3 transition-all">
              去看建议 →
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        <button onClick={onRestart} className="border border-ink/20 px-6 py-3 rounded-full hover:border-ink transition-all">
          重新测一次
        </button>
        <a href="#tracker" className="bg-ink text-white px-6 py-3 rounded-full hover:bg-coral transition-all">
          保存到追踪
        </a>
      </div>
    </div>
  );
}
