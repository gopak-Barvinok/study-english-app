import { useEffect, useState } from "react";
import AsyncButton from "./buttons/AsyncBtn";

type SetIsTeacherComponentProps = {
  pageIsReady: () => Promise<void>;
  choosedRole: string;
  toggleRole: (role: string) => void;
};

export default function SetIsTeacherComponent({
  pageIsReady,
  choosedRole,
  toggleRole,
}: SetIsTeacherComponentProps) {
  const [isRoles, setIsRoles] = useState<string[]>();

  const handleAccept = async () => {
    await pageIsReady();
  };

  useEffect(() => {
    const roles = ["Teacher", "Student"];
    setIsRoles(roles);
  }, []);

  const handleRoleChange = (role: string) => {
    toggleRole(role);
  };

  return (
    <div className="flex flex-col">
      <h1>What kind of user are you?</h1>
      <div className="join join-vertical grid grid-cols-2 gap-y-2 mb-3 mt-3">
        {isRoles?.map((role) => (
          <div key={role} className="join-item contents">
            <span className="text-lg">{role}</span>
            <input
              type="radio"
              name="userRole"
              value={role}
              className="radio radio-success justify-self-end"
              onChange={(e) => handleRoleChange(e.target.value)}
              checked={choosedRole === role}
            />
          </div>
        ))}
      </div>
      <AsyncButton
        func={handleAccept}
        isLoadingText="Loading data"
        isNormalText="Accept"
        className="btn btn-success"
      />
    </div>
  );
}
