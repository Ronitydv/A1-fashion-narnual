import React from 'react';
import { X } from 'lucide-react';
import { SignIn } from '@clerk/clerk-react';

export default function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade">
      <div className="modal-card animate-slide-up" style={{ maxWidth: '480px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Close Button */}
        <button className="close-modal-btn" onClick={onClose} style={{ zIndex: 10 }}>
          <X size={20} />
        </button>

        {/* Clerk Sign In component */}
        <SignIn 
          routing="hash"
        />

        <style>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(37, 61, 83, 0.6);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1500;
            padding: 15px;
          }

          .modal-card {
            background-color: var(--color-bg-white);
            border-radius: var(--border-radius-lg);
            width: 100%;
            box-shadow: var(--shadow-lg);
            position: relative;
            border: 1px solid var(--color-border);
          }

          .close-modal-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            color: var(--color-body);
            transition: var(--transition-fast);
            padding: 5px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.8);
            border: 1px solid #ddd;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .close-modal-btn:hover {
            background-color: var(--color-bg-light);
            color: var(--color-primary);
          }
        `}</style>
      </div>
    </div>
  );
}
