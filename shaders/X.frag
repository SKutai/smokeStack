varying vec3 pos;

void main(){
    float sigma = 1.0;
    float sigmaSqr = sigma*sigma;
    gl_FragColor = vec4(exp(-pos[0]/sigmaSqr), exp(-pos[1]/sigmaSqr), exp(-pos[2]/sigmaSqr), 1.0);
}