import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="bg-[#000] bg-noise min-h-screen flex flex-col font-glitch text-[#0ff] overflow-hidden screen-tear selection:bg-[#f0f] selection:text-[#000]">
      <div className="crt-overlay"></div>
      
      <header className="h-24 flex shrink-0 items-center justify-between px-6 border-b-4 border-[#0ff] jarring-border mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#0ff] flex items-center justify-center border-4 border-[#f0f] animate-pulse">
            <div className="w-4 h-4 bg-[#000]"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase glitch-text" data-text="ERR_SYSTEM_FAIL">
            ERR_SYSTEM_FAIL
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block border-2 border-[#f0f] p-2 bg-[#000]">
            <p className="text-xl text-[#f0f]">STATUS: COMPROMISED</p>
            <p className="text-lg text-[#0ff] animate-pulse">DATA CORRUPTION: 89%</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col xl:flex-row gap-12 p-6 overflow-hidden items-center xl:items-start justify-center">
        <section className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl order-2 xl:order-1 relative z-10">
          <SnakeGame />
        </section>

        <aside className="w-full xl:w-96 flex flex-col gap-8 order-1 xl:order-2 shrink-0 z-10">
          <div className="bg-[#000] p-4 border-4 border-[#0ff] shadow-[-8px_8px_0_#f0f]">
            <h2 className="text-3xl text-[#f0f] uppercase mb-2 glitch-text" data-text="SYS.AUDIO.DAC">SYS.AUDIO.DAC</h2>
            <p className="text-xl text-[#0ff] bg-[#000] mb-4">&gt; EXECUTING AUDIO PLAYBACK... _</p>
            <MusicPlayer />
          </div>
        </aside>
      </main>
    </div>
  );
}
