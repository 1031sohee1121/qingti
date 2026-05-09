'use client';

import { SectionHead } from './Predict';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function HealthPortrait() {
  const factors = [
    { name: '体重', impact: 100, color: '#D17A5C', desc: '所有分析中绝对的第一影响因素' },
    { name: '身高', impact: 19, color: '#E8956F', desc: '作为 BMI 的修正基础' },
    { name: '年龄', impact: 11, color: '#E8B4A0', desc: '基础代谢的关键变量' },
    { name: '蔬菜摄入', impact: 11, color: '#7A9B7E', desc: '可干预的核心饮食因素' },
    { name: '性别', impact: 10, color: '#A8C4A2', desc: '体脂分布的生理基础' },
    { name: '饮水量', impact: 7, color: '#A8C4DA', desc: '影响代谢与饱腹感' },
    { name: '屏幕时间', impact: 7, color: '#C4A8DA', desc: '反映久坐生活方式' },
    { name: '运动频率', impact: 5, color: '#7A9B7E', desc: '非线性影响——过量收益递减' },
  ];

  return (
    <section id="portrait" className="py-24 px-6 md:px-10 bg-cream">
      <div className="max-w-7xl mx-auto">
        <SectionHead
          eyebrow="02 — 健康画像"
          title={<>影响体重的，<em className="font-serif italic font-normal text-coral">远比你想的多。</em></>}
          desc="基于论文中 2111 个真实样本的 SHAP 分析，下面这些因素正在共同塑造每个人的体重状态。"
        />

        <div className="mt-16 grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7 bg-white rounded-3xl p-10 border border-border-soft/30">
            <div className="text-xs tracking-widest text-text-muted mb-2">全局特征影响力</div>
            <h3 className="font-serif text-2xl mb-8">影响排行 TOP 8</h3>
            <div className="space-y-5">
              {factors.map((f, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs tabular-nums text-text-muted w-6">0{i + 1}</span>
                      <span className="font-medium">{f.name}</span>
                    </div>
                    <span className="text-sm tabular-nums text-text-muted">{f.impact}%</span>
                  </div>
                  <div className="ml-9 h-3 bg-cream rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${f.impact}%`, background: `linear-gradient(90deg, ${f.color}, ${f.color}AA)` }}
                    />
                  </div>
                  <div className="ml-9 text-xs text-text-muted mt-1.5 italic">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-coral-pale to-[#F5E6DC] rounded-3xl p-8">
              <div className="text-xs tracking-widest text-coral mb-3">第一洞察</div>
              <h4 className="font-serif text-2xl mb-3 leading-tight">身体记得每一份蔬菜</h4>
              <p className="text-sm text-text-soft leading-relaxed">
                在所有<em>你可以改变</em>的因素中，蔬菜摄入是最有效的——它是论文中唯一同时进入"统计相关"、"模型重要性"、"SHAP 全局" 三个维度 Top 5 的可干预变量。
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#E8F0E0] to-[#F5F0E8] rounded-3xl p-8">
              <div className="text-xs tracking-widest text-moss mb-3">第二洞察</div>
              <h4 className="font-serif text-2xl mb-3 leading-tight">运动不是越多越好</h4>
              <p className="text-sm text-text-soft leading-relaxed">
                SHAP 揭示了一个反直觉的事实——每周运动 2-4 次的负向贡献最强，超过这个频率后<em>边际收益递减</em>。中等强度，刚刚好。
              </p>
            </div>
            <div className="bg-white border border-border-soft/30 rounded-3xl p-8">
              <div className="text-xs tracking-widest text-text-muted mb-3">第三洞察</div>
              <h4 className="font-serif text-2xl mb-3 leading-tight">有家族史 ≠ 注定</h4>
              <p className="text-sm text-text-soft leading-relaxed">
                数据中有家族史的人肥胖比例约 55.9%，无家族史的仅 2.1%。但<em>剩下的 44.1%</em> 也证明了——基因不是命运。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================
// 建议
// =============================================================
export function Suggestions() {
  const cards = [
    { tag: '饮食', tagColor: '#7A9B7E', title: '从一盘"半绿"开始', body: '不必追求完美——每顿饭把盘子的一半留给蔬菜。SHAP 显示这是性价比最高的改变。', action: '查看 7 天蔬菜计划', icon: '🥬' },
    { tag: '运动', tagColor: '#D17A5C', title: '每周三次，每次 30 分', body: '不是越久越好。模型显示每周 2-4 次中等强度运动是甜蜜点，多了反而收益递减。', action: '挑选适合你的运动', icon: '🚶‍♀️' },
    { tag: '作息', tagColor: '#A8C4DA', title: '把屏幕时间还给自己', body: '屏幕时间和体重的关联，比你想象的强。试试每天给自己留 1 小时"无屏幕窗口"。', action: '建立屏幕仪式', icon: '🌙' },
    { tag: '心态', tagColor: '#E8B4A0', title: '不要节食，要节奏', body: '间歇性饥饿会让身体更想储存。规律的三餐，比"少吃"更有效。', action: '看看进餐节奏指南', icon: '🍽️' },
    { tag: '饮水', tagColor: '#A8C4DA', title: '每天 1.5 升起步', body: '充足饮水能帮助代谢，也常常被误认为饥饿信号。从早起一杯水开始。', action: '设置饮水提醒', icon: '💧' },
    { tag: '环境', tagColor: '#C4A8DA', title: '改变路径，而非意志', body: '把零食藏起来、把运动鞋放门口。环境的微调，比意志力更可靠。', action: '环境改造清单', icon: '🪴' },
  ];

  return (
    <section id="suggestions" className="py-24 px-6 md:px-10 bg-cream-light">
      <div className="max-w-7xl mx-auto">
        <SectionHead
          eyebrow="03 — 个性化建议"
          title={<>小步前进，<em className="font-serif italic font-normal text-coral">比完美更重要。</em></>}
          desc={<>我们不会让你<em className="not-italic">明天开始全新生活</em>。下面是六个轻量级行动，挑一个就够了。</>}
        />
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div key={i} className="group bg-white border border-border-soft/30 rounded-3xl p-8 hover:shadow-[0_20px_40px_-15px_rgba(209,122,92,0.2)] hover:-translate-y-1 transition-all duration-500">
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs tracking-widest px-3 py-1 rounded-full" style={{ background: `${c.tagColor}20`, color: c.tagColor }}>{c.tag}</span>
                <span className="text-3xl">{c.icon}</span>
              </div>
              <h3 className="font-serif text-2xl mb-3 leading-snug">{c.title}</h3>
              <p className="text-sm text-text-soft leading-relaxed mb-6">{c.body}</p>
              <button className="text-sm text-coral flex items-center gap-2 group-hover:gap-3 transition-all">
                {c.action} <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================
// 科普
// =============================================================
export function Knowledge() {
  const articles = [
    { cat: '科学解读', readTime: '5 min', title: 'BMI 真的能代表健康吗？', excerpt: '它是一个 200 年前的统计公式。它能告诉你一些事，也藏着另一些。', gradient: 'from-coral-pale to-[#F5E6DC]' },
    { cat: '饮食', readTime: '7 min', title: '关于"少吃多动"的 5 个误区', excerpt: '为什么意志力总是失败？因为我们用错了对手。', gradient: 'from-[#E8F0E0] to-[#F5F0E8]' },
    { cat: 'AI 解读', readTime: '8 min', title: '什么是 SHAP？为什么它重要？', excerpt: 'AI 不再是黑盒。每一次预测，都能告诉你"为什么"。', gradient: 'from-[#E0E8F0] to-[#F0F0F8]' },
    { cat: '行为科学', readTime: '6 min', title: '环境，是最被低估的减重伙伴', excerpt: '比起改变自己，改变身边的物品摆放可能更有效。', gradient: 'from-[#F0E0E8] to-[#F8F0F0]' },
  ];

  return (
    <section id="knowledge" className="py-24 px-6 md:px-10 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <SectionHead
            eyebrow="04 — 知识科普"
            title={<>慢慢读，<em className="font-serif italic font-normal text-coral">慢慢懂。</em></>}
            desc="健康知识不该是焦虑来源。这里是一些值得花点时间读的内容。"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {articles.map((a, i) => (
            <article key={i} className="group cursor-pointer">
              <div className={`bg-gradient-to-br ${a.gradient} rounded-3xl p-10 h-72 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-500 relative overflow-hidden`}>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/30 blur-2xl" />
                <div className="flex items-center gap-3 text-xs tracking-widest text-text-soft relative">
                  <span>{a.cat}</span><span>·</span><span>{a.readTime}</span>
                </div>
                <div className="relative">
                  <h3 className="font-serif text-3xl leading-tight mb-3 group-hover:translate-x-1 transition-transform">{a.title}</h3>
                  <p className="text-sm text-text-soft leading-relaxed">{a.excerpt}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================
// 追踪
// =============================================================
export function Tracker() {
  const weightData = [
    { day: '周一', w: 60.2 }, { day: '周二', w: 60.0 }, { day: '周三', w: 59.8 },
    { day: '周四', w: 60.1 }, { day: '周五', w: 59.6 }, { day: '周六', w: 59.7 },
    { day: '周日', w: 59.4 },
  ];
  const habitData = [
    { name: '蔬菜', done: 6, total: 7 }, { name: '运动', done: 4, total: 7 },
    { name: '饮水', done: 7, total: 7 }, { name: '早睡', done: 5, total: 7 },
  ];

  return (
    <section id="tracker" className="py-24 px-6 md:px-10 bg-cream-light">
      <div className="max-w-7xl mx-auto">
        <SectionHead
          eyebrow="05 — 数据追踪"
          title={<>每一个微小的变化，<em className="font-serif italic font-normal text-coral">都会被记得。</em></>}
          desc="不仅是数字。我们把你的每周变化变成一段可以回头看的旅程。"
        />
        <div className="mt-16 grid md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-white rounded-3xl p-8 border border-border-soft/30">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-xs tracking-widest text-text-muted mb-1">本周体重曲线</div>
                <h3 className="font-serif text-2xl">59.4 <span className="text-base text-text-muted">kg</span></h3>
                <div className="text-sm text-moss mt-1">↓ 0.8 kg · 一周</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5E6DC" />
                <XAxis dataKey="day" stroke="#8A7E6F" tick={{ fontSize: 12 }} />
                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} stroke="#8A7E6F" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#FFFBF5', border: '1px solid #E8B4A0', borderRadius: 12 }} formatter={(v: any) => [`${v} kg`, '体重']} />
                <Line type="monotone" dataKey="w" stroke="#D17A5C" strokeWidth={3} dot={{ r: 5, fill: '#D17A5C', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="md:col-span-4 bg-white rounded-3xl p-8 border border-border-soft/30">
            <div className="text-xs tracking-widest text-text-muted mb-1">本周习惯</div>
            <h3 className="font-serif text-2xl mb-6">完成 22 / 28</h3>
            <div className="space-y-5">
              {habitData.map((h, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{h.name}</span>
                    <span className="text-text-muted tabular-nums">{h.done} / {h.total}</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: h.total }).map((_, idx) => (
                      <div key={idx} className={`flex-1 h-2 rounded-full ${idx < h.done ? 'bg-gradient-to-r from-coral to-coral-light' : 'bg-coral-pale'}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full bg-cream-light border border-border-soft/30 text-coral py-3 rounded-full text-sm hover:bg-coral-pale transition-all">+ 今日打卡</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================
// 页脚
// =============================================================
export function Footer() {
  return (
    <footer className="bg-ink text-cream py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-serif text-2xl">轻体</span>
            </div>
            <p className="font-serif text-3xl leading-tight max-w-md mb-6">
              <em className="italic text-coral-light">每个人</em>都值得，<br />
              一段被理解的健康旅程。
            </p>
            <p className="text-sm text-cream/60 max-w-md leading-relaxed">
              基于刘雯怡《基于机器学习的多源行为数据体重状态预测与可视化系统设计》研究成果构建。模型 XGBoost · 准确率 95.98% · 可解释性 SHAP。
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="text-xs tracking-widest text-cream/50 mb-4">功能</div>
            <ul className="space-y-2 text-sm text-cream/80">
              <li><a href="#predict" className="hover:text-coral-light">测一测</a></li>
              <li><a href="#portrait" className="hover:text-coral-light">健康画像</a></li>
              <li><a href="#suggestions" className="hover:text-coral-light">建议</a></li>
              <li><a href="#knowledge" className="hover:text-coral-light">科普</a></li>
              <li><a href="#tracker" className="hover:text-coral-light">追踪</a></li>
            </ul>
          </div>
          <div className="md:col-span-5">
            <div className="text-xs tracking-widest text-cream/50 mb-4">每周一封温柔来信</div>
            <p className="text-sm text-cream/70 mb-4">订阅后，你会收到精选的健康知识、读者故事和小提醒。</p>
            <div className="flex gap-2 max-w-md">
              <input type="email" placeholder="你的邮箱" className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-coral-light" />
              <button className="bg-coral-light text-ink px-5 rounded-full text-sm hover:bg-cream transition-all">订阅</button>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 text-xs text-cream/50">
          © 2026 轻体 · QING TI · 一项温柔的实验
        </div>
      </div>
    </footer>
  );
}
