// src/pages/Home.jsx
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
import Reveal from "../components/Reveal";

const Home = () => (
  <main>
    <Reveal delay={0}>
      <Banner />
    </Reveal>

    <Reveal delay={100}>
      <AboutBuilding />
    </Reveal>

    <Reveal delay={150}>
      <FeaturedApartments />
    </Reveal>

    <Reveal delay={200}>
      <RecentApartments />
    </Reveal>

    <Reveal delay={250}>
      <Amenities />
    </Reveal>

    <Reveal delay={300}>
      <AnnouncementsStrip />
    </Reveal>

    <Reveal delay={350}>
      <Reviews />
    </Reveal>

    <Reveal delay={400}>
      <Newsletter />
    </Reveal>

    <Reveal delay={450}>
      <Stats />
    </Reveal>

    <Reveal delay={500}>
      <CallToAction />
    </Reveal>

    <Reveal delay={550}>
      <FAQ />
    </Reveal>

    <Reveal delay={600}>
      <Coupons />
    </Reveal>

    <Reveal delay={650}>
      <Location />
    </Reveal>
  </main>
);

export default Home;
