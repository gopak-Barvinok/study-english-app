"use client";

import AsyncButton from "@/components/buttons/AsyncBtn";
import ModalWindow from "@/components/modals/ModalWindow";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";

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

  const handleSetName = (name: string) => {
    setName(name);
  };

  const handleSetSurname = (surname: string) => {
    setSurname(surname);
  };

  const handleSetUsername = (username: string) => {
    setUsername(username);
  };

  const handleSaveSettings = async () => {
    if (name && surname && username) {
      await updateUser({
        name: name,
        surname: surname,
        username: username,
      });
      setModal(true);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="font-extrabold">Account settings</div>
      <figure>
        <img src={image} alt="Avatar" className="rounded-xl" />
      </figure>
      <input type="file" className="file-input file-input-info" />
      {user && user.name && user.surname && user.username && (
        <div className="flex flex-col gap-3">
          <div>
            <p>Your name</p>
            <input
              type="text"
              defaultValue={name}
              placeholder="Enter your name"
              onChange={(e) => handleSetName(e.target.value)}
              className={`input ${!name && `input-error`}`}
            />
            {!name && (
              <div
                className="tooltip tooltip-open tooltip-right tooltip-error"
                data-tip="Name is required"
              />
            )}
          </div>
          <div>
            <p>Your surname</p>
            <input
              type="text"
              defaultValue={surname}
              placeholder="Enter your surname"
              onChange={(e) => handleSetSurname(e.target.value)}
              className={`input ${!surname && `input-error`}`}
            />
            {!surname && (
              <div
                className="tooltip tooltip-open tooltip-right tooltip-error"
                data-tip="Surname is required"
              />
            )}
          </div>
          <div>
            <p>Your username</p>
            <input
              type="text"
              defaultValue={username}
              placeholder="Enter your username"
              onChange={(e) => handleSetUsername(e.target.value)}
              className={`input ${!username && `input-error`}`}
            />
            {!username && (
              <div
                className="tooltip tooltip-open tooltip-right tooltip-error"
                data-tip="Username is required"
              />
            )}
          </div>
          <div>
            <AsyncButton
              func={handleSaveSettings}
              isLoadingText="Saving"
              isNormalText="Save settings"
              className="btn btn-success"
            />
          </div>
        </div>
      )}
      {modal && (
        <ModalWindow>
          <div>
            Saved success
          </div>
        </ModalWindow>
      )}
    </div>
  );
}
