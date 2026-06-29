type SetAgeComponentProps = {
  pageIsReady: () => void;
  toggleAge: (age: string) => void;
};

export default function SetAgeComponent({ toggleAge, pageIsReady }: SetAgeComponentProps) {
  return (
    <div className="bg-base-200 border border-base-300 rounded-2xl p-8 shadow-xl w-full max-w-sm animate-fade-in">
      <div className="space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Your date of birth</h1>
          <p className="text-base-content/50 text-sm">We'll use this to personalize your experience</p>
        </div>
        <input
          type="date"
          className="input input-bordered w-full"
          onChange={(e) => toggleAge(e.target.value)}
        />
        <button
          className="btn btn-primary w-full rounded-xl hover:-translate-y-0.5 transition-transform duration-200"
          onClick={pageIsReady}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
