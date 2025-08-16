const SectionHeading = ({ title, subtitle }) => (
  <div className="mb-6 md:mb-8">
    <h2 className="text-center text-2xl md:text-3xl font-bold">{title}</h2>
    {subtitle && <p className="text-center text-base-content/70 mt-1">{subtitle}</p>}
  </div>
);
export default SectionHeading;
