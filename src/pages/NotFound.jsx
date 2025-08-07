import { Link } from "react-router";
import { FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-6">
      <div className="text-center max-w-lg">
        <h1 className="text-7xl font-bold text-error mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary flex items-center gap-2">
          <FaHome /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
