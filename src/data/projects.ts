export type EngineeringImage = {
  src: string;
  alt: string;
  label: string;
  kind?: "Project image" | "Result figure" | "System diagram";
  caption?: string;
  metadata?: string[];
  aspect?: "landscape" | "wide" | "portrait" | "square" | "natural";
  fit?: "contain" | "cover";
  width?: number;
  height?: number;
};

export type ProjectSection = {
  id: string;
  title: string;
  text: string;
  images: EngineeringImage[];
  layout?: "full" | "grid";
};

export type Project = {
  slug: string;
  number: string;
  category: string;
  title: string;
  description: string;
  focus: string;
  technologies: string[];
  heroImage: EngineeringImage;
  overview: string;
  sections: ProjectSection[];
};

export const projects: Project[] = [
  {
    slug: "navigation", number: "01", category: "Positioning & perception",
    title: "Multi-Sensor Navigation System",
    description: "LiDAR, GNSS, and embedded computing for localization and mapping when satellite navigation is unreliable.",
    focus: "GPS-denied navigation",
    technologies: ["LiDAR", "GNSS", "Sensor fusion", "Jetson"],
    heroImage: {
      src: "/images/navigation/lidar-hardware.jpg", alt: "VLP-16 LiDAR hardware and navigation platform",
      label: "VLP-16 hardware", kind: "Project image", aspect: "landscape",
      caption: "Hardware platform · LiDAR sensing and embedded compute", metadata: ["VLP-16", "Hardware integration"],
    },
    overview: "My interest in navigation starts with a practical question: how can a system understand where it is when GPS is weak or unavailable? This work brings together LiDAR hardware, point-cloud processing, and embedded computing to explore that question on a physical platform.",
    sections: [
      { id: "perception", title: "LiDAR point clouds", text: "The perception side of the project focuses on handling LiDAR data and examining the geometry it captures. The figure below is reserved for an actual point-cloud capture, with its processing settings and test conditions documented alongside it.", images: [
        { src: "/images/navigation/point-cloud.png", alt: "3D LiDAR point cloud generated from VLP-16 data", label: "LiDAR point cloud", kind: "Result figure", aspect: "wide", caption: "Point-cloud visualization · Add capture conditions and filtering parameters with the real figure." },
      ] },
      { id: "architecture", title: "System architecture", text: "The architecture view connects sensing, data processing, and localization. It is a place to document the actual interfaces, coordinate frames, timing assumptions, and data flow as the system develops.", images: [
        { src: "/images/navigation/system-architecture.png", alt: "Navigation system architecture and sensor interfaces", label: "System architecture", kind: "System diagram", aspect: "wide" },
      ] },
      { id: "implementation", title: "Hardware integration", text: "Hardware integration makes the assumptions in a navigation pipeline tangible: power, connectivity, sensor mounting, and compute all matter. These views document the LiDAR and GNSS/SDR sides of the platform.", layout: "grid", images: [
        { src: "/images/navigation/lidar-hardware.jpg", alt: "LiDAR sensor mounting and hardware connections", label: "LiDAR hardware", aspect: "landscape" },
        { src: "/images/navigation/gnss-hardware.jpg", alt: "GNSS and SDR hardware integration", label: "GNSS / SDR hardware", aspect: "landscape" },
      ] },
      { id: "results", title: "Navigation results", text: "Trajectory, positioning, and mapping figures belong together so that the behavior of the complete system can be examined. Experimental figures and quantitative results will be added here when available; no measured performance is claimed by these placeholders.", images: [
        { src: "/images/navigation/trajectory.png", alt: "Estimated navigation trajectory from a recorded test", label: "Navigation trajectory", kind: "Result figure", aspect: "wide" },
      ] },
      { id: "validation", title: "Positioning & mapping evidence", text: "Supporting figures will record the positioning output and map from the same test, with reference data and test conditions where available.", layout: "grid", images: [
        { src: "/images/navigation/gnss-result.png", alt: "GNSS positioning output", label: "GNSS result", kind: "Result figure" },
        { src: "/images/navigation/mapping-result.png", alt: "Mapping output from the LiDAR platform", label: "Mapping result", kind: "Result figure" },
      ] },
    ],
  },
  {
    slug: "gps-sdr", number: "02", category: "Signals & software-defined radio",
    title: "Software-Defined GPS Receiver",
    description: "Software-defined GPS L1 receiver work covering signal acquisition, tracking, and position estimation.",
    focus: "The GNSS signal chain", technologies: ["RTL-SDR", "GPS L1", "DSP", "Python"],
    heroImage: { src: "/images/gps-sdr/rtl-sdr-setup.jpg", alt: "RTL-SDR receiver and active GNSS antenna setup", label: "RTL-SDR receiver setup", aspect: "landscape", caption: "Receiver hardware · RTL-SDR and active GNSS antenna", metadata: ["GPS L1", "Software-defined radio"] },
    overview: "A software-defined receiver makes the signal-processing stages behind satellite positioning visible. This project is organized around the receiver hardware and the acquisition, tracking, and position, velocity, and time (PVT) outputs that explain how the signal becomes a navigation solution.",
    sections: [
      { id: "signal-processing", title: "Acquisition & tracking", text: "Acquisition searches for satellite signals in code phase and Doppler. Tracking follows the acquired signals over time. These two figures are intended to document the actual receiver output, together with capture settings and the satellites being tracked.", layout: "grid", images: [
        { src: "/images/gps-sdr/acquisition.png", alt: "GPS L1 acquisition correlation plot", label: "GPS acquisition", kind: "Result figure", caption: "Acquisition · Record code phase, Doppler range, and integration settings." },
        { src: "/images/gps-sdr/tracking.png", alt: "GPS satellite tracking output", label: "Satellite tracking", kind: "Result figure", caption: "Tracking · Record channel, time interval, and loop settings." },
      ] },
      { id: "position", title: "Position, velocity & time", text: "The PVT view is reserved for the receiver’s position solution. A useful result includes the reference location, observation interval, and the conditions of the recording. Measured plots and accuracy estimates have not yet been supplied.", images: [
        { src: "/images/gps-sdr/pvt-results.png", alt: "GPS receiver position velocity and time results", label: "PVT / position solution", kind: "Result figure", aspect: "wide" },
      ] },
    ],
  },
  {
    slug: "uav", number: "03", category: "Autonomy & embedded systems",
    title: "Autonomous Aerial Systems",
    description: "Aircraft hardware, embedded compute, and simulation for autonomous aerial systems.",
    focus: "Autonomous platforms", technologies: ["UAV", "Jetson", "Gazebo", "Embedded systems"],
    heroImage: { src: "/images/uav/quadcopter.jpg", alt: "Quadcopter autonomous aerial platform", label: "Autonomous aircraft", aspect: "wide", caption: "Aerial platform · Airframe and onboard systems", metadata: ["UAV", "Platform integration"] },
    overview: "Autonomy is a system-level problem. The airframe, sensors, embedded computer, and software all have to work together. This project documents those connections through hardware photography, integration details, and simulation and flight-test evidence as it becomes available.",
    sections: [
      { id: "platforms", title: "Aircraft platforms", text: "Platform photographs give context to the engineering decisions: sensor placement, payload, wiring, and the physical constraints of the aircraft. Both multirotor and fixed-wing views can be documented here.", layout: "grid", images: [
        { src: "/images/uav/quadcopter.jpg", alt: "Quadcopter airframe and electronics", label: "Quadcopter", aspect: "landscape" },
        { src: "/images/uav/fixed-wing.jpg", alt: "Fixed-wing UAV platform", label: "Fixed-wing UAV", aspect: "landscape" },
      ] },
      { id: "integration", title: "Onboard compute", text: "The integration view focuses on the onboard computer and its physical connections. Documenting the power arrangement, interfaces, mounting, and cooling makes the hardware work understandable beyond a parts list.", images: [
        { src: "/images/uav/jetson-integration.jpg", alt: "Jetson embedded computer integrated with the aircraft", label: "Jetson integration", aspect: "wide" },
      ] },
      { id: "testing", title: "Simulation to field testing", text: "Simulation and field documentation provide complementary views of the system. These spaces are reserved for actual Gazebo screenshots and flight-test photography; test outcomes and operating conditions should accompany the media when added.", layout: "grid", images: [
        { src: "/images/uav/gazebo-simulation.png", alt: "UAV model in Gazebo simulation", label: "Gazebo simulation", kind: "Result figure" },
        { src: "/images/uav/flight-test.jpg", alt: "Aircraft during a field flight test", label: "Flight test", aspect: "landscape" },
      ] },
    ],
  },
  {
    slug: "wilkinson", number: "04", category: "RF & hardware design",
    title: "Wilkinson GPS Splitter",
    description: "RF splitter and filter design for GPS bands, including circuit concepts, PCB layout, and frequency-response characterization.",
    focus: "RF signal distribution", technologies: ["RF", "GPS L1 / L2 / L5", "KiCad", "LTspice"],
    heroImage: { src: "/images/wilkinson/pcb.jpg", alt: "Wilkinson GPS splitter printed circuit board", label: "GPS splitter PCB", aspect: "landscape", caption: "RF hardware · Wilkinson power splitter", metadata: ["RF design", "PCB prototype"] },
    overview: "Distributing a GNSS signal to multiple receivers creates a concrete RF design problem. This work explores Wilkinson splitter and filter concepts for GPS L1, L2, and L5, with attention to frequency response, insertion loss, and port isolation.",
    sections: [
      { id: "design", title: "Schematic & PCB layout", text: "The schematic communicates the circuit topology; the board layout shows how that topology is realized physically. Together, they make transmission-line geometry, component choices, and connector interfaces available for review.", layout: "grid", images: [
        { src: "/images/wilkinson/schematic.png", alt: "Wilkinson GPS splitter circuit schematic", label: "Circuit schematic", kind: "System diagram" },
        { src: "/images/wilkinson/pcb-layout.png", alt: "GPS splitter PCB routing and layout", label: "PCB layout", kind: "System diagram" },
      ] },
      { id: "characterization", title: "S-parameters", text: "S-parameter plots provide a way to examine transmission, reflection, and isolation across frequency. Add measured or simulated traces here with their source clearly identified, including port definitions and test or simulation conditions. No performance values are assumed.", images: [
        { src: "/images/wilkinson/sparameters.png", alt: "GPS splitter S-parameters across frequency", label: "S-parameter response", kind: "Result figure", aspect: "wide", caption: "Frequency response · Label measurement or simulation source when adding the plot." },
      ] },
    ],
  },
];
