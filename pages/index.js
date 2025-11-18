import Head from 'next/head';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

export default function Home() {
  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <Head>
        <title>Cent Stage — Tasks</title>
      </Head>

      <header className="mb-6">
        <h1 className="text-3xl font-bold">Cent Stage</h1>
        <p className="text-sm text-gray-500">Simple task manager</p>
      </header>

      <main className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div><TaskForm /></div>
        <div><TaskList /></div>
      </main>
    </div>
  );
}
