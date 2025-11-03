import { Metadata } from 'next';

import { HelpForm } from '@/features/help';

export const metadata: Metadata = {
  title: 'Помощь',
};

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <HelpForm />
    </div>
  );
}
