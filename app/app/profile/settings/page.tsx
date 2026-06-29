"use client";

import AsyncButton from "@/components/buttons/AsyncBtn";
import ModalWindow from "@/components/modals/ModalWindow";
import SignOutBtn from "@/components/buttons/loginButtons/SignOutBtn";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";

function FormField({
  label,
  value,
  placeholder,
  onChange,
  required,
}: {
  label: string;
  value?: string;
  placeholder: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const isEmpty = required && !value;
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-base-content/60">{label}</label>
      <input
        type="text"
        defaultValue={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`input input-bordered w-full transition-colors duration-200 ${isEmpty ? "input-error" : ""}`}
      />
      {isEmpty && (
        <p className="text-error text-xs">{label} is required</p>
      )}
    </div>
  );
}

export default function GeneralSettingsPage() {
  const { user, updateUser } = useUserStore();
  const [name, setName] = useState<string>();
  const [image, setImage] = useState<string>();
  const [surname, setSurname] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [modal, setModal] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setName(user.name!);
      setSurname(user.surname!);
      setUsername(user.username!);
      setImage(user.image!);
    }
  }, [user]);

  const handleSaveSettings = async () => {
    if (name && surname && username) {
      await updateUser({ name, surname, username });
      setModal(true);
    }
  };

  return (
    <div className="bg-base-200 border border-base-300 rounded-2xl shadow-xl p-6 space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Account settings</h2>
        <p className="text-base-content/50 text-sm">Manage your profile information</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        {image && (
          <img
            src={image}
            alt="Avatar"
            className="w-16 h-16 rounded-xl object-cover ring-2 ring-base-300"
          />
        )}
        <div className="space-y-1 flex-1">
          <label className="text-sm font-medium text-base-content/60">Profile photo</label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered file-input-sm w-full"
          />
        </div>
      </div>

      {user?.name && user?.surname && user?.username && (
        <div className="space-y-4">
          <FormField
            label="First name"
            value={name}
            placeholder="Enter your name"
            onChange={setName}
            required
          />
          <FormField
            label="Last name"
            value={surname}
            placeholder="Enter your surname"
            onChange={setSurname}
            required
          />
          <FormField
            label="Username"
            value={username}
            placeholder="Enter your username"
            onChange={setUsername}
            required
          />
          <AsyncButton
            func={handleSaveSettings}
            isLoadingText="Saving..."
            isNormalText="Save changes"
            className="btn btn-primary w-full rounded-xl hover:-translate-y-0.5 transition-transform duration-200"
          />
        </div>
      )}

      <div className="pt-2 border-t border-base-300">
        <SignOutBtn />
      </div>

      <ModalWindow modal={modal} modalState={setModal}>
        <div className="text-center space-y-2 py-2">
          <div className="text-3xl">✓</div>
          <h3 className="font-semibold text-lg">Saved successfully</h3>
          <p className="text-base-content/55 text-sm">Your profile has been updated.</p>
        </div>
      </ModalWindow>
    </div>
  );
}
