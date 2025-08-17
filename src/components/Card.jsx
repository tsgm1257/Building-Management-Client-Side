const Card = ({ image, title, children, footer }) => {
  return (
    <div
      className={[
        "group rounded-xl bg-base-100 border border-base-200 overflow-hidden flex flex-col shadow",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-lg hover:border-base-300",
        "focus-within:-translate-y-1 focus-within:shadow-lg", // keyboard-accessible
      ].join(" ")}
    >
      {image && (
        <img
          src={image}
          alt={title || "Card image"}
          className="w-full h-44 md:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="p-4 flex-1">
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        <div className="text-sm text-base-content/80">{children}</div>
      </div>
      {footer && <div className="p-4 pt-0">{footer}</div>}
    </div>
  );
};
export default Card;
