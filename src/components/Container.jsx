const Container = ({ children, className = "" }) => {
  // Use the SAME max width & side padding everywhere
  return (
    <div className={`mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};
export default Container;
