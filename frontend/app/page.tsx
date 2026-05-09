import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Predict } from '@/components/Predict';
import { HealthPortrait, Suggestions, Knowledge, Tracker, Footer } from '@/components/Sections';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Predict />
        <HealthPortrait />
        <Suggestions />
        <Knowledge />
        <Tracker />
        <Footer />
      </main>
    </>
  );
}
