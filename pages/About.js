import React from "react";
import "../components/About.css";
import pangolin from "../assets/images/pangolin.jpg";
/**
 * @author Amol Dhaliwal
 * Content for About page providing context on application
 */
const About = () => {
  return (
    <div className="aboutwrapper">
      <section className="about">
        <div className="row">
          <div className="col50">
            <h2 className="titleText">About Zap</h2>
            <p>
              These solitary, primarily nocturnal animals, are easily recognized
              by their full armor of scales. A startled pangolin will cover its
              head with its front legs, exposing its scales to any potential
              predator. If touched or grabbed it will roll up completely into a
              ball, while the sharp scales on the tail can be used to lash out.
              Also called scaly anteaters because of their preferred diet,
              pangolins are the most trafficked mammal in the world—with demand
              primarily in Asia and in growing amounts in Africa—for their meat
              and scales. There is also demand in the United States for pangolin
              products, particularly for their leather to be used in boots,
              bags, and belts. Eight species of pangolins are found on two
              continents. They range from Vulnerable to Critically Endangered.
              Four species live in Africa: Black-bellied pangolin (Phataginus
              tetradactyla), White-bellied pangolin (Phataginus tricuspis),
              Giant Ground pangolin (Smutsia gigantea) and Temminck's Ground
              pangolin (Smutsia temminckii). All eight pangolin species are
              protected under national and international laws, and two are
              listed as Critically Endangered on the IUCN Red List of Threatened
              Species. <br /> <br /> Zapp allows for game rangers and local
              communities across Southern Africa to log pangolin sightings and
              mortalities, enabling several research teams to study these
              threats and help Pangolins fight against extinction.
            </p>
          </div>
          <div className="col50">
            <div className="imgBx">
              <img src={pangolin} alt="img of pangolin" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
