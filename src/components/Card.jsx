const Card = ({ image, title, children, footer }) => {
  return (
    <div className="rounded-xl shadow bg-base-100 border border-base-200 overflow-hidden flex flex-col">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-44 md:h-52 object-cover"
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
