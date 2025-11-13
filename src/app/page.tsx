import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Bus, BookOpen, User, CreditCard, Bell } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8" />
            <h1 className="text-2xl font-bold font-headline">VidyaVahini</h1>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="#features" className="text-sm font-medium hover:underline">Features</Link>
            <Link href="#about" className="text-sm font-medium hover:underline">About</Link>
            <Link href="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          </nav>
          <div className="md:hidden">
             <Link href="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full h-[60vh] text-white">
          <div className="absolute inset-0 bg-black/50 z-10" />
           {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="School building"
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="relative z-20 container mx-auto flex flex-col items-center justify-center h-full text-center px-4">
            <h2 className="text-4xl md:text-6xl font-bold font-headline mb-4">Karnataka Government School</h2>
            <p className="text-lg md:text-2xl mb-8 max-w-3xl">Empowering students, teachers, and parents with seamless access to school information.</p>
            <Link href="/login">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Access Dashboard
              </Button>
            </Link>
          </div>
        </section>

        <section id="features" className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12 font-headline">One Portal for All School Needs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard icon={<User />} title="Student Profiles" description="Complete student information at your fingertips." />
              <FeatureCard icon={<BookOpen />} title="Academics" description="Track homework, timetables, and study materials." />
              <FeatureCard icon={<Bus />} title="Transport" description="Real-time bus tracking and route information." />
              <FeatureCard icon={<CreditCard />} title="Fee Management" description="Easy online fee payments and history." />
              <FeatureCard icon={<Bell />} title="Parent Dashboard" description="Stay updated with your child's progress." />
              <FeatureCard icon={<GraduationCap />} title="Staff Directory" description="Connect with teachers and school staff." />
            </div>
          </div>
        </section>
        
        <section id="about" className="py-16 bg-secondary">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold font-headline mb-4">About VidyaVahini</h3>
            <p className="max-w-3xl mx-auto text-muted-foreground">
              VidyaVahini is a modern, professional portal for Karnataka Government Schools, designed to bridge the communication gap between parents, students, and teachers. Our mission is to provide an easy-to-use platform for all school-related information, promoting transparency and collaboration.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} VidyaVahini. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="text-center hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="mx-auto bg-accent text-accent-foreground rounded-full p-3 w-fit mb-4">
          {icon}
        </div>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
