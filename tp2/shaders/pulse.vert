attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float normScale;
uniform float timeFactor;
uniform float scale_h;


varying vec2 vTextureCoord;

void main() {
	float normScale = scale_h * abs(sin(timeFactor * 0.5));
	
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+aVertexNormal*normScale, 1.0);

	vTextureCoord = aTextureCoord;
}