import { redirect } from "next/navigation";

export default function AfterCallLayout() {

  const handlePushingToMainPage = () => {
    return redirect("/app");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1>The call ended</h1>
      <button
        className="btn btn-error"
        onClick={() => handlePushingToMainPage()}
      >
        Return to Main page
      </button>
    </div>
  );
}
