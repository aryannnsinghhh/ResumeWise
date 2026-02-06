// src/pages/LandingPage.tsx
import React from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import FeatureOverview from '../features/FeatureOverview';
import Testimonials from '../features/Testimonials';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <FeatureOverview />
        <Testimonials />
        {/* Add more sections here like Pricing, How It Works, FAQ etc. */}
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;