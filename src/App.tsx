/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { ResultCalculator } from './components/ResultCalculator';

export default function App() {
  const [view, setView] = useState<'landing' | 'calculator'>('landing');

  return (
    <div className="min-h-screen">
      {view === 'landing' ? (
        <LandingPage onStart={() => setView('calculator')} />
      ) : (
        <ResultCalculator onBack={() => setView('landing')} />
      )}
    </div>
  );
}

