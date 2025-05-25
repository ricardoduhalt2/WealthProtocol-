import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

type PurchaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  inscriptionId: string;
  title: string;
  price: string;
  sellerAddress: string;
};

// Add this type for the window.unisat object
declare global {
  interface Window {
    unisat?: {
      requestAccounts: () => Promise<string[]>;
      sendBitcoin: (toAddress: string, amount: number) => Promise<string>;
    };
  }
}

export default function PurchaseModal({
  isOpen,
  onClose,
  inscriptionId,
  title,
  price,
  sellerAddress,
}: PurchaseModalProps) {
  type PurchaseStep = 'details' | 'confirm' | 'processing' | 'complete' | 'error' | 'install-wallet';
  const [step, setStep] = useState<PurchaseStep>('details');
  const [error, setError] = useState('');

  const handlePurchase = async () => {
    try {
      setStep('processing');
      
      // Check if Unisat wallet is installed
      if (typeof window.unisat === 'undefined') {
        setStep('install-wallet');
        return;
      }

      // Request account access
      const accounts = await window.unisat.requestAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.');
      }

      // In a real app, you would:
      // 1. Get the payment address from your API
      // 2. Calculate the exact amount (price + network fees)
      // 3. Send the transaction
      
      // For demo purposes, we'll just show success after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log the purchase details
      console.log('Purchase details:', {
        inscriptionId,
        title,
        price,
        sellerAddress,
        buyerAddress: accounts[0]
      });
      
      setStep('complete');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process purchase. Please try again.';
      setError(errorMessage);
      setStep('error');
      console.error('Purchase error:', err);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // Reset modal state when closed
      setStep('details');
      setError('');
    }
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">
                  {step === 'details' && 'Purchase Details'}
                  {step === 'confirm' && 'Confirm Purchase'}
                  {step === 'processing' && 'Processing...'}
                  {step === 'complete' && 'Purchase Complete!'}
                  {step === 'error' && 'Error'}
                </Dialog.Title>

                <div className="mt-4">
                  {step === 'details' && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-300">
                        You're about to purchase <span className="font-medium text-white">{title}</span>
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Price:</span>
                          <span className="text-sm font-medium text-white">{price} BTC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Seller:</span>
                          <span className="text-sm text-purple-300 truncate max-w-[200px]">
                            {sellerAddress}
                          </span>
                        </div>
                      </div>
                      <div className="pt-4">
                        <p className="text-xs text-gray-400 mb-2">
                          By clicking "Continue", you'll be prompted to confirm the transaction in your wallet.
                        </p>
                        <div className="flex space-x-3 mt-4">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                            onClick={onClose}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                            onClick={() => setStep('confirm')}
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 'confirm' && (
                    <div className="space-y-6">
                      <div className="bg-slate-700 p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-300">Item</span>
                          <span className="text-sm text-white">{title}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-300">Price</span>
                          <span className="text-sm text-white">{price} BTC</span>
                        </div>
                        <div className="border-t border-slate-600 my-3"></div>
                        <div className="flex justify-between font-medium">
                          <span className="text-sm text-white">Total</span>
                          <span className="text-sm text-white">{price} BTC</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400 space-y-2">
                        <p>• By completing this purchase, you agree to our Terms of Service.</p>
                        <p>• The transaction will be processed on the Bitcoin blockchain.</p>
                      </div>

                      <div className="flex space-x-3 mt-6">
                        <button
                          type="button"
                          className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          onClick={() => setStep('details')}
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          onClick={handlePurchase}
                        >
                          {step === 'install-wallet' ? 'I\'ve installed Unisat' : 'Confirm Purchase'}
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 'processing' && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                      <p className="text-white">Processing your transaction...</p>
                      <p className="text-sm text-gray-400 mt-2">Please confirm the transaction in your wallet</p>
                    </div>
                  )}

                  {step === 'complete' && (
                    <div className="text-center py-8">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">Purchase Complete!</h3>
                      <p className="text-sm text-gray-300 mb-6">
                        Your purchase of {title} has been successfully processed.
                      </p>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={onClose}
                      >
                        Close
                      </button>
                    </div>
                  )}

                  {step === 'error' && (
                    <div className="text-center py-8">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">Error</h3>
                      <p className="text-sm text-gray-300 mb-6">
                        {error || 'An error occurred while processing your purchase.'}
                      </p>
                      <div className="flex space-x-3 justify-center">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          onClick={() => setStep('details')}
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {step === 'install-wallet' && (
                    <div className="text-center py-8">
                      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-900/20 mb-4">
                        <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">Unisat Wallet Required</h3>
                      <p className="text-sm text-gray-300 mb-6">
                        To purchase this NFT, you'll need to install the Unisat wallet extension for your browser.
                      </p>
                      <div className="mb-6">
                        <a 
                          href="https://unisat.io/download" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                          </svg>
                          Download Unisat Wallet
                        </a>
                      </div>
                      <div className="text-xs text-gray-500">
                        After installing, refresh this page and connect your wallet to continue.
                      </div>
                      <div className="mt-6 pt-6 border-t border-gray-700">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
