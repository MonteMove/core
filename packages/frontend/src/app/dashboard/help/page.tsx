import { Metadata } from 'next';

import { HelpForm } from '@/features/help';

export const metadata: Metadata = {
  title: 'Помощь',
};

export default function HelpPage() {
  return <HelpForm />;
}
