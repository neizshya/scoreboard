import { XMarkIcon } from "@heroicons/react/16/solid";

export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded p-6 max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black focus:outline-none">
          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
        </button>
        {children}
      </div>
    </div>
  );
}
