"use client";

import Link from "next/link";

export default function LendingComponent() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/25 rounded-full text-primary text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            AI-Powered Language Learning
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Never forget what you
            <br />
            <span className="text-primary">learned</span> again
          </h1>
          <p className="text-lg text-base-content/55 max-w-xl mx-auto leading-relaxed">
            Automatically turn every lesson into transcripts and flashcards powered by AI.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              href="/app/login"
              className="btn btn-primary rounded-full px-8 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform duration-200"
            >
              Start learning smarter
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="min-h-screen flex items-center justify-center px-6 bg-base-200">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="text-7xl md:text-9xl font-bold text-primary/15 leading-none select-none">
            70%
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight -mt-4">
            of students forget what they learned
          </h2>
          <p className="text-lg text-base-content/55 max-w-lg mx-auto">
            Our platform turns every lesson into permanent knowledge through AI-generated flashcards and smart spaced review.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it works</h2>
            <p className="text-base-content/55">Three simple steps to mastery</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "Have your lesson",
                desc: "Attend your class or meeting as usual with your teacher",
              },
              {
                step: "02",
                title: "We record & transcribe",
                desc: "AI processes everything automatically in the background",
              },
              {
                step: "03",
                title: "Review with flashcards",
                desc: "Smart cards generated directly from your lesson content",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="bg-base-200 border border-base-300 rounded-2xl p-7 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl font-bold text-primary/25 mb-4">{step}</div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-base-content/55 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="min-h-screen flex items-center justify-center px-6 bg-base-200">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ready to remember everything?
          </h2>
          <p className="text-base-content/55">
            Join thousands of students who never forget a lesson.
          </p>
          <Link
            href="/app/login"
            className="btn btn-primary rounded-full px-8 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform duration-200"
          >
            Start for free
          </Link>
        </div>
      </section>
    </div>
  );
}
