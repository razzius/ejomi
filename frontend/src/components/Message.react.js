import React, { Component } from 'react';
import './Message.css';

class Message extends Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    const canvas = this.refs.canvas
    this.ctx = canvas.getContext("2d")
    this.W = canvas.width;
    this.H = canvas.height;

    this.ctx.fillText(this.props.text, 210, 75)

    const total_area = this.W * this.H;
    const total_particles = 500;
    const single_particle_area = total_area / total_particles;
    const area_length = Math.sqrt(single_particle_area);

    this.particles = [];
    for (let i = 1; i <= total_particles; i++) {
        this.particles.push(new particle(i, this.W, this.H));
    }

    function particle(i, W, H) {
      this.r = Math.round(Math.random() * 255|0);
      this.g = Math.round(Math.random() * 255|0);
      this.b = Math.round(Math.random() * 255|0);
      this.alpha = 1;

      this.x = (i * area_length) % W;
      this.y = (i * area_length) / W * area_length;

      this.deltaOffset = 0;

      this.radius = 0.1 + Math.random() * 2;
    }

    this.text = ['a', 'a', 'b', 'c', 'd' ,'e', 'f', 'g', 'h']
    this.text_i = 0;
    this.new_positions()

    this.drawTimer= setInterval(
      () => this.draw(),
      60
    );

    this.changeTextTimer = setInterval(
      () => this.new_positions(),
      3000
    )
  }

  draw() {
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.globalAlpha = 1.0;
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.W, this.H)

    const particles = this.particles;
    for (let i = 0; i < particles.length; i++) {

      let p = particles[i];

      if (isNaN(p.x)) continue
      
      this.ctx.beginPath();
      this.ctx.fillStyle = "rgb(" + p.r + ", " + p.g + ", " + p.b + ")";
      this.ctx.fillStyle = "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.alpha + ")";
      let mod = 1;
      let offset = 0;
      var radius = 6 * p.radius;

      this.ctx.arc(offset + p.x, offset + p.y, 1, Math.PI * 2, false);
      this.ctx.fill();

      p.x += (p.dx - p.x) / 10;
      p.y += (p.dy - p.y) / 10;
    }
  }

  new_positions() {

    let text = this.text[this.text_i%9]
    this.text_i = this.text_i + 1

    const tcanvas = this.refs.tcanvas;
    const tctx = tcanvas.getContext("2d");
    tcanvas.width = this.W;
    tcanvas.height = this.H;

    tctx.fillStyle = "white";
    tctx.fillRect(0, 0, this.W, this.H)

    tctx.fillStyle = "black";
    tctx.font = "60pt verdana";
    tctx.fillText(text, 10, 60);

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

    console.log(positions)

    this.shuffle(positions);

    for (let i = 0; i < this.particles.length; i++) {
      if( i < positions.length){ 
        this.particles[i].dx = positions[i].x;
        this.particles[i].dy = positions[i].y;
      }
    }
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
        <canvas ref="canvas" width="1000" height="200"></canvas>
        <canvas ref="tcanvas" width="1000" height="200"></canvas>
      </div>
    );
  }
}

export default Message;
