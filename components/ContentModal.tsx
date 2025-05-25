
import React from 'react';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  iframeSrc?: string;   // Source URL for the iframe
}

const ContentModal: React.FC<ContentModalProps> = ({ isOpen, onClose, title, iframeSrc }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[1000] p-4 transition-opacity duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose} // Close modal on backdrop click
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl flex flex-col w-full max-w-[640px] h-[90vh] overflow-hidden border border-slate-700 transform transition-all duration-300 ease-in-out scale-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-slate-800/50">
          <h2 id="modal-title" className="text-xl font-semibold text-slate-100 truncate pr-4">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-pink-500 p-1.5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto bg-slate-900">
          {iframeSrc ? (
            <iframe
              src={iframeSrc}
              title={title}
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"
            />
          ) : (
            <div className="p-8 text-center text-slate-400 flex items-center justify-center h-full">
              Content not available or source URL not provided.
            </div>
          )}
        </div>
         <div className="p-3 border-t border-slate-700 bg-slate-800/50 text-right">
            <button
                onClick={onClose}
                className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;
