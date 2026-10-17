import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";

const ShadowComponent = ({ children }) => {
  const hostRef = useRef(null);
  const [shadowRoot, setShadowRoot] = useState(null);

  useEffect(() => {
    if (hostRef.current && !shadowRoot) {
      const shadow = hostRef.current.attachShadow({ mode: "open" });
      setShadowRoot(shadow);
    }
  }, [shadowRoot]);

  return (
      <div ref={hostRef}>
        {shadowRoot ? ReactDOM.createPortal(children, shadowRoot) : null}
      </div>
  );
};

export default ShadowComponent;
