import React from "react";
import Particles from "react-tsparticles";
import "../ParticleBackground.css";

export default function ParticleBackground() {
  return (
    <Particles
      id="mainParticles"
      options={{
        background: {
          color: {
            value: "#ffffff",
          },
        },
        fpsLimit: 60,
        interactivity: {
          detectsOn: "canvas",
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              size: 40,
            },
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#b72aa9",
          },
          links: {
            color: "#b72aa9",
            distance: 150,
            enable: true,
            opacity: 0.4,
            width: 2,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outMode: "bounce",
            random: true,
            speed: 2,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              value_area: 800,
            },
            value: 40,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
        },
        size: {
          random: true,
          value: 8,
        },
        detectRetina: true,
      }}
    ></Particles>
  );
}
