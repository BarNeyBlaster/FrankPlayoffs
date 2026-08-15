import { ShieldAlert } from 'lucide-react';

export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-6">
      <div className="max-w-md text-center">
        <ShieldAlert className="w-12 h-12 mx-auto text-amber-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">You're not registered</h1>
        <p className="text-white/60 text-sm">This app requires an invitation. Ask the app owner to invite you, then sign in with that email.</p>
      </div>
    </div>
  );
}