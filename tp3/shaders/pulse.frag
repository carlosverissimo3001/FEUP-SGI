#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float timeFactor;
uniform float r;
uniform float g;
uniform float b;

void main() {
		vec4 text = texture2D(uSampler, vTextureCoord);
		vec4 color = vec4(r,g,b,1);
		gl_FragColor = mix(text, color, abs(sin(timeFactor * 0.5)));

}