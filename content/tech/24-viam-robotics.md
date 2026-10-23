---
id: viam-robotics
title: Viam Robotics
summary: Coded robot arms that hand blocks to each other, and taught high schoolers to build Viam robots. # DRAFT — rewrite
year: "2026"
medium: Robotics, Python, Raspberry Pi, Viam
category: project
photo: https://img.antoni.us/viam/viam-hero.gif
thumbnail: https://img.antoni.us/highlights/robot-arms-landscape-v2-poster-1920.png
hero: https://img.antoni.us/highlights/robot-arms-landscape-v2-poster-1920.png
previewVideo: https://img.antoni.us/highlights/robot-arms-landscape-v2.mp4
heroVideo: https://img.antoni.us/highlights/robot-arms-landscape-v2.mp4
list-title: Highlights
list:
  - Worked with Viam to teach NYC FIRST high school students to make products for senior citizens
  - Five student products, including a water reminder, a message board for remembering keys, and a fall detector
  - Redid the class slides so we could teach it better
  - Made a robot that could squeeze out ketchup at Viam open hours
  - Make Them Kiss, two robot arms that move and hand blocks to each other, run from a Stream Deck
gallery:
  - thumb: https://img.antoni.us/viam/viam-03-thumb.png
    full: https://img.antoni.us/viam/viam-03-full.png
    caption: Stream Deck scenes run on a Python server that controls the arms through the Viam SDK.
  - thumb: https://img.antoni.us/viam/viam-04-thumb.png
    full: https://img.antoni.us/viam/viam-04-full.png
    caption: Scene 6 on the Stream Deck runs the robot-arm kiss sequence.
  - thumb: https://img.antoni.us/viam/viam-02-full.jpg
    full: https://img.antoni.us/viam/viam-02-full.jpg
    caption: Block handover
links:
  - label: GitHub
    url: https://github.com/theantonius/make-them-kiss
  - label: Watch demo
    url: https://youtu.be/sIzc23cfVqo
  - label: Build story
    url: https://www.hackster.io/antonius-wiriadjaja/make-them-kiss-two-robot-arms-a-stream-deck-and-viam-e8b867
---

In spring 2026 we worked with <a target="_blank" rel="noopener" href="https://www.viam.com">Viam</a> to teach NYC FIRST high school students to make products for senior citizens. Michael Lee from Viam taught the class, Shannon, the SVP of Product and Education at Viam, taught Python, and Nick helped people fix their Pis. Ian, an engineer at Viam, was our main contact for doing the semester long curriculum.

There were five products: one that helped remind them to drink water, one that helped them remember their keys as a message board, and one that would detect if they were falling. There were two others that didn't quite make it to the finish line.

To learn it myself, I converted a standalone Python script (potentiometer + PWM LED on a Raspberry Pi 4) into a Viam inline module. I redid their slides so we could teach it better: <a target="_blank" rel="noopener" href="https://docs.google.com/presentation/d/1xHEEp5IBeYdq9FMTQVpUIoS15hxl6-Eg7oWj9IPYUAM/edit?usp=sharing">Ultrasonic Sensor & LED Display</a> and <a target="_blank" rel="noopener" href="https://docs.google.com/presentation/d/1sifDcC04yIni2IKJrinHNEEQapPI0W1zW8YBz2UMRjw/edit?usp=sharing">Potentiometer and LED PWM</a>. Chelsy helped me redo the ultrasonic slides.

I stayed connected, so I went to their open hours on Fridays in October and made a robot that could squeeze out ketchup. Then they invited NYC FIRST to come and test it out again, and I made two robot arms that could move and hand blocks to each other.

I called it Make Them Kiss. I pressed the Stream Deck. I was originally planning on making them dance, but then a coworker said "make them kiss" and asked for the Lady and the Tramp scene, with robot arms. One Python server connects to both arms (armfarm 8, an xArm6, and armfarm 14, an xArm850) and keeps the connections open. Each Stream Deck key runs one scene. It went well.

The hardest part was getting two robot arms to move together. I still didn't manage to get them to match their speed because they were different models.
