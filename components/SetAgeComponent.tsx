type SetAgeComponentProps = {
  pageIsReady: () => void;
  toggleAge: (age: string) => void;
};

export default function SetAgeComponent({
    toggleAge,
    pageIsReady
}: SetAgeComponentProps) {

    const handleAccept = () => {
        pageIsReady();
    }

    const handleAgeChange = (age: string) => {
        toggleAge(age);
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="flex justify-center">Select your age</h1>
            <input 
            type="date" 
            className="input"
            onChange={(e) => handleAgeChange(e.target.value)} 
            />
            <button className="btn btn-success" onClick={handleAccept}>Accept</button>
        </div>
    );
}