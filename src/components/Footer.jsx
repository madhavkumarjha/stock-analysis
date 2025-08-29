import React, { useState, useEffect } from "react";

function Footer() {
  const [openModal, setOpenModal] = useState(null); // "privacy" | "terms" | null

  const handleOpen = (type) => setOpenModal(type);
  const handleClose = () => setOpenModal(null);

  // Auto close modal after 5 seconds
  useEffect(() => {
    if (openModal) {
      const timer = setTimeout(() => {
        setOpenModal(null);
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [openModal]);

  return (
    <footer className="text-sm text-gray-500 py-6 border-t mt-8 text-center">
       <p>© {new Date().getFullYear()} Stock Analysis App. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <span
          onClick={() => handleOpen("privacy")}
          className=" hover:underline cursor-pointer"
        >
          Privacy Policy
        </span>
        <span
          onClick={() => handleOpen("terms")}
          className=" hover:underline cursor-pointer"
        >
          Terms & Conditions
        </span>
      </div>

      {/* Modal */}
      {openModal && (
        <div
          className="fixed inset-0 flex items-center justify-center  z-50"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
            onClick={(e) => e.stopPropagation()} // prevent close on inner click
          >
            <button
              onClick={handleClose}
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
            >
              &times;
            </button>
            {openModal === "privacy" && (
              <>
                <h2 className="text-lg font-semibold mb-4">Privacy Policy</h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We value your privacy. This app does not store personal data
                  or share information with third parties. Any data displayed is
                  fetched from public APIs and used for educational purposes
                  only.
                </p>
              </>
            )}
            {openModal === "terms" && (
              <>
                <h2 className="text-lg font-semibold mb-4">
                  Terms & Conditions
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  This application is intended for educational use only and
                  should not be considered financial advice. By using this app,
                  you agree that we are not responsible for any financial
                  decisions made based on the displayed data.
                </p>
              </>
            )}
            <p className="text-xs text-gray-400 mt-4">
              (This modal will auto-close in 5 seconds)
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
