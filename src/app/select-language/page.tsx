
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import { useLocalization, type Language } from '@/hooks/use-localization';

export default function SelectLanguagePage() {
  const router = useRouter();
  const { setLanguage } = useLocalization();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    router.push('/login');
  };

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center">
        <GraduationCap className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-3xl md:text-5xl font-bold font-headline mb-2">Welcome to VidyaVahini</h1>
        <p className="text-lg text-muted-foreground mb-8">Please select your language to continue.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" onClick={() => handleLanguageSelect('en')}>Continue in English</Button>
        <Button size="lg" variant="outline" onClick={() => handleLanguageSelect('kn')}>ಕನ್ನಡದಲ್ಲಿ ಮುಂದುವರಿಸಿ</Button>
      </div>
    </div>
  );
}
