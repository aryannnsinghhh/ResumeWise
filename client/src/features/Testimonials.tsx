// src/components/features/Testimonials.tsx
import React from 'react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  title: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, title }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 flex flex-col justify-between h-full">
    <p className="text-gray-700 text-lg italic mb-6">"{quote}"</p>
    <div>
      <p className="font-semibold text-gray-900">{author}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  </div>
);

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 text-center mb-12">
          What Our Hiring Teams Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            quote="ResumeWise cut our initial screening time by over 75%, allowing our recruiters to focus on qualified candidates faster."
            author="Jane Doe"
            title="HR Manager, TechCorp"
          />
          <TestimonialCard
            quote="The accuracy of the match scoring is incredible. We've found top talent we might have missed with manual screening."
            author="John Smith"
            title="Recruiting Lead, Innovate Inc."
          />
          <TestimonialCard
            quote="Easy to integrate and even easier to use. ResumeWise is now an indispensable part of our hiring workflow."
            author="Sarah Lee"
            title="Talent Acquisition Specialist, Global Solutions"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;