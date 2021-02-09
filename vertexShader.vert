void main(){
    vec4 modelViewPosition = modelViewMatrix * ( position , 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}