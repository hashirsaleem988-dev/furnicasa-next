import { createContext, useContext, useState } from "react";

const InquiryContext = createContext(null);

function getInquiryKey(item) {
  return item.id || item.nameKey || item.nameEn;
}

export function InquiryProvider({ children }) {
  const [inquiryItems, setInquiryItems] = useState([]);

  function addToInquiry(product) {
    setInquiryItems((current) => {
      const productKey = getInquiryKey(product);
      const existing = current.find((item) => getInquiryKey(item) === productKey);

      if (existing) {
        return current.map((item) =>
          getInquiryKey(item) === productKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  }

  function removeFromInquiry(itemKey) {
    setInquiryItems((current) =>
      current.filter((item) => getInquiryKey(item) !== itemKey)
    );
  }

  function changeQuantity(itemKey, amount) {
    setInquiryItems((current) =>
      current
        .map((item) =>
          getInquiryKey(item) === itemKey
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const inquiryCount = inquiryItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const inquiryTotal = inquiryItems.reduce(
    (total, item) => total + item.priceValue * item.quantity,
    0
  );

  return (
    <InquiryContext.Provider
      value={{
        inquiryItems,
        inquiryCount,
        inquiryTotal,
        addToInquiry,
        removeFromInquiry,
        changeQuantity,
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  const context = useContext(InquiryContext);

  if (!context) {
    throw new Error("useInquiry must be used inside InquiryProvider");
  }

  return context;
}
