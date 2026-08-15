import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white">
      <h1 className="text-6xl font-black">404</h1>
      <p className="text-white/50 mt-2">This page could not be found.</p>
      <Link to="/" className="mt-6 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">Back home</Link>
    </div>
  );
}