import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { JSX } from 'react';
import SEO from '@/components/SEO';

type Value = {
  number: string;
  title: string;
  body: string;
};

const values: Value[] = [
  {
    number: '01',
    title: 'UNAPOLOGETIC',
    body: 'We build clothing for people who have stopped apologising for who they are. Every piece is a declaration.',
  },
  {
    number: '02',
    title: 'DESIRE',
    body: 'Desire is the engine of everything beautiful. We refuse to be ashamed of wanting — wanting more, wanting boldly, wanting truthfully.',
  },
  {
    number: '03',
    title: 'QUALITY',
    body: 'Every cut, every stitch, every fabric is chosen with intention. We make things that last because conviction should be durable.',
  },
  {
    number: '04',
    title: 'COMMUNITY',
    body: 'This is not just a brand. It is a collective of people who chose themselves. You are not alone in that choice.',
  },
];

export default function About(): JSX.Element {
  return (
    <>
      <SEO
          title="About"
          description="Desire is not a crime. The story behind SLUT Clothing."
          url="/about"
      />
    <div className="bg-white">

      {/* ── 1. Hero ── */}
      <section className="relative bg-black min-h-[80vh] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80"
          alt="SLUT Clothing — Our Story"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-10 pb-20 md:pb-28">
          <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase mb-4">
            Our Story
          </p>
          <h1
            className="text-6xl md:text-[9rem] font-black text-white leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}
          >
            DESIRE IS NOT<br />A CRIME
          </h1>
        </div>
      </section>

      {/* ── 2. Manifesto ── */}
      <section className="max-w-screen-xl mx-auto px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 mb-4">
            The Beginning
          </p>
          <h2
            className="text-5xl md:text-6xl font-black leading-none mb-8"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            BORN FROM<br />REFUSING TO HIDE
          </h2>
        </div>
        <div className="space-y-5 text-neutral-500 text-sm leading-relaxed">
          <p>
            Own your body. Own your Power in Desire 
          </p>
          <p>
            Own your Urge <br /> Want More. Take More.
          </p>
          <p>
            SS25 is our loudest statement yet. These are clothes for people who stopped asking for permission.
          </p>
        </div>
      </section>

      {/* ── 3. Full-bleed image ── */}
      <div className="w-full aspect-[16/7] overflow-hidden bg-neutral-100">
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80"
          alt="Campaign"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── 4. Values ── */}
      <section className="bg-black text-white py-24 px-6 md:px-10">
        <div className="max-w-screen-xl mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-white/30 mb-14">
            What We Stand For
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
            {values.map((v) => (
              <div key={v.number}>
                <span className="text-white/20 text-xs tracking-widest font-mono block mb-4">
                  {v.number}
                </span>
                <h3
                  className="text-2xl font-black tracking-wide mb-3"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {v.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Marquee strip ── */}
      <div className="relative bg-white border-y border-neutral-100 py-4 overflow-hidden select-none" aria-hidden>
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="text-black text-[10px] tracking-[0.25em] font-medium mx-8 uppercase opacity-30 shrink-0"
            >
              SLUT CLOTHING · SS25 · DESIRE IS NOT A CRIME · UNAPOLOGETIC · MADE WITH CONVICTION
            </span>
          ))}
        </div>
      </div>

      {/* ── 6. Split editorial ── */}
      <section className="grid md:grid-cols-2 min-h-[60vh]">
        <div className="relative overflow-hidden bg-neutral-900 aspect-square md:aspect-auto">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
            alt="The Process"
            className="w-full h-full object-cover opacity-70 hover:opacity-90 hover:scale-[1.03] transition-all duration-700"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-10 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white/40 text-[10px] tracking-[0.35em] uppercase mb-2">Process</p>
            <h3
              className="text-white text-4xl font-black mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              MADE WITH INTENTION
            </h3>
            <p className="text-white/50 text-sm max-w-xs leading-relaxed">
              Every garment is sampled, worn, and revised before it reaches you. We make what we would actually wear ourselves.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center px-10 md:px-16 py-20 bg-neutral-50">
          <p className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 mb-4">SS25</p>
          <h3
            className="text-5xl font-black leading-none mb-6"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            NEW COLLECTION<br />AVAILABLE NOW
          </h3>
          <p className="text-neutral-500 text-sm leading-relaxed mb-8 max-w-sm">
            The SS25 drop is here. Bold silhouettes, uncompromising materials, and a message you wear on your back.
          </p>
          <Link to="/shop">
            <Button className="rounded-none bg-black text-white hover:bg-neutral-800 text-[10px] font-bold tracking-widest uppercase px-8 w-fit">
              Shop SS25 <ArrowRight size={13} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
    </>
  );
}
