precision highp float;
precision highp int;

out vec4 fragColor;
in vec2 uv;
uniform vec2 resolution;

uniform float time;
uniform float size;
uniform vec2 center;
uniform sampler2D dino;

#define texture2D texture

// TODO
// uv coordinate redefine, it's a mess
// size ratio is not correct (currently always 1)
// background transparent issue

void draw(inout vec4 color, in vec2 center, in float size) {
  float intensity = 1.0;
  float speed = 5.0;
  float frame = 6.0;
  float range = 0.1;
  float mode = floor(mod(time * speed, frame));
  bool flip = step(frame, mod(time * speed, frame * 2.0)) == 0.0;

  float dispacement = mode * range / frame - range;
  center.x += flip ? -dispacement : dispacement;

  vec2 a = center - size;
  vec2 b = center + size;

  intensity = min(intensity, step(a.x, uv.x));
  intensity = min(intensity, step(a.y, uv.y));
  intensity = min(intensity, 1.0 - step(b.x, uv.x));
  intensity = min(intensity, 1.0 - step(b.y, uv.y));

  float aspect = resolution.y / resolution.x;
  vec2 uuvv = uv;
  uuvv.x = (uv.x + 1.0) / 2.0;
  uuvv.y = (uv.y / aspect + 1.0) / 2.0;

  vec2 aa = a;
  aa.x = (a.x + 1.0) / 2.0;
  aa.y = (a.y / aspect + 1.0) / 2.0;
  vec2 bb = b;
  bb.x = (b.x + 1.0) / 2.0;
  bb.y = (b.y / aspect + 1.0) / 2.0;

  // 1233 100 "x": 848, "y": 0, "w": 176, "h": 52, "piece": 4,
  // lb 0.688 0.480 tr 0.830 1.000

  vec2 lb = vec2(0.688 + mode / 4.0 * (0.830 - 0.688), 0.480);
  vec2 tr = vec2(0.688 + (mode + 1.0) / 4.0 * (0.830 - 0.688), 1.000);

  vec2 llbb = lb;
  vec2 ttrr = tr;
  lb.x = flip ? ttrr.x : llbb.x;
  tr.x = flip ? llbb.x : ttrr.x;

  vec2 uu = uuvv;
  uu.x = uuvv.x * (tr.x-lb.x)/(bb.x-aa.x) + lb.x - aa.x * (tr.x-lb.x)/(bb.x-aa.x);
  uu.y = uuvv.y * (tr.y-lb.y)/(bb.y-aa.y) + lb.y - aa.y * (tr.y-lb.y)/(bb.y-aa.y);

  vec4 tt = texture(dino, uu);

  //color = vec4(vec3(intensity), 1.0);
  color = vec4(vec3(0.0, intensity, 0.0), tt.w);
}

void main() {
  vec4 color = vec4(0.0);
  draw(color, center, size);
  //fragColor = vec4(uv, 1.0, 1.0);
  //fragColor = texture(dino, uv);
  fragColor = color;
}
