varying vec3 pos;
varying float i;
attribute float vertexID; 

void main(){

    i = vertexID;
    vec4 modelViewPosition = modelViewMatrix * vec4( position , 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
    pos = modelViewPosition.xyz;
}

