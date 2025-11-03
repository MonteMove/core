import { Metadata } from 'next';

import { GuidesPageContent } from '@/features/guides/ui/guides-page-content/guides-page-content';

export const metadata: Metadata = {
  title: 'Справочники',
};

export default function GuidesPage() {
  return (
    <div className="max-w-5xl mx-auto text-foreground">
      <GuidesPageContent />
    </div>
  );
}
