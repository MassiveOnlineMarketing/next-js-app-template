'use client';
import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";

const BackAndForwardButtons = () => {
  const router = useRouter();

  return (
    <div className="flex gap-2">
      <button onClick={() => router.back()} className="rounded-[4px] bg-p-50/40 dark:bg-dark-bg-light p-2">
        <ArrowUturnLeftIcon className="w-5 h-5 text-slate-800 dark:text-dark-text-dark"/>
      </button>
      <button onClick={() => router.forward()}>
        <ArrowUturnRightIcon className="w-5 h-5 text-slate-500 dark:text-dark-text-dark"/>
      </button>
    </div>
  );
};

export default BackAndForwardButtons;