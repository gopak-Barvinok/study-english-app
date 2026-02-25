"use client";

import Link from "next/link";

export default function LendingComponent() {
  return (
    <div className="flex flex-col">
      {/* Hero секция */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">
            Never forget what you learned 
            <br />in your lessons again
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Automatically turn every lesson into transcripts and flashcards powered by AI.
          </p>
          <div>
            <Link 
              href="/app/login" 
              className="inline-block px-8 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Start learning smarter
            </Link>
          </div>
        </div>
      </section>

      {/* Статистика/Проблема */}
      <section className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight">
            Most students forget 70% of what they learned after a lesson.
          </h2>
          <p className="text-lg text-gray-600">
            Our platform turns every lesson into permanent knowledge.
          </p>
        </div>
      </section>

      {/* Как это работает */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight">
            How it works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="text-5xl font-light text-gray-300">1</div>
              <h3 className="text-xl font-medium">Have your lesson</h3>
              <p className="text-gray-600 text-sm">
                Just attend your regular class or meeting
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="text-5xl font-light text-gray-300">2</div>
              <h3 className="text-xl font-medium">We record & transcribe</h3>
              <p className="text-gray-600 text-sm">
                Automatically in the background
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="text-5xl font-light text-gray-300">3</div>
              <h3 className="text-xl font-medium">Review with AI</h3>
              <p className="text-gray-600 text-sm">
                Smart flashcards generated for you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots - можно добавить позже */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            Screenshots placeholder
          </div>
        </div>
      </section>

      {/* Финальный CTA */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight max-w-xl">
            Ready to remember everything?
          </h2>
          <div>
            <Link 
              href="/app/login" 
              className="inline-block px-8 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Start learning smarter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}