import Banner from "../components/Banner";
import AboutBuilding from "../components/AboutBuilding";
import FeaturedApartments from "../components/home/FeaturedApartments";
import RecentApartments from "../components/home/RecentApartments";
import Amenities from "../components/home/Amenities";
import AnnouncementsStrip from "../components/home/AnnouncementsStrip";
import Reviews from "../components/home/Reviews";
import Newsletter from "../components/home/Newsletter";
import Stats from "../components/home/Stats";
import CallToAction from "../components/home/CallToAction";
import FAQ from "../components/home/FAQ";
import Location from "../components/Location";
import Coupons from "../components/Coupons";

const Home = () => (
  <section>
    <Banner />
    <AboutBuilding />
    <FeaturedApartments />
    <RecentApartments />
    <Amenities />
    <AnnouncementsStrip />
    <Reviews />
    <Newsletter />
    <Stats />
    <CallToAction />
    <FAQ />
    <Coupons />
    <Location />
  </section>
);

export default Home;
