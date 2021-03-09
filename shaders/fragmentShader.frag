varying vec3 pos;
varying float i;

void main(){
    float R = floor(i / (256.0*256.0));
    float G = floor((i - 256.0*256.0*R)/256.0);
    float B = i - 256.0*256.0*R - 256.0*G;
    gl_FragColor = vec4(R/255.0, G/255.0, B/255.0, 0.0);
}