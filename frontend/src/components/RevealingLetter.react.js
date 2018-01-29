import React, { Component } from 'react';
import './RevealingLetter.css'

class RevealingLetter extends Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.canvas = this.refs.canvas
    this.ctx = this.canvas.getContext("2d")
    this.W = this.canvas.width;
    this.H = this.canvas.height;

    const total_particles = 500;
    this.particles = [];
    for (let i = 1; i <= total_particles; i++) {
        this.particles.push(new particle());
    }

    function particle() {
      this.alpha = 1;
    }

    this.originalLetter = this.props.originalLetter;
    this.scrambledLetter = this.props.scrambledLetter;

    let positions = this.getPositions(this.scrambledLetter)
    this.setPositions(this.particles, positions)

    this.displayText(this.scrambledLetter);
    if(this.originalLetter != this.scrambledLetter){
      setTimeout(this.drawToNewPositions, 2000);
    }
  }

  startTransitionDraw() {
    this.drawTimer= setInterval(
      () => this.draw(),
      30
    );
  }

  stopTransitionDraw() {
    clearInterval(this.drawTimer);
    this.displayText(this.originalLetter);
    //setTimeout(this.drawToNewPositions, 2000);
  }

  displayText(text) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle = "black";
    this.ctx.font = "60pt verdana";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "bottom";
    this.ctx.fillText(text, 30, 100);
  }

  draw() {
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.globalAlpha = 1.0;
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.W, this.H)

    const particles = this.particles;
    this.still_drawing = true;
    for (let i = 0; i < particles.length; i++) {

      let p = particles[i];

      p.x += ((p.target_x - p.orig_x) / 20);
      p.y += ((p.target_y - p.orig_y) / 20);
      if (isNaN(p.x)) continue
      
      this.ctx.beginPath();
      this.ctx.fillStyle = "rgba(0, 0, 0, " + p.alpha + ")";
      this.ctx.arc(p.x, p.y, 1, Math.PI * 2, false);
      this.ctx.fill();

    }
    this.transition_draw_step = this.transition_draw_step + 1;
    if(this.transition_draw_step >= 20){
      for (let i = 0; i < particles.length; i++){
        particles[i].orig_x = particles[i].target_x;
        particles[i].orig_y = particles[i].target_y;

      }
      this.stopTransitionDraw();
    }
  }

  getPositions(text) {
    const tcanvas = document.createElement("canvas");
    const tctx = tcanvas.getContext("2d");
    tcanvas.width = this.W;
    tcanvas.height = this.H;

    tctx.fillStyle = "white";
    tctx.fillRect(0, 0, this.W, this.H)

    tctx.fillStyle = "black";
    tctx.font = "60pt verdana";
    tctx.textAlign = "center";
    tctx.textBaseline = "bottom";
    tctx.fillText(text, 30, 100);

    const image_data = tctx.getImageData(0, 0, this.W, this.H);
    const pixels = image_data.data;
    let positions = [];
    for (let i = 0; i < pixels.length; i = i + 4) {
      if (pixels[i] != 255) {
        let position = {
          x: (i / 4 % this.W),
          y: (i / 4 / this.W)
        }
        positions.push(position);
      }
    }
    this.shuffle(positions);
    return positions;
  }

  setPositions(particles, positions) {
    for (let i = 0; i < particles.length; i++) {
      if( i < positions.length){ 
        particles[i].orig_x = positions[i].x;
        particles[i].orig_y = positions[i].y;
        particles[i].x = positions[i].x;
        particles[i].y = positions[i].y;
      }
    }
  }

  drawToNewPositions = () => {
    const text = this.originalLetter;
    let positions = this.getPositions(text)

    for (let i = 0; i < this.particles.length; i++) {
      if( i < positions.length){ 
        this.particles[i].target_x = positions[i].x;
        this.particles[i].target_y = positions[i].y;
      }
    }

    this.transition_draw_step = 0;
    this.startTransitionDraw()
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
  }

  render () {
    return (
      <canvas ref="canvas" width="60" height="100"></canvas>
    );
  }
}

export default RevealingLetter;
