import React, { Component } from 'react';
import './Message.css';

class Message extends Component {

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

    this.text = ['a', 'a', 'b', 'c', 'd' ,'e', 'f', 'g', 'h']
    this.text_i = 0;

    let positions = this.getPositions(this.text[this.text_i])
    this.setPositions(this.particles, positions)

    this.drawToNewPositions()
  }

  startTransitionDraw() {
    this.drawTimer= setInterval(
      () => this.draw(),
      50
    );
  }

  stopTransitionDraw() {
    clearInterval(this.drawTimer);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle = "black";
    this.ctx.font = "60pt verdana";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "bottom";
    this.ctx.fillText(this.text[this.text_i%9], 30, 100);
    setTimeout(this.drawToNewPositions, 2000);
  }

  draw() {
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.globalAlpha = 1.0;
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.W, this.H)

    const particles = this.particles;
    this.still_drawing = false;
    for (let i = 0; i < particles.length; i++) {

      let p = particles[i];

      if (isNaN(p.x)) continue
      
      this.ctx.beginPath();
      this.ctx.fillStyle = "rgba(0, 0, 0, " + p.alpha + ")";
      this.ctx.arc(p.x, p.y, 1, Math.PI * 2, false);
      this.ctx.fill();

      p.x += (p.dx - p.x) / 5;
      p.y += (p.dy - p.y) / 5;

      if (p.dx - p.x > 1 && p.dy - p.y > 1){
        this.still_drawing = true;
      }
    }
    if(!this.still_drawing){
      this.stopTransitionDraw();
    }
  }

  getPositions(text) {
    const tcanvas = this.refs.tcanvas;
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
        particles[i].x = positions[i].x;
        particles[i].y = positions[i].y;
      }
    }
  }

  drawToNewPositions = () => {
    this.text_i = this.text_i + 1
    const text = this.text[this.text_i%9]
    let positions = this.getPositions(text)

    for (let i = 0; i < this.particles.length; i++) {
      if( i < positions.length){ 
        this.particles[i].dx = positions[i].x;
        this.particles[i].dy = positions[i].y;
      }
    }

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
      <div>
        <canvas ref="canvas" width="60" height="100"></canvas>
        <canvas ref="tcanvas" width="60" height="100"></canvas>
      </div>
    );
  }
}

export default Message;
