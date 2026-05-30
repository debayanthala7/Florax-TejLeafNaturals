import React from "react";

export const Section = ({ overline, title, children, align = "left", className = "" }) => (
  <div className={`max-w-7xl mx-auto px-6 lg:px-10 ${className}`}>
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {overline && <p className="overline text-florax-muted mb-4">{overline}</p>}
      {title && (
        <h2 className="font-editorial text-4xl sm:text-5xl text-florax-primary tracking-tight leading-[1.05]">
          {title}
        </h2>
      )}
    </div>
    {children}
  </div>
);
