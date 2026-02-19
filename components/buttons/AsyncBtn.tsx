import { useState } from "react";

type Props<TResult = void> = {
  isLoadingText: string;
  isNormalText: string;
  className: string;
  func: () => Promise<TResult>;
};

export default function AsyncButton<TResult = void>({
  func,
  isLoadingText,
  isNormalText,
  className,
}: Props<TResult>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const handleClick = async () => {
    setIsLoading(true);
    try {
      await func();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <button
      className={className}
      disabled={isLoading}
      onClick={handleClick}
    >
      {isLoading && <span className="loading loading-spinner"/>}
      {isLoading ? isLoadingText : isNormalText}
    </button>
  );
}
